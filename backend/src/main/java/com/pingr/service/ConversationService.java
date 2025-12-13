package com.pingr.service;

import com.pingr.dto.ConversationDTO;
import com.pingr.entity.Conversation;
import com.pingr.entity.UserAccount;
import com.pingr.repository.ConversationRepository;
import com.pingr.repository.MessageRepository;
import com.pingr.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserAccountRepository userAccountRepository;
    private final MessageRepository messageRepository;

    @Transactional // Important pour garantir la cohérence des écritures
    public ConversationDTO createConversation(Long accountId) {
        UserAccount userAccount = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("UserAccount not found"));
        Conversation conversation = new Conversation();
        conversation.getUserAccounts().add(userAccount);
        conversationRepository.save(conversation);

        ConversationDTO dto = new ConversationDTO();
        dto.setConversationId(conversation.getConversationId());
        return dto;
    }
}
