package com.pingr;

import com.pingr.dto.ConversationDTO;
import com.pingr.entity.Conversation;
import com.pingr.entity.ConversationType;
import com.pingr.entity.UserAccount;
import com.pingr.mapper.ConversationMapper;
import com.pingr.repository.ConversationRepository;
import com.pingr.repository.UserAccountRepository;
import com.pingr.service.ConversationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class ConversationServiceTest {

    @Mock
    private ConversationRepository conversationRepository;
    @Mock
    private UserAccountRepository userAccountRepository;
    @Mock
    private ConversationMapper conversationMapper;

    @InjectMocks
    private ConversationService conversationService;

    @Test
    void createConversation_ShouldReturnExisting_WhenSingleConversationExists() {
        Long requesterId = 1L;
        Long targetId = 2L;
        Set<Long> targetParticipants = Set.of(targetId);

        UserAccount requester = new UserAccount(); requester.setAccountId(requesterId);
        UserAccount target = new UserAccount(); target.setAccountId(targetId);

        Conversation existingConv = new Conversation();
        existingConv.setConversationType(ConversationType.SINGLE);
        existingConv.setUserAccounts(Set.of(requester, target));

        when(userAccountRepository.findAllById(anySet())).thenReturn(List.of(requester, target));
        when(conversationRepository.findByUserAccounts_AccountIdAndConversationType(requesterId, ConversationType.SINGLE))
                .thenReturn(List.of(existingConv));

        when(conversationMapper.toDTO(existingConv)).thenReturn(new ConversationDTO());

        conversationService.createConversation(targetParticipants, requesterId);

        verify(conversationRepository, never()).save(any());
        verify(conversationMapper).toDTO(existingConv);
    }

    @Test
    void getConversationById_ShouldThrowException_WhenUserIsNotMember() {
        Long strangerId = 99L;
        Long convId = 10L;
        Conversation conversation = new Conversation();
        conversation.setUserAccounts(new HashSet<>());

        when(conversationRepository.findById(convId)).thenReturn(Optional.of(conversation));

        assertThrows(IllegalArgumentException.class, () -> {
            conversationService.getConversationById(convId, strangerId);
        });
    }
}
