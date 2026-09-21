package com.expenseflow.dashboard.service;

import com.expenseflow.common.security.SecurityUtils;
import com.expenseflow.dashboard.dto.DashboardResponse;
import com.expenseflow.expense.repository.ExpenseRepository;
import com.expenseflow.income.repository.IncomeRepository;
import com.expenseflow.user.entity.User;
import com.expenseflow.user.service.UserService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class DashboardService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final UserService userService;

    public DashboardService(IncomeRepository incomeRepository, 
                            ExpenseRepository expenseRepository, 
                            UserService userService) {
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
        this.userService = userService;
    }

    public DashboardResponse getDashboardSummary(int month, int year) {
        String email = SecurityUtils.getAuthenticatedUserEmail();
        User user = userService.getUserByEmail(email);

        BigDecimal totalIncome = incomeRepository.calculateTotalIncomeByMonthAndYear(user.getId(), month, year);
        if (totalIncome == null) {
            totalIncome = BigDecimal.ZERO;
        }

        BigDecimal totalExpenses = expenseRepository.calculateTotalExpensesByMonthAndYear(user.getId(), month, year);
        if (totalExpenses == null) {
            totalExpenses = BigDecimal.ZERO;
        }

        BigDecimal remainingBalance = totalIncome.subtract(totalExpenses);

        return new DashboardResponse(totalIncome, totalExpenses, remainingBalance);
    }
}
