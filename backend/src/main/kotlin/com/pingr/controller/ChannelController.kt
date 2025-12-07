package com.pingr.controller

import com.pingr.dto.ChannelDTO
import java.net.URI
import lombok.RequiredArgsConstructor
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/channel")
@RequiredArgsConstructor
class ChannelController(private val channelService: ChannelService) {

    @PostMapping
    fun createChannel(): ResponseEntity<ChannelDTO> {
        val dto = channelService.createChannel()
        val location = URI.create("/api/channel/${dto.channelId}")
        return ResponseEntity.created(location).body(dto)
    }
}