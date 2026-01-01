package com.pingr.dto;

import com.pingr.entity.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequestDTO {
    @NotNull
    private String accountName;
    @NotNull
    private String accountEmail;
    @NotNull
    private String password;
}
