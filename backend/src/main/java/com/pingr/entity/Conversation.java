package com.pingr.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "conversation")
@Getter
@Setter
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "conversation_id", nullable = false)
    private Long conversationId;

    @Column(name = "creator_id")
            private Long creatorId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConversationType conversationType  = ConversationType.SINGLE;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "participates",
            joinColumns = @JoinColumn(name = "conversation_id"),
            inverseJoinColumns = @JoinColumn(name = "account_id")
    )
    private Set<UserAccount> userAccounts = new HashSet<>();

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages = new ArrayList<>();

    public void addUserAccount(UserAccount userAccount) {
        this.userAccounts.add(userAccount);
    }
}
