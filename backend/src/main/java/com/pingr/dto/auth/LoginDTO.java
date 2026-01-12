package com.pingr.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LoginDTO {
    @NotNull(message = "Email is required")
    @Email(message = "Invalid email")
    private String accountEmail;
    @NotNull
    private String password;
}
