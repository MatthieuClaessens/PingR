package com.pingr.dto.auth;

import jakarta.validation.constraints.NotNull;

public class ChangePasswordDTO {
    @NotNull
    String newPassword;
}
