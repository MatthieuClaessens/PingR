package com.pingr.security;

import com.pingr.entity.UserAccount;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET_KEY =
            "Z3Vuc3RlcjY0c2VjdXJlaml3dG9rZW5rZXlzMTIzNDU2Nzg5MA==";
    private static final long EXPIRATION_MS = 1000 * 60 * 60 * 24;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(UserAccount userAccount) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_MS);

        return Jwts.builder()
                .subject(userAccount.getAccountEmail())
                .claim("id", userAccount.getAccountId())
                .claim("name", userAccount.getAccountName())
                .claim("role", userAccount.getRole().name())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    public Claims parseToken(String token) throws JwtException {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String getEmailFromToken(String token) {
        return parseToken(token).getSubject();
    }

    public boolean isTokenExpired(String token) {
        return parseToken(token).getExpiration().before(new Date());
    }

    public boolean isTokenValid(String token, String expectedEmail) {
        try {
            String email = getEmailFromToken(token);
            return email.equals(expectedEmail) && !isTokenExpired(token);
        } catch (JwtException ex) {
            return false;
        }
    }
}
