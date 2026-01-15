package com.pingr.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public class ChangeMailDTO {
    @NotNull
    @Email(message = "Invalid email")
    private String newEmail;

    @NotNull
    private String accountPassword;
}
