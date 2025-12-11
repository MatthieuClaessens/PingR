package com.pingr.service;

import com.pingr.dto.UserAccountDTO;
import com.pingr.entity.UserAccount;
import com.pingr.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserAccountService {

    private final UserAccountRepository userAccountRepository;

    public UserAccountDTO createAccount(UserAccountDTO dto) {
        UserAccount entity = new UserAccount();
        entity.setAccountName(dto.accountName());
        entity.setAccountTag(dto.accountTag());
        entity.setAvatarPath(dto.avatarPath());

        // Note: l'ID est généré par la DB, pas besoin de le setter

        UserAccount saved = userAccountRepository.save(entity);

        return new UserAccountDTO(
                saved.getAccountId(),
        saved.getAccountName(),
        saved.getAccountTag(),
        saved.getAvatarPath()
        );
    }
}
