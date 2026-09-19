package com.expenseflow.ai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expenseflow.ai.dto.InsightsResponse;
import com.expenseflow.ai.service.AiService;
import com.expenseflow.common.security.SecurityUtils;
import com.expenseflow.user.entity.User;
import com.expenseflow.user.service.UserService;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;
    private final UserService userService;

    public AiController(AiService aiService, UserService userService) {
        this.aiService = aiService;
        this.userService = userService;
    }

    @GetMapping("/insights")
    public ResponseEntity<InsightsResponse> getSpendingInsights() {
        // 1. Identify who is making the request using their JWT token
        String email = SecurityUtils.getAuthenticatedUserEmail();
        User loggedInUser = userService.getUserByEmail(email);
        
        // 2. Ask the AI Service to generate the insights for this specific user
        InsightsResponse insights = aiService.generateSpendingInsights(loggedInUser);
        
        // 3. Return the AI's response with a 200 OK status
        return ResponseEntity.ok(insights);
    }
}
