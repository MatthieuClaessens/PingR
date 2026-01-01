package com.pingr.controller;

import com.pingr.dto.UserAccountDTO;
import com.pingr.service.UserAccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/user")
@RequiredArgsConstructor
public class UserAccountController {

    private final UserAccountService service;

    public UserAccountDTO createUserAccount(@Valid @RequestBody UserAccountDTO request) {
        return service.createUserAccount(request);
    }
}
