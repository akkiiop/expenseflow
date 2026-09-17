package com.expenseflow.category.service;

import org.springframework.stereotype.Service;

import com.expenseflow.category.entity.Category;
import com.expenseflow.category.repository.CategoryRepository;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }
}