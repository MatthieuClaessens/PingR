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



@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserAccountRepository userAccountRepository;
    private final ConversationRepository conversationRepository;

    private static final String USER_NOT_FOUND = "User not found";
    private static final String CONVERSATION_NOT_FOUND = "Conversation not found";
    private static final String MESSAGE_NOT_FOUND = "Message not found";

    @Autowired
    public MessageService(MessageRepository messageRepository,
                          UserAccountRepository userAccountRepository,
                          ConversationRepository conversationRepository) {
        this.messageRepository = messageRepository;
        this.userAccountRepository = userAccountRepository;
        this.conversationRepository = conversationRepository;
    }

    // Récupérer tous les messages d'un utilisateur
    @Transactional(readOnly = true)
    public List<MessageDTO> getMessagesFromUserAccountId(Long accountId) {
        if (!userAccountRepository.existsById(accountId)) {
            throw new EntityNotFoundException(USER_NOT_FOUND);
        }
        return messageRepository.getMessagesByUserAccountId(accountId)
                .stream()
                .map(MessageMapper::toDTO)
                .toList();
    }

    // Version paginée pour éviter de charger des milliers de messages d'un coup
    @Transactional(readOnly = true)
    public Page<MessageDTO> getMessagesFromUserAccountId(Long accountId, Pageable pageable) {
        return messageRepository.getMessagesByUserAccountId(accountId, pageable)
                .map(MessageMapper::toDTO);
    }

    // Création d'un message : on lie l'auteur et la conversation cible
    @Transactional
    public MessageDTO createMessage(Long conversationId, Long accountId, String message) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));

        UserAccount userAccount = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));

        Message newMessage = new Message();
        newMessage.setMessageContent(message);
        newMessage.setMessageDate(LocalDateTime.now());
        newMessage.setConversation(conversation);
        newMessage.setUserAccount(userAccount);
        return MessageMapper.toDTO(messageRepository.save(newMessage));
    }

    // Récupère un message précis en vérifiant qu'il appartient bien à la bonne conversation
    @Transactional(readOnly = true)
    public MessageDTO getMessageById(Long conversationId, Long messageId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException(MESSAGE_NOT_FOUND));
    // Sécurité : on empêche de récupérer un message via une URL de conversation différente
        if (!message.getConversation().getConversationId().equals(conversation.getConversationId())) {
            throw new IllegalArgumentException("Message does not belong to the specified conversation");
        }

        return MessageMapper.toDTO(message);
    }

    @Transactional
    public MessageDTO editMessage(Long conversationId, Long messageId, String updatedContent) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException(MESSAGE_NOT_FOUND));
        if (!message.getConversation().getConversationId().equals(conversation.getConversationId())) {
            throw new IllegalArgumentException("Message does not belong to the specified conversation");
        }
            message.setMessageContent(updatedContent);
            Message updatedMessage = messageRepository.save(message);
        return MessageMapper.toDTO(updatedMessage);
    }


    // Suppression sécurisée : même logique de vérification que pour le "get"
    @Transactional
    public void deleteMessage(Long conversationId, Long messageId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException(MESSAGE_NOT_FOUND));
    // On s'assure de l'intégrité des données avant la suppression
        if (!message.getConversation().getConversationId().equals(conversation.getConversationId())) {
            throw new IllegalArgumentException("Message does not belong to the specified conversation");
        }
        messageRepository.delete(message);
    }
}
