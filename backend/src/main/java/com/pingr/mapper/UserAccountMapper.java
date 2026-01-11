package com.pingr.mapper;

import com.pingr.entity.UserAccount;
import com.pingr.dto.UserAccountDTO;
import org.springframework.stereotype.Component;

@Component
public class UserAccountMapper {
    public UserAccount fromDTO(UserAccountDTO dto) {
        UserAccount u = new UserAccount();
        u.setAccountId(dto.getAccountId());
        u.setAccountName(dto.getAccountName());
        u.setAvatarPath(dto.getAvatarPath());
        u.setRole(dto.getRole());
        return u;
    }

    public UserAccountDTO toDTO(UserAccount u) {
        UserAccountDTO dto = new UserAccountDTO();
        dto.setAccountId(u.getAccountId());
        dto.setAccountName(u.getAccountName());
        dto.setAvatarPath(u.getAvatarPath());
        dto.setRole(u.getRole());
        return dto;
    }
}
