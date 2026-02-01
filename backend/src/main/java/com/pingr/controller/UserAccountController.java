package com.pingr.controller;

import com.pingr.dto.UserAccountDTO;
import com.pingr.dto.auth.ChangeMailDTO;
import com.pingr.dto.auth.ChangePasswordDTO;
import com.pingr.dto.auth.RegisterDTO;
import com.pingr.entity.Role;
import com.pingr.service.UserAccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/")
@RequiredArgsConstructor
public class UserAccountController {

    private final UserAccountService userAccountService;


    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<List<UserAccountDTO>> getAllUsers() {
        List<UserAccountDTO> userAccounts = userAccountService.getAllUsers();
        return ResponseEntity.ok(userAccounts);
    }

    @PostMapping("/user/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserAccountDTO> createUserAccount(@Valid @RequestBody RegisterDTO registerDTO) {
        UserAccountDTO created = userAccountService.createUserAccount(
                registerDTO.getAccountName(),
                registerDTO.getAccountEmail(),
                registerDTO.getPassword(),
                registerDTO.getAvatarPath()
        );
        return ResponseEntity.status(201).body(created);
    }

    @PatchMapping("/user/{accountId}")
    public ResponseEntity<UserAccountDTO> editUserAccount(
            @PathVariable Long accountId,
            @Valid @RequestBody UserAccountDTO userAccountDTO,
            Authentication authentication) {
            Long requesterId = (Long) authentication.getPrincipal();
            UserAccountDTO updated = userAccountService.editUserAccount(accountId, requesterId, userAccountDTO);
            return ResponseEntity.ok(updated);
    }

    @GetMapping("/user/search")
    public ResponseEntity<List<UserAccountDTO>> searchUsers(@RequestParam("q") String query) {
        List<UserAccountDTO> results = userAccountService.searchUsers(query);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/user/me")
    public ResponseEntity<UserAccountDTO> getMyProfile(Authentication authentication) {
        Long accountId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(userAccountService.getUserAccountById(accountId));
    }

    @GetMapping("/user/{targetId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR', 'USER')")
    public ResponseEntity<UserAccountDTO> getUserProfile(@PathVariable Long targetId) {
        return ResponseEntity.ok(userAccountService.getUserAccountById(targetId));
    }

    @PatchMapping("/user/{targetId}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserAccountDTO> changeRole(
            @PathVariable Long targetId,
            @RequestBody Role newRole,
            Authentication authentication
    ) {
        Long requesterId = (Long) authentication.getPrincipal();
        UserAccountDTO updated = userAccountService.changeRole(requesterId, targetId, newRole);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/user/{accountId}/changePassword")
    public ResponseEntity<Void> changePassword(
            @PathVariable Long accountId,
            @Valid @RequestBody ChangePasswordDTO changePasswordDTO,
            Authentication authentication) {
            Long requesterId = (Long) authentication.getPrincipal();
            if (!requesterId.equals(accountId)) {
                throw new SecurityException("You can only change your own password");
        }
            userAccountService.changePassword(accountId, changePasswordDTO);
            return ResponseEntity.noContent().build();
    }

    @PatchMapping("/user/{accountId}/change-email")
    public ResponseEntity<Void> changeMail(
            @PathVariable Long accountId,
            @Valid @RequestBody ChangeMailDTO changeMailDTO,
            Authentication authentication) {
        Long requesterId = (Long) authentication.getPrincipal();
        if (!requesterId.equals(accountId)) {
            throw new SecurityException("You can only change your own email");
        }
        userAccountService.changeMail(accountId, changeMailDTO);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/user/{accountId}")
    public ResponseEntity<Void> deleteUserAccount(
            @PathVariable Long accountId,
            Authentication authentication) {
        Long requesterId = (Long) authentication.getPrincipal();
        userAccountService.deleteUserAccount(accountId, requesterId);
        return ResponseEntity.noContent().build();
    }
}
