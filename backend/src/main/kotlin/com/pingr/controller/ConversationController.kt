package com.pingr.controller

import com.pingr.dto.ConversationDTO
import com.pingr.service.ConversationService
import java.net.URI
import lombok.RequiredArgsConstructor
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/conversation")
@RequiredArgsConstructor
class ConversationController(private val conversationService: ConversationService) {

    @PostMapping
    fun createConversation(): ResponseEntity<ConversationDTO> {
        val dto = conversationService.createConversation()
        val location = URI.create("/api/conversation/${dto.conversationId}")
        return ResponseEntity.created(location).body(dto)
    }
}