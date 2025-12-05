let transactions = [];
let currentFilter = 'all';

// Load transactions from localStorage on page load
function loadTransactions() {
    const saved = localStorage.getItem('transactions');
    if (saved) {
        transactions = JSON.parse(saved);
        updateUI();
    }
}

// Save transactions to localStorage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Handle form submission
document.getElementById('transactionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const type = document.getElementById('type').value;

    const transaction = {
        id: Date.now(),
        description,
        amount,
        category,
        type,
        date: new Date().toLocaleDateString()
    };

    transactions.unshift(transaction);
    saveTransactions();
    updateUI();
    resetForm();
});

// Reset form
function resetForm() {
    document.getElementById('transactionForm').reset();
}

// Reset button event listener
document.getElementById('resetBtn').addEventListener('click', resetForm);

// Delete transaction
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions();
    updateUI();
}

// Filter transactions
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        currentFilter = this.getAttribute('data-filter');
        
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('active');
        });
        this.classList.add('active');
        
        updateUI();
    });
});

// Update UI
function updateUI() {
    // Calculate totals
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expense;

    // Update dashboard cards
    document.getElementById('totalIncome').textContent = `$${income.toFixed(2)}`;
    document.getElementById('totalExpense').textContent = `$${expense.toFixed(2)}`;
    document.getElementById('balance').textContent = `$${balance.toFixed(2)}`;

    // Filter transactions based on current filter
    let filteredTransactions = transactions;
    if (currentFilter !== 'all') {
        filteredTransactions = transactions.filter(t => t.type === currentFilter);
    }

    // Display transactions
    const transactionList = document.getElementById('transactionList');
    
    if (filteredTransactions.length === 0) {
        transactionList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📊</div>
                <p>No ${currentFilter === 'all' ? '' : currentFilter} transactions found.</p>
            </div>
        `;
        return;
    }

    transactionList.innerHTML = filteredTransactions.map(t => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-desc">${t.description}</div>
                <span class="transaction-category">${t.category}</span>
            </div>
            <span class="transaction-amount ${t.type}">
                ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
            </span>
            <button class="delete-btn" onclick="deleteTransaction(${t.id})">Delete</button>
        </div>
    `).join('');
}

// Load transactions when page loads
loadTransactions();
