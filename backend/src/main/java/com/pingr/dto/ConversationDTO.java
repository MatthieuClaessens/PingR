package com.pingr.dto;

import com.pingr.entity.ConversationType;
import lombok.Data;

@Data
public class ConversationDTO {
    private Long conversationId;
    private ConversationType conversationType;
}
