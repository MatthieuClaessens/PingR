package com.pingr.service;

import com.pingr.repository.MessageRepository;
import com.pingr.repository.UserAccountRepository;
import org.springframework.transaction.annotation.Transactional;

public class MessageService {

    private final MessageRepository messageRepository;
    private final UserAccountRepository userAccountRepository;

    @Transactional
    public MessageDTO createMessage(Long conversationId, Long accountId, String message) {

    }
}
