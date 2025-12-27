package com.pingr.repository;

import com.pingr.entity.Conversation;
import com.pingr.entity.Message;
import com.pingr.entity.UserAccount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    Conversation userAccounts(List<UserAccount> userAccounts);
    List<Conversation> getConversationsByUserAccountId(Long accountId);
    Page<Conversation> getConversationsByUserAccountId(Long accountId, Pageable pageable);
}