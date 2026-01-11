package com.pingr.service;

import com.pingr.dto.UserAccountDTO;
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

    private static final String USER_NOT_FOUND = "User not found with ID: ";

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
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND + accountId));
        return userAccountMapper.toDTO(existing);
    }

    @Transactional
    public UserAccountDTO editUserAccount(Long accountId, UserAccountDTO dto) {
        UserAccount existing = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND + accountId));
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
    public void deleteUserAccount(Long accountId) {
        if (!userAccountRepository.existsById(accountId)) {
            throw new EntityNotFoundException(USER_NOT_FOUND + accountId);
        }
        userAccountRepository.deleteById(accountId);
    }

    @Transactional
    public void changePassword(Long accountId, String currentPassword, String newPassword) {
        UserAccount user = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND + accountId));

        if (!passwordEncoder.matches(currentPassword, user.getAccountPassword())) {
            throw new IllegalArgumentException("Invalid current password");
        }

        user.setAccountPassword(passwordEncoder.encode(newPassword));
        userAccountRepository.save(user);
    }
}