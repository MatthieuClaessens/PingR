package com.pingr.dto;

import java.time.LocalDateTime;

public record MessageDTO(
        Long messageId,
        LocalDateTime messageDate,
        String messageContent,
        Long conversationId,
        Long accountId
) {}
