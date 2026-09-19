package com.expenseflow.income.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class IncomeResponse {

    private Long id;
    private BigDecimal amount;
    private String source;
    private String description;
    private LocalDate incomeDate;

    public IncomeResponse(Long id, BigDecimal amount, String source, String description, LocalDate incomeDate) {
        this.id = id;
        this.amount = amount;
        this.source = source;
        this.description = description;
        this.incomeDate = incomeDate;
    }

    public Long getId() {
        return id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getSource() {
        return source;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getIncomeDate() {
        return incomeDate;
    }
}
