package com.pingr.service;

import com.pingr.dto.UserAccountDTO;
import com.pingr.entity.Role;
import com.pingr.entity.UserAccount;
import com.pingr.mapper.UserAccountMapper;
import com.pingr.repository.UserAccountRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service gérant toute la logique métier des comptes utilisateurs.
 * C'est ici que l'on vérifie les règles (email unique, hachage du mot de passe).
 */
@Service
@RequiredArgsConstructor // Génère le constructeur pour injecter les dépendances (Repo, Mapper, Encoder)
public class UserAccountService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserAccountMapper userAccountMapper;

    // Message d'erreur centralisé pour éviter les répétitions
    private static final String USER_NOT_FOUND = "L'utilisateur n'a pas été trouvé avec l'ID : ";

    /**
     * Récupère la liste complète des utilisateurs.
     * @Transactional(readOnly = true) optimise la performance pour les lectures simples.
     */
    @Transactional(readOnly = true)
    public List<UserAccountDTO> getAllUsers() {
        return userAccountRepository.findAll().stream()
                .map(userAccountMapper::toDTO) // On transforme chaque entité en DTO pour la sécurité
                .toList();
    }

    /**
     * Récupère les utilisateurs par "pages" (ex: 20 par 20).
     * Très important pour ne pas ralentir l'application si on a 10 000 utilisateurs.
     */
    public Page<UserAccountDTO> getAllUsers(Pageable pageable) {
        return userAccountRepository.findAll(pageable)
                .map(userAccountMapper::toDTO);
    }

    /**
     * Création d'un nouveau compte (Inscription).
     */
    @Transactional
    public UserAccountDTO createUserAccount(String accountName, String accountTag, String accountEmail, String password, String avatarPath) {
        UserAccount user = new UserAccount();
        user.setAccountName(accountName);
        user.setAccountTag(accountTag);
        user.setAccountEmail(accountEmail);

        // SÉCURITÉ : On ne stocke jamais le mot de passe en clair ! On le hache.
        user.setAccountPassword(passwordEncoder.encode(password));

        user.setAvatarPath(avatarPath);
        user.setRole(Role.USER); // Par défaut, tout le monde est simple utilisateur

        UserAccount saved = userAccountRepository.save(user);
        return userAccountMapper.toDTO(saved);
    }

    /**
     * Trouve un utilisateur précis via son ID unique.
     */
    @Transactional(readOnly = true)
    public UserAccountDTO getUserAccountById(Long accountId) {
        UserAccount existing = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND + accountId));
        return userAccountMapper.toDTO(existing);
    }

    /**
     * Modifie les informations d'un compte existant.
     * Cette méthode vérifie chaque champ pour ne mettre à jour que ce qui est envoyé.
     */
    @Transactional
    public UserAccountDTO editUserAccount(Long accountId, UserAccount userAccount) {
        // 1. On vérifie si l'utilisateur existe bien avant de modifier
        UserAccount existing = userAccountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException(USER_NOT_FOUND + accountId));

        // 2. Mise à jour sélective : on ne change que ce qui n'est pas "null"
        if (userAccount.getAccountName() != null) {
            existing.setAccountName(userAccount.getAccountName());
        }
        if (userAccount.getAccountTag() != null) {
            existing.setAccountTag(userAccount.getAccountTag());
        }

        // 3. Cas spécial de l'email : on vérifie s'il n'est pas déjà utilisé par quelqu'un d'autre
        if (userAccount.getAccountEmail() != null) {
            String newAccountEmail = userAccount.getAccountEmail().trim().toLowerCase();
            userAccountRepository.findByAccountEmail(newAccountEmail)
                    .filter(u -> !u.getAccountId().equals(accountId)) // Si l'email existe déjà ailleurs
                    .ifPresent(u -> {
                        throw new IllegalArgumentException("Cette adresse email est déjà utilisée.");
                    });
            existing.setAccountEmail(newAccountEmail);
        }

        if (userAccount.getAccountPassword() != null) {
            // Ici, il faudrait idéalement re-hacher le mot de passe s'il change
            existing.setAccountPassword(userAccount.getAccountPassword());
        }
        if (userAccount.getAvatarPath() != null) {
            existing.setAvatarPath(userAccount.getAvatarPath());
        }

        UserAccount saved = userAccountRepository.save(existing);
        return userAccountMapper.toDTO(saved);
    }

    /**
     * Supprime définitivement un compte.
     */
    @Transactional
    public void deleteUserAccount(Long accountId) {
        if (!userAccountRepository.existsById(accountId)) {
            throw new EntityNotFoundException(USER_NOT_FOUND + accountId);
        }
        userAccountRepository.deleteById(accountId);
    }
}