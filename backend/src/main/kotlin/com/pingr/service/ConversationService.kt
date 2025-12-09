package com.pingr.service

import com.pingr.dto.ConversationDTO
import com.pingr.repository.ConversationRepository
import com.pingr.repository.UserAccountRepository
import com.pingr.entity.Conversation
import org.springframework.stereotype.Service

@Service
class ConversationService(
    private val channelRepository: ConversationRepository,
    private val userAccountRepository: UserAccountRepository
) {

    fun createChannel(senderId: Long, receiverId: Long): ConversationDTO {

        val sender = userAccountRepository.findById(senderId)
            .orElseThrow { RuntimeException("Sender not found") }

        val receiver = userAccountRepository.findById(receiverId)
            .orElseThrow { RuntimeException("Receiver not found") }

        val existingChannel = sender.channels.firstOrNull { conversation ->
            conversation.userAccounts.size == 2 &&
                    conversation.userAccounts.any { it.accountId == receiverId }
        }
        val channel = existingChannel ?: run {
            val newChannel = Conversation()
            newChannel.userAccounts.add(sender)
            newChannel.userAccounts.add(receiver)
            channelRepository.save(newConversation)
        }

        return ConversationDTO(conversation.conversationId)
    }
}
