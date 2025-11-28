package com.example.exam;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.*;
import java.util.Date;

@Component
public class JwtUtil {
  private final Key key = Keys.hmacShaKeyFor(System.getenv().getOrDefault("JWT_SECRET","change_this_secret_please").getBytes());
  private final long validityMs = 1000 * 60 * 60 * 24; // 24h

  public String generateToken(String username, List<String> roles) {
    return Jwts.builder()
      .setSubject(username)
      .claim("roles", roles)
      .setIssuedAt(new Date())
      .setExpiration(new Date(System.currentTimeMillis() + validityMs))
      .signWith(key)
      .compact();
  }

  public Jws<Claims> validate(String token) {
    return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
  }
}