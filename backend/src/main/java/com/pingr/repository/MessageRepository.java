package com.pingr.repository;

import com.pingr.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> getMessagesByUserAccountId(Long accountId);
    Page<Message> getMessagesByUserAccountId(Long accountId, Pageable pageable);
}