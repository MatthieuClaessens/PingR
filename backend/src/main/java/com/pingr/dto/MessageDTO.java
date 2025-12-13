package com.pingr.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MessageDTO {
    private Long messageId;
    private LocalDateTime messageDate;
    private String messageContent;
}
