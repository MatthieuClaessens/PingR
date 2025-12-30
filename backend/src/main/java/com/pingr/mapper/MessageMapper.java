package com.pingr.mapper;

import com.pingr.entity.Message;
import com.pingr.dto.MessageDTO;
import org.springframework.stereotype.Component;

@Component
public class MessageMapper {
    public static Message fromDTO(MessageDTO dto) {
        Message m = new Message();
        m.setMessageId(dto.getMessageId());
        m.setMessageDate(dto.getMessageDate());
        m.setMessageContent(dto.getMessageContent());
        return m;
    }

    public MessageDTO toDTO(Message m) {
        MessageDTO dto = new MessageDTO();
        dto.setMessageId(m.getMessageId());
        dto.setMessageDate(m.getMessageDate());
        dto.setMessageContent(m.getMessageContent());
        return dto;
    }
}
