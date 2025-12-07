package com.pingr.dto;

import jakarta.validation.constraints.NotNull;

data class UserAccountDTO(
    val accountId: Long,
    val accountName: String,
    val accountTag: String,
    val avatarPath: String
    )