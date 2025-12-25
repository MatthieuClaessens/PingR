package com.pingr.service;

import com.pingr.dto.ConversationDTO;
import com.pingr.entity.Conversation;
import com.pingr.entity.ConversationType;
import com.pingr.entity.UserAccount;
import com.pingr.mapper.ConversationMapper;
import com.pingr.repository.ConversationRepository;
import com.pingr.repository.MessageRepository;
import com.pingr.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserAccountRepository userAccountRepository;
    private final MessageRepository messageRepository;

    @Transactional
    public ConversationDTO createConversation(Long accountId) {
        UserAccount userAccount = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("User account not found"));
        Conversation conversation = new Conversation();
        conversation.getUserAccounts().add(userAccount);
        Conversation saved = conversationRepository.save(conversation);
        return ConversationMapper.toDTO(saved);
    }

    @Transactional
    public void deleteConversation(Long conversationId, Long accountId) {
        UserAccount userAccount = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("User account not found"));
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        if (!conversation.getUserAccounts().contains(userAccount)) {
            throw new IllegalArgumentException("User is not allowed to delete this conversation");
        }
        conversationRepository.delete(conversation);

    }

    @Transactional
    public ConversationDTO addParticipant(Long conversationId, Long accountId) {
        UserAccount userAccount = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("User account not found"));
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        Conversation savedConversation;
        if (conversation.getConversationType() == ConversationType.SINGLE) {
            Conversation newConversation = new Conversation();
            newConversation.setConversationType(ConversationType.GROUP);
            newConversation.getUserAccounts().addAll(conversation.getUserAccounts());
            newConversation.getUserAccounts().add(userAccount);

            if (newConversation.getUserAccounts().size() > 10) {
                throw new IllegalArgumentException("Maximum: 10 members allowed");
            }
            savedConversation = conversationRepository.save(newConversation);
            return ConversationMapper.toDTO(savedConversation);
        } else if (conversation.getUserAccounts().size() >= 10) {
            throw new IllegalArgumentException(("Maximum 10 members allowed"));
        }
        conversation.getUserAccounts().add(userAccount);
        savedConversation = conversationRepository.save(conversation);

        return ConversationMapper.toDTO(savedConversation);
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
