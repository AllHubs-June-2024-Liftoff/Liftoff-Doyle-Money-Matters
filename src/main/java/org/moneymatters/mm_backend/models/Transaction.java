package org.moneymatters.mm_backend.models;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

import java.util.List;

@JsonIgnoreProperties({"user", "tag", "hibernateLazyInitializer", "handler"})
@Entity
public class Transaction extends Entry{

    private boolean isRecurring;

    @ManyToOne
    @JsonIgnore
    private Tag tag;

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("transaction")
    private List<Split> splits;

    public Transaction(int id, Double amount, boolean isIncome, String description, Budget budget, User user, boolean isRecurring, Tag tag, List<Split> splits) {
        super(id, amount, isIncome, description, budget, user);
        this.isRecurring = isRecurring;
        this.tag = tag;
        this.splits = splits;
    }

    public Transaction(boolean isRecurring) {
        super();
        this.isRecurring = isRecurring;
    }




    public Transaction() { };

    public List<Split> getSplits() {
        return splits;
    }

    public void setSplits(List<Split> splits) {
        this.splits = splits;
    }

    public boolean isRecurring() {
        return isRecurring;
    }

    public void setRecurring(boolean recurring) {
        isRecurring = recurring;
    }

    public Tag getTag() {
        return tag;
    }

    public void setTag(Tag tag) {
        this.tag = tag;
    }
}
