package com.expenseflow.category.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.expenseflow.category.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
	List<Category> findByUserId(Long userId);
}