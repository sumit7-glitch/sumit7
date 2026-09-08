const BUDGET_KEY = "expense_tracker_budget";

function loadBudget() {
  return parseFloat(
    localStorage.getItem(BUDGET_KEY) || "0"
  );
}

function saveBudget(amount) {
  localStorage.setItem(
    BUDGET_KEY,
    String(amount)
  );
}

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
    .reduce((total, t) => {
      return total + Number(t.amount || 0);
    }, 0);
}

function renderBudgetPage() {

  const budget = loadBudget();
  const spent = getThisMonthExpense();

  const remaining = budget - spent;

  document.getElementById("budgetAmount").value =
    budget || "";

  document.getElementById("budgetTotal").textContent =
    fmt(budget);

  document.getElementById("budgetSpent").textContent =
    fmt(spent);

  document.getElementById("budgetRemaining").textContent =
    fmt(Math.max(remaining, 0));

  let percentage = 0;

  if (budget > 0) {
    percentage = (spent / budget) * 100;
  }

  percentage = Math.min(percentage, 100);

  document.getElementById("budgetProgress").style.width =
    percentage + "%";

  const message =
    document.getElementById("budgetMessage");

  if (budget <= 0) {

    message.textContent =
      "💡 Please set your monthly budget.";

  } else if (spent > budget) {

    message.textContent =
      "🚨 Budget exceeded by " +
      fmt(spent - budget);

  } else if (percentage >= 80) {

    message.textContent =
      "⚠️ You have used " +
      percentage.toFixed(0) +
      "% of your budget.";

  } else {

    message.textContent =
      "✅ You are within your monthly budget.";
  }
}
