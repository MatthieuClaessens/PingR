package com.pingr.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user_account")
@Getter
@Setter
public class UserAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;

    @Column(nullable = false, length = 20)
    private String accountName;

    @Column(nullable = false, unique = true, length = 4)
    private String accountTag;

    @Column(nullable = false, unique = true, length = 100)
    private String accountEmail;

    @Column(nullable = false, length = 60)
    private String accountPassword;

    @Column(nullable = false, length = 500)
    private String avatarPath;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @ManyToMany
    @JoinTable(
            name = "participates",
            joinColumns = @JoinColumn(name = "account_id"),
            inverseJoinColumns = @JoinColumn(name = "conversation_id")
    )
    private List<Conversation> conversations = new ArrayList<>();
}
