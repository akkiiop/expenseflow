package com.expenseflow.budget.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import com.expenseflow.budget.dto.BudgetRequest;
import com.expenseflow.budget.dto.BudgetResponse;
import com.expenseflow.budget.service.BudgetService;
import com.expenseflow.common.security.SecurityUtils;
import com.expenseflow.user.entity.User;
import com.expenseflow.user.service.UserService;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;
    private final UserService userService;

    public BudgetController(BudgetService budgetService, UserService userService) {
        this.budgetService = budgetService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<BudgetResponse> createBudget(@Valid @RequestBody BudgetRequest request) {
        String email = SecurityUtils.getAuthenticatedUserEmail();
        User loggedInUser = userService.getUserByEmail(email);
        
        return ResponseEntity.status(201).body(budgetService.saveBudget(request, loggedInUser));
    }

    @GetMapping("/my-budgets")
    public ResponseEntity<List<BudgetResponse>> getMyBudgets() {
        String email = SecurityUtils.getAuthenticatedUserEmail();
        User loggedInUser = userService.getUserByEmail(email);
        return ResponseEntity.ok(budgetService.getBudgetsByUser(loggedInUser.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BudgetResponse> getBudgetById(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.getBudgetById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetResponse> updateBudget(@PathVariable Long id,
                                   @Valid @RequestBody BudgetRequest request) {
        return ResponseEntity.ok(budgetService.updateBudget(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.ok("Budget deleted successfully");
    }
}
