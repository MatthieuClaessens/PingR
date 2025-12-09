package com.pingr.controller

import com.pingr.dto.ConversationDTO
import java.net.URI
import lombok.RequiredArgsConstructor
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/channel")
@RequiredArgsConstructor
class ChannelController(private val channelService: ChannelService) {

    @PostMapping
    fun createChannel(): ResponseEntity<ConversationDTO> {
        val dto = channelService.createChannel()
        val location = URI.create("/api/channel/${dto.channelId}")
        return ResponseEntity.created(location).body(dto)
    }
}