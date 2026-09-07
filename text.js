/* =====================================================
   PART 3 — ADVANCED FEATURES
===================================================== */


/* =====================================================
   SAFE NUMBER HELPER
===================================================== */

function safeNumber(value){

  const number =
    Number(value);

  if(
    Number.isFinite(number)
  ){

    return number;

  }

  return 0;

}


/* =====================================================
   FORMAT DATE
===================================================== */

function formatDate(date){

  if(!date){

    return '';

  }


  const d =
    new Date(date);


  if(
    Number.isNaN(
      d.getTime()
    )
  ){

    return date;

  }


  return d.toLocaleDateString(
    'en-IN',
    {
      day:'2-digit',
      month:'short',
      year:'numeric'
    }
  );

}


/* =====================================================
   TRANSACTION COUNT
===================================================== */

function getTransactionCount(){

  return transactions.length;

}


/* =====================================================
   INCOME COUNT
===================================================== */

function getIncomeCount(){

  return transactions.filter(
    t =>
      t.type === 'income'
  ).length;

}


/* =====================================================
   EXPENSE COUNT
===================================================== */

function getExpenseCount(){

  return transactions.filter(
    t =>
      t.type === 'expense'
  ).length;

}


/* =====================================================
   TODAY TOTAL
===================================================== */

function getTodayIncome(){

  return totalIncome(
    transactions.filter(
      t =>
        isToday(t.date)
    )
  );

}


function getTodayExpense(){

  return totalExpense(
    transactions.filter(
      t =>
        isToday(t.date)
    )
  );

}


/* =====================================================
   MONTH TOTAL
===================================================== */

function getMonthIncome(){

  return totalIncome(
    transactions.filter(
      t =>
        isThisMonth(t.date)
    )
  );

}


function getMonthExpense(){

  return totalExpense(
    transactions.filter(
      t =>
        isThisMonth(t.date)
    )
  );

}


/* =====================================================
   YEAR TOTAL
===================================================== */

function isThisYear(date){

  const d =
    new Date(date);

  const now =
    new Date();


  return (
    d.getFullYear() ===
    now.getFullYear()
  );

}


function getYearIncome(){

  return totalIncome(
    transactions.filter(
      t =>
        isThisYear(t.date)
    )
  );

}


function getYearExpense(){

  return totalExpense(
    transactions.filter(
      t =>
        isThisYear(t.date)
    )
  );

}


/* =====================================================
   BALANCE
===================================================== */

function getBalance(){

  return (
    totalIncome(
      transactions
    )
    -
    totalExpense(
      transactions
    )
  );

}


/* =====================================================
   CATEGORY TOTAL
===================================================== */

function getCategoryTotal(
  category,
  type='expense'
){

  return transactions

    .filter(
      t =>
        t.category === category
        &&
        t.type === type
    )

    .reduce(
      (sum,t)=>
        sum +
        safeNumber(
          t.amount
        ),
      0
    );

}


/* =====================================================
   MONTH CATEGORY TOTAL
===================================================== */

function getMonthCategoryTotal(
  category
){

  return transactions

    .filter(
      t =>
        t.category === category
        &&
        t.type === 'expense'
        &&
        isThisMonth(t.date)
    )

    .reduce(
      (sum,t)=>
        sum +
        safeNumber(
          t.amount
        ),
      0
    );

}


/* =====================================================
   TOP EXPENSE CATEGORY
===================================================== */

function getTopExpenseCategory(){

  const totals = {};


  transactions

    .filter(
      t =>
        t.type === 'expense'
    )

    .forEach(
      t => {

        totals[t.category] =
          (
            totals[t.category]
            || 0
          )
          +
          safeNumber(
            t.amount
          );

      }
    );


  const entries =
    Object.entries(
      totals
    );


  if(
    entries.length === 0
  ){

    return null;

  }


  entries.sort(
    (a,b)=>
      b[1] - a[1]
  );


  return {

    category:
      entries[0][0],

    amount:
      entries[0][1]

  };

}


/* =====================================================
   AVERAGE EXPENSE
===================================================== */

function getAverageExpense(){

  const expenses =
    transactions.filter(
      t =>
        t.type === 'expense'
    );


  if(
    expenses.length === 0
  ){

    return 0;

  }


  return (
    totalExpense(
      expenses
    )
    /
    expenses.length
  );

}


