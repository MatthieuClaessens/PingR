package com.pingr.controller;

import com.pingr.dto.UserAccountDTO;
import com.pingr.dto.auth.ChangePasswordDTO;
import com.pingr.service.UserAccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/user")
@RequiredArgsConstructor
public class UserAccountController {

    private final UserAccountService userAccountService;

    @GetMapping("/{accountId}")
    public ResponseEntity<UserAccountDTO> getUserAccountById(@PathVariable Long accountId) {
        return ResponseEntity.ok(userAccountService.getUserAccountById(accountId));
    }

    @PatchMapping("/{accoundId}/changePassword")
    public ResponseEntity<Void> changePassword(
            @PathVariable Long accountId,
            @Valid @RequestBody ChangePasswordDTO changePasswordDTO) {
            userAccountService.changePassword(accountId, changePasswordDTO);
            return ResponseEntity.noContent().build();
    }
}
