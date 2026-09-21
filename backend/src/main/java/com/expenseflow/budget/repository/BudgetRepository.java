package com.expenseflow.budget.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.expenseflow.budget.entity.Budget;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUserId(Long userId);

    Optional<Budget> findByUserIdAndCategoryIdAndMonthAndYear(
            Long userId, Long categoryId, Integer month, Integer year);
}
