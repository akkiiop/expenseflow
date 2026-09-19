package com.expenseflow.expense.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.expenseflow.budget.entity.Budget;
import com.expenseflow.budget.repository.BudgetRepository;
import com.expenseflow.category.entity.Category;
import com.expenseflow.category.repository.CategoryRepository;
import com.expenseflow.common.exception.BudgetExceededException;
import com.expenseflow.common.exception.ResourceNotFoundException;
import com.expenseflow.expense.dto.ExpenseRequest;
import com.expenseflow.expense.dto.ExpenseResponse;
import com.expenseflow.expense.entity.Expense;
import com.expenseflow.expense.repository.ExpenseRepository;
import com.expenseflow.user.entity.User;

@ExtendWith(MockitoExtension.class)
public class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private BudgetRepository budgetRepository;

    @InjectMocks
    private ExpenseService expenseService;

    private User testUser;
    private Category testCategory;
    private ExpenseRequest testRequest;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@test.com");

        testCategory = new Category();
        testCategory.setId(1L);
        testCategory.setName("Food");

        testRequest = new ExpenseRequest();
        testRequest.setAmount(new BigDecimal("100.00"));
        testRequest.setCategoryId(1L);
        testRequest.setExpenseDate(LocalDate.now());
        testRequest.setDescription("Lunch");
        testRequest.setPaymentMethod("CASH");
    }

    @Test
    void saveExpense_Success_NoBudget() {
        // Arrange
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(budgetRepository.findByUserIdAndCategoryIdAndMonthAndYear(anyLong(), anyLong(), anyInt(), anyInt()))
                .thenReturn(Optional.empty()); // No budget set

        Expense savedExpense = new Expense();
        savedExpense.setId(10L);
        savedExpense.setAmount(testRequest.getAmount());
        savedExpense.setCategory(testCategory);
        savedExpense.setExpenseDate(testRequest.getExpenseDate());
        savedExpense.setPaymentMethod(testRequest.getPaymentMethod());
        savedExpense.setDescription(testRequest.getDescription());
        savedExpense.setUser(testUser);

        when(expenseRepository.save(any(Expense.class))).thenReturn(savedExpense);

        // Act
        ExpenseResponse response = expenseService.saveExpense(testRequest, testUser);

        // Assert
        assertNotNull(response);
        assertEquals(new BigDecimal("100.00"), response.getAmount());
        assertEquals("Food", response.getCategoryName());
        verify(expenseRepository, times(1)).save(any(Expense.class));
    }

    @Test
    void saveExpense_ThrowsBudgetExceededException() {
        // Arrange
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));

        Budget testBudget = new Budget();
        testBudget.setAmount(new BigDecimal("500.00"));
        
        when(budgetRepository.findByUserIdAndCategoryIdAndMonthAndYear(anyLong(), anyLong(), anyInt(), anyInt()))
                .thenReturn(Optional.of(testBudget));

        // Mock current expenses to be 450. Adding 100 will exceed the 500 budget!
        when(expenseRepository.calculateTotalExpensesByCategoryMonthAndYear(anyLong(), anyLong(), anyInt(), anyInt()))
                .thenReturn(new BigDecimal("450.00"));

        // Act & Assert
        Exception exception = assertThrows(BudgetExceededException.class, () -> {
            expenseService.saveExpense(testRequest, testUser);
        });

        assertTrue(exception.getMessage().contains("exceeds your budget"));
        verify(expenseRepository, never()).save(any(Expense.class)); // Ensure it is NOT saved
    }

    @Test
    void getExpenseById_ThrowsResourceNotFound() {
        // Arrange
        when(expenseRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            expenseService.getExpenseById(99L);
        });
    }
}
