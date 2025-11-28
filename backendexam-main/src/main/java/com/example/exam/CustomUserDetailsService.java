package com.example.exam;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {
  private final UserRepository userRepository;
  public CustomUserDetailsService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    AppUser user = userRepository.findByUsername(username)
      .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    return User.builder()
      .username(user.getUsername())
      .password(user.getPassword())
      .authorities(user.getRoles().stream()
        .map(r -> "ROLE_" + r.getName())
        .collect(Collectors.toList()).toArray(new String[0]))
      .build();
  }
}