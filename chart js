<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
let expenseCategoryChart = null;
let incomeExpenseChart = null;
let monthlyExpenseChart = null;


/* ==============================
   REPORT DATA
============================== */

function renderExpenseReports(){

    const income =
        transactions
        .filter(t => t.type === "income")
        .reduce(
            (sum,t) =>
                sum + Number(t.amount),
            0
        );


    const expense =
        transactions
        .filter(t => t.type === "expense")
        .reduce(
            (sum,t) =>
                sum + Number(t.amount),
            0
        );


    const balance =
        income - expense;


    document.getElementById(
        "reportTotalIncome"
    ).textContent =
        money(income);


    document.getElementById(
        "reportTotalExpense"
    ).textContent =
        money(expense);


    document.getElementById(
        "reportBalance"
    ).textContent =
        money(balance);


    createCategoryChart();

    createIncomeExpenseChart();

    createMonthlyExpenseChart();

}


/* ==============================
   CATEGORY PIE CHART
============================== */

function createCategoryChart(){

    const totals = {};


    transactions
    .filter(
        t =>
            t.type === "expense"
    )
    .forEach(
        t => {

            if(
                !totals[t.category]
            ){

                totals[t.category] = 0;

            }


            totals[t.category] +=
                Number(t.amount);

        }
    );


    const labels =
        Object.keys(totals);


    const values =
        Object.values(totals);


    const canvas =
        document.getElementById(
            "expenseCategoryChart"
        );


    if(
        expenseCategoryChart
    ){

        expenseCategoryChart.destroy();

    }


    expenseCategoryChart =
        new Chart(
            canvas,
            {

                type:
                    "pie",

                data:{

                    labels:labels,

                    datasets:[{

                        label:
                            "Expenses",

                        data:
                            values

                    }]

                },

                options:{

                    responsive:true,

                    plugins:{

                        legend:{

                            position:
                                "bottom"

                        }

                    }

                }

            }
        );

}


/* ==============================
   INCOME VS EXPENSE
============================== */

function createIncomeExpenseChart(){

    const income =
        transactions
        .filter(
            t =>
                t.type === "income"
        )
        .reduce(
            (sum,t) =>
                sum + Number(t.amount),
            0
        );


    const expense =
        transactions
        .filter(
            t =>
                t.type === "expense"
        )
        .reduce(
            (sum,t) =>
                sum + Number(t.amount),
            0
        );


    const canvas =
        document.getElementById(
            "incomeExpenseChart"
        );


    if(
        incomeExpenseChart
    ){

        incomeExpenseChart.destroy();

    }


    incomeExpenseChart =
        new Chart(
            canvas,
            {

                type:
                    "bar",

                data:{

                    labels:[
                        "Income",
                        "Expense"
                    ],

                    datasets:[{

                        label:
                            "Amount",

                        data:[
                            income,
                            expense
                        ]

                    }]

                },

                options:{

                    responsive:true,

                    scales:{

                        y:{

                            beginAtZero:true

                        }

                    }

                }

            }
        );

}


/* ==============================
   MONTHLY EXPENSE LINE CHART
============================== */

function createMonthlyExpenseChart(){

    const monthly = {};


    transactions
    .filter(
        t =>
            t.type === "expense"
    )
    .forEach(
        t => {

            const date =
                new Date(t.date);


            const key =
                date.getFullYear()
                + "-"
                +
                String(
                    date.getMonth()+1
                )
                .padStart(2,"0");


            if(
                !monthly[key]
            ){

                monthly[key] = 0;

            }


            monthly[key] +=
                Number(t.amount);

        }
    );


    const labels =
        Object.keys(monthly)
        .sort();


    const values =
        labels.map(
            key =>
                monthly[key]
        );


    const canvas =
        document.getElementById(
            "monthlyExpenseChart"
        );


    if(
        monthlyExpenseChart
    ){

        monthlyExpenseChart.destroy();

    }


    monthlyExpenseChart =
        new Chart(
            canvas,
            {

                type:
                    "line",

                data:{

                    labels:labels,

                    datasets:[{

                        label:
                            "Monthly Expense",

                        data:values,

                        tension:
                            0.3,

                        fill:false

                    }]

                },

                options:{

                    responsive:true,

                    scales:{

                        y:{

                            beginAtZero:true

                        }

                    }

                }

            }
        );

}


/* ==============================
   REPORT PAGE OPEN
============================== */

function openReports(){

    renderExpenseReports();

}
