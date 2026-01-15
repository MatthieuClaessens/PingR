package com.pingr.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChangePasswordDTO {

    @NotNull
    @Email(message = "Invalid email")
    private String accountEmail;

    @NotNull
    private String accountPassword;

    @NotNull
    String newPassword;
}
