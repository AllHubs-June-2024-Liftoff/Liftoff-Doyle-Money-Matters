package org.moneymatters.mm_backend.controllers;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Valid;
import jakarta.validation.Validator;
import org.moneymatters.mm_backend.data.*;
import org.moneymatters.mm_backend.models.*;
import org.moneymatters.mm_backend.models.dto.IncomeSplitDto;
import org.moneymatters.mm_backend.models.dto.TransactionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private RecurringTransactionRepository recurringTransactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private SplitRepository splitRepository;

    @Autowired
    private Validator validator;


//    Create transaction with budget and tag assignment options
@PostMapping("/add")
    public ResponseEntity<?> addTransaction(@RequestBody @Valid TransactionDTO transactionDTO,
                                            @RequestParam Integer user_id,
                                            @RequestParam(required = false) Integer budget_id,
                                            @RequestParam(required = false) Integer tag_id) {

    if (transactionDTO.getAmount() == null) {
        return new ResponseEntity<>("Amount is null: ", HttpStatus.BAD_REQUEST);
    }

    System.out.println("Amount from DTO: " + transactionDTO.getAmount());
    System.out.println("Budget ID: " + budget_id);
    System.out.println("User ID: " + user_id);

    Transaction transaction = new Transaction();
    transaction.setAmount(transactionDTO.getAmount());
    transaction.setDescription(transactionDTO.getDescription());
    transaction.setRecurring(transactionDTO.isRecurring());
    transaction.setIsIncome(transactionDTO.isIncome());


    Optional<User> userOptional = userRepository.findById(user_id);
    if (userOptional.isEmpty()) {
        return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
    }
    transaction.setUser(userOptional.get());

    if  (budget_id != null) {
    Optional<Budget> budgetOptional = budgetRepository.findById(budget_id);
    if (budgetOptional.isEmpty()) {
        return new ResponseEntity<>("Budget not found", HttpStatus.NOT_FOUND);
    }
    transaction.setBudgetId(budgetOptional.get());
    }

    if (tag_id != null) {
        Optional<Tag> tagOptional = tagRepository.findById(tag_id);
        if (tagOptional.isEmpty()) {
            return new ResponseEntity<>("Tag not found", HttpStatus.NOT_FOUND);
        }
        transaction.setTag(tagOptional.get());
    }

    Transaction savedTransaction = transactionRepository.save(transaction);

    if (transaction.isRecurring()){
        RecurringTransaction recurringTransaction= new RecurringTransaction();
        recurringTransaction.setTransaction(transaction);
        recurringTransaction.setAmount(transactionDTO.getAmount());
        recurringTransaction.setDescription(transactionDTO.getDescription());
        recurringTransaction.setIsIncome(transactionDTO.isIncome());
        recurringTransaction.setRecurringDay(transactionDTO.getRecurringDate());
        recurringTransaction.setTag(transaction.getTag());
        recurringTransaction.setUser(transaction.getUser());
        recurringTransaction.setBudgetId(transaction.getBudget());
        recurringTransaction.setNextTransactionDate(recurringTransaction.calculateNextTransactionDate());


        System.out.println("Received recurringTransaction: " +  recurringTransaction.getAmount());

        Set<ConstraintViolation<RecurringTransaction>> violations = validator.validate(recurringTransaction);
        if (!violations.isEmpty()) {
            String errorMessages = violations.stream()
                    .map(violation -> violation.getMessage())
                    .collect(Collectors.joining(", "));
            return new ResponseEntity<>(errorMessages, HttpStatus.BAD_REQUEST);
        }

        recurringTransactionRepository.save(recurringTransaction);
    }


    if(transactionDTO.getSplits() != null && !transactionDTO.getSplits().isEmpty()){
        for(TransactionDTO.SplitDto splitDto: transactionDTO.getSplits()){

            if (splitDto.getTag() == null || splitDto.getTag().isEmpty()){
                return new ResponseEntity<>("Tag ID cannot be null or empty", HttpStatus.BAD_REQUEST);
            }
//            double splitAmount = splitDto.getSplitAmount();
//            String tag = splitDto.getTag();

            Optional<Tag> tagOptional = tagRepository.findById(Integer.parseInt(splitDto.getTag()));
            if(tagOptional.isEmpty()){
                return new ResponseEntity<>("Tag not found for id: " + splitDto.getTag(),HttpStatus.NOT_FOUND);
            }

            Split split = new Split();
            split.setSplitAmount(splitDto.getSplitAmount());
            split.setTag(tagOptional.get());
            split.setTransaction(savedTransaction);
            splitRepository.save(split);
        }
    }

    return new ResponseEntity<>(true, HttpStatus.CREATED);
}// Income split endpoint
    @PostMapping("/split-income")
    public ResponseEntity<?> splitIncome(@RequestBody IncomeSplitDto incomeSplitDto) {
        double totalIncome = incomeSplitDto.getTotalIncome();
        Map<String, Double> allocations = incomeSplitDto.getAllocations();

        // Create transaction for each category split
        for (Map.Entry<String, Double> entry : allocations.entrySet()) {
            String tagName = entry.getKey();
            Double percentage = entry.getValue();

            // Calculate the split amount
            double splitAmount = (percentage / 100) * totalIncome;

            // Fetch the corresponding tag by name
            Optional<Tag> tagOptional = tagRepository.findByName(tagName);
            if (tagOptional.isEmpty()) {
                return new ResponseEntity<>("Tag not found for name: " + tagName, HttpStatus.NOT_FOUND);
            }
            Tag tag = tagOptional.get();

            // Create the transaction for the split
            Transaction transaction = new Transaction();
            transaction.setAmount(splitAmount);
            transaction.setDescription("Income split for " + tag.getName());
            transaction.setIsIncome(true);  // Set as income
            transaction.setTag(tag);

            // Save the transaction
            transactionRepository.save(transaction);
        }

        return new ResponseEntity<>("Income successfully split into categories", HttpStatus.CREATED);

    }

