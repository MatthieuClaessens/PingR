package com.pingr.service

import com.pingr.dto.ConversationDTO
import com.pingr.repository.ConversationRepository
import com.pingr.repository.UserAccountRepository
import com.pingr.entity.Conversation
import org.springframework.stereotype.Service

@Service
class ConversationService(
    private val conversationRepository: ConversationRepository,
    private val userAccountRepository: UserAccountRepository
) {

    fun createConversation(senderId: Long, receiverId: Long): ConversationDTO {

        val sender = userAccountRepository.findById(senderId)
            .orElseThrow { RuntimeException("Sender not found") }

        val receiver = userAccountRepository.findById(receiverId)
            .orElseThrow { RuntimeException("Receiver not found") }

        val existingConversation = sender.conversations.firstOrNull { conversation ->
            conversation.userAccounts.size == 2 &&
                    conversation.userAccounts.any { it.accountId == receiverId }
        }
        val conversation = existingConversation ?: run {
            val newConversation = Conversation()
            newConversation.userAccounts.add(sender)
            newConversation.userAccounts.add(receiver)
            conversationRepository.save(newConversation)
        }

        return ConversationDTO(conversation.conversationId)
    }
}
