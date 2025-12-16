package com.pingr.service;

import com.pingr.dto.ConversationDTO;
import com.pingr.dto.UserAccountDTO;
import com.pingr.entity.Conversation;
import com.pingr.entity.UserAccount;
import com.pingr.repository.ConversationRepository;
import com.pingr.repository.MessageRepository;
import com.pingr.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserAccountRepository userAccountRepository;
    private final MessageRepository messageRepository;

    @Transactional
    public ConversationDTO createConversation(Long conversationId, Long accountId) {
        UserAccount userAccount = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("User account not found"));
        Conversation conversation = new Conversation();
        conversation.getUserAccounts().add(userAccount);
        conversationRepository.save(conversation);

        ConversationDTO dto = new ConversationDTO();
        dto.setConversationId(conversation.getConversationId());
        return dto;
    }

    @Transactional
    public ConversationDTO deleteConversation(Long conversationId, Long accountId) {
        UserAccount userAccount = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("User account not found"));
        conversationRepository.deleteById(conversationId);
        ConversationDTO dto = new ConversationDTO();
        dto.setConversationId(conversationId);
        return dto;
    }

    @Transactional
    public ConversationDTO addParticipant(Long conversationId, Long accountId) {
        UserAccount userAccount = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("User account not found"));
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        conversation.getUserAccounts().add(userAccount);

        ConversationDTO dto = new ConversationDTO();
        dto.setConversationId(conversation.getConversationId());
        return dto;
    }


    @Transactional
    public ConversationDTO kickParticipant(Long conversationId, Long accountId) {
        UserAccount userAccount = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("User account not found"));
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        conversation.getUserAccounts().remove(userAccount);

        ConversationDTO dto = new ConversationDTO();
        return dto;
    }
}