//      View all transactions for a user
    @GetMapping("/user/{user_id}")
    public ResponseEntity<?> getUserTransactions(@PathVariable Integer user_id) {
    Optional<User> userOptional = userRepository.findById(user_id);
    if (userOptional.isEmpty()) {
        return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
    }
        List<Transaction> transactions = transactionRepository.findByUser(userOptional.get());
        List<TransactionDTO> transactionDTOS = transactions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return new ResponseEntity<>(transactionDTOS, HttpStatus.OK);
    }


//    View all transactions by specific budget
    @GetMapping("/budget/{budget_id}")
    public ResponseEntity<?> getBudgetTransactions(@PathVariable Integer budget_id) {
    Optional<Budget> budgetOptional = budgetRepository.findById(budget_id);
    if (budgetOptional.isEmpty()) {
        return new ResponseEntity<>("Budget not found", HttpStatus.NOT_FOUND);
    }
    List<Transaction> transactions = transactionRepository.findByBudget(budgetOptional.get());

    List<TransactionDTO> transactionDTOS = transactions.stream().map(transaction -> {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(transaction.getId());
        dto.setUserId(transaction.getUser().getUser_id());
        dto.setBudgetId(transaction.getBudget().getId());
        dto.setAmount(transaction.getAmount());
        dto.setDescription(transaction.getDescription());
        dto.setRecurring(transaction.isRecurring());
        dto.setIncome(transaction.isIncome());
        dto.setCreatedDate(transaction.getCreatedDate());

        if (transaction.getTag() != null) {
            dto.setTagId(transaction.getTag().getId());
        }
        return dto;
    }).collect(Collectors.toList());

    return new ResponseEntity<>(transactionDTOS, HttpStatus.OK);
    }

