package com.expenseflow.category.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.expenseflow.category.dto.CategoryRequest;
import com.expenseflow.category.dto.CategoryResponse;
import com.expenseflow.category.entity.Category;
import com.expenseflow.category.repository.CategoryRepository;
import com.expenseflow.common.exception.ResourceNotFoundException;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public CategoryResponse saveCategory(Category category) {
        Category savedCategory = categoryRepository.save(category);
        return convertToResponse(savedCategory);
    }

    public List<CategoryResponse> getCategoriesByUser(Long userId) {
        return categoryRepository.findByUserId(userId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return convertToResponse(category);
    }

    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        existingCategory.setName(request.getName());

        Category updatedCategory = categoryRepository.save(existingCategory);
        return convertToResponse(updatedCategory);
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found");
        }

        categoryRepository.deleteById(id);
    }
    
    private CategoryResponse convertToResponse(Category category) {
        return new CategoryResponse(category.getId(), category.getName());
    }
}
