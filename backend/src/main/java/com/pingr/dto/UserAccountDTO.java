package com.pingr.dto;

import com.pingr.entity.Role;
import lombok.Data;

@Data
public class UserAccountDTO {
        private Long accountId;
        private String accountName;
        private String accountTag;
        private String avatarPath;
        public Role role;
}
