package com.example.exam;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController
@RequestMapping("/auth")
public class AuthController {
  private final UserRepository userRepo;
  private final RoleRepository roleRepo;
  private final PasswordEncoder encoder;
  private final JwtUtil jwtUtil;

  public AuthController(UserRepository userRepo, RoleRepository roleRepo, PasswordEncoder encoder, JwtUtil jwtUtil) {
    this.userRepo = userRepo; this.roleRepo = roleRepo; this.encoder = encoder; this.jwtUtil = jwtUtil;
  }

  static class LoginRequest { public String username; public String password; }
  static class LoginResponse { public String token; public LoginResponse(String token){this.token=token;} }

  @PostMapping("/login")
  public LoginResponse login(@RequestBody LoginRequest req){
    AppUser user = userRepo.findByUsername(req.username).orElseThrow();
    if (!encoder.matches(req.password, user.getPassword())) throw new RuntimeException("Invalid credentials");
    List<String> roles = user.getRoles().stream().map(r -> "ROLE_"+r.getName()).toList();
    String token = jwtUtil.generateToken(user.getUsername(), roles);
    return new LoginResponse(token);
  }

  @PostMapping("/register")
  public String register(@RequestBody LoginRequest req){
    if (userRepo.findByUsername(req.username).isPresent()) throw new RuntimeException("User exists");
    AppUser u = new AppUser();
    u.setUsername(req.username);
    u.setPassword(encoder.encode(req.password));
    Role userRole = roleRepo.findByName("USER").orElseGet(() -> roleRepo.save(new Role(){{
      setName("USER");
    }}));
    u.setRoles(Set.of(userRole));
    userRepo.save(u);
    return "ok";
  }
}