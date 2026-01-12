package com.pingr.service;

import com.pingr.dto.LoginDTO;
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

    public Optional<UserAccount> authenticate(LoginDTO loginDTO) {
        return userAccountRepository.findByAccountEmail(loginDTO.getAccountEmail())
                .filter(user -> passwordEncoder.matches(
                        loginDTO.getPassword(),
                        user.getAccountPassword()
                ));
    }
}