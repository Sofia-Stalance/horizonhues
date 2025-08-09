const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Connect to SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS scores (
            email TEXT PRIMARY KEY,
            score INTEGER
        )`, (createErr) => {
            if (createErr) {
                console.error('Error creating table:', createErr.message);
            } else {
                console.log('Table "scores" ready.');
            }
        });
    }
});

// Endpoint to submit scores
app.post('/submit-score', (req, res) => {
    const { email, score } = req.body;
    if (!email || typeof score !== 'number') {
        return res.status(400).json({ error: 'Invalid data' });
    }

    const sql = `INSERT INTO scores (email, score) VALUES (?, ?) ON CONFLICT(email) DO UPDATE SET score = excluded.score`;
    db.run(sql, [email, score], function(err) {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Failed to save score' });
        }
        res.json({ message: 'Score saved successfully!', email, score });
    });
});

// Endpoint to view all scores
app.get('/scores', (req, res) => {
    const sql = `SELECT * FROM scores ORDER BY score DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Failed to retrieve scores' });
        }
        res.json(rows);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});