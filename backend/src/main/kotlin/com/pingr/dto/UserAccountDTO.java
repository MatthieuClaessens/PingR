package com.pingr.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class UserAccountDTO {

    private Long accountId;
    @NotNull
    private String accountName;
    @NotNull
    private Integer accountTag;
    @NotNull
    private String avatarPath;
}