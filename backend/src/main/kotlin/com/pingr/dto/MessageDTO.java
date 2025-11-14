package com.pingr.dto;

import com.pingr.entity.Channel;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
public class MessageDTO {
    private Long messageId;
    private Long senderName;
    private Date messageDate;
    private String messageContent;
}