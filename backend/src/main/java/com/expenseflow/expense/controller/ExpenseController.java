package com.expenseflow.expense.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import jakarta.validation.Valid;

import com.expenseflow.expense.dto.ExpenseRequest;
import com.expenseflow.expense.dto.ExpenseResponse;
import com.expenseflow.expense.service.ExpenseService;
import com.expenseflow.common.security.SecurityUtils;
import com.expenseflow.user.entity.User;
import com.expenseflow.user.service.UserService;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final UserService userService;

    public ExpenseController(ExpenseService expenseService, UserService userService) {
        this.expenseService = expenseService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(@Valid @RequestBody ExpenseRequest request) {
        String email = SecurityUtils.getAuthenticatedUserEmail();
        User loggedInUser = userService.getUserByEmail(email);
        
        return ResponseEntity.status(201).body(expenseService.saveExpense(request, loggedInUser));
    }

    @GetMapping("/my-expenses")
    public ResponseEntity<Page<ExpenseResponse>> getMyExpenses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long categoryId) {
        
        String email = SecurityUtils.getAuthenticatedUserEmail();
        User loggedInUser = userService.getUserByEmail(email);
        
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(expenseService.getExpensesByUser(loggedInUser.getId(), pageable, categoryId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> getExpenseById(@PathVariable Long id) {
        return ResponseEntity.ok(expenseService.getExpenseById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(@PathVariable Long id,
                                   @Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.updateExpense(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.ok("Expense deleted successfully");
    }
}
