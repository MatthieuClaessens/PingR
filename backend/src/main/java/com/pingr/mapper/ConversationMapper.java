package com.pingr.mapper;

import com.pingr.entity.Conversation;
import com.pingr.dto.ConversationDTO;
import com.pingr.entity.UserAccount;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ConversationMapper {
    public Conversation fromDTO(ConversationDTO dto) {
        Conversation c = new Conversation();
        c.setConversationId(dto.getConversationId());
        c.setConversationType(dto.getConversationType());
        return c;
    }

    public ConversationDTO toDTO(Conversation c) {
        if (c == null) return null;

        ConversationDTO dto = new ConversationDTO();
        dto.setConversationId(c.getConversationId());
        dto.setConversationType(c.getConversationType());
        dto.setCreatorId(c.getCreatorId());

        if (c.getUserAccounts() != null && !c.getUserAccounts().isEmpty()) {
            Set<Long> accountsId = c.getUserAccounts().stream()
                    .map(UserAccount::getAccountId)
                    .collect(Collectors.toSet());
            dto.setAccountIds(accountsId);

            Set<ConversationDTO.AccountShortInfo> participants = c.getUserAccounts().stream()
                    .map(user -> {
                        ConversationDTO.AccountShortInfo info = new ConversationDTO.AccountShortInfo();
                        info.setAccountId(user.getAccountId());
                        info.setAccountName(user.getAccountName());
                        return info;
                    })
                    .collect(Collectors.toSet());

            dto.setParticipants(participants);
            System.out.println("Mapper : " + participants.size() + " participants mappés avec noms.");
        } else {
            System.out.println("Mapper : Attention, userAccounts est NULL ou VIDE pour la conv ID: " + c.getConversationId());
        }
        return dto;
    }
}