package com.expenseflow.income.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.expenseflow.income.dto.IncomeRequest;
import com.expenseflow.income.dto.IncomeResponse;
import com.expenseflow.income.entity.Income;
import com.expenseflow.income.repository.IncomeRepository;
import com.expenseflow.common.exception.ResourceNotFoundException;

@Service
public class IncomeService {

    private final IncomeRepository incomeRepository;

    public IncomeService(IncomeRepository incomeRepository) {
        this.incomeRepository = incomeRepository;
    }

    public IncomeResponse saveIncome(Income income) {
        Income savedIncome = incomeRepository.save(income);
        return convertToResponse(savedIncome);
    }

    public org.springframework.data.domain.Page<IncomeResponse> getIncomesByUser(Long userId, org.springframework.data.domain.Pageable pageable) {
        return incomeRepository.findByUserId(userId, pageable)
                .map(this::convertToResponse);
    }

    public List<IncomeResponse> getIncomesByUser(Long userId) {
        return incomeRepository.findByUserId(userId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public IncomeResponse getIncomeById(Long id) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found"));
        return convertToResponse(income);
    }

    public IncomeResponse updateIncome(Long id, IncomeRequest request) {
        Income existingIncome = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found"));

        existingIncome.setAmount(request.getAmount());
        existingIncome.setSource(request.getSource());
        existingIncome.setDescription(request.getDescription());
        existingIncome.setIncomeDate(request.getIncomeDate());

        Income updatedIncome = incomeRepository.save(existingIncome);
        return convertToResponse(updatedIncome);
    }

    public void deleteIncome(Long id) {
        if (!incomeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Income not found");
        }

        incomeRepository.deleteById(id);
    }
    
    private IncomeResponse convertToResponse(Income income) {
        return new IncomeResponse(
                income.getId(),
                income.getAmount(),
                income.getSource(),
                income.getDescription(),
                income.getIncomeDate()
        );
    }
}
