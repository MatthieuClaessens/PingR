package com.pingr.controller;

import com.pingr.dto.ConversationDTO;
import com.pingr.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("/api/conversation")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;

    @PostMapping
    public ResponseEntity<ConversationDTO> createConversation() {
        ConversationDTO dto = conversationService.createConversation();
        URI location = URI.create("/api/conversation/" + dto.getConversationId());
        return ResponseEntity.created(location).body(dto);
    }
}