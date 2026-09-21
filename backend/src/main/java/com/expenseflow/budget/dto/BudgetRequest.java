package com.expenseflow.budget.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class BudgetRequest {

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    @NotNull(message = "Month is required")
    private Integer month;

    @NotNull(message = "Year is required")
    private Integer year;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public Integer getMonth() { return month; }
    public void setMonth(Integer month) { this.month = month; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
}
