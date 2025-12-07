package com.pingr.service

import org.springframework.stereotype.Service
import com.pingr.repository.UserAccountRepository
import com.pingr.dto.UserAccountDTO

@Service
class UserAccountService(private val accountRepository: UserAccountRepository) {
    fun createAccount(userAccountDTO: UserAccountDTO) {
        val accountEntity = userAccountDTO.toEntity()
        UserAccountRepository.save(accountEntity)
        }
}