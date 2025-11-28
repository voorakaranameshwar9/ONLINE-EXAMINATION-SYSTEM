package com.example.exam;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

interface RoleRepository extends JpaRepository<Role, Long>
 {
  Optional<Role> findByName(String name);
}