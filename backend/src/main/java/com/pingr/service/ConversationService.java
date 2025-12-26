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

    // Initialisation d'une nouvelle discussion
    @Transactional
    public ConversationDTO createConversation(Long accountId) {
        UserAccount userAccount = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("User account not found"));
        Conversation conversation = new Conversation();
        conversation.setConversationType(ConversationType.SINGLE);
        conversation.getUserAccounts().add(userAccount);
        Conversation saved = conversationRepository.save(conversation);
        return ConversationMapper.toDTO(saved);
    }


    // Supprime la conversation, mais seulement si l'utilisateur qui demande fait bien partie des participants    @Transactional
    public void deleteConversation(Long conversationId, Long accountId) {
        UserAccount userAccount = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("User account not found"));
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        // Sécurité : on évite qu'un utilisateur externe puisse supprimer la discussion
        if (!conversation.getUserAccounts().contains(userAccount)) {
            throw new IllegalArgumentException("User is not allowed to delete this conversation");
        }
        conversationRepository.delete(conversation);

    }

    // Récupère les détails d'une discussion après avoir vérifié les droits d'accès
    @Transactional(readOnly = true)
    public ConversationDTO getConversationById(Long conversationId, Long accountId) {
        UserAccount userAccount = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("User account not found"));
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        // On s'assure que l'utilisateur est bien membre pour autoriser la lecture
        if (!conversation.getUserAccounts().contains(userAccount)) {
            throw new IllegalArgumentException("User is not allowed to read this conversation");
        }
        return ConversationMapper.toDTO(conversation);
    }

    // Gère l'ajout d'un membre avec une règle métier : si on dépasse 2 personnes, ça devient un groupe
    @Transactional
    public ConversationDTO addParticipant(Long conversationId, Long accountId) {
        UserAccount userAccount = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("User account not found"));
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        Conversation savedConversation;
        // Si c'était un chat privé (SINGLE), on bascule sur une nouvelle entité de type GROUP
        if (conversation.getConversationType() == ConversationType.SINGLE) {
            Conversation newConversation = new Conversation();
            newConversation.setConversationType(ConversationType.GROUP);
            // On transfère les membres existants et on ajoute le nouveau venu
            newConversation.getUserAccounts().addAll(conversation.getUserAccounts());
            newConversation.getUserAccounts().add(userAccount);

            // On limite la taille des groupes à 10 pour garder des discussions gérables
            if (newConversation.getUserAccounts().size() > 10) {
                // Vérification de la limite si la conversation est déjà un groupe
                throw new IllegalArgumentException("Maximum: 10 members allowed");
            }
            // Cas classique : ajout simple d'un participant à un groupe existant
            savedConversation = conversationRepository.save(newConversation);
            return ConversationMapper.toDTO(savedConversation);
        } else if (conversation.getConversationType() == ConversationType.GROUP &&
                conversation.getUserAccounts().size() >= 10) {
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
        return ConversationMapper.toDTO(conversationRepository.save(conversation));
    }
}
