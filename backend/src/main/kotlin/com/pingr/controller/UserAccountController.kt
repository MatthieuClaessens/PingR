package com.pingr.controller

import com.pingr.dto.UserAccountDTO
import com.pingr.service.UserAccountService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam


@RestController
@RequestMapping("/api/")
class UserAccountController (private val userAccountService: UserAccountService) {
    @PostMapping("/auth/register")
