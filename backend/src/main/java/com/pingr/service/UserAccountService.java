package com.pingr.service;

import com.pingr.dto.UserAccountDTO;
import com.pingr.dto.auth.ChangeMailDTO;
import com.pingr.dto.auth.ChangePasswordDTO;
import com.pingr.entity.Role;
import com.pingr.entity.UserAccount;
import com.pingr.mapper.UserAccountMapper;
import com.pingr.repository.UserAccountRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserAccountService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserAccountMapper userAccountMapper;

    private static final String USER_NOT_FOUND = "User not found";

    @Transactional(readOnly = true)
    public List<UserAccountDTO> getAllUsers() {
        return userAccountRepository.findAll().stream()
                .map(userAccountMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<UserAccountDTO> getAllUsers(Pageable pageable) {
        return userAccountRepository.findAll(pageable)
                .map(userAccountMapper::toDTO);
    }

    @Transactional
    public UserAccountDTO createUserAccount(String accountName, String accountEmail, String password, String avatarPath) {
        if (userAccountRepository.existsByAccountName(accountName)) {
            throw new IllegalArgumentException("This username is already in use.");
        }
        if (userAccountRepository.existsByAccountEmail(accountEmail)) {
            throw new IllegalArgumentException("This email address is already in use.");
        }

        UserAccount user = new UserAccount();
        user.setAccountName(accountName);
        user.setAccountEmail(accountEmail.trim().toLowerCase());
        user.setAccountPassword(passwordEncoder.encode(password));
        user.setAvatarPath(avatarPath == null || avatarPath.isBlank() ? "default-avatar.png" : avatarPath);
        user.setRole(Role.USER);

        UserAccount saved = userAccountRepository.save(user);
        return userAccountMapper.toDTO(saved);
    }

    @Transactional(readOnly = true)
    public UserAccountDTO getUserAccountById(Long accountId) {
        UserAccount existing = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));
        return userAccountMapper.toDTO(existing);
    }

    @Transactional
    public UserAccountDTO changeRole(Long accountId, Long targetId, Role newRole) {
        UserAccount requester = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Requester not found"));
        if (requester.getRole() != Role.ADMIN) {
            throw new SecurityException("Only administrators can change roles");
        }
        UserAccount target = userAccountRepository.findById(targetId)
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));

        target.setRole(newRole);
        return userAccountMapper.toDTO(target);
    }

    @Transactional
    public UserAccountDTO editUserAccount(Long accountId, Long requesterId, UserAccountDTO dto) {
        UserAccount existing = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));

        UserAccount requester = userAccountRepository.findById(requesterId)
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));

        boolean isSelfEdit = requesterId.equals(accountId);
        boolean isPrivileged = requester.getRole() == Role.ADMIN || requester.getRole() == Role.MODERATOR;

        if (!isSelfEdit && !isPrivileged) {
            throw new SecurityException("You are not allowed to edit this user");
        }

        if (dto.getAccountName() != null && !dto.getAccountName().trim().isEmpty()) {
            existing.setAccountName(dto.getAccountName().trim());
        }
        if (dto.getAvatarPath() != null) {
            if (dto.getAvatarPath().isBlank()) {
                existing.setAvatarPath("default-avatar.png");
            } else {
                existing.setAvatarPath(dto.getAvatarPath());
            }
        }

        return userAccountMapper.toDTO(userAccountRepository.save(existing));
    }

    @Transactional
    public void deleteUserAccount(Long accountId, Long requesterId) {
        UserAccount target = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));

        UserAccount requester = userAccountRepository.findById(requesterId)
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));

        boolean isSelfDelete = requesterId.equals(accountId);
        boolean isPrivileged = requester.getRole() == Role.ADMIN || requester.getRole() == Role.MODERATOR;

        if (!isSelfDelete && !isPrivileged) {
            throw new SecurityException("You are not allowed to delete this user");
        }

        userAccountRepository.delete(target);
    }

    @Transactional
    public void changePassword(Long accountId, ChangePasswordDTO changePasswordDTO) {
        UserAccount userAccount = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));
        if (!userAccount.getAccountEmail().equals(changePasswordDTO.getAccountEmail())) {
            throw new IllegalArgumentException("Email does not match this account");
        }
        if (!passwordEncoder.matches(changePasswordDTO.getAccountPassword(), userAccount.getAccountPassword())) {
            throw new IllegalArgumentException("Invalid current password");
        }
        userAccount.setAccountPassword(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
        userAccountRepository.save(userAccount);
    }

    @Transactional
    public void changeMail(Long accountId, ChangeMailDTO changeMailDTO) {
        UserAccount userAccount = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));

        if (!passwordEncoder.matches(changeMailDTO.getAccountPassword(), userAccount.getAccountPassword())) {
            throw new IllegalArgumentException("Invalid current password");
        }

        if (userAccountRepository.existsByAccountEmail(changeMailDTO.getNewEmail())) {
            throw new IllegalArgumentException("This email address is already in use");
        }

        userAccount.setAccountEmail(changeMailDTO.getNewEmail());
        userAccountRepository.save(userAccount);
    }
}