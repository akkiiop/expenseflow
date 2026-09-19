package com.expenseflow.income.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;

import com.expenseflow.income.entity.Income;

public interface IncomeRepository extends JpaRepository<Income, Long> {

    List<Income> findByUserId(Long userId);
    
    // Pagination Method
    Page<Income> findByUserId(Long userId, Pageable pageable);

    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.user.id = :userId AND MONTH(i.incomeDate) = :month AND YEAR(i.incomeDate) = :year")
    BigDecimal calculateTotalIncomeByMonthAndYear(@Param("userId") Long userId, @Param("month") int month, @Param("year") int year);

    // All-time total for Report Summary
    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.user.id = :userId")
    BigDecimal calculateTotalIncomeByUserId(@Param("userId") Long userId);
}
