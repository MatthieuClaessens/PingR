package com.pingr.service

import com.pingr.dto.ChannelDTO
import com.pingr.repository.ChannelRepository
import com.pingr.repository.UserAccountRepository
import org.springframework.stereotype.Service

@Service
class ChannelService(
    private val channelRepository: ChannelRepository,
    private val userAccountRepository: UserAccountRepository
) {

    fun createChannel(senderId: Long, receiverId: Long): ChannelDTO {

        val sender = userAccountRepository.findById(senderId)
            .orElseThrow { RuntimeException("Sender not found") }

        val receiver = userAccountRepository.findById(receiverId)
            .orElseThrow { RuntimeException("Receiver not found") }

        val existingChannel = sender.channels.firstOrNull { channel ->
            channel.userAccounts.size == 2 &&
                    channel.userAccounts.any { it.accountId == receiverId }
        }
        val channel = existingChannel ?: run {
            val newChannel = Channel()
            newChannel.userAccounts.add(sender)
            newChannel.userAccounts.add(receiver)
            channelRepository.save(newChannel)
        }

        return ChannelDTO(channel.channelId)
    }
}
