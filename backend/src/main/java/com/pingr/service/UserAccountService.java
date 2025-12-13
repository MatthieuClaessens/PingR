package com.pingr.service;

import com.pingr.dto.UserAccountDTO;
import com.pingr.entity.Role;
import com.pingr.entity.UserAccount;
import com.pingr.mapper.UserAccountMapper;
import com.pingr.repository.UserAccountRepository;
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
}
