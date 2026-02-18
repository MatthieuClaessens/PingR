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
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

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
    public Page<ConversationDTO> getConversationsFromUserAccountId(Long accountId, Pageable pageable) {
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
        if (accountIds == null || accountIds.isEmpty()) {
            throw new IllegalArgumentException("La liste des participants ne peut pas être vide.");
        }

        Set<Long> allIds = new HashSet<>(accountIds);
        allIds.add(accountId);
        Set<UserAccount> userAccounts = new HashSet<>(userAccountRepository.findAllById(allIds));

        if (userAccounts.size() != allIds.size()) {
            throw new EntityNotFoundException("Un ou plusieurs utilisateurs sont introuvables.");
        }

        if (userAccounts.size() == 1) {
            throw new IllegalArgumentException("Vous ne pouvez pas créer une conversation avec vous-même.");
        }

        if (userAccounts.size() == 2) {
            List<Conversation> existingConvs = conversationRepository
                    .findByUserAccounts_AccountIdAndConversationType(accountId, ConversationType.SINGLE);
            for (Conversation conv : existingConvs) {
                Set<Long> existingIds = conv.getUserAccounts().stream()
                        .map(UserAccount::getAccountId)
                        .collect(Collectors.toSet());
                if (existingIds.equals(allIds)) {
                    return conversationMapper.toDTO(conv);
                }
            }
        }

        Conversation conversation = new Conversation();
        conversation.setConversationType(userAccounts.size() > 2 ? ConversationType.GROUP : ConversationType.SINGLE);
        conversation.setCreatorId(accountId);
        conversation.setUserAccounts(userAccounts);

        Conversation savedConversation = conversationRepository.save(conversation);
        return conversationMapper.toDTO(savedConversation);
    }

    @Transactional
    public void deleteConversation(Long conversationId, Long accountId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));

        boolean isMember = conversation.getUserAccounts().stream()
                .anyMatch(u -> u.getAccountId().equals(accountId));
        if (!isMember) {
            throw new SecurityException("You are not a member of this conversation");
        }

        if (conversation.getConversationType() == ConversationType.GROUP) {
            if (!accountId.equals(conversation.getCreatorId())) {
                throw new IllegalArgumentException("Only the creator can delete a group conversation.");
            }
        }
        conversation.getMessages().clear();
        conversationRepository.flush();
        conversationRepository.delete(conversation);
    }

    @Transactional(readOnly = true)
    public ConversationDTO getConversationById(Long conversationId, Long accountId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));

        boolean isMember = conversation.getUserAccounts().stream()
                .anyMatch(u -> u.getAccountId().equals(accountId));
        if (!isMember) {
            throw new IllegalArgumentException("User is not allowed to read this conversation");
        }

        return conversationMapper.toDTO(conversation);
    }

    @Transactional
    public ConversationDTO addParticipant(Long conversationId, Long targetId, Long requesterId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));

        UserAccount requester = userAccountRepository.findById(requesterId)
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));

        UserAccount target = userAccountRepository.findById(targetId)
                .orElseThrow(() -> new EntityNotFoundException("Target user not found"));

        if (!conversation.getUserAccounts().contains(requester)) {
            throw new SecurityException("You are not a member of this conversation");
        }

        if (conversation.getConversationType() == ConversationType.SINGLE) {
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

        if (!(conversation.getConversationType() == ConversationType.GROUP
                && requesterId.equals(conversation.getCreatorId()))) {
            throw new IllegalArgumentException("Only the creator can kick a participant");
        }

        if (targetId.equals(conversation.getCreatorId())) {
            throw new IllegalArgumentException("The creator cannot be kicked");
        }

        conversation.getUserAccounts().remove(target);
        return conversationMapper.toDTO(conversationRepository.save(conversation));
    }

    @Transactional
    public void leaveParticipant(Long conversationId, Long accountId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));

        if (conversation.getConversationType() == ConversationType.SINGLE) {
            throw new IllegalArgumentException("Impossible de quitter une conversation privée.");
        }

        boolean removed = conversation.getUserAccounts().removeIf(u -> u.getAccountId().equals(accountId));

        if (!removed) {
            throw new SecurityException("Vous ne faites pas partie de ce groupe.");
        }

        if (conversation.getUserAccounts().isEmpty()) {
            conversationRepository.delete(conversation);
            return;
        }

        if (accountId.equals(conversation.getCreatorId())) {
            UserAccount nextCreator = conversation.getUserAccounts().iterator().next();
            conversation.setCreatorId(nextCreator.getAccountId());
        }

        conversationRepository.save(conversation);
    }
}