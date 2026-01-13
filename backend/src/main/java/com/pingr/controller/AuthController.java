package com.pingr.controller;
;
import com.pingr.dto.UserAccountDTO;
import com.pingr.dto.auth.LoginDTO;
import com.pingr.dto.auth.RegisterDTO;
import com.pingr.entity.UserAccount;
import com.pingr.security.JwtService;
import com.pingr.service.AuthService;
import com.pingr.service.UserAccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserAccountService userAccountService;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody com.pingr.dto.auth.LoginDTO dto) {
        UserAccount userAccount = authService.authenticate(dto)
                .orElseThrow(() -> new BadCredentialsException("Identifiants incorrects"));

        String token = jwtService.generateToken(userAccount);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "userId", userAccount.getAccountId().toString(),
                "role", userAccount.getRole().name()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterDTO dto) {
        UserAccountDTO userAccount = userAccountService.createUserAccount(
                dto.getAccountName(),
                dto.getAccountEmail(),
                dto.getPassword(),
                dto.getAvatarPath()
        );

        return ResponseEntity.status(201).body(Map.of(
                "userId", userAccount.getAccountId().toString(),
                "message", "Inscription réussie"
        ));
    }
}
