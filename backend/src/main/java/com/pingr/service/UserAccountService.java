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

    private static final String USER_NOT_FOUND = "User not found";

    @Transactional(readOnly = true)
    public List<UserAccountDTO> getAllUsers() {
        return userAccountRepository.findAll().stream()
                .map(UserAccountMapper::toDTO)
                .toList();
    }

    public Page<UserAccountDTO> getAllUsers(Pageable pageable) {
        return userAccountRepository.findAll(pageable)
        .map(UserAccountMapper::toDTO);
    }

@Transactional
    public UserAccountDTO createUserAccount(String accountName, String accountTag, String accountEmail, String password, String avatarPath) {
    UserAccount user = new UserAccount();
    user.setAccountName(accountName);
    user.setAccountTag(accountTag);
    user.setAccountEmail(accountEmail);
    user.setAccountPassword(passwordEncoder.encode(password));
    user.setAvatarPath(avatarPath);
    user.setRole(Role.USER);

    UserAccount saved = userAccountRepository.save(user);

    return UserAccountMapper.toDTO(saved);
    }

    @Transactional
    public UserAccountDTO getUserAccountById(Long accountId) {
    UserAccount existing = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND + accountId));
    return UserAccountMapper.toDTO(existing);
    }

    @Transactional
    public UserAccountDTO editUserAccount(Long accountId, UserAccount userAccount) {
        UserAccount existing = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND + accountId));
        if (userAccount.getAccountName() != null) {
            existing.setAccountName(userAccount.getAccountName());
        }
        if (userAccount.getAccountTag() != null) {
            existing.setAccountTag(userAccount.getAccountTag());
        }
        if (userAccount.getAccountEmail() != null) {
            String newAccountEmail = userAccount.getAccountEmail().trim().toLowerCase();
            userAccountRepository.findByAccountEmail(newAccountEmail)
                    .filter(u -> !u.getAccountId().equals(accountId))
                    .ifPresent(u -> {
                        throw new IllegalArgumentException("Email address already in use");});
            existing.setAccountEmail(newAccountEmail);
        }
        if (userAccount.getAccountPassword() != null) {
            existing.setAccountPassword(userAccount.getAccountPassword());
        }
        if (userAccount.getAvatarPath() != null) {
            existing.setAvatarPath(userAccount.getAvatarPath());
        }
        UserAccount saved = userAccountRepository.save(existing);
        return UserAccountMapper.toDTO(saved);
    }


    @Transactional
    public void deleteUserAccount(Long accountId) {
        if (!userAccountRepository.existsById(accountId)) {
            throw new EntityNotFoundException(USER_NOT_FOUND);
        }
        userAccountRepository.deleteById(accountId);
    }
}
