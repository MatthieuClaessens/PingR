package com.pingr.dto;

import com.pingr.entity.ConversationType;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Set;

@Data
public class ConversationDTO {
    private Long conversationId;
    private ConversationType conversationType;

    @NotNull
    private Long creatorId;

    @NotEmpty
    private Set<Long> accountIds;
}
