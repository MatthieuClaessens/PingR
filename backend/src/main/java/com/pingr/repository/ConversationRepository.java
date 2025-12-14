package com.pingr.repository;

import com.pingr.entity.Conversation;
import com.pingr.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    Conversation userAccounts(List<UserAccount> userAccounts);
}