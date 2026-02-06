package com.pingr.controller;

import com.pingr.dto.MessageDTO;
import com.pingr.service.MessageService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.pingr.repository.ConversationRepository;

@RestController
@RequestMapping("/api/conversations/{conversationId}/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final ConversationRepository conversationRepository;

    @GetMapping
    public ResponseEntity<Page<MessageDTO>> getMessages(
            @PathVariable Long conversationId,
            Authentication authentication,
            @PageableDefault(size = 20, sort = "messageDate") Pageable pageable
    ) {
        Long requesterId = (Long) authentication.getPrincipal();
        if (!conversationRepository.existsById(conversationId)) {
            throw new EntityNotFoundException("Conversation not found with ID:" + conversationId);
        }
        Page<MessageDTO> messages = messageService
                .getMessagesByConversationId(conversationId, requesterId, pageable);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/{messageId}")
    public ResponseEntity<MessageDTO> getMessage(
            @PathVariable Long conversationId,
            @PathVariable Long messageId,
            Authentication authentication
    ) {
        Long requesterId = (Long) authentication.getPrincipal();
        MessageDTO message = messageService
                .getMessageById(conversationId, messageId, requesterId);
        return ResponseEntity.ok(message);
    }

    @PostMapping
    public ResponseEntity<MessageDTO> createMessage(
            @PathVariable Long conversationId,
            Authentication authentication,
            @Valid @RequestBody MessageRequest request
    ) {
        Long accountId = (Long) authentication.getPrincipal();
        MessageDTO created = messageService
                .createMessage(conversationId, accountId, request.messageContent());
        return ResponseEntity.status(201).body(created);
    }

    @PatchMapping("/{messageId}")
    public ResponseEntity<MessageDTO> editMessage(
            @PathVariable Long conversationId,
            @PathVariable Long messageId,
            Authentication authentication,
            @RequestBody MessageRequest request
    ) {
        Long requesterId = (Long) authentication.getPrincipal();
        MessageDTO updated = messageService
                .editMessage(conversationId, messageId, requesterId, request.messageContent());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable Long conversationId,
            @PathVariable Long messageId,
            Authentication authentication
    ) {
        Long requesterId = (Long) authentication.getPrincipal();
        messageService.deleteMessage(conversationId, messageId, requesterId);
        return ResponseEntity.noContent().build();
    }
}

record MessageRequest(String messageContent) {}