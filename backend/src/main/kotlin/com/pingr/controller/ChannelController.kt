package com.pingr.controller

import lombok.RequiredArgsConstructor
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/channel/{id}")
@RequiredArgsConstructor
class ChannelController(private val channelService: ChannelService) {
}