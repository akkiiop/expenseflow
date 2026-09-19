package com.expenseflow.report.dto;

import java.math.BigDecimal;

public class ReportSummaryResponse {
    
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal remainingBalance;

    public ReportSummaryResponse(BigDecimal totalIncome, BigDecimal totalExpenses, BigDecimal remainingBalance) {
        this.totalIncome = totalIncome;
        this.totalExpenses = totalExpenses;
        this.remainingBalance = remainingBalance;
    }

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public BigDecimal getRemainingBalance() {
        return remainingBalance;
    }

    public void setRemainingBalance(BigDecimal remainingBalance) {
        this.remainingBalance = remainingBalance;
    }
}
