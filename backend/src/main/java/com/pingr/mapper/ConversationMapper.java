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

        if (c.getUserAccounts() != null) {
            System.out.println("Mapper : Nombre de comptes trouvés dans l'entité : " + c.getUserAccounts().size());

            Set<Long> accountsId = c.getUserAccounts().stream()
                    .map(UserAccount::getAccountId)
                    .collect(Collectors.toSet());
            dto.setAccountIds(accountsId);
        } else {
            System.out.println("Mapper : Attention, userAccounts est NULL");
        }
        return dto;
    }
}