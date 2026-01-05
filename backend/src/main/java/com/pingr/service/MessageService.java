package com.pingr.service;

import com.pingr.dto.MessageDTO;
import com.pingr.entity.Message;
import com.pingr.entity.Conversation;
import com.pingr.entity.UserAccount;
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
    private final MessageMapper messageMapper;

    private static final String USER_NOT_FOUND = "Utilisateur non trouvé";
    private static final String CONVERSATION_NOT_FOUND = "Conversation non trouvée";
    private static final String MESSAGE_NOT_FOUND = "Message non trouvé";

    @Autowired
    public MessageService(MessageRepository messageRepository,
                          UserAccountRepository userAccountRepository,
                          ConversationRepository conversationRepository, MessageMapper messageMapper) {
        this.messageRepository = messageRepository;
        this.userAccountRepository = userAccountRepository;
        this.conversationRepository = conversationRepository;
        this.messageMapper = messageMapper;
    }

    @Transactional(readOnly = true)
    public List<MessageDTO> getMessagesFromUserAccountId(Long accountId) {
        if (!userAccountRepository.existsById(accountId)) {
            throw new EntityNotFoundException(USER_NOT_FOUND);
        }
        return messageRepository.findByUserAccount_AccountId(accountId)
                .stream()
                .map(messageMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<MessageDTO> getMessagesFromUserAccountId(Long accountId, Pageable pageable) {
        return messageRepository.findByUserAccount_AccountId(accountId, pageable)
                .map(messageMapper::toDTO);
    }

    @Transactional
    public MessageDTO createMessage(Long conversationId, Long accountId, String messageContent) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));

        UserAccount userAccount = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));

        Message newMessage = new Message();
        newMessage.setMessageContent(messageContent);
        newMessage.setMessageDate(LocalDateTime.now());
        newMessage.setConversation(conversation);
        newMessage.setUserAccount(userAccount);

        return messageMapper.toDTO(messageRepository.save(newMessage));
    }


    @Transactional(readOnly = true)
    public MessageDTO getMessageById(Long conversationId, Long messageId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException(MESSAGE_NOT_FOUND));

        if (!message.getConversation().getConversationId().equals(conversation.getConversationId())) {
            throw new IllegalArgumentException("Ce message n'appartient pas à cette conversation.");
        }

        return messageMapper.toDTO(message);
    }

    @Transactional
    public MessageDTO editMessage(Long conversationId, Long messageId, String updatedContent) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException(MESSAGE_NOT_FOUND));

        if (!message.getConversation().getConversationId().equals(conversation.getConversationId())) {
            throw new IllegalArgumentException("Action interdite : conversation incohérente.");
        }

        message.setMessageContent(updatedContent);
        return messageMapper.toDTO(messageRepository.save(message));
    }

    @Transactional
    public void deleteMessage(Long conversationId, Long messageId) {
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