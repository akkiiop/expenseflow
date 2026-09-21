package com.expenseflow.expense.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ExpenseResponse {

    private Long id;
    private BigDecimal amount;
    private String description;
    private String paymentMethod;
    private LocalDate expenseDate;
    private String categoryName;

    public ExpenseResponse(Long id, BigDecimal amount, String description, String paymentMethod, LocalDate expenseDate, String categoryName) {
        this.id = id;
        this.amount = amount;
        this.description = description;
        this.paymentMethod = paymentMethod;
        this.expenseDate = expenseDate;
        this.categoryName = categoryName;
    }

    public Long getId() { return id; }
    public BigDecimal getAmount() { return amount; }
    public String getDescription() { return description; }
    public String getPaymentMethod() { return paymentMethod; }
    public LocalDate getExpenseDate() { return expenseDate; }
    public String getCategoryName() { return categoryName; }
}
