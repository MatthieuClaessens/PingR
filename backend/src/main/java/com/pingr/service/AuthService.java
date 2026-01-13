package com.pingr.service;

import com.pingr.dto.UserAccountDTO;
import com.pingr.dto.auth.LoginDTO;
import com.pingr.dto.auth.RegisterDTO;
import com.pingr.entity.UserAccount;
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

    public UserAccountDTO authenticate(LoginDTO loginDTO) {
        return userAccountRepository.findByAccountEmail(loginDTO.getAccountEmail())
                .filter(userAccount -> passwordEncoder.matches(loginDTO.getPassword(), userAccount.getAccountPassword()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
    }

    public UserAccountDTO register(RegisterDTO registerDTO) {
        Optional<UserAccountDTO> isExisting = userAccountRepository.findByAccountEmail(registerDTO.getAccountEmail());
        if (isExisting.isPresent()) {
            throw new SecurityException("Account is already registered");
        }

        return createUserAccount (
                registerDTO.getAccountEmail(),
                registerDTO.getPassword(),
                registerDTO.getAvatarPath());
    }
}