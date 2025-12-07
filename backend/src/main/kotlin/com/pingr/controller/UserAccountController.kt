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
@RequestMapping("/account")
class UserAccountController (private val userAccountService: UserAccountService) {
   @PostMapping()
   fun createAccount(@Valid @RequestBody req: UserAccountDTO) : ResponseEntity<UserAccountDTO> {
       val created = userAccountService.createAccount(req)
       return ResponseEntity.ok(created)
   }

    @GetMapping()
    fun getAccount(@RequestParam id: Long ) : UserAccountService {
        val account = userAccountService.getAccountById(accountId)
        return ResponseEntity.ok(account)
    }

    @PutMapping()
    fun editAccount(@RequestParam accountId: Long ) : UserAccountService {
        val updated = userAccountService.getAccountById(account)
        return ResponseEntity.ok(account)
    }

    @DeleteMapping()
    fun deleteAccount(@RequestParam accountId: (accountId)
        return ReponseEntity.ok(account)
}