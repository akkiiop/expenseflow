package com.expenseflow.ai.dto;

import java.math.BigDecimal;

public class InsightsResponse {

    private String aiAnalysis;
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal remainingBalance;

    public InsightsResponse(String aiAnalysis, BigDecimal totalIncome, BigDecimal totalExpenses, BigDecimal remainingBalance) {
        this.aiAnalysis = aiAnalysis;
        this.totalIncome = totalIncome;
        this.totalExpenses = totalExpenses;
        this.remainingBalance = remainingBalance;
    }

    // Getters
    public String getAiAnalysis() { return aiAnalysis; }
    public BigDecimal getTotalIncome() { return totalIncome; }
    public BigDecimal getTotalExpenses() { return totalExpenses; }
    public BigDecimal getRemainingBalance() { return remainingBalance; }
}
