package com.pingr.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MessageDTO {
    private LocalDateTime messageDate;
    private String messageContent;
}
