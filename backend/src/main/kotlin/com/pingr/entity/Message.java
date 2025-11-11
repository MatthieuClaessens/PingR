package com.pingr.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

/**
 * Entity class representing a Message in the database.
 * This class is mapped to the "message" table using JPA annotations.
 */
@Entity
@Table(name = "message")
@Getter
@Setter


public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMessage;

    private Long senderId;

    private Date messageDate;
    private String messageContent;


    @ManyToOne
    @JoinColumn(name = "channel_id")
    private Channel channel = null;
}


