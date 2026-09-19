package com.expenseflow.budget.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.expenseflow.budget.entity.Budget;
import com.expenseflow.budget.repository.BudgetRepository;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;

    public BudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    public Budget saveBudget(Budget budget) {
        Optional<Budget> existing = budgetRepository
                .findByUserIdAndCategoryIdAndMonthAndYear(
                        budget.getUser().getId(),
                        budget.getCategory().getId(),
                        budget.getMonth(),
                        budget.getYear());

        if (existing.isPresent()) {
            throw new RuntimeException("Budget already exists for this category and month");
        }

        return budgetRepository.save(budget);
    }

    public List<Budget> getBudgetsByUser(Long userId) {
        return budgetRepository.findByUserId(userId);
    }

    public Budget getBudgetById(Long id) {
        return budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
    }

    public Budget updateBudget(Long id, Budget budget) {
        Budget existingBudget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        existingBudget.setAmount(budget.getAmount());
        existingBudget.setMonth(budget.getMonth());
        existingBudget.setYear(budget.getYear());
        existingBudget.setCategory(budget.getCategory());

        return budgetRepository.save(existingBudget);
    }

    public void deleteBudget(Long id) {
        if (!budgetRepository.existsById(id)) {
            throw new RuntimeException("Budget not found");
        }

        budgetRepository.deleteById(id);
    }
}
