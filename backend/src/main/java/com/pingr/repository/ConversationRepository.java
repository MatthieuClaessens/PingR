package com.pingr.repository;

import com.pingr.entity.Conversation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findByUserAccounts_AccountId(Long accountId);
    Page<Conversation> findByUserAccounts_AccountId(Long accountId, Pageable pageable);
    List<Conversation> findByUserAccounts_AccountIdAndConversationType(Long accountId, com.pingr.entity.ConversationType conversationType);
}