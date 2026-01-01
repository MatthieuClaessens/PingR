package com.pingr.mapper;

import com.pingr.entity.Conversation;
import com.pingr.dto.ConversationDTO;
import org.springframework.stereotype.Component;

@Component
public class ConversationMapper {
    public Conversation fromDTO(ConversationDTO dto) {
        Conversation c = new Conversation();
        c.setConversationId(dto.getConversationId());
        c.setConversationType(dto.getConversationType());
        return c;
    }

    public ConversationDTO toDTO(Conversation c) {
        ConversationDTO dto = new ConversationDTO();
        dto.setConversationId(c.getConversationId());
        dto.setConversationType(c.getConversationType());
        if (c.getUserAccounts() != null && !c.getUserAccounts().isEmpty()) {
            dto.setAccountId(c.getUserAccounts().get(0).getAccountId());
        }
        return dto;
    }
}