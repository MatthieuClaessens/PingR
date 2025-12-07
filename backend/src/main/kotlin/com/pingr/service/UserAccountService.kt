package com.pingr.service

import org.springframework.stereotype.Service
import com.pingr.repository.AccountRepository
import com.pingr.dto.UserAccountDTO

@Service
class UserAccountService(private val accountRepository: AccountRepository) {
    fun createAccount(userAccountDTO: UserAccountDTO) {
        val accountEntity = userAccountDTO.toEntity()
        accountRepository.save(accountEntity)
        }
}