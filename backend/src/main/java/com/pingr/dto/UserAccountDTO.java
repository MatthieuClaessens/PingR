package com.pingr.dto;

import jakarta.validation.constraints.NotNull;

public record UserAccountDTO(
        Long accountId,
        String accountName,
        String accountTag,
        String avatarPath
) {}
