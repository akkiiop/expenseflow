package com.expenseflow.dashboard.controller;

import com.expenseflow.dashboard.dto.DashboardResponse;
import com.expenseflow.dashboard.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardResponse> getSummary(
            @RequestParam int month, 
            @RequestParam int year) {
        
        return ResponseEntity.ok(dashboardService.getDashboardSummary(month, year));
    }
}
