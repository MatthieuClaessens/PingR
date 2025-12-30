package com.pingr.mapper;

import com.pingr.entity.UserAccount;
import com.pingr.dto.UserAccountDTO;
import org.springframework.stereotype.Component;

@Component
public class UserAccountMapper {
    public static UserAccount fromDTO(UserAccountDTO dto) {
        UserAccount u = new UserAccount();
        u.setAccountId(dto.getAccountId());
        u.setAccountName(dto.getAccountName());
        u.setAccountTag(dto.getAccountTag());
        u.setAvatarPath(dto.getAvatarPath());
        return u;
    }

    public UserAccountDTO toDTO(UserAccount u) {
        UserAccountDTO dto = new UserAccountDTO();
        dto.setAccountId(u.getAccountId());
        dto.setAccountName(u.getAccountName());
        dto.setAccountTag(u.getAccountTag());
        dto.setAvatarPath(u.getAvatarPath());
        return dto;
    }
}
