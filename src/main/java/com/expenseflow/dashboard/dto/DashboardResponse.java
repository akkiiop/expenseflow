package com.expenseflow.dashboard.dto;

import java.math.BigDecimal;

public class DashboardResponse {
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal remainingBalance;

    public DashboardResponse(BigDecimal totalIncome, BigDecimal totalExpenses, BigDecimal remainingBalance) {
        this.totalIncome = totalIncome;
        this.totalExpenses = totalExpenses;
        this.remainingBalance = remainingBalance;
    }

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public BigDecimal getRemainingBalance() {
        return remainingBalance;
    }
}
