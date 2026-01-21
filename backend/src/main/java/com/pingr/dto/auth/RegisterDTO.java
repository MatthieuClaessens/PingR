package com.pingr.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterDTO {

    @NotNull(message = "Username required")
    @Size(min = 2, max = 20, message = "Username must have between 2-20 characters")
    private String accountName;

    @NotNull
    @Email(message = "Invalid email")
    private String accountEmail;

    @NotNull
    @Size(min = 10, message = "Password must have minimum 10 characters")
    private String password;

    private String avatarPath;
}
