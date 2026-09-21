package com.expenseflow.report.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.expenseflow.expense.repository.ExpenseRepository;
import com.expenseflow.income.repository.IncomeRepository;
import com.expenseflow.report.dto.ReportSummaryResponse;
import com.expenseflow.user.entity.User;

@Service
public class ReportService {

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;

    public ReportService(ExpenseRepository expenseRepository, IncomeRepository incomeRepository) {
        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
    }

    public ReportSummaryResponse getReportSummary(User user) {
        BigDecimal totalIncome = incomeRepository.calculateTotalIncomeByUserId(user.getId());
        BigDecimal totalExpenses = expenseRepository.calculateTotalExpensesByUserId(user.getId());

        // Handle nulls if user has no income or no expenses yet
        if (totalIncome == null) {
            totalIncome = BigDecimal.ZERO;
        }
        if (totalExpenses == null) {
            totalExpenses = BigDecimal.ZERO;
        }

        BigDecimal remainingBalance = totalIncome.subtract(totalExpenses);

        return new ReportSummaryResponse(totalIncome, totalExpenses, remainingBalance);
    }
}
