package com.pingr.controller;

import com.pingr.dto.ConversationDTO;
import com.pingr.service.ConversationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;

    @GetMapping
    public ResponseEntity<Page<ConversationDTO>> getConversations(
            Authentication authentication,
            @PageableDefault(size = 20, sort = "conversationId") Pageable pageable
    ) {
        Long accountId = (Long) authentication.getPrincipal();
        Page<ConversationDTO> conversations = conversationService
                .getConversationsFromUserAccountId(accountId, pageable);
        return ResponseEntity.ok(conversations);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ConversationDTO>> getAllConversations(
            Authentication authentication
    ) {
        Long accountId = (Long) authentication.getPrincipal();
        List<ConversationDTO> conversations = conversationService
                .getConversationsFromUserAccountId(accountId);
        return ResponseEntity.ok(conversations);
    }

    @GetMapping("/{conversationId}")
    public ResponseEntity<ConversationDTO> getConversation(
            @PathVariable Long conversationId,
            Authentication authentication
    ) {
        Long accountId = (Long) authentication.getPrincipal();
        ConversationDTO conversation = conversationService
                .getConversationById(conversationId, accountId);
        return ResponseEntity.ok(conversation);
    }

    @PostMapping
    public ResponseEntity<ConversationDTO> createConversation(
            @Valid @RequestBody ConversationDTO dto,
            Authentication authentication
    ) {
        Long accountId = (Long) authentication.getPrincipal();
        ConversationDTO created = conversationService
                .createConversation(dto.getAccountIds(), accountId);
        return ResponseEntity.status(201).body(created);
    }

    @DeleteMapping("/{conversationId}")
    public ResponseEntity<Void> deleteConversation(
            @PathVariable Long conversationId,
            Authentication authentication
    ) {
        Long accountId = (Long) authentication.getPrincipal();
        conversationService.deleteConversation(conversationId, accountId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{conversationId}/participants/{targetId}")
    public ResponseEntity<ConversationDTO> addParticipant(
            @PathVariable Long conversationId,
            @PathVariable Long targetId,
            Authentication authentication
    ) {
        Long requesterId = (Long) authentication.getPrincipal();
        ConversationDTO updated = conversationService
                .addParticipant(conversationId, targetId, requesterId);
        return ResponseEntity.status(HttpStatus.CREATED).body(updated);
    }

    @DeleteMapping("/{conversationId}/participants/{targetId}")
    public ResponseEntity<ConversationDTO> kickParticipant(
            @PathVariable Long conversationId,
            @PathVariable Long targetId,
            Authentication authentication
    ) {
        Long accountId = (Long) authentication.getPrincipal();
        ConversationDTO updated = conversationService
                .kickParticipant(conversationId, targetId, accountId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{conversationId}/leave")
    public ResponseEntity<Void> leaveParticipant(
            @PathVariable Long conversationId,
            Authentication authentication
    ) {
        Long accountId = (Long) authentication.getPrincipal();
        conversationService.leaveParticipant(conversationId, accountId);
        return ResponseEntity.noContent().build();
    }

}
