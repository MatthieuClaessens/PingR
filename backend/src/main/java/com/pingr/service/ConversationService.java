package com.pingr.service;

import com.pingr.dto.ConversationDTO;
import com.pingr.entity.Conversation;
import com.pingr.entity.ConversationType;
import com.pingr.entity.UserAccount;
import com.pingr.mapper.ConversationMapper;
import com.pingr.repository.ConversationRepository;
import com.pingr.repository.MessageRepository;
import com.pingr.repository.UserAccountRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserAccountRepository userAccountRepository;
    private final MessageRepository messageRepository;

    private static final String USER_NOT_FOUND = "User not found";
    private static final String CONVERSATION_NOT_FOUND = "Conversation not found";
    private final ConversationMapper conversationMapper;

    // Récupérer toutes les conversations d'un utilisateur
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

    // Récupère les conversations (groupes ou privées) auxquelles appartient l'utilisateur
    @Transactional(readOnly = true)
    public Page<ConversationDTO> getConversationsFromUserAccountId(Long accountId, Pageable pageable) {
        // On appelle une méthode du repository qui renvoie des OBJETS Conversation
        return conversationRepository.findByUserAccounts_AccountId(accountId, pageable)
                .map(conversationMapper::toDTO);
    }

    // Initialisation d'une nouvelle discussion, par défaut en mode "SINGLE"    @Transactional
    public ConversationDTO createConversation(Long accountId) {
        UserAccount userAccount = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));
        Conversation conversation = new Conversation();
        conversation.setConversationType(ConversationType.SINGLE);
        conversation.getUserAccounts().add(userAccount);
        Conversation saved = conversationRepository.save(conversation);
        return conversationMapper.toDTO(saved);
    }


    // Supprime la conversation, mais seulement si l'utilisateur qui demande fait bien partie des participants    @Transactional
    public void deleteConversation(Long conversationId, Long accountId) {
        UserAccount userAccount = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));
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
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));
        // On s'assure que l'utilisateur est bien membre pour autoriser la lecture
        if (!conversation.getUserAccounts().contains(userAccount)) {
            throw new IllegalArgumentException("User is not allowed to read this conversation");
        }
        return conversationMapper.toDTO(conversation);
    }

    // Ajoute un participant et crée une nouvelle conversation de type GROUP si la conversation est privée
    @Transactional
    public ConversationDTO addParticipant(Long conversationId, Long accountId) {
        UserAccount userAccount = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));
        Conversation savedConversation;
        // Si c'est un chat privé (SINGLE), on bascule sur une nouvelle entité de type GROUP
        if (conversation.getConversationType() == ConversationType.SINGLE) {
            Conversation newConversation = new Conversation();
            newConversation.setConversationType(ConversationType.GROUP);
            // On transfère les membres du chat privé vers cette nouvelle discussion groupée
            newConversation.getUserAccounts().addAll(conversation.getUserAccounts());
            newConversation.getUserAccounts().add(userAccount);

            // On limite la taille des groupes à 10 pour garder des discussions gérables
            if (newConversation.getUserAccounts().size() > 10) {
                // Vérification de la limite si la conversation est déjà un groupe
                throw new IllegalArgumentException("Maximum: 10 members allowed");
            }
            // Cas classique : ajout simple d'un participant à un groupe existant
            savedConversation = conversationRepository.save(newConversation);
            return conversationMapper.toDTO(savedConversation);
        } else if (conversation.getConversationType() == ConversationType.GROUP &&
                conversation.getUserAccounts().size() >= 10) {
            // Sécurité pour les groupes existants : on bloque l'ajout si le plafond est atteint
            throw new IllegalArgumentException(("Maximum 10 members allowed"));
        }
        // Cas standard : ajout d'un participant à un groupe qui n'est pas encore complet
        conversation.getUserAccounts().add(userAccount);
        savedConversation = conversationRepository.save(conversation);

        return conversationMapper.toDTO(savedConversation);
    }

    // Retire un utilisateur de la liste des participants
    @Transactional
    public ConversationDTO kickParticipant(Long conversationId, Long accountId) {
        UserAccount userAccount = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));
        // La JPA se chargera de mettre à jour la table de jointure suite au retrait de l'élément
        conversation.getUserAccounts().remove(userAccount);
        return conversationMapper.toDTO(conversationRepository.save(conversation));
    }
}
