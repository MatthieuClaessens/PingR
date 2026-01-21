package com.pingr.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    @Column(nullable = false, unique = true, length = 100)
    private String accountEmail;

    @Column(nullable = false, length = 60)
    private String accountPassword;

    @Column(name = "avatar_path", nullable = false, length = 500)
    private String avatarPath;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @ManyToMany(mappedBy = "userAccounts")
    private Set<Conversation> conversations = new HashSet<>();

    @OneToMany(mappedBy = "userAccount", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages = new ArrayList<>();
}
