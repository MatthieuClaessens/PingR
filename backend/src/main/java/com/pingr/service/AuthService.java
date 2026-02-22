package com.pingr.service;

import com.pingr.dto.UserAccountDTO;
import com.pingr.dto.auth.AuthResponseDTO;
import com.pingr.dto.auth.LoginDTO;
import com.pingr.dto.auth.RegisterDTO;
import com.pingr.entity.UserAccount;
import com.pingr.mapper.UserAccountMapper;
import com.pingr.repository.UserAccountRepository;
import com.pingr.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserAccountService userAccountService;
    private final UserAccountMapper userAccountMapper;
    private final JwtService jwtService;

    @Transactional
    public AuthResponseDTO authenticate(LoginDTO loginDTO) {
        UserAccount userAccount = userAccountRepository.findByAccountEmail(loginDTO.getAccountEmail())
                .filter(u -> passwordEncoder.matches(loginDTO.getPassword(), u.getAccountPassword()))
                .orElseThrow(() -> new SecurityException("Invalid credentials"));
        UserAccountDTO userAccountDTO = userAccountMapper.toDTO(userAccount);
        String token = jwtService.generateToken(userAccount);
        return new AuthResponseDTO(userAccountDTO, token);
    }

    @Transactional
    public AuthResponseDTO register(RegisterDTO registerDTO) {
        if (userAccountRepository.existsByAccountEmail(registerDTO.getAccountEmail())) {
            throw new SecurityException("This email address is already in use.");
        }
        if (userAccountRepository.existsByAccountName(registerDTO.getAccountName())) {
            throw new SecurityException("This username is already in use.");
        }

        UserAccountDTO userAccountDTO = userAccountService.createUserAccount (
                registerDTO.getAccountName(),
                registerDTO.getAccountEmail(),
                registerDTO.getPassword(),
                registerDTO.getAvatarPath());
        UserAccount userAccount = userAccountRepository.findByAccountEmail(registerDTO.getAccountEmail())
                .orElseThrow(() -> new RuntimeException("User not found after creation"));
        String token = jwtService.generateToken(userAccount);
        return new AuthResponseDTO(userAccountDTO, token);
    }
}