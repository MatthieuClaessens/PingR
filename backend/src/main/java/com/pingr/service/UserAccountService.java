package com.pingr.service;

import com.pingr.dto.UserAccountDTO;
import com.pingr.entity.Role;
import com.pingr.entity.UserAccount;
import com.pingr.mapper.UserAccountMapper;
import com.pingr.repository.UserAccountRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
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

    // Retourne tous les users sans pagination
    public List<UserAccount> getAllUsers() {
        return userAccountRepository.findAll();
    }

    // Retourne les users avec pagination
    public Page<UserAccount> getAllUsers(Pageable pageable) {
        return userAccountRepository.findAll(pageable);
    }

@Transactional
    public UserAccountDTO createUser(String accountName, String accountTag, String accountEmail, String password, String avatarPath) {
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
    public UserAccount getAccountById(Long accountId) {
        return userAccountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable" + accountId));
    }

    @Transactional
    public UserAccount editAccount(Long accountId, UserAccount userAccount) {
        UserAccount existing = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur Introuvable" + accountId));
        if (userAccount.getAccountName() != null) {
            existing.setAccountName(userAccount.getAccountName());
        }
        if (userAccount.getAccountTag() != null) {
            existing.setAccountTag(userAccount.getAccountTag());
        }
        if (userAccount.getAccountEmail() != null) {
            String newAccountEmail = userAccount.getAccountEmail().trim().toLowerCase();
            userAccountRepository.findByAccountEmail(newAccountEmail)
                    .filter(u -> !u.getUserAccountId().equals(accountId))
                    .ifPresent(u -> {
                        throw new IllegalArgumentException("Adresse mail déjà utilisée");});
            existing.setAccountEmail(newAccountEmail);
        }
        if (userAccount.getAccountPassword() != null) {
            existing.setAccountPassword(userAccount.getAccountPassword());
        }
        if (userAccount.getAvatarPath() != null) {
            existing.setAvatarPath(userAccount.getAvatarPath());
        }

    }


    @Transactional
    public void deleteUser(Long accountId) {
        if (!userAccountRepository.existsById(accountId)) {
            throw new EntityNotFoundException("Utilisateur Introuvable");
        }
        userAccountRepository.deleteById(accountId);
    }
}
