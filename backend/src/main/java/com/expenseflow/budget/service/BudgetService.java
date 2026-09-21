package com.expenseflow.budget.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.expenseflow.budget.dto.BudgetRequest;
import com.expenseflow.budget.dto.BudgetResponse;
import com.expenseflow.budget.entity.Budget;
import com.expenseflow.budget.repository.BudgetRepository;
import com.expenseflow.category.entity.Category;
import com.expenseflow.category.repository.CategoryRepository;
import com.expenseflow.user.entity.User;
import com.expenseflow.common.exception.ResourceNotFoundException;
import com.expenseflow.common.exception.DuplicateResourceException;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;

    public BudgetService(BudgetRepository budgetRepository, CategoryRepository categoryRepository) {
        this.budgetRepository = budgetRepository;
        this.categoryRepository = categoryRepository;
    }

    public BudgetResponse saveBudget(BudgetRequest request, User user) {
        Optional<Budget> existing = budgetRepository
                .findByUserIdAndCategoryIdAndMonthAndYear(
                        user.getId(),
                        request.getCategoryId(),
                        request.getMonth(),
                        request.getYear());

        if (existing.isPresent()) {
            throw new DuplicateResourceException("Budget already exists for this category and month");
        }
        
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Budget budget = new Budget();
        budget.setAmount(request.getAmount());
        budget.setMonth(request.getMonth());
        budget.setYear(request.getYear());
        budget.setCategory(category);
        budget.setUser(user);

        Budget savedBudget = budgetRepository.save(budget);
        return convertToResponse(savedBudget);
    }

    public List<BudgetResponse> getBudgetsByUser(Long userId) {
        return budgetRepository.findByUserId(userId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public BudgetResponse getBudgetById(Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));
        return convertToResponse(budget);
    }

    public BudgetResponse updateBudget(Long id, BudgetRequest request) {
        Budget existingBudget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));
                
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        existingBudget.setAmount(request.getAmount());
        existingBudget.setMonth(request.getMonth());
        existingBudget.setYear(request.getYear());
        existingBudget.setCategory(category);

        Budget updatedBudget = budgetRepository.save(existingBudget);
        return convertToResponse(updatedBudget);
    }

    public void deleteBudget(Long id) {
        if (!budgetRepository.existsById(id)) {
            throw new ResourceNotFoundException("Budget not found");
        }

        budgetRepository.deleteById(id);
    }
    
    private BudgetResponse convertToResponse(Budget budget) {
        return new BudgetResponse(
                budget.getId(),
                budget.getAmount(),
                budget.getMonth(),
                budget.getYear(),
                budget.getCategory().getName()
        );
    }
}
