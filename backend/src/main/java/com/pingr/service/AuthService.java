package com.pingr.service;

import com.pingr.dto.UserAccountDTO;
import com.pingr.dto.auth.LoginDTO;
import com.pingr.dto.auth.RegisterDTO;
import com.pingr.entity.UserAccount;
import com.pingr.mapper.UserAccountMapper;
import com.pingr.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserAccountService userAccountService;
    private final UserAccountMapper userAccountMapper;

    public UserAccountDTO authenticate(LoginDTO loginDTO) {
        return userAccountRepository.findByAccountEmail(loginDTO.getAccountEmail())
                .filter(userAccount -> passwordEncoder.matches(loginDTO.getPassword(), userAccount.getAccountPassword()))
                .map(userAccountMapper::toDTO)
                .orElseThrow(() -> new SecurityException("Invalid credentials"));
    }

    public UserAccountDTO register(RegisterDTO registerDTO) {
        if (userAccountRepository.existsByAccountEmail(registerDTO.getAccountEmail())) {
            throw new SecurityException("This email address is already in use.");
        }
        if (userAccountRepository.existsByAccountName(registerDTO.getAccountName())) {
            throw new SecurityException("This username is already in use.");
        }

        return userAccountService.createUserAccount(
                registerDTO.getAccountName(),
                registerDTO.getAccountEmail(),
                registerDTO.getPassword(),
                registerDTO.getAvatarPath());
    }
}