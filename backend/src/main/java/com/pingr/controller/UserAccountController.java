package com.pingr.controller;

import com.pingr.dto.UserAccountDTO;
import com.pingr.service.UserAccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api") // Pas besoin du dernier slash
@RequiredArgsConstructor
public class UserAccountController {

    private final UserAccountService userAccountService;

    @PostMapping("/auth/register")
    public ResponseEntity<UserAccountDTO> register(@RequestBody @Valid UserAccountDTO dto) {
        UserAccountDTO createdUser = userAccountService.createAccount(dto);
        // Bonne pratique REST : Renvoyer 201 Created avec l'URI de la ressource
        return ResponseEntity
            .created(URI.create("/api/users/" + createdUser.accountId()))
            .body(createdUser);
    }
}
