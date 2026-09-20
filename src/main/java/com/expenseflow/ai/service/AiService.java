package com.expenseflow.ai.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.expenseflow.ai.dto.InsightsResponse;
import com.expenseflow.expense.entity.Expense;
import com.expenseflow.expense.repository.ExpenseRepository;
import com.expenseflow.income.repository.IncomeRepository;
import com.expenseflow.user.entity.User;

import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AiService {

    @Value("${spring.ai.openai.api-key:}")
    private String geminiApiKey;

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final HttpClient httpClient;

    public AiService(ExpenseRepository expenseRepository, IncomeRepository incomeRepository) {
        this.expenseRepository = expenseRepository;
        this.incomeRepository = incomeRepository;
        this.httpClient = HttpClient.newHttpClient(); // Native Java 21 HTTP Client
    }

    public InsightsResponse generateSpendingInsights(User user) {
        int currentMonth = LocalDate.now().getMonthValue();
        int currentYear = LocalDate.now().getYear();

        BigDecimal totalExpenses = expenseRepository.calculateTotalExpensesByMonthAndYear(user.getId(), currentMonth, currentYear);
        if (totalExpenses == null) totalExpenses = BigDecimal.ZERO;

        BigDecimal totalIncome = incomeRepository.findByUserId(user.getId()).stream()
                .filter(income -> income.getIncomeDate().getMonthValue() == currentMonth && income.getIncomeDate().getYear() == currentYear)
                .map(income -> income.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal balance = totalIncome.subtract(totalExpenses);

        List<Expense> monthlyExpenses = expenseRepository.findByUserId(user.getId()).stream()
                .filter(e -> e.getExpenseDate().getMonthValue() == currentMonth && e.getExpenseDate().getYear() == currentYear)
                .collect(Collectors.toList());

        Map<String, BigDecimal> categorySpending = monthlyExpenses.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getCategory().getName(),
                        Collectors.mapping(Expense::getAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ));

        String prompt = buildPrompt(totalIncome, totalExpenses, balance, categorySpending);
        String aiAnalysis = callGeminiApi(prompt);

        return new InsightsResponse(aiAnalysis, totalIncome, totalExpenses, balance);
    }

    private String buildPrompt(BigDecimal income, BigDecimal expenses, BigDecimal balance, Map<String, BigDecimal> categorySpending) {
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("You are an expert personal financial advisor. Analyze this month's spending data and provide 3 short, highly actionable tips.\n\n");
        promptBuilder.append("Total Income: Rs ").append(income).append("\n");
        promptBuilder.append("Total Expenses: Rs ").append(expenses).append("\n");
        promptBuilder.append("Remaining Balance: Rs ").append(balance).append("\n\n");
        
        promptBuilder.append("Spending breakdown by Category:\n");
        categorySpending.forEach((category, amount) -> 
            promptBuilder.append("- ").append(category).append(": Rs ").append(amount).append("\n")
        );
        
        promptBuilder.append("\nKeep your response encouraging, professional, and under 4 sentences.");
        return promptBuilder.toString();
    }

    // This replaces Spring AI! We talk to Google directly using pure Java.
    private String callGeminiApi(String prompt) {
        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            return "Gemini API key is not configured. Please set the GEMINI_API_KEY environment variable or configure it in application.properties to enable AI insights.";
        }
        try {
            // Updated to use the incredibly new Gemini 2.5 Flash model!
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

            // Build the JSON request body that Google expects
            String jsonBody = """
                {
                  "contents": [{
                    "parts":[{"text": "%s"}]
                  }]
                }
                """.formatted(prompt.replace("\"", "\\\"").replace("\n", " "));

            // Build the HTTP Request
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            // Send the request and get the response
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            // We use Jackson (built into Spring Boot) to parse Google's massive JSON response
            // and extract ONLY the text we care about!
            org.springframework.boot.json.JsonParser springParser = org.springframework.boot.json.JsonParserFactory.getJsonParser();
            Map<String, Object> map = springParser.parseMap(response.body());
            
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) map.get("candidates");
            Map<String, Object> firstCandidate = candidates.get(0);
            Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            Map<String, Object> firstPart = parts.get(0);
            
            return (String) firstPart.get("text");

        } catch (Exception e) {
            return "Failed to connect to AI: " + e.getMessage();
        }
    }
}
