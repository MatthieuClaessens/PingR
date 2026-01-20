package com.pingr.controller;

import com.pingr.dto.UserAccountDTO;
import com.pingr.dto.auth.ChangeMailDTO;
import com.pingr.dto.auth.ChangePasswordDTO;
import com.pingr.entity.Role;
import com.pingr.service.UserAccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserAccountController {

    private final UserAccountService userAccountService;

    @GetMapping("/{accountId}")
    public ResponseEntity<UserAccountDTO> getUserAccountById(@PathVariable Long accountId) {
        return ResponseEntity.ok(userAccountService.getUserAccountById(accountId));
    }

    @PatchMapping("/{accountId}")
    public ResponseEntity<UserAccountDTO> editUserAccount(
            @PathVariable Long accountId,
            @Valid @RequestBody UserAccountDTO userAccountDTO,
            Authentication authentication) {
            Long requesterId = (Long) authentication.getPrincipal();
            UserAccountDTO updated = userAccountService.editUserAccount(accountId, requesterId, userAccountDTO);
            return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{targetId}/role")
    public ResponseEntity<UserAccountDTO> changeRole(
            @PathVariable Long targetId,
            @RequestBody Role newRole,
            Authentication authentication
    ) {
        Long requesterId = (Long) authentication.getPrincipal();
        UserAccountDTO updated = userAccountService.changeRole(requesterId, targetId, newRole);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{accountId}/changePassword")
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

    @PatchMapping("/{accountId}/change-email")
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

    @DeleteMapping("/{accountId}")
    public ResponseEntity<Void> deleteUserAccount(
            @PathVariable Long accountId,
            Authentication authentication) {
        Long requesterId = (Long) authentication.getPrincipal();
        userAccountService.deleteUserAccount(accountId, requesterId);
        return ResponseEntity.noContent().build();
    }
}
