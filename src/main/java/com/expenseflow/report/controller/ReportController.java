package com.expenseflow.report.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expenseflow.common.security.SecurityUtils;
import com.expenseflow.report.dto.ReportSummaryResponse;
import com.expenseflow.report.service.ReportService;
import com.expenseflow.user.entity.User;
import com.expenseflow.user.service.UserService;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private final UserService userService;

    public ReportController(ReportService reportService, UserService userService) {
        this.reportService = reportService;
        this.userService = userService;
    }

    @GetMapping("/summary")
    public ResponseEntity<ReportSummaryResponse> getSummary() {
        String email = SecurityUtils.getAuthenticatedUserEmail();
        User loggedInUser = userService.getUserByEmail(email);

        ReportSummaryResponse summary = reportService.getReportSummary(loggedInUser);
        
        return ResponseEntity.ok(summary);
    }
}
