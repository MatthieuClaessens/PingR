package com.pingr.controller

import com.pingr.dto.AccountDTO
import com.pingr.service.AccountService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestBody

@RestController
class AccountController (private val accountService: AccountService) {
   @PostMapping()
   fun createAccount(@Valid @RequestBody req: AccountDTO) : ResponseEntity<AccountDTO> {
       return ResponseEntity.ok(req)
   }
}