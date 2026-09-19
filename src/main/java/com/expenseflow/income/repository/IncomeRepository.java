package com.expenseflow.income.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.expenseflow.income.entity.Income;

public interface IncomeRepository extends JpaRepository<Income, Long> {

    List<Income> findByUserId(Long userId);
}
