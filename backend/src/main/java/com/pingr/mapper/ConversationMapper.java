package com.pingr.mapper;

import com.pingr.entity.Conversation;
import com.pingr.dto.ConversationDTO;

public class ConversationMapper {
    public static Conversation fromDTO(ConversationDTO dto) {
        Conversation c = new Conversation();
        c.setConversationId(dto.getConversationId());
        return c;
    }

    public static ConversationDTO toDTO(Conversation c) {
        ConversationDTO dto = new ConversationDTO();
        dto.setConversationId(c.getConversationId());
        return dto;
    }
}
