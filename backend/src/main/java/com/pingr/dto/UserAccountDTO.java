package com.pingr.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserAccountDTO {
        private Long accountId;
        private String accountName;
        private String accountTag;
        private String avatarPat;
}
