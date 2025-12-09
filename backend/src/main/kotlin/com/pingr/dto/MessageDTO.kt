package com.pingr.dto

import java.time.LocalDateTime

data class MessageDTO(
    val messageId: Long,
    val messageDate: LocalDateTime,
    val messageContent: String,
    val conversationId: Long,
    val accountId: Long
)