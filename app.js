/* =====================================
   EXPENSE PRO - DASHBOARD
   FEATURE 1/14
===================================== */


/* -------------------------------------
   GET TRANSACTIONS FROM LOCAL STORAGE
------------------------------------- */

function getTransactions() {

    const data =
        localStorage.getItem("expenseProTransactions");

    if (!data) {
        return [];
    }

    try {
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}


/* -------------------------------------
   SAVE TRANSACTIONS
------------------------------------- */

function saveTransactions(transactions) {

    localStorage.setItem(
        "expenseProTransactions",
        JSON.stringify(transactions)
    );

}


/* -------------------------------------
   CALCULATE DASHBOARD
------------------------------------- */

function calculateDashboard() {

    const transactions = getTransactions();

    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {

        const amount =
            Number(transaction.amount) || 0;

        if (transaction.type === "income") {

            income += amount;

        }

        if (transaction.type === "expense") {

            expense += amount;

        }

    });


    const balance = income - expense;


    /* Dashboard cards */

    document.getElementById("totalIncome")
        .textContent =
        formatMoney(income);


    document.getElementById("totalExpense")
        .textContent =
        formatMoney(expense);


    document.getElementById("balance")
        .textContent =
        formatMoney(balance);


    document.getElementById("transactionCount")
        .textContent =
        transactions.length;


    /* Summary */

    document.getElementById("summaryIncome")
        .textContent =
        formatMoney(income);


    document.getElementById("summaryExpense")
        .textContent =
        formatMoney(expense);


    document.getElementById("summaryBalance")
        .textContent =
        formatMoney(balance);


    displayRecentTransactions(transactions);

}


/* -------------------------------------
   MONEY FORMAT
------------------------------------- */

function formatMoney(amount) {

    return "₹" +
        Number(amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

}


/* -------------------------------------
   RECENT TRANSACTIONS
------------------------------------- */

function displayRecentTransactions(transactions) {

    const container =
        document.getElementById(
            "recentTransactions"
        );


    if (!transactions.length) {

        container.innerHTML = `
            <div class="empty">
                No transactions found.
            </div>
        `;

        return;
    }


    const recent =
        [...transactions]
        .reverse()
        .slice(0, 5);


    container.innerHTML =
        recent.map(transaction => {

            const type =
                transaction.type === "income"
                    ? "income"
                    : "expense";


            const sign =
                type === "income"
                    ? "+"
                    : "-";


            return `

                <div class="transaction">

                    <div>

                        <div class="transaction-title">
                            ${escapeHTML(
                                transaction.title ||
                                transaction.category ||
                                "Transaction"
                            )}
                        </div>

                        <div class="transaction-date">
                            ${transaction.date || ""}
                        </div>

                    </div>


                    <strong class="${type}">

                        ${sign}
                        ${formatMoney(
                            transaction.amount
                        )}

                    </strong>

                </div>

            `;

        }).join("");

}


/* -------------------------------------
   ADD INCOME
------------------------------------- */

function addIncome() {

    const title =
        prompt("Enter income source:");

    if (!title) {
        return;
    }


    const amount =
        prompt("Enter income amount:");

    if (!amount || Number(amount) <= 0) {

        alert("Please enter a valid amount.");

        return;
    }


    const transactions =
        getTransactions();


    transactions.push({

        id: Date.now(),

        type: "income",

        title: title,

        amount: Number(amount),

        date: new Date()
            .toLocaleDateString("en-IN")

    });


    saveTransactions(transactions);

    calculateDashboard();


    alert("Income added successfully!");

}


/* -------------------------------------
   ADD EXPENSE
------------------------------------- */

function addExpense() {

    const title =
        prompt("Enter expense name:");

    if (!title) {
        return;
    }


    const amount =
        prompt("Enter expense amount:");

    if (!amount || Number(amount) <= 0) {

        alert("Please enter a valid amount.");

        return;
    }


    const transactions =
        getTransactions();


    transactions.push({

        id: Date.now(),

        type: "expense",

        title: title,

        amount: Number(amount),

        date: new Date()
            .toLocaleDateString("en-IN")

    });


    saveTransactions(transactions);

    calculateDashboard();


    alert("Expense added successfully!");

}


/* -------------------------------------
   TRANSACTIONS BUTTON
------------------------------------- */

function showTransactions() {

    alert(
        "Transactions feature will be connected in Feature 5/14."
    );

}


/* -------------------------------------
   DARK / LIGHT MODE
------------------------------------- */

const themeBtn =
    document.getElementById("themeBtn");


function loadTheme() {

    const theme =
        localStorage.getItem(
            "expenseProTheme"
        );


    if (theme === "dark") {

        document.body.classList.add("dark");

        themeBtn.textContent =
            "☀️ Light Mode";

    }

}


themeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.toggle("dark");


        const dark =
            document.body.classList.contains("dark");


        if (dark) {

            localStorage.setItem(
                "expenseProTheme",
                "dark"
            );

            themeBtn.textContent =
                "☀️ Light Mode";

        } else {

            localStorage.setItem(
                "expenseProTheme",
                "light"
            );

            themeBtn.textContent =
                "🌙 Dark Mode";

        }

    }
);


/* -------------------------------------
   SECURITY / HTML ESCAPE
------------------------------------- */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* -------------------------------------
   START DASHBOARD
------------------------------------- */

loadTheme();

calculateDashboard();
