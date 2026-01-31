package com.pingr.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MessageDTO {
    private Long messageId;
    private LocalDateTime messageDate;
    private String messageContent;
    private String updatedContent;
}
