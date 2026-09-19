package com.expenseflow.income.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.expenseflow.income.entity.Income;
import com.expenseflow.income.repository.IncomeRepository;

@Service
public class IncomeService {

    private final IncomeRepository incomeRepository;

    public IncomeService(IncomeRepository incomeRepository) {
        this.incomeRepository = incomeRepository;
    }

    public Income saveIncome(Income income) {
        return incomeRepository.save(income);
    }

    public List<Income> getIncomesByUser(Long userId) {
        return incomeRepository.findByUserId(userId);
    }

    public Income getIncomeById(Long id) {
        return incomeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income not found"));
    }

    public Income updateIncome(Long id, Income income) {
        Income existingIncome = incomeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income not found"));

        existingIncome.setAmount(income.getAmount());
        existingIncome.setSource(income.getSource());
        existingIncome.setDescription(income.getDescription());
        existingIncome.setIncomeDate(income.getIncomeDate());

        return incomeRepository.save(existingIncome);
    }

    public void deleteIncome(Long id) {
        if (!incomeRepository.existsById(id)) {
            throw new RuntimeException("Income not found");
        }

        incomeRepository.deleteById(id);
    }
}
