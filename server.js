const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "expense_tracker_secret";

// =========================
// MYSQL CONNECTION
// =========================

const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "expense_tracker",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ MySQL connection failed:", err.message);
    } else {
        console.log("✅ MySQL connected successfully");
        connection.release();
    }
});

// =========================
// TEST API
// =========================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Expense Tracker API is running 🚀"
    });
});

// =========================
// AUTH MIDDLEWARE
// =========================

function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Login required"
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {

        if (err) {
            return res.status(403).json({
                success: false,
                message: "Token expired or invalid"
            });
        }

        req.user = user;
        next();
    });
}

// =========================
// REGISTER STUDENT
// =========================

app.post("/api/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters"
            });
        }

        const [existing] = await db.promise().query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.promise().query(
            `INSERT INTO users (name, email, password)
             VALUES (?, ?, ?)`,
            [name, email, hashedPassword]
        );

        res.status(201).json({
            success: true,
            message: "Student registered successfully",
            userId: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
});

// =========================
// LOGIN STUDENT
// =========================

app.post("/api/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const [users] = await db.promise().query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email
            },
            JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
});

// =========================
// GET LOGGED-IN STUDENT
// =========================

app.get("/api/profile", authenticateToken, async (req, res) => {

    try {

        const [users] = await db.promise().query(
            "SELECT id, name, email FROM users WHERE id = ?",
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            user: users[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Could not load profile"
        });
    }
});

// =========================
// ADD TRANSACTION
// =========================

app.post("/api/transactions", authenticateToken, async (req, res) => {

    try {

        const {
            type,
            category,
            amount,
            date,
            note
        } = req.body;

        if (!["income", "expense"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction type"
            });
        }

        if (!category || !amount || !date) {
            return res.status(400).json({
                success: false,
                message: "Category, amount and date are required"
            });
        }

        const [result] = await db.promise().query(
            `INSERT INTO transactions
             (user_id, type, category, amount, date, note)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                req.user.id,
                type,
                category,
                Number(amount),
                date,
                note || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Transaction added successfully",
            id: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Could not add transaction"
        });
    }
});

// =========================
// GET ALL TRANSACTIONS
// =========================

app.get("/api/transactions", authenticateToken, async (req, res) => {

    try {

        const [rows] = await db.promise().query(
            `SELECT
                id,
                type,
                category,
                amount,
                DATE_FORMAT(date, '%Y-%m-%d') AS date,
                note
             FROM transactions
             WHERE user_id = ?
             ORDER BY id DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            transactions: rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Could not load transactions"
        });
    }
});

// =========================
// UPDATE TRANSACTION
// =========================

app.put("/api/transactions/:id", authenticateToken, async (req, res) => {

    try {

        const { id } = req.params;

        const {
            type,
            category,
            amount,
            date,
            note
        } = req.body;

        const [result] = await db.promise().query(
            `UPDATE transactions
             SET type = ?,
                 category = ?,
                 amount = ?,
                 date = ?,
                 note = ?
             WHERE id = ?
             AND user_id = ?`,
            [
                type,
                category,
                Number(amount),
                date,
                note || null,
                id,
                req.user.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        res.json({
            success: true,
            message: "Transaction updated successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Could not update transaction"
        });
    }
});

// =========================
// DELETE TRANSACTION
// =========================

app.delete("/api/transactions/:id", authenticateToken, async (req, res) => {

    try {

        const { id } = req.params;

        const [result] = await db.promise().query(
            `DELETE FROM transactions
             WHERE id = ?
             AND user_id = ?`,
            [id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        res.json({
            success: true,
            message: "Transaction deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Could not delete transaction"
        });
    }
});

// =========================
// DASHBOARD
// =========================

app.get("/api/dashboard", authenticateToken, async (req, res) => {

    try {

        const [incomeResult] = await db.promise().query(
            `SELECT COALESCE(SUM(amount), 0) AS totalIncome
             FROM transactions
             WHERE user_id = ?
             AND type = 'income'`,
            [req.user.id]
        );

        const [expenseResult] = await db.promise().query(
            `SELECT COALESCE(SUM(amount), 0) AS totalExpense
             FROM transactions
             WHERE user_id = ?
             AND type = 'expense'`,
            [req.user.id]
        );

        const totalIncome = Number(incomeResult[0].totalIncome);
        const totalExpense = Number(expenseResult[0].totalExpense);

        res.json({
            success: true,
            dashboard: {
                totalIncome,
                totalExpense,
                remainingBalance: totalIncome - totalExpense
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Could not load dashboard"
        });
    }
});

// =========================
// SAVE BUDGET
// =========================

app.post("/api/budget", authenticateToken, async (req, res) => {

    try {

        const { amount, month } = req.body;

        if (!amount || !month) {
            return res.status(400).json({
                success: false,
                message: "Budget amount and month are required"
            });
        }

        const [existing] = await db.promise().query(
            `SELECT id FROM budgets
             WHERE user_id = ?
             AND month = ?`,
            [req.user.id, month]
        );

        if (existing.length > 0) {

            await db.promise().query(
                `UPDATE budgets
                 SET amount = ?
                 WHERE id = ?
                 AND user_id = ?`,
                [Number(amount), existing[0].id, req.user.id]
            );

        } else {

            await db.promise().query(
                `INSERT INTO budgets
                 (user_id, amount, month)
                 VALUES (?, ?, ?)`,
                [req.user.id, Number(amount), month]
            );
        }

        res.json({
            success: true,
            message: "Budget saved successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Could not save budget"
        });
    }
});

// =========================
// GET BUDGET
// =========================

app.get("/api/budget/:month", authenticateToken, async (req, res) => {

    try {

        const { month } = req.params;

        const [rows] = await db.promise().query(
            `SELECT amount, month
             FROM budgets
             WHERE user_id = ?
             AND month = ?`,
            [req.user.id, month]
        );

        res.json({
            success: true,
            budget: rows.length ? rows[0] : null
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Could not load budget"
        });
    }
});

// =========================
// START SERVER
// =========================

app.listen(PORT, () => {

    console.log("");
    console.log("================================");
    console.log("💰 Expense Tracker Server");
    console.log("================================");
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 http://localhost:${PORT}`);
    console.log("================================");
});

".env"

PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=expense_tracker

JWT_SECRET=my_expense_tracker_secret_2026

Server ચલાવવા

cd backend
node server.js

જો બધું બરાબર હોય તો:

MySQL connected successfully
Server running on port 3000

મહત્વનું: તમારી હાલની HTML ફાઇલ "localStorage"માં transaction રાખે છે; એટલે MySQL સાથે ખરેખર data save કરવા માટે frontendના "loadTransactions()" / "saveTransactions()" ભાગને API calls સાથે બદલવો પડશે.

આગળનું જરૂરી ભાગ "index.html" માં Student Login + Register page અને ઉપરના API સાથેનું સંપૂર્ણ connection code છે.
