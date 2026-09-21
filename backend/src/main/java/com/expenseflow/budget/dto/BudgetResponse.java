package com.expenseflow.budget.dto;

import java.math.BigDecimal;

public class BudgetResponse {

    private Long id;
    private BigDecimal amount;
    private Integer month;
    private Integer year;
    private String categoryName;

    public BudgetResponse(Long id, BigDecimal amount, Integer month, Integer year, String categoryName) {
        this.id = id;
        this.amount = amount;
        this.month = month;
        this.year = year;
        this.categoryName = categoryName;
    }

    public Long getId() { return id; }
    public BigDecimal getAmount() { return amount; }
    public Integer getMonth() { return month; }
    public Integer getYear() { return year; }
    public String getCategoryName() { return categoryName; }
}
