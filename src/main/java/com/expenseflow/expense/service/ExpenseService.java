package com.expenseflow.expense.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.expenseflow.expense.entity.Expense;
import com.expenseflow.expense.repository.ExpenseRepository;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public Expense saveExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public Expense getExpenseById(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
    }

    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new RuntimeException("Expense not found");
        }

        expenseRepository.deleteById(id);
    }
}