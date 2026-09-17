package com.expenseflow.category.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.expenseflow.category.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}