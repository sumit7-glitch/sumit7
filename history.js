<script>

/* =====================================================
   DASHBOARD
===================================================== */

function renderDashboard(){

  let income = 0;
  let expense = 0;

  transactions.forEach(tx => {

    if(tx.type === 'income'){
      income += Number(tx.amount);
    }

    if(tx.type === 'expense'){
      expense += Number(tx.amount);
    }

  });


  const balance =
    income - expense;


  document.getElementById(
    'dashIncome'
  ).textContent =
    formatMoney(income);


  document.getElementById(
    'dashExpense'
  ).textContent =
    formatMoney(expense);


  document.getElementById(
    'dashBalance'
  ).textContent =
    formatMoney(balance);


  /* This month's expense */

  const now =
    new Date();

  const currentMonth =
    now.getMonth();

  const currentYear =
    now.getFullYear();


  let monthExpense = 0;


  transactions.forEach(tx => {

    if(tx.type !== 'expense')
      return;

    const d =
      new Date(
        tx.date + 'T00:00:00'
      );

    if(
      d.getMonth() === currentMonth &&
      d.getFullYear() === currentYear
    ){

      monthExpense +=
        Number(tx.amount);

    }

  });


  document.getElementById(
    'dashMonthExpense'
  ).textContent =
    formatMoney(monthExpense);


  /* Recent transactions */

  const recentBox =
    document.getElementById(
      'recentTx'
    );


  const recent =
    transactions
      .slice()
      .sort(
        (a,b) =>
          new Date(b.date) -
          new Date(a.date)
      )
      .slice(0,5);


  if(recent.length === 0){

    recentBox.innerHTML = `
      <div class="empty-state">

        <span class="emoji">
          💸
        </span>

        No transactions yet.

      </div>
    `;

  }else{

    recentBox.innerHTML =
      recent.map(
        tx => transactionHTML(tx)
      ).join('');

  }


  renderDashboardBudget(
    monthExpense
  );

}


/* =====================================================
   DASHBOARD BUDGET
===================================================== */

function renderDashboardBudget(
  monthExpense
){

  const box =
    document.getElementById(
      'dashBudgetInfo'
    );


  if(!budget){

    box.innerHTML = `
      <p
        style="
          color:var(--muted);
          font-size:.9rem;
        ">

        No budget set yet.
        Go to the Budget tab to set one.

      </p>
    `;

    return;

  }


  const percentage =
    Math.min(
      (monthExpense / budget) * 100,
      100
    );


  let barClass = '';

  if(
    monthExpense >= budget
  ){

    barClass = 'over';

  }else if(
    monthExpense >= budget * .8
  ){

    barClass = 'warn';

  }


  box.innerHTML = `

    <div
      style="
        display:flex;
        justify-content:space-between;
        font-size:.9rem;
        font-weight:600;
      ">

      <span>
        Monthly Budget
      </span>

      <span>
        ${formatMoney(budget)}
      </span>

    </div>


    <div class="budget-bar-wrap">

      <div
        class="budget-bar ${barClass}"
        style="
          width:${percentage}%;
        ">

      </div>

    </div>


    <div class="budget-text">

      <span>
        Spent:
        ${formatMoney(monthExpense)}
      </span>

      <span>
        ${
          monthExpense > budget
            ? 'Over Budget'
            : formatMoney(
                budget - monthExpense
              ) + ' left'
        }
      </span>

    </div>

  `;

}


/* =====================================================
   TRANSACTION HTML
===================================================== */

function transactionHTML(tx){

  return `

    <div class="tx-item">

      <div class="tx-left">

        <div class="tx-icon">

          ${getCategoryEmoji(
            tx.category
          )}

        </div>


        <div class="tx-info">

          <div class="tx-cat">

            ${escapeHTML(
              tx.category
            )}

          </div>

          <div class="tx-date">

            ${formatDate(
              tx.date
            )}

          </div>

          ${
            tx.note
              ? `
                <div class="tx-note">
                  ${escapeHTML(
                    tx.note
                  )}
                </div>
              `
              : ''
          }

        </div>

      </div>


      <div class="tx-right">

        <div
          class="tx-amount ${
            tx.type === 'income'
              ? 'income'
              : 'expense'
          }">

          ${
            tx.type === 'income'
              ? '+'
              : '-'
          }

          ${formatMoney(
            tx.amount
          )}

        </div>


        <div class="tx-actions">

          <button
            title="Edit"
            onclick="
              editTransaction(
                ${tx.id}
              )
            ">

            ✏️

          </button>


          <button
            title="Delete"
            onclick="
              deleteTransaction(
                ${tx.id}
              )
            ">

            🗑️

          </button>

        </div>

      </div>

    </div>

  `;

}


/* =====================================================
   INCOME HISTORY
===================================================== */

function openIncomeHistory(){

  document
    .querySelectorAll('.tab-btn')
    .forEach(btn => {

      btn.classList.remove(
        'active'
      );

    });


  document
    .querySelectorAll('.page')
    .forEach(page => {

      page.classList.remove(
        'active'
      );

    });


  const historyButton =
    document.querySelector(
      '[data-page="history"]'
    );


  historyButton.classList.add(
    'active'
  );


  document
    .getElementById('history')
    .classList.add('active');


  const type =
    document.getElementById(
      'historyType'
    );


  type.value =
    'income';


  renderHistory();

}


/* =====================================================
   REPORTS
===================================================== */

let expenseChart = null;
let incomeExpenseChart = null;


function renderReports(){

  const categoryTotals = {};


  transactions.forEach(tx => {

    if(
      tx.type !== 'expense'
    )
      return;


    if(
      !categoryTotals[
        tx.category
      ]
    ){

      categoryTotals[
        tx.category
      ] = 0;

    }


    categoryTotals[
      tx.category
    ] += Number(tx.amount);

  });


  const labels =
    Object.keys(
      categoryTotals
    );


  const values =
    Object.values(
      categoryTotals
    );


  const expenseCanvas =
    document.getElementById(
      'expenseChart'
    );


  if(expenseChart){

    expenseChart.destroy();

  }


  expenseChart =
    new Chart(
      expenseCanvas,
      {
        type:'doughnut',

        data:{
          labels:labels,

          datasets:[{
            data:values
          }]
        },

        options:{
          responsive:true,
          maintainAspectRatio:false
        }

      }
    );


  let income = 0;
  let expense = 0;


  transactions.forEach(tx => {

    if(tx.type === 'income'){

      income +=
        Number(tx.amount);

    }else{

      expense +=
        Number(tx.amount);

    }

  });


  const incomeExpenseCanvas =
    document.getElementById(
      'incomeExpenseChart'
    );


  if(
    incomeExpenseChart
  ){

    incomeExpenseChart.destroy();

  }


 
