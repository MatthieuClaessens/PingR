package com.pingr.service

import com.pingr.entity.UserAccount
import org.springframework.stereotype.Service
import com.pingr.repository.UserAccountRepository
import com.pingr.dto.UserAccountDTO

@Service
class UserAccountService(private val userAccountRepository:  UserAccountRepository) {
    fun createAccount(dto: UserAccountDTO): UserAccountDTO {
        val entity = UserAccount()
        entity.accountName = dto.accountName
        entity.accountTag = dto.accountTag
        entity.avatarPath = dto.avatarPath

        val saved = userAccountRepository.save(entity)

        return UserAccountDTO(
            accountId = saved.accountId ?: 0L,
            accountName = saved.accountName,
            accountTag = saved.accountTag,
            avatarPath = saved.avatarPath
        )
    }
}