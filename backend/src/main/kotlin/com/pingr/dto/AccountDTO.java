package com.pingr.dto;

import lombok.Data;
import org.jetbrains.annotations.NotNull;

@Data
public class AccountDTO {

    private Long accountId;
    @NotNull
    private String accountName;
    @NotNull
    private Integer accountTag;
    @NotNull
    private String avatarPath;
}