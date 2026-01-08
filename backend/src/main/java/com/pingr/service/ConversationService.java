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

    // Obtenir les conversations d'un utilisateur par son id (Pagination)
    @Transactional(readOnly = true)
    public Page<ConversationDTO> getConversationsFromUserAccountId(Long accountId, Long requesterId, Pageable pageable) {
        return conversationRepository.findByUserAccounts_AccountId(accountId, pageable)
                .map(conversationMapper::toDTO);
    }

    // Obtenir les conversations d'un utilisateur par son id (Liste)
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

    // Créer une conversation
    @Transactional
    public ConversationDTO createConversation(Set<Long> accountIds, Long creatorId) {
        accountIds.add(creatorId);
        Set<UserAccount> userAccounts = new HashSet<>(userAccountRepository.findAllById(accountIds));

        if (userAccounts.size() != accountIds.size()) {
            throw new EntityNotFoundException("One or more users could not be found.");
        }
        if (userAccounts.size() == 2) {
            List<Conversation> existing = conversationRepository
                    .findByUserAccounts_AccountIdAndConversationType(creatorId, ConversationType.SINGLE);
            // Alors dans notre conversation existante
            for (Conversation conv : existing) {
                if (conv.getUserAccounts().equals(userAccounts)) {
                    return conversationMapper.toDTO(conv);
                }
            }
        }
        Conversation conversation = new Conversation();
        conversation.setCreatorId(creatorId);
        conversation.setConversationType(userAccounts.size() > 2 ? ConversationType.GROUP : ConversationType.SINGLE);
        conversation.setUserAccounts(userAccounts);

        return conversationMapper.toDTO(conversationRepository.save(conversation));
    }


    @Transactional
    public void deleteConversation(Long conversationId, Long accountId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));
        if (!conversation.getCreatorId().equals(accountId)) {
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
        if (conversation.getUserAccounts().size() >= 10) {
            throw new IllegalArgumentException("Maximum 10 members allowed");
        }
        if (conversation.getConversationType() == ConversationType.GROUP) {
            if (!requesterId.equals(conversation.getCreatorId())) {
                throw new IllegalArgumentException("Only the creator can add to a group");
            }
        } else {
            boolean isParticipant = conversation.getUserAccounts().stream()
                    .anyMatch(u -> u.getAccountId().equals(requesterId));
            if (!isParticipant) {
                throw new SecurityException("You are not part of this conversation");
            }
        }
        conversation.getUserAccounts().add(target);
        if (conversation.getUserAccounts().size() > 2) {
            conversation.setConversationType(ConversationType.GROUP);
        }

        return conversationMapper.toDTO(conversationRepository.save(conversation));
    }

    @Transactional
    public ConversationDTO kickParticipant(Long conversationId, Long targetId, Long requesterId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));
        UserAccount target = userAccountRepository.findById(targetId)
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));
        if (!requesterId.equals(conversation.getCreatorId())) {
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
        if (conversation.getCreatorId().equals(accountId)) {
            Long nextCreatorId = conversation.getUserAccounts().iterator().next().getAccountId();
            conversation.setCreatorId(nextCreatorId);
            }
            conversationRepository.save(conversation);
        }
    }