/* =====================================================
   LARGEST EXPENSE
===================================================== */

function getLargestExpense(){

  const expenses =
    transactions.filter(
      t =>
        t.type === 'expense'
    );


  if(
    expenses.length === 0
  ){

    return null;

  }


  return expenses.reduce(
    (largest,current)=>
      safeNumber(
        current.amount
      )
      >
      safeNumber(
        largest.amount
      )
      ?
      current
      :
      largest
  );

}


/* =====================================================
   LARGEST INCOME
===================================================== */

function getLargestIncome(){

  const incomes =
    transactions.filter(
      t =>
        t.type === 'income'
    );


  if(
    incomes.length === 0
  ){

    return null;

  }


  return incomes.reduce(
    (largest,current)=>
      safeNumber(
        current.amount
      )
      >
      safeNumber(
        largest.amount
      )
      ?
      current
      :
      largest
  );

}


/* =====================================================
   TRANSACTION SORT
===================================================== */

function sortTransactions(
  list,
  order='newest'
){

  const copy =
    [...list];


  copy.sort(
    (a,b)=>{

      const dateA =
        new Date(a.date)
          .getTime();

      const dateB =
        new Date(b.date)
          .getTime();


      if(
        order === 'oldest'
      ){

        return dateA - dateB;

      }


      if(
        order === 'amountHigh'
      ){

        return (
          safeNumber(
            b.amount
          )
          -
          safeNumber(
            a.amount
          )
        );

      }


      if(
        order === 'amountLow'
      ){

        return (
          safeNumber(
            a.amount
          )
          -
          safeNumber(
            b.amount
          )
        );

      }


      return dateB - dateA;

    }
  );


  return copy;

}


/* =====================================================
   SEARCH TRANSACTIONS
===================================================== */

function searchTransactions(
  keyword
){

  const text =
    String(
      keyword || ''
    )
    .trim()
    .toLowerCase();


  if(!text){

    return [
      ...transactions
    ];

  }


  return transactions.filter(
    t => {

      const category =
        String(
          t.category || ''
        ).toLowerCase();


      const note =
        String(
          t.note || ''
        ).toLowerCase();


      const date =
        String(
          t.date || ''
        ).toLowerCase();


      const type =
        String(
          t.type || ''
        ).toLowerCase();


      return (
        category.includes(text)
        ||
        note.includes(text)
        ||
        date.includes(text)
        ||
        type.includes(text)
      );

    }
  );

}


/* =====================================================
   DUPLICATE CHECK
===================================================== */

function hasDuplicateTransaction(
  transaction
){

  return transactions.some(
    t => {

      return (

        t.type ===
        transaction.type

        &&

        t.category ===
        transaction.category

        &&

        safeNumber(
          t.amount
        )
        ===
        safeNumber(
          transaction.amount
        )

        &&

        t.date ===
        transaction.date

        &&

        String(
          t.note || ''
        ).trim()
        ===
        String(
          transaction.note || ''
        ).trim()

      );

    }
  );

}


/* =====================================================
   UNIQUE ID
===================================================== */

function createTransactionId(){

  let id =
    Date.now();


  while(
    transactions.some(
      t =>
        t.id === id
    )
  ){

    id++;

  }


  return id;

}


/* =====================================================
   ADD TRANSACTION PROGRAMMATICALLY
===================================================== */

function addTransaction(
  type,
  category,
  amount,
  date,
  note=''
){

  amount =
    safeNumber(
      amount
    );


  if(
    amount <= 0
  ){

    showToast(
      'Amount must be greater than zero'
    );

    return false;

  }


  if(!category){

    showToast(
      'Category is required'
    );

    return false;

  }


  if(!date){

    showToast(
      'Date is required'
    );

    return false;

  }


  const transaction = {

    id:
      createTransactionId(),

    type,

    category,

    amount,

    date,

    note:
      String(
        note || ''
      ).trim()

  };


  transactions.push(
    transaction
  );


  saveTransactions(
    transactions
  );


  renderDashboard();

  renderHistory();


  return true;

}


/* =====================================================
   REMOVE TRANSACTION
===================================================== */

function removeTransactionById(
  id
){

  const index =
    transactions.findIndex(
      t =>
        t.id === id
    );


  if(index === -1){

    return false;

  }


  transactions.splice(
    index,
    1
  );


  saveTransactions(
    transactions
  );


  return true;

}


