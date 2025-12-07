package com.pingr.dto

import lombok.Data
import java.time.LocalDateTime

data class MessageDTO(
    val messageId: Long,
    val messageDate: LocalDateTime,
    val messageContent: String,
    val channelId: Long,
    val accountId: Long
)