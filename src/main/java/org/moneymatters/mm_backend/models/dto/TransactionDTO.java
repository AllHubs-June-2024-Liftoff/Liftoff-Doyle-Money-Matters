package org.moneymatters.mm_backend.models.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public class TransactionDTO {

    private Integer id;
    private Integer userId;
    private Integer budgetId;
    private Integer tagId;
    @NotNull(message = "Amount cannot be null")
    private Double amount;
    private String description;
    @JsonProperty
    private boolean isRecurring;
    @JsonProperty
    private boolean isIncome;
    private Integer recurringDate;
    private LocalDateTime createdDate;
    private List<SplitDto> splits;

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getBudgetId() {
        return budgetId;
    }

    public void setBudgetId(Integer budgetId) {
        this.budgetId = budgetId;
    }

    public Integer getTagId() {
        return tagId;
    }

    public void setTagId(Integer tagId) {
        this.tagId = tagId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isRecurring() {
        return isRecurring;
    }

    public void setRecurring(boolean recurring) {
        isRecurring = recurring;
    }

    public boolean isIncome() {
        return isIncome;
    }

    public void setIncome(boolean income) {
        isIncome = income;
    }

    public Integer getRecurringDate() {
        return recurringDate;
    }

    public void setRecurringDate(Integer recurringDate) {
        this.recurringDate = recurringDate;
    }

    public List<SplitDto> getSplits() {
        return splits;
    }

    public void setSplits(List<SplitDto> splits) {
        this.splits = splits;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    // Nested DTO for split
    public static class SplitDto{

            private Integer splitAmount;
            private String tag;

            public String getTag() {
                return tag;
            }

            public void setTag(String tag) {
                this.tag = tag;
            }

            public Integer getSplitAmount() {
                return splitAmount;
            }

            public void setSplitAmount(Integer splitAmount) {
                this.splitAmount = splitAmount;
            }
        }

        @Override
    public String toString() {
        return "TransactionDTO{" +
                "id=" + id +
                ", userId=" + userId +
                ", budgetId=" + budgetId +
                ", tagId=" + tagId +
                ", amount=" + amount +
                ", description='" + description + '\'' +
                ", isRecurring=" + isRecurring +
                ", isIncome=" + isIncome +
                ", recurringDate=" + recurringDate +
                ", createdDate=" + createdDate +
                ", splits=" + splits +
                '}';
        }

}

