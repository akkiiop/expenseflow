package com.expenseflow.income.controller;

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

import com.expenseflow.income.dto.IncomeRequest;
import com.expenseflow.income.dto.IncomeResponse;
import com.expenseflow.income.entity.Income;
import com.expenseflow.income.service.IncomeService;
import com.expenseflow.common.security.SecurityUtils;
import com.expenseflow.user.entity.User;
import com.expenseflow.user.service.UserService;

@RestController
@RequestMapping("/api/incomes")
public class IncomeController {

    private final IncomeService incomeService;
    private final UserService userService;

    public IncomeController(IncomeService incomeService, UserService userService) {
        this.incomeService = incomeService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<IncomeResponse> createIncome(@Valid @RequestBody IncomeRequest request) {
        String email = SecurityUtils.getAuthenticatedUserEmail();
        User loggedInUser = userService.getUserByEmail(email);
        
        Income income = new Income();
        income.setAmount(request.getAmount());
        income.setSource(request.getSource());
        income.setDescription(request.getDescription());
        income.setIncomeDate(request.getIncomeDate());
        income.setUser(loggedInUser);
        
        return ResponseEntity.status(201).body(incomeService.saveIncome(income));
    }

    @GetMapping("/my-incomes")
    public ResponseEntity<Page<IncomeResponse>> getMyIncomes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        String email = SecurityUtils.getAuthenticatedUserEmail();
        User loggedInUser = userService.getUserByEmail(email);
        
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(incomeService.getIncomesByUser(loggedInUser.getId(), pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncomeResponse> getIncomeById(@PathVariable Long id) {
        return ResponseEntity.ok(incomeService.getIncomeById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncomeResponse> updateIncome(@PathVariable Long id,
                                   @Valid @RequestBody IncomeRequest request) {
        return ResponseEntity.ok(incomeService.updateIncome(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteIncome(@PathVariable Long id) {
        incomeService.deleteIncome(id);
        return ResponseEntity.ok("Income deleted successfully");
    }
}
