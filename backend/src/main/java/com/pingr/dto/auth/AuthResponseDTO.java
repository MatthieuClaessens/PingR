package com.pingr.dto.auth;

import com.pingr.dto.UserAccountDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDTO {
    private UserAccountDTO userAccountDTO;
    private String token;
}
