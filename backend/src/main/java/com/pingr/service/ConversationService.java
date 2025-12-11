package com.pingr.service;

import com.pingr.dto.ConversationDTO;
import com.pingr.entity.Conversation;
import com.pingr.entity.UserAccount;
import com.pingr.repository.ConversationRepository;
import com.pingr.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserAccountRepository userAccountRepository;

    @Transactional // Important pour garantir la cohérence des écritures
    public ConversationDTO createConversation(Long senderId, Long receiverId) {

        UserAccount sender = userAccountRepository.findById(senderId)
            .orElseThrow(() -> new RuntimeException("Sender not found"));

        UserAccount receiver = userAccountRepository.findById(receiverId)
            .orElseThrow(() -> new RuntimeException("Receiver not found"));

        // Chercher une conversation existante (Logique "Get or Create")
        Optional<Conversation> existingConversation = sender.getConversations().stream()
            .filter(c -> c.getUserAccounts().size() == 2) // Seulement les duos
        .filter(c -> c.getUserAccounts().stream()
        .anyMatch(u -> u.getAccountId().equals(receiverId))) // Qui contiennent l'autre
        .findFirst();

        Conversation conversation;

        if (existingConversation.isPresent()) {
            conversation = existingConversation.get();
        } else {
            // Création nouvelle conversation
            Conversation newConversation = new Conversation();
            // Attention: en JPA ManyToMany, il faut souvent ajouter des deux côtés pour que ce soit propre
            newConversation.getUserAccounts().add(sender);
            newConversation.getUserAccounts().add(receiver);

            // Astuce: Si ta relation est bidirectionnelle, pense à faire aussi :
            // sender.getConversations().add(newConversation);
            // receiver.getConversations().add(newConversation);

            conversation = conversationRepository.save(newConversation);
        }

        return new ConversationDTO(conversation.getConversationId());
    }
}
