// ======================================================
// EXPENSE TRACKER
// BUDGET + EDIT + DELETE + RESTORE
// ALL-IN-ONE JAVASCRIPT CODE
// ======================================================


// ======================================================
// LOCAL STORAGE
// ======================================================

const STORAGE_KEY = "expense_tracker_data";
const DELETED_KEY = "expense_tracker_deleted";
const BUDGET_KEY = "expense_tracker_budget";

let transactions = JSON.parse(
  localStorage.getItem(STORAGE_KEY) || "[]"
);

let deletedTransactions = JSON.parse(
  localStorage.getItem(DELETED_KEY) || "[]"
);

let editingId = null;


// ======================================================
// SAVE DATA
// ======================================================

function saveTransactions() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(transactions)
  );
}

function saveDeletedTransactions() {
  localStorage.setItem(
    DELETED_KEY,
    JSON.stringify(deletedTransactions)
  );
}

function saveBudget(amount) {
  localStorage.setItem(
    BUDGET_KEY,
    String(amount)
  );
}

function loadBudget() {
  return parseFloat(
    localStorage.getItem(BUDGET_KEY) || "0"
  );
}


// ======================================================
// MONEY FORMAT
// ======================================================

function fmt(amount) {
  return "₹" + Number(amount || 0).toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2
    }
  );
}


// ======================================================
// MONTH EXPENSE
// ======================================================

function getThisMonthExpense() {

  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth();

  return transactions
    .filter(t => {

      if (t.type !== "expense") return false;

      const d = new Date(t.date);

      return (
        d.getFullYear() === year &&
        d.getMonth() === month
      );

    })
    .reduce(
      (total, t) =>
        total + Number(t.amount || 0),
      0
    );
}


// ======================================================
// BUDGET PAGE
// ======================================================

function renderBudgetPage() {

  const budget = loadBudget();

  const spent = getThisMonthExpense();

  const remaining = budget - spent;

  const amountInput =
    document.getElementById("budgetAmount");

  const total =
    document.getElementById("budgetTotal");

  const spentBox =
    document.getElementById("budgetSpent");

  const remainingBox =
    document.getElementById("budgetRemaining");

  const progress =
    document.getElementById("budgetProgress");

  const message =
    document.getElementById("budgetMessage");


  if (amountInput) {
    amountInput.value =
      budget > 0 ? budget : "";
  }

  if (total) {
    total.textContent =
      fmt(budget);
  }

  if (spentBox) {
    spentBox.textContent =
      fmt(spent);
  }

  if (remainingBox) {
    remainingBox.textContent =
      fmt(Math.max(remaining, 0));
  }


  let percentage = 0;

  if (budget > 0) {
    percentage =
      (spent / budget) * 100;
  }

  const displayPercentage =
    Math.min(percentage, 100);


  if (progress) {
    progress.style.width =
      displayPercentage + "%";
  }


  if (message) {

    if (budget <= 0) {

      message.textContent =
        "💡 Please set your monthly budget.";

    }
    else if (spent > budget) {

      message.textContent =
        "🚨 Budget exceeded by " +
        fmt(spent - budget);

    }
    else if (percentage >= 80) {

      message.textContent =
        "⚠️ You have used " +
        percentage.toFixed(0) +
        "% of your budget.";

    }
    else {

      message.textContent =
        "✅ You are within your monthly budget.";

    }
  }
}


// ======================================================
// SAVE BUDGET
// ======================================================

const budgetForm =
  document.getElementById("budgetForm");

if (budgetForm) {

  budgetForm.addEventListener(
    "submit",
    function(e) {

      e.preventDefault();

      const amount =
        parseFloat(
          document.getElementById(
            "budgetAmount"
          ).value
        );

      if (
        isNaN(amount) ||
        amount < 0
      ) {

        alert(
          "Please enter a valid budget."
        );

        return;
      }


      saveBudget(amount);

      renderBudgetPage();


      if (
        typeof renderDashboard ===
        "function"
      ) {
        renderDashboard();
      }


      alert(
        "Monthly budget saved successfully! ✅"
      );

    }
  );

}


