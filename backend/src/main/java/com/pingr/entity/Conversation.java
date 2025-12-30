package com.pingr.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "conversation")
@Getter
@Setter
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long conversationId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConversationType conversationType  = ConversationType.SINGLE;

    @ManyToMany
    @JoinTable(
            name = "participates",
            joinColumns = @JoinColumn(name = "conversation_id"),
            inverseJoinColumns = @JoinColumn(name = "account_id")
    )
    private List <UserAccount> userAccounts = new ArrayList<>();

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages = new ArrayList<>();
}
