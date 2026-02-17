package com.pingr;

import com.pingr.dto.UserAccountDTO;
import com.pingr.entity.Role;
import com.pingr.entity.UserAccount;
import com.pingr.mapper.UserAccountMapper;
import com.pingr.repository.UserAccountRepository;
import com.pingr.service.UserAccountService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class UserAccountServiceTest {

    @Mock
    private UserAccountRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserAccountMapper userAccountMapper;

    @InjectMocks
    private UserAccountService userService;

    @Test
    void createUserAccount_ShouldHashPasswordAndSaveUser() {
        String rawPassword = "password123";
        String encodedPassword = "hashed_password";
        when(passwordEncoder.encode(rawPassword)).thenReturn(encodedPassword);
        when(userRepository.existsByAccountName(anyString())).thenReturn(false);
        when(userRepository.existsByAccountEmail(anyString())).thenReturn(false);

        when(userRepository.save(any(UserAccount.class))).thenAnswer(i -> i.getArguments()[0]);
        when(userAccountMapper.toDTO(any(UserAccount.class))).thenReturn(new UserAccountDTO());

        userService.createUserAccount("Matthieu", "mat@test.com", rawPassword, null);

        verify(userRepository).save(argThat(user ->
                user.getAccountPassword().equals(encodedPassword) &&
                        user.getAccountName().equals("Matthieu")
        ));
    }

    @Test
    void createUserAccount_ShouldThrowException_WhenUsernameExists() {
        String name = "DejaPris";
        when(userRepository.existsByAccountName(name)).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> {
            userService.createUserAccount(name, "test@test.com", "pass", null);
        });
        verify(userRepository, never()).save(any());
    }

    @Test
    void searchUsers_ShouldReturnDtoList_WhenNameMatchesAndNotCurrentUser() {
        Long myId = 1L;
        String query = "Mat";
        UserAccount otherUser = new UserAccount();
        otherUser.setAccountId(2L);
        otherUser.setAccountName("Matthieu");

        UserAccountDTO expectedDto = new UserAccountDTO();
        expectedDto.setAccountName("Matthieu");

        when(userRepository.findByAccountName(query)).thenReturn(Optional.of(otherUser));
        when(userAccountMapper.toDTO(otherUser)).thenReturn(expectedDto);

        List<UserAccountDTO> result = userService.searchUsers(query, myId);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Matthieu", result.get(0).getAccountName());
    }

    @Test
    void searchUsers_ShouldReturnEmptyList_WhenOnlyCurrentUserFound() {
        Long myId = 1L;
        String query = "Matthieu";
        UserAccount me = new UserAccount();
        me.setAccountId(myId);

        when(userRepository.findByAccountName(query)).thenReturn(Optional.of(me));

        List<UserAccountDTO> result = userService.searchUsers(query, myId);

        assertTrue(result.isEmpty(), "La liste doit être vide si on se trouve soi-même");
    }

    @Test
    void changeRole_ShouldThrowSecurityException_WhenRequesterIsNotAdmin() {
        Long myId = 1L;
        UserAccount requester = new UserAccount();
        requester.setAccountId(myId);
        requester.setRole(Role.USER);

        when(userRepository.findById(myId)).thenReturn(Optional.of(requester));

        assertThrows(SecurityException.class, () -> {
            userService.changeRole(myId, 2L, Role.ADMIN);
        });
    }
}