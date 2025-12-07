package com.pingr.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "channel")
@Getter
@Setter
public class Channel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long channelId;
    private String channelName;

    @ManyToMany(mappedBy = "channels") //
    private List<UserAccount> userAccounts = new ArrayList<>();
}