//    View transactions by specific tag
    @GetMapping("/tag/{tag_id}")
    public ResponseEntity<?> getTagTransactions(@PathVariable Integer tag_id) {
    Optional<Tag> tagOptional = tagRepository.findById(tag_id);
    if (tagOptional.isEmpty()) {
        return new ResponseEntity<>("Tag not found", HttpStatus.NOT_FOUND   );
    }
    List<Transaction> transactions = transactionRepository.findByTag(tagOptional.get());
    return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

//    View details of specific transaction
    @GetMapping("/view/{id}")
    public ResponseEntity<?> getTransaction(@PathVariable Integer id) {
    Optional<Transaction> transaction = transactionRepository.findById(id);
    if (transaction.isEmpty()) {
        return new ResponseEntity<>("Transaction not found", HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(transaction.get(), HttpStatus.OK);
    }

//    Update transaction with budget and tag reassignments
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateTransaction(@PathVariable Integer id,
                                               @RequestBody @Valid Transaction transaction,
                                               @RequestParam(required = false) Integer budget_id,
                                               @RequestParam(required = false) Integer tag_id) {
//        Verify transaction exists
    Optional<Transaction> existingTransactionOpt = transactionRepository.findById(id);
    if (existingTransactionOpt.isEmpty()) {
        return new ResponseEntity<>("Transaction not found", HttpStatus.NOT_FOUND);
    }

    Transaction existingTransaction = existingTransactionOpt.get();
    existingTransaction.setAmount(transaction.getAmount());
    existingTransaction.setDescription(transaction.getDescription());
    existingTransaction.setIsIncome(transaction.isIncome());
    existingTransaction.setRecurring(transaction.isRecurring());

        if (budget_id != null) {
            Optional<Budget> budgetOptional = budgetRepository.findById(budget_id);
            if (budgetOptional.isEmpty()) {
                return new ResponseEntity<>("Budget not found", HttpStatus.NOT_FOUND);
            }
            existingTransaction.setBudgetId(budgetOptional.get());
        }

        if (tag_id != null) {
            Optional<Tag> tagOptional = tagRepository.findById(tag_id);
            if (tagOptional.isEmpty()) {
                return new ResponseEntity<>("Tag not found", HttpStatus.NOT_FOUND);
            }
            existingTransaction.setTag(tagOptional.get());
        }
        Transaction updatedTransaction = transactionRepository.save(existingTransaction);
        return new ResponseEntity<>(updatedTransaction, HttpStatus.OK);
    }

//    Delete a transaction
@DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Integer id) {
    Optional<Transaction> transactionOptional = transactionRepository.findById(id);
    if (transactionOptional.isEmpty()) {
        return new ResponseEntity<>("Budget not found", HttpStatus.NOT_FOUND);
    }
    transactionRepository.deleteById(id);
    return new ResponseEntity<>("Transaction deleted successfully", HttpStatus.OK);
}

    @GetMapping("/search")
    public ResponseEntity<?> searchTransactions(@RequestParam String query, @RequestParam Integer budget_id){
        List<Transaction> transactions = transactionRepository.findByDescriptionContainingIgnoreCase(query, budget_id);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    /**
     * Converts a Transaction entity to a TransactionDTO.
     * This handles the proper conversion of all fields, including splits.
     */
    private TransactionDTO convertToDTO(Transaction transaction) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(transaction.getId());
        dto.setAmount(transaction.getAmount());
        dto.setDescription(transaction.getDescription());
        dto.setIncome(transaction.isIncome());
        dto.setRecurring(transaction.isRecurring());
        dto.setCreatedDate(transaction.getCreatedDate());

        // Set user ID if user exists
        if (transaction.getUser() != null) {
            dto.setUserId(transaction.getUser().getUser_id());
        }

        // Set budget ID if budget exists
        if (transaction.getBudget() != null) {
            dto.setBudgetId(transaction.getBudget().getId());
        }

        // Set tag ID if tag exists
        if (transaction.getTag() != null) {
            dto.setTagId(transaction.getTag().getId());
        }

        // Convert splits if they exist
        if (transaction.getSplits() != null) {
            List<TransactionDTO.SplitDto> splitDtos = transaction.getSplits().stream()
                    .map(split -> {
                        TransactionDTO.SplitDto splitDto = new TransactionDTO.SplitDto();
                        splitDto.setSplitAmount(split.getSplitAmount());
                        splitDto.setTag(String.valueOf(split.getTag().getId()));
                        return splitDto;
                    })
                    .collect(Collectors.toList());
            dto.setSplits(splitDtos);
        }

        return dto;
    }

}
