package com.pingr.service;

import com.pingr.dto.ConversationDTO;
import com.pingr.entity.Conversation;
import com.pingr.entity.ConversationType;
import com.pingr.entity.UserAccount;
import com.pingr.mapper.ConversationMapper;
import com.pingr.repository.ConversationRepository;
import com.pingr.repository.UserAccountRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserAccountRepository userAccountRepository;
    private final ConversationMapper conversationMapper;

    private static final String USER_NOT_FOUND = "User not found";
    private static final String CONVERSATION_NOT_FOUND = "Conversation not found";
    private static final int MAX_PARTICIPANTS = 10;

    @Transactional(readOnly = true)
    public Page<ConversationDTO> getConversationsFromUserAccountId(Long accountId,
                                                                   Pageable pageable) {
        return conversationRepository.findByUserAccounts_AccountId(accountId, pageable)
                .map(conversationMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<ConversationDTO> getConversationsFromUserAccountId(Long accountId) {
        if (!userAccountRepository.existsById(accountId)) {
            throw new EntityNotFoundException(USER_NOT_FOUND);
        }
        return conversationRepository.findByUserAccounts_AccountId(accountId)
                .stream()
                .map(conversationMapper::toDTO)
                .toList();
    }

    @Transactional
    public ConversationDTO createConversation(Set<Long> accountIds, Long accountId) {
        Set<UserAccount> userAccounts = new HashSet<>(userAccountRepository.findAllById(accountIds));

        if (userAccounts.size() != accountIds.size()) {
            throw new EntityNotFoundException("One or more users could not be found.");
        }
        if (userAccounts.size() == 2) {
            List<Conversation> existing = conversationRepository
                    .findByUserAccounts_AccountIdAndConversationType(accountId, ConversationType.SINGLE);
            for (Conversation conv : existing) {
                if (conv.getUserAccounts().equals(userAccounts)) {
                    return conversationMapper.toDTO(conv);
                }
            }
        }
        Conversation conversation = new Conversation();
        conversation.setConversationType(userAccounts.size() > 2 ? ConversationType.GROUP : ConversationType.SINGLE);
        conversation.setUserAccounts(userAccounts);

        return conversationMapper.toDTO(conversationRepository.save(conversation));
    }

    @Transactional
    public void deleteConversation(Long conversationId, Long accountId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));
        if (!(conversation.getConversationType() == ConversationType.GROUP && accountId.equals(conversation.getCreatorId()))) {
            throw new IllegalArgumentException("Only the creator can delete this conversation.");
        }
        conversationRepository.delete(conversation);
    }

    @Transactional(readOnly = true)
    public ConversationDTO getConversationById(Long conversationId, Long accountId) {
        UserAccount userAccount = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));
        if (!conversation.getUserAccounts().contains(userAccount)) {
            throw new IllegalArgumentException("User is not allowed to read this conversation");
        }
        return conversationMapper.toDTO(conversation);
    }

    @Transactional
    public ConversationDTO addParticipant(Long conversationId, Long targetId, Long requesterId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));

        UserAccount target = userAccountRepository.findById(targetId)
                .orElseThrow(() -> new EntityNotFoundException("Target user not found"));

        if (conversation.getConversationType() == ConversationType.SINGLE) {
            boolean isParticipant = conversation.getUserAccounts().stream()
                    .anyMatch(u -> u.getAccountId().equals(requesterId));
            if (!isParticipant) throw new SecurityException("You are not part of this DM");

            Conversation newGroup = new Conversation();
            newGroup.setConversationType(ConversationType.GROUP);
            newGroup.setCreatorId(requesterId);

            Set<UserAccount> userAccounts = new HashSet<>(conversation.getUserAccounts());
            userAccounts.add(target);
            newGroup.setUserAccounts(userAccounts);

            return conversationMapper.toDTO(conversationRepository.save(newGroup));
        }
        if (!requesterId.equals(conversation.getCreatorId())) {
            throw new IllegalArgumentException("Only the creator can add to a group");
        }
        if (conversation.getUserAccounts().size() >= MAX_PARTICIPANTS) {
            throw new IllegalArgumentException("Maximum " + MAX_PARTICIPANTS + " members allowed");
        }
        if (conversation.getUserAccounts().contains(target)) {
            throw new IllegalArgumentException("Target user is already in this conversation");
        }
        conversation.getUserAccounts().add(target);
        return conversationMapper.toDTO(conversationRepository.save(conversation));
    }

    @Transactional
    public ConversationDTO kickParticipant(Long conversationId, Long targetId, Long requesterId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));
        UserAccount target = userAccountRepository.findById(targetId)
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));
        if (!(conversation.getConversationType() == ConversationType.GROUP && requesterId.equals(conversation.getCreatorId()))) {
            throw new IllegalArgumentException("Only the creator can kick a participant");
        }
        conversation.getUserAccounts().remove(target);
        return conversationMapper.toDTO(conversationRepository.save(conversation));
    }

    @Transactional
    public void leaveParticipant(Long conversationId, Long accountId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));
        boolean removed = conversation.getUserAccounts().removeIf(u -> u.getAccountId().equals(accountId));
        if (!removed) {
            throw new SecurityException("You are not a participant of this conversation");
        }
        if (conversation.getUserAccounts().isEmpty()) {
            conversationRepository.delete(conversation);
            return;
        }
        if (conversation.getConversationType() == ConversationType.GROUP && accountId.equals(conversation.getCreatorId())) {
            UserAccount nextCreatorId = conversation.getUserAccounts().stream()
                    .findFirst()
                    .orElseThrow(() -> new IllegalStateException("Conversation should not be empty"));
            conversation.setCreatorId(nextCreatorId.getAccountId());
        }
        conversationRepository.save(conversation);
    }
}
