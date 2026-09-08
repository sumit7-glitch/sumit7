// ================================
// BUDGET SAVE + NAVIGATION
// ================================

document.getElementById("budgetForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const amount = parseFloat(
    document.getElementById("budgetAmount").value
  );

  if (isNaN(amount) || amount < 0) {
    alert("Please enter a valid budget.");
    return;
  }

  // Save budget in LocalStorage
  saveBudget(amount);

  // Refresh Budget page
  renderBudgetPage();

  // Success message
  alert("Monthly budget saved successfully! ✅");
});


// ================================
// BUDGET NAVIGATION
// ================================

document.querySelectorAll(".tab-btn").forEach(function(btn) {

  btn.addEventListener("click", function() {

    if (btn.dataset.page === "budget") {
      renderBudgetPage();
    }

  });

});


// ================================
// LOAD BUDGET WHEN WEBSITE OPENS
// ================================

document.addEventListener("DOMContentLoaded", function() {

  if (typeof renderBudgetPage === "function") {
    renderBudgetPage();
  }

});
