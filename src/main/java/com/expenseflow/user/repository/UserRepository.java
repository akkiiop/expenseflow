package com.expenseflow.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.expenseflow.user.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
	
	boolean existsByEmail(String email);
}