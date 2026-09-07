document
  .getElementById("incomeForm")
  .addEventListener("submit", function(e) {

    e.preventDefault();

    const category =
      document.getElementById("incomeCategory").value;

    const amount =
      Number(
        document.getElementById("incomeAmount").value
      );

    const date =
      document.getElementById("incomeDate").value;

    const note =
      document.getElementById("incomeNote").value.trim();

    if (!category) {
      alert("Please select income source");
      return;
    }

    if (!amount || amount <= 0) {
      alert("Please enter valid income amount");
      return;
    }

    if (!date) {
      alert("Please select date");
      return;
    }

    const income = {

      id: Date.now(),

      type: "income",

      category: category,

      amount: amount,

      date: date,

      note: note,

      createdAt:
        new Date().toISOString()

    };

    transactions.unshift(income);

    saveTransactions();

    document
      .getElementById("incomeForm")
      .reset();

    alert(
      "✅ Income added successfully!"
    );

    renderDashboard();

    renderHistory();

    updateHistoryCategories();

  });
