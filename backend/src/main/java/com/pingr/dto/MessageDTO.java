package com.pingr.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MessageDTO {
    private UserAccountDTO userAccount;
    private Long messageId;
    private LocalDateTime messageDate;

    @NotBlank
    @Size(max = 2000)
    private String messageContent;
    private String updatedContent;
}
