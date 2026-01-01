package com.pingr.service;

import com.pingr.dto.ConversationDTO;
import com.pingr.dto.MessageDTO;
import com.pingr.entity.Message;
import com.pingr.entity.Conversation;
import com.pingr.entity.UserAccount;
import com.pingr.mapper.ConversationMapper;
import com.pingr.repository.MessageRepository;
import com.pingr.repository.ConversationRepository;
import com.pingr.repository.UserAccountRepository;
import com.pingr.mapper.MessageMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service gérant l'envoi, la modification et la lecture des messages.
 * C'est le "moteur" de la messagerie de Pingr.
 */
@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserAccountRepository userAccountRepository;
    private final ConversationRepository conversationRepository;
    private final MessageMapper messageMapper;

    // Messages d'erreurs clairs pour le débogage et l'utilisateur
    private static final String USER_NOT_FOUND = "Utilisateur non trouvé";
    private static final String CONVERSATION_NOT_FOUND = "Conversation non trouvée";
    private static final String MESSAGE_NOT_FOUND = "Message non trouvé";

    /**
     * Constructeur pour l'injection des dépendances.
     * On utilise @Autowired ici, ce qui permet à Spring de relier les repositories et le mapper.
     */
    @Autowired
    public MessageService(MessageRepository messageRepository,
                          UserAccountRepository userAccountRepository,
                          ConversationRepository conversationRepository, MessageMapper messageMapper) {
        this.messageRepository = messageRepository;
        this.userAccountRepository = userAccountRepository;
        this.conversationRepository = conversationRepository;
        this.messageMapper = messageMapper;
    }

    /**
     * Récupère l'historique complet des messages d'un utilisateur spécifique.
     */
    @Transactional(readOnly = true)
    public List<MessageDTO> getMessagesFromUserAccountId(Long accountId) {
        if (!userAccountRepository.existsById(accountId)) {
            throw new EntityNotFoundException(USER_NOT_FOUND);
        }
        return messageRepository.findByUserAccount_AccountId(accountId)
                .stream()
                .map(messageMapper::toDTO) // On convertit chaque entité en DTO
                .toList();
    }

    /**
     * Version paginée de la récupération des messages.
     * Indispensable pour la performance : on ne charge pas 1000 messages d'un coup sur le téléphone.
     */
    @Transactional(readOnly = true)
    public Page<MessageDTO> getMessagesFromUserAccountId(Long accountId, Pageable pageable) {
        return messageRepository.findByUserAccount_AccountId(accountId, pageable)
                .map(messageMapper::toDTO);
    }

    /**
     * Enregistre un nouveau message dans une discussion.
     */
    @Transactional
    public MessageDTO createMessage(Long conversationId, Long accountId, String messageContent) {
        // 1. On vérifie que la conversation et l'utilisateur existent
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));

        UserAccount userAccount = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));

        // 2. On crée l'objet Message et on lie les relations (Auteur et Discussion)
        Message newMessage = new Message();
        newMessage.setMessageContent(messageContent);
        newMessage.setMessageDate(LocalDateTime.now()); // Date automatique au moment de l'envoi
        newMessage.setConversation(conversation);
        newMessage.setUserAccount(userAccount);

        // 3. On sauvegarde et on renvoie le résultat au format DTO
        return messageMapper.toDTO(messageRepository.save(newMessage));
    }

    /**
     * Récupère un message par son ID, avec une double vérification de sécurité.
     */
    @Transactional(readOnly = true)
    public MessageDTO getMessageById(Long conversationId, Long messageId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException(MESSAGE_NOT_FOUND));

        // SÉCURITÉ : On vérifie que le message appartient bien à la conversation demandée.
        // Cela empêche quelqu'un de deviner un ID de message d'une autre discussion.
        if (!message.getConversation().getConversationId().equals(conversation.getConversationId())) {
            throw new IllegalArgumentException("Ce message n'appartient pas à cette conversation.");
        }

        return messageMapper.toDTO(message);
    }

    /**
     * Permet à l'utilisateur de modifier le contenu d'un message envoyé.
     */
    @Transactional
    public MessageDTO editMessage(Long conversationId, Long messageId, String updatedContent) {
        // On récupère le message et on refait la vérification de sécurité
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException(MESSAGE_NOT_FOUND));

        if (!message.getConversation().getConversationId().equals(conversation.getConversationId())) {
            throw new IllegalArgumentException("Action interdite : conversation incohérente.");
        }

        // On ne change que le texte, la date d'origine reste la même
        message.setMessageContent(updatedContent);
        return messageMapper.toDTO(messageRepository.save(message));
    }

    /**
     * Supprime un message de la base de données.
     */
    @Transactional
    public void deleteMessage(Long conversationId, Long messageId) {
        // On vérifie une dernière fois l'existence et la cohérence avant de supprimer
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException(MESSAGE_NOT_FOUND));

        if (!message.getConversation().getConversationId().equals(conversation.getConversationId())) {
            throw new IllegalArgumentException("Suppression impossible : lien corrompu.");
        }

        messageRepository.delete(message);
    }
}