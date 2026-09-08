function renderHistory() {

  const box = document.getElementById("historyList");

  if (!box) return;

  const search =
    (document.getElementById("searchNote")?.value || "")
      .toLowerCase()
      .trim();

  const type =
    document.getElementById("filterType")?.value || "all";

  const category =
    document.getElementById("filterCategory")?.value || "all";

  const date =
    document.getElementById("filterDate")?.value || "";

  let filtered = transactions.filter(t => {

    // Search
    const searchText = `
      ${t.category || ""}
      ${t.note || ""}
      ${t.amount || ""}
      ${t.type || ""}
    `.toLowerCase();

    if (search && !searchText.includes(search)) {
      return false;
    }

    // Type filter
    if (type !== "all" && t.type !== type) {
      return false;
    }

    // Category filter
    if (category !== "all" && t.category !== category) {
      return false;
    }

    // Date filter
    if (date && t.date !== date) {
      return false;
    }

    return true;
  });

  filtered.sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );

  if (filtered.length === 0) {

    box.innerHTML = `
      <div class="empty-state">
        <div style="font-size:45px;">🔍</div>
        <h3>No transactions found</h3>
        <p>Try changing your search or filters.</p>
      </div>
    `;

    return;
  }

  box.innerHTML = filtered.map(t => `
    <div class="transaction-item">

      <div>
        <strong>
          ${t.type === "income" ? "💰" : "💸"}
          ${t.category || "Other"}
        </strong>

        <small>
          ${t.date || ""}
          ${t.note ? " • " + t.note : ""}
        </small>
      </div>

      <strong>
        ${t.type === "income" ? "+" : "-"}
        ${fmt(t.amount)}
      </strong>

      <div>
        <button onclick="editTransaction(${t.id})">
          ✏️
        </button>

        <button onclick="deleteTransaction(${t.id})">
          🗑️
        </button>
      </div>

    </div>
  `).join("");
}
