package com.pingr.controller;

import com.pingr.dto.ConversationDTO;
import com.pingr.mapper.ConversationMapper;
import com.pingr.service.ConversationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/conversation")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;
    private final ConversationMapper conversationMapper;

    @PostMapping
    public ResponseEntity<ConversationDTO> createConversation(@Valid @RequestBody ConversationDTO request) {
        ConversationDTO dto = conversationService.createConversation(request.getAccountId());
        return ResponseEntity.created(URI.create("/api/conversation/" + dto.getConversationId())).body(dto);
    }

    @GetMapping("/{id}")
public Page<ConversationDTO> getConversationsFromUserAccountId(
        @PathVariable(name = "id") Long accountId,
        @PageableDefault(size=  20, sort = "conversationId") Pageable pageable) {
        return conversationService.getConversationsFromUserAccountId(accountId, pageable).map(ConversationMapper::toDTO);
    }
}