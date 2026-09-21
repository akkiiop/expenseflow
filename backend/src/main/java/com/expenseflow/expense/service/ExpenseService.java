package com.expenseflow.expense.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.expenseflow.expense.dto.ExpenseRequest;
import com.expenseflow.expense.dto.ExpenseResponse;
import com.expenseflow.expense.entity.Expense;
import com.expenseflow.expense.repository.ExpenseRepository;
import com.expenseflow.category.entity.Category;
import com.expenseflow.category.repository.CategoryRepository;
import com.expenseflow.budget.entity.Budget;
import com.expenseflow.budget.repository.BudgetRepository;
import com.expenseflow.user.entity.User;
import com.expenseflow.common.exception.ResourceNotFoundException;
import com.expenseflow.common.exception.BudgetExceededException;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;
    private final BudgetRepository budgetRepository;

    public ExpenseService(ExpenseRepository expenseRepository, CategoryRepository categoryRepository, BudgetRepository budgetRepository) {
        this.expenseRepository = expenseRepository;
        this.categoryRepository = categoryRepository;
        this.budgetRepository = budgetRepository;
    }

    public ExpenseResponse saveExpense(ExpenseRequest request, User user) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        // BUDGET ENFORCEMENT LOGIC
        int month = request.getExpenseDate().getMonthValue();
        int year = request.getExpenseDate().getYear();

        Optional<Budget> budgetOpt = budgetRepository.findByUserIdAndCategoryIdAndMonthAndYear(
                user.getId(), category.getId(), month, year);

        if (budgetOpt.isPresent()) {
            Budget budget = budgetOpt.get();
            
            BigDecimal currentExpenses = expenseRepository.calculateTotalExpensesByCategoryMonthAndYear(
                    user.getId(), category.getId(), month, year);
            if (currentExpenses == null) {
                currentExpenses = BigDecimal.ZERO;
            }
            
            BigDecimal newTotal = currentExpenses.add(request.getAmount());
            if (newTotal.compareTo(budget.getAmount()) > 0) {
                throw new BudgetExceededException("This expense exceeds your budget of " + budget.getAmount() 
                        + " for " + category.getName() + " in " + month + "/" + year);
            }
        }

        Expense expense = new Expense();
        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setPaymentMethod(request.getPaymentMethod());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setCategory(category);
        expense.setUser(user);

        Expense savedExpense = expenseRepository.save(expense);
        return convertToResponse(savedExpense);
    }

    // New Paginated Method
    public org.springframework.data.domain.Page<ExpenseResponse> getExpensesByUser(Long userId, org.springframework.data.domain.Pageable pageable, Long categoryId) {
        if (categoryId != null) {
            return expenseRepository.findByUserIdAndCategoryId(userId, categoryId, pageable)
                    .map(this::convertToResponse);
        }
        return expenseRepository.findByUserId(userId, pageable)
                .map(this::convertToResponse);
    }

    // Retained for backward compatibility (e.g., AiService)
    public List<ExpenseResponse> getExpensesByUser(Long userId) {
        return expenseRepository.findByUserId(userId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ExpenseResponse getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
        return convertToResponse(expense);
    }

    public ExpenseResponse updateExpense(Long id, ExpenseRequest request) {
        Expense existingExpense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        // BUDGET ENFORCEMENT for updates
        int month = request.getExpenseDate().getMonthValue();
        int year = request.getExpenseDate().getYear();

        Optional<Budget> budgetOpt = budgetRepository.findByUserIdAndCategoryIdAndMonthAndYear(
                existingExpense.getUser().getId(), category.getId(), month, year);

        if (budgetOpt.isPresent()) {
            Budget budget = budgetOpt.get();
            
            BigDecimal currentExpenses = expenseRepository.calculateTotalExpensesByCategoryMonthAndYear(
                    existingExpense.getUser().getId(), category.getId(), month, year);
            if (currentExpenses == null) {
                currentExpenses = BigDecimal.ZERO;
            }
            
            // Subtract the old amount, add the new amount
            BigDecimal newTotal = currentExpenses.subtract(existingExpense.getAmount()).add(request.getAmount());
            if (newTotal.compareTo(budget.getAmount()) > 0) {
                throw new BudgetExceededException("Updating this expense exceeds your budget of " + budget.getAmount() 
                        + " for " + category.getName() + " in " + month + "/" + year);
            }
        }

        existingExpense.setAmount(request.getAmount());
        existingExpense.setDescription(request.getDescription());
        existingExpense.setPaymentMethod(request.getPaymentMethod());
        existingExpense.setExpenseDate(request.getExpenseDate());
        existingExpense.setCategory(category);

        Expense updatedExpense = expenseRepository.save(existingExpense);
        return convertToResponse(updatedExpense);
    }

    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Expense not found");
        }
        expenseRepository.deleteById(id);
    }

    private ExpenseResponse convertToResponse(Expense expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getAmount(),
                expense.getDescription(),
                expense.getPaymentMethod(),
                expense.getExpenseDate(),
                expense.getCategory().getName()
        );
    }
}
