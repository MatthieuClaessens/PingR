package com.pingr.controller;

import com.pingr.dto.MessageDTO;
import com.pingr.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/conversations/{conversationId}/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping
    public ResponseEntity<Page<MessageDTO>> getMessages(
            @PathVariable Long conversationId,
            @RequestParam Long requesterId,
            @PageableDefault(size = 20, sort = "messageDate") Pageable pageable
    ) {
        Page<MessageDTO> messages = messageService
                .getMessagesByConversationId(conversationId, requesterId, pageable);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/{messageId}")
    public ResponseEntity<MessageDTO> getMessage(
            @PathVariable Long conversationId,
            @PathVariable Long messageId,
            @RequestParam Long requesterId
    ) {
        MessageDTO message = messageService
                .getMessageById(conversationId, messageId, requesterId);
        return ResponseEntity.ok(message);
    }

    @PostMapping
    public ResponseEntity<MessageDTO> createMessage(
            @PathVariable Long conversationId,
            @RequestParam Long accountId,
            @RequestBody String content
    ) {
        MessageDTO created = messageService
                .createMessage(conversationId, accountId, content);
        return ResponseEntity.status(201).body(created);
    }

    @PatchMapping("/{messageId}")
    public ResponseEntity<MessageDTO> editMessage(
            @PathVariable Long conversationId,
            @PathVariable Long messageId,
            @RequestParam Long requesterId,
            @RequestBody String updatedContent
    ) {
        MessageDTO updated = messageService
                .editMessage(conversationId, messageId, requesterId, updatedContent);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable Long conversationId,
            @PathVariable Long messageId,
            @RequestParam Long requesterId
    ) {
        messageService.deleteMessage(conversationId, messageId, requesterId);
        return ResponseEntity.noContent().build();
    }
}