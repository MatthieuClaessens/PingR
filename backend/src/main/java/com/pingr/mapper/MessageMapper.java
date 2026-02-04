package com.pingr.mapper;

import com.pingr.entity.Message;
import com.pingr.dto.MessageDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MessageMapper {
    private final UserAccountMapper userAccountMapper;
    public Message fromDTO(MessageDTO dto) {
        if (dto == null) return null;

        Message m = new Message();
        m.setMessageId(dto.getMessageId());
        m.setMessageDate(dto.getMessageDate());
        m.setMessageContent(dto.getMessageContent());
        return m;
    }

    public MessageDTO toDTO(Message m) {
        if (m == null) return null;

        MessageDTO dto = new MessageDTO();
        dto.setMessageId(m.getMessageId());
        dto.setMessageDate(m.getMessageDate());
        dto.setMessageContent(m.getMessageContent());

        if (m.getUserAccount() != null) {
            dto.setUserAccount(userAccountMapper.toDTO(m.getUserAccount()));
        }
        return dto;
    }
}