// ======================================================
// EDIT TRANSACTION
// ======================================================

function editTransaction(id) {

  const tx =
    transactions.find(
      t => String(t.id) === String(id)
    );


  if (!tx) {

    alert(
      "Transaction not found!"
    );

    return;
  }


  editingId = tx.id;


  // ------------------------------------------
  // EDIT INCOME
  // ------------------------------------------

  if (tx.type === "income") {

    openPage("income");


    const amount =
      document.getElementById(
        "incomeAmount"
      );

    const date =
      document.getElementById(
        "incomeDate"
      );

    const note =
      document.getElementById(
        "incomeNote"
      );


    if (amount)
      amount.value = tx.amount;

    if (date)
      date.value = tx.date;

    if (note)
      note.value = tx.note || "";


    document
      .querySelectorAll(
        "#incomeCatGrid .cat-btn"
      )
      .forEach(btn => {

        btn.classList.remove(
          "selected"
        );


        const category =
          btn.dataset.category ||
          btn.getAttribute(
            "data-category"
          );


        if (
          category === tx.category
        ) {

          btn.classList.add(
            "selected"
          );

        }

      });

  }


  // ------------------------------------------
  // EDIT EXPENSE
  // ------------------------------------------

  else {

    openPage("expense");


    const amount =
      document.getElementById(
        "expenseAmount"
      );

    const date =
      document.getElementById(
        "expenseDate"
      );

    const note =
      document.getElementById(
        "expenseNote"
      );


    if (amount)
      amount.value = tx.amount;

    if (date)
      date.value = tx.date;

    if (note)
      note.value = tx.note || "";


    document
      .querySelectorAll(
        "#expenseCatGrid .cat-btn"
      )
      .forEach(btn => {

        btn.classList.remove(
          "selected"
        );


        const category =
          btn.dataset.category ||
          btn.getAttribute(
            "data-category"
          );


        if (
          category === tx.category
        ) {

          btn.classList.add(
            "selected"
          );

        }

      });

  }


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


// ======================================================
// OPEN PAGE
// ======================================================

function openPage(pageName) {

  document
    .querySelectorAll(".tab-btn")
    .forEach(btn => {

      btn.classList.remove(
        "active"
      );

    });


  document
    .querySelectorAll(".page")
    .forEach(page => {

      page.classList.remove(
        "active"
      );

    });


  const button =
    document.querySelector(
      '[data-page="' +
      pageName +
      '"]'
    );


  const page =
    document.getElementById(
      pageName
    );


  if (button) {

    button.classList.add(
      "active"
    );

  }


  if (page) {

    page.classList.add(
      "active"
    );

  }

}


// ======================================================
// DELETE TRANSACTION
// ======================================================

function deleteTransaction(id) {

  const tx =
    transactions.find(
      t => String(t.id) === String(id)
    );


  if (!tx) {

    alert(
      "Transaction not found!"
    );

    return;
  }


  const confirmDelete =
    confirm(
      "Are you sure you want to delete this transaction?"
    );


  if (!confirmDelete)
    return;


  // Move transaction to deleted history

  deletedTransactions.push({

    ...tx,

    deletedAt:
      new Date().toISOString()

  });


  // Remove transaction

  transactions =
    transactions.filter(
      t =>
        String(t.id) !==
        String(id)
    );


  saveTransactions();

  saveDeletedTransactions();


  refreshAll();


  alert(
    "Transaction deleted successfully! 🗑️"
  );

}


// ======================================================
// RESTORE DELETED TRANSACTION
// ======================================================

function restoreDeletedTransaction(id) {

  const index =
    deletedTransactions.findIndex(
      t =>
        String(t.id) ===
        String(id)
    );


  if (index === -1) {

    alert(
      "Deleted transaction not found!"
    );

    return;
  }


  const tx =
    deletedTransactions[index];


  let newId = tx.id;


  // Prevent duplicate ID

  if (
    transactions.some(
      t =>
        String(t.id) ===
        String(newId)
    )
  ) {

    newId =
      Date.now();

  }


  const restored = {

    ...tx,

    id: newId

  };


  delete restored.deletedAt;


  transactions.push(
    restored
  );


  deletedTransactions.splice(
    index,
    1
  );


  saveTransactions();

  saveDeletedTransactions();


  refreshAll();


  alert(
    "Transaction restored successfully! ♻️"
  );

}


// ======================================================
// PERMANENT DELETE
// ======================================================

function permanentlyDeleteTransaction(id) {

  const confirmDelete =
    confirm(
      "Delete this transaction permanently?"
    );


  if (!confirmDelete)
    return;


  deletedTransactions =
    deletedTransactions.filter(
      t =>
        String(t.id) !==
        String(id)
    );


  saveDeletedTransactions();


  if (
    typeof renderDeletedHistory ===
    "function"
  ) {

    renderDeletedHistory();

  }


  alert(
    "Transaction permanently deleted! ❌"
  );

}


// ======================================================
// CLEAR DELETED HISTORY
// ======================================================

function clearDeletedHistory() {

  if (
    deletedTransactions.length === 0
  ) {

    alert(
      "Deleted history is already empty."
    );

    return;
  }


  const confirmClear =
    confirm(
      "Delete all deleted transactions permanently?"
    );


  if (!confirmClear)
    return;


  deletedTransactions = [];


  saveDeletedTransactions();


  if (
    typeof renderDeletedHistory ===
    "function"
  ) {

    renderDeletedHistory();

  }


  alert(
    "Deleted history cleared! 🗑️"
  );

}


// ======================================================
// REFRESH EVERYTHING
// ======================================================

function refreshAll() {

  if (
    typeof renderDashboard ===
    "function"
  ) {

    renderDashboard();

  }


  if (
    typeof renderHistory ===
    "function"
  ) {

    renderHistory();

  }


  if (
    typeof renderReports ===
    "function"
  ) {

    renderReports();

  }


  if (
    typeof renderBudgetPage ===
    "function"
  ) {

    renderBudgetPage();

  }


  if (
    typeof renderDeletedHistory ===
    "function"
  ) {

    renderDeletedHistory();

  }

}


// ======================================================
// NAVIGATION
// ======================================================

document
  .querySelectorAll(".tab-btn")
  .forEach(btn => {

    btn.addEventListener(
      "click",
      function() {

        const page =
          this.dataset.page;

        openPage(page);


        if (
          page === "dashboard" &&
          typeof renderDashboard ===
          "function"
        ) {

          renderDashboard();

        }


        if (
          page === "history" &&
          typeof renderHistory ===
          "function"
        ) {

          renderHistory();

        }


        if (
          page === "reports" &&
          typeof renderReports ===
          "function"
        ) {

          renderReports();

        }


        if (
          page === "budget" &&
          typeof renderBudgetPage ===
          "function"
        ) {

          renderBudgetPage();

        }


        if (
          page === "deletedHistory" &&
          typeof renderDeletedHistory ===
          "function"
        ) {

          renderDeletedHistory();

        }

      }
    );

  });


// ======================================================
// GLOBAL FUNCTIONS
// ======================================================

window.editTransaction =
  editTransaction;

window.deleteTransaction =
  deleteTransaction;

window.restoreDeletedTransaction =
  restoreDeletedTransaction;

window.permanentlyDeleteTransaction =
  permanentlyDeleteTransaction;

window.clearDeletedHistory =
  clearDeletedHistory;

window.renderBudgetPage =
  renderBudgetPage;


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  function() {

    renderBudgetPage();

    if (
      typeof renderDashboard ===
      "function"
    ) {

      renderDashboard();

    }

  }
);
