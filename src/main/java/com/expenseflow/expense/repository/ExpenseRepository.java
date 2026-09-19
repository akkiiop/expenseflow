package com.expenseflow.expense.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;

import com.expenseflow.expense.entity.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
	
	List<Expense> findByUserId(Long userId);
	
	// Pagination and Filtering methods
	Page<Expense> findByUserId(Long userId, Pageable pageable);
	Page<Expense> findByUserIdAndCategoryId(Long userId, Long categoryId, Pageable pageable);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.id = :userId AND MONTH(e.expenseDate) = :month AND YEAR(e.expenseDate) = :year")
    BigDecimal calculateTotalExpensesByMonthAndYear(@Param("userId") Long userId, @Param("month") int month, @Param("year") int year);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.id = :userId AND e.category.id = :categoryId AND MONTH(e.expenseDate) = :month AND YEAR(e.expenseDate) = :year")
    BigDecimal calculateTotalExpensesByCategoryMonthAndYear(@Param("userId") Long userId, @Param("categoryId") Long categoryId, @Param("month") int month, @Param("year") int year);

    // All-time total for Report Summary
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.id = :userId")
    BigDecimal calculateTotalExpensesByUserId(@Param("userId") Long userId);
}