/* =====================================================
   CLEAR ALL ACTIVE TRANSACTIONS
===================================================== */

function clearAllTransactions(){

  if(
    transactions.length === 0
  ){

    showToast(
      'No transactions to clear'
    );

    return;

  }


  const confirmed =
    confirm(
      'Delete all active transactions?'
    );


  if(!confirmed){

    return;

  }


  const deletionTime =
    new Date().toISOString();


  transactions.forEach(
    t => {

      deletedTransactions.push({

        ...t,

        deletedAt:
          deletionTime

      });

    }
  );


  transactions = [];


  saveTransactions(
    transactions
  );


  saveDeletedTransactions(
    deletedTransactions
  );


  renderDashboard();

  renderHistory();

  renderDeletedHistory();


  showToast(
    'All transactions moved to Deleted History'
  );

}


/* =====================================================
   BACKUP OBJECT
===================================================== */

function createBackupObject(){

  return {

    app:
      'Expense Tracker',

    version:
      '1.0.0',

    createdAt:
      new Date().toISOString(),

    budget:
      loadBudget(),

    transactions:
      transactions,

    deletedTransactions:
      deletedTransactions

  };

}


/* =====================================================
   DOWNLOAD BACKUP
===================================================== */

function downloadBackup(){

  const data =
    createBackupObject();


  const json =
    JSON.stringify(
      data,
      null,
      2
    );


  const blob =
    new Blob(
      [json],
      {
        type:
          'application/json'
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      'a'
    );


  link.href =
    url;


  link.download =
    'expense-tracker-backup-' +
    todayStr +
    '.json';


  document.body.appendChild(
    link
  );


  link.click();


  document.body.removeChild(
    link
  );


  URL.revokeObjectURL(
    url
  );


  showToast(
    'Backup downloaded 📥'
  );

}


/* =====================================================
   CSV EXPORT
===================================================== */

function exportCSV(){

  if(
    transactions.length === 0
  ){

    showToast(
      'No transactions to export'
    );

    return;

  }


  const header = [

    'ID',

    'Type',

    'Category',

    'Amount',

    'Date',

    'Note'

  ];


  const rows =
    transactions.map(
      t => [

        t.id,

        t.type,

        t.category,

        safeNumber(
          t.amount
        ),

        t.date,

        String(
          t.note || ''
        )
        .replace(
          /"/g,
          '""'
        )

      ]
    );


  const csv = [

    header,

    ...rows

  ]

  .map(
    row =>
      row
        .map(
          value =>
            `"${String(
              value ?? ''
            )}"`
        )
        .join(',')
  )

  .join('\n');


  const blob =
    new Blob(
      [csv],
      {
        type:
          'text/csv;charset=utf-8;'
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      'a'
    );


  link.href =
    url;


  link.download =
    'expense-tracker-' +
    todayStr +
    '.csv';


  link.click();


  URL.revokeObjectURL(
    url
  );


  showToast(
    'CSV exported successfully 📊'
  );

}


/* =====================================================
   PRINT REPORT
===================================================== */

function printReport(){

  window.print();

}


/* =====================================================
   MONTH NAME
===================================================== */

function getMonthName(
  monthIndex
){

  const months = [

    'January',

    'February',

    'March',

    'April',

    'May',

    'June',

    'July',

    'August',

    'September',

    'October',

    'November',

    'December'

  ];


  return months[
    monthIndex
  ];

}


/* =====================================================
   CURRENT MONTH NAME
===================================================== */

function getCurrentMonthName(){

  return getMonthName(
    new Date().getMonth()
  );

}


/* =====================================================
   CURRENT YEAR
===================================================== */

function getCurrentYear(){

  return new Date()
    .getFullYear();

}


/* =====================================================
   MONTHLY SUMMARY
===================================================== */

function getMonthlySummary(){

  const income =
    getMonthIncome();


  const expense =
    getMonthExpense();


  return {

    month:
      getCurrentMonthName(),

    year:
      getCurrentYear(),

    income,

    expense,

    balance:
      income - expense

  };

}


/* =====================================================
   YEARLY SUMMARY
===================================================== */

function getYearlySummary(){

  const income =
    getYearIncome();


  const expense =
    getYearExpense();


  return {

    year:
      getCurrentYear(),

    income,

    expense,

    balance:
      income - expense

  };

}


/* =====================================================
   BUDGET PERCENTAGE
===================================================== */

function getBudgetPercentage(){

  const budget =
    loadBudget();


  if(
    budget <= 0
  ){

    return 0;

  }


  const expense =
    getMonthExpense();


  return (
    expense /
    budget
  ) * 100;

}


/* =====================================================
   BUDGET STATUS
===================================================== */

function getBudgetStatus(){

  const budget =
    loadBudget();


  if(
    budget <= 0
  ){

    return 'none';

  }


  const percentage =
    getBudgetPercentage();


  if(
    percentage >= 100
  ){

    return 'over';

  }


  if(
    percentage >= 80
  ){

    return 'warning';

  }


  return 'safe';

}


/* =====================================================
   BUDGET MESSAGE
===================================================== */

function getBudgetMessage(){

  const budget =
    loadBudget();


  if(
    budget <= 0
  ){

    return 'No monthly budget set.';

  }


  const expense =
    getMonthExpense();


  const remaining =
    budget - expense;


  if(
    remaining < 0
  ){

    return (
      'Budget exceeded by ' +
      fmt(
        Math.abs(
          remaining
        )
      )
    );

  }


  if(
    remaining === 0
  ){

    return 'Budget fully used.';

  }


  return (
    fmt(remaining) +
    ' remaining this month.'
  );

}


/* =====================================================
   CATEGORY LIST
===================================================== */

function getAllCategories(){

  return [
    ...new Set(
      transactions
        .map(
          t =>
            t.category
        )
        .filter(Boolean)
    )
  ].sort();

}


/* =====================================================
   INCOME CATEGORY LIST
===================================================== */

function getIncomeCategories(){

  return [
    ...new Set(
      transactions
        .filter(
          t =>
            t.type === 'income'
        )
        .map(
          t =>
            t.category
        )
        .filter(Boolean)
    )
  ].sort();

}


/* =====================================================
   EXPENSE CATEGORY LIST
===================================================== */

function getExpenseCategories(){

  return [
    ...new Set(
      transactions
        .filter(
          t =>
            t.type === 'expense'
        )
        .map(
          t =>
            t.category
        )
        .filter(Boolean)
    )
  ].sort();

}


/* =====================================================
   CATEGORY SUMMARY
===================================================== */

function getCategorySummary(){

  const result = {};


  transactions.forEach(
    t => {

      if(
        !result[t.category]
      ){

        result[t.category] = {

          income:0,

          expense:0,

          count:0

        };

      }


      if(
        t.type === 'income'
      ){

        result[
          t.category
        ].income +=
          safeNumber(
            t.amount
          );

      }


      if(
        t.type === 'expense'
      ){

        result[
          t.category
        ].expense +=
          safeNumber(
            t.amount
          );

      }


      result[
        t.category
      ].count++;

    }
  );


  return result;

}


/* =====================================================
   DATA VALIDATION
===================================================== */

function validateTransactions(){

  let changed = false;


  transactions =
    transactions.filter(
      t => {

        if(
          !t ||
          typeof t !== 'object'
        ){

          changed = true;

          return false;

        }


        if(
          !t.id
        ){

          t.id =
            createTransactionId();

          changed = true;

        }


        if(
          !t.type ||
          (
            t.type !== 'income'
            &&
            t.type !== 'expense'
          )
        ){

          changed = true;

          return false;

        }


        if(
          !t.category
        ){

          changed = true;

          return false;

        }


        t.amount =
          safeNumber(
            t.amount
          );


        if(
          t.amount <= 0
        ){

          changed = true;

          return false;

        }


        if(!t.date){

          changed = true;

          return false;

        }


        if(
          typeof t.note !==
          'string'
        ){

          t.note =
            String(
              t.note || ''
            );

          changed = true;

        }


        return true;

      }
    );


  if(changed){

    saveTransactions(
      transactions
    );

  }


  return changed;

}


/* =====================================================
   APP INITIALIZATION
===================================================== */

validateTransactions();


renderDashboard();

renderHistory();

renderDeletedHistory();

renderBudgetPage();


/* =====================================================
   AUTO REFRESH
===================================================== */

setInterval(
  function(){

    transactions =
      loadTransactions();

    deletedTransactions =
      loadDeletedTransactions();

  },
  3000
);


/* =====================================================
   END PART 3
===================================================== */
