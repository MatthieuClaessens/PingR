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
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserAccountRepository userAccountRepository;
    private final ConversationRepository conversationRepository;
    private final MessageMapper messageMapper;

    private static final String USER_NOT_FOUND = "User not found";
    private static final String CONVERSATION_NOT_FOUND = "Conversation not found";
    private static final String MESSAGE_NOT_FOUND = "Message not found";
    private static final String NOT_PARTICIPANT = "You are not a participant of this conversation";
    private static final String NOT_AUTHOR = "You are not the author of this message";

    @Transactional(readOnly = true)
    public Page<MessageDTO> getMessagesByConversationId(Long conversationId, Long requesterId, Pageable pageable) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));
        boolean isParticipant = conversation.getUserAccounts().stream()
                .anyMatch(u -> u.getAccountId().equals(requesterId));
        if (!isParticipant) {
            throw new SecurityException(NOT_PARTICIPANT);
        }
        return messageRepository.findByConversation_ConversationId(conversationId, pageable)
                .map(messageMapper::toDTO);
    }

    @Transactional
    public MessageDTO createMessage(Long conversationId, Long accountId, String messageContent) {
        if (messageContent.isBlank()) {
            Conversation conversation = conversationRepository.findById(conversationId)
                    .orElseThrow(() -> new EntityNotFoundException(CONVERSATION_NOT_FOUND));
            UserAccount userAccount = userAccountRepository.findById(accountId)
                    .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND));
            boolean isParticipant = conversation.getUserAccounts().stream()
                    .anyMatch(u -> u.getAccountId().equals(accountId));
            if (!isParticipant) {
                throw new SecurityException(NOT_PARTICIPANT);
            }
            Message newMessage = new Message();
            newMessage.setMessageContent(messageContent);
            newMessage.setMessageDate(LocalDateTime.now());
            newMessage.setConversation(conversation);
            newMessage.setUserAccount(userAccount);
            return messageMapper.toDTO(messageRepository.save(newMessage));
        }
    }

    @Transactional(readOnly = true)
    public MessageDTO getMessageById(Long conversationId, Long messageId, Long requesterId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException(MESSAGE_NOT_FOUND));

        if (!message.getConversation().getConversationId().equals(conversationId)) {
            throw new IllegalArgumentException("Message does not belong to this conversation");
        }
        boolean isParticipant = message.getConversation().getUserAccounts().stream()
                .anyMatch(u -> u.getAccountId().equals(requesterId));
        if (!isParticipant) {
            throw new SecurityException(NOT_PARTICIPANT);
        }
        return messageMapper.toDTO(message);
    }

    @Transactional
    public MessageDTO editMessage(Long conversationId, Long messageId, Long requesterId, String updatedContent) {
        Message message = getValidatedMessage(conversationId, messageId, requesterId);

        message.setMessageContent(updatedContent);
        return messageMapper.toDTO(messageRepository.save(message));
    }

    @Transactional
    public void deleteMessage(Long conversationId, Long messageId, Long requesterId) {
        Message message = getValidatedMessage(conversationId, messageId, requesterId);

        messageRepository.delete(message);
    }

    private Message getValidatedMessage(Long conversationId, Long messageId, Long requesterId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException(MESSAGE_NOT_FOUND));
        if (!message.getConversation().getConversationId().equals(conversationId)) {
            throw new IllegalArgumentException("Inconsistent conversation context");
        }
        if (!message.getUserAccount().getAccountId().equals(requesterId)) {
            throw new SecurityException(NOT_AUTHOR);
        }
        return message;
    }
}