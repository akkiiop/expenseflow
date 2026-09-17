package com.expenseflow.expense.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.expenseflow.expense.entity.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

}