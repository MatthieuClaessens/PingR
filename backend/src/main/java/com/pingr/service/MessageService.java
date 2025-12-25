package com.pingr.service;

import com.pingr.dto.MessageDTO;
import com.pingr.entity.Message;
import com.pingr.entity.Conversation;
import com.pingr.entity.UserAccount;
import com.pingr.repository.MessageRepository;
import com.pingr.repository.ConversationRepository;
import com.pingr.repository.UserAccountRepository;
import com.pingr.mapper.MessageMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserAccountRepository userAccountRepository;
    private final ConversationRepository conversationRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository, 
                         UserAccountRepository userAccountRepository,
                         ConversationRepository conversationRepository) {
        this.messageRepository = messageRepository;
        this.userAccountRepository = userAccountRepository;
        this.conversationRepository = conversationRepository;
    }

    @Transactional
    public MessageDTO createMessage(Long conversationId, Long accountId, String message) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        
        UserAccount userAccount = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Message newMessage = new Message();
        newMessage.setMessageContent(message);
        newMessage.setMessageDate(LocalDateTime.now());
        newMessage.setConversation(conversation);
        newMessage.setUserAccount(userAccount);
        return MessageMapper.toDTO(messageRepository.save(newMessage));
    }

    public MessageDTO readMessage(Long conversationId, Long accountId, Long messageId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        if (!message.getConversation().getConversationId().equals(conversation.getConversationId())) {
            throw new IllegalArgumentException("Message does not belong to the specified conversation");
        }

        return MessageMapper.toDTO(message);
    }

    @Transactional
    public void deleteMessage(Long conversationId, Long messageId) {
        Conversation conversation = conversationRepository.findById(conversationId)
            .orElseThrow(() -> new RuntimeException("Conversation not found"));
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new RuntimeException("Message not found"));

        if (!message.getConversation().getConversationId().equals(conversation.getConversationId())) {
            throw new IllegalArgumentException("Message does not belong to the specified conversation");
        }
        messageRepository.delete(message);
    }
}
