package com.example.exam;

import jakarta.persistence.*;
@Entity
public class Role {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String name;
  // getters/setters
}