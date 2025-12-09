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

    @ManyToMany(mappedBy = "conversations") //
    private List<UserAccount> userAccounts = new ArrayList<>();
}
