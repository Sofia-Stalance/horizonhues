// server.js
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Use body-parser middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Explicitly serve the index.html file for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Explicitly serve the scores.html file for the /scores path
app.get('/scores.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'scores.html'));
});

// Connect to the SQLite database. It will create the file if it doesn't exist.
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the database.');
    
    // Create the scores table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        score INTEGER NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating scores table:', err.message);
        } else {
            console.log('Scores table is ready.');

            // --- Server Endpoints ---
            
            // Endpoint to submit scores.
            app.post('/submit-score', (req, res) => {
                const { email, score } = req.body;

                if (!email || typeof score === 'undefined') {
                    return res.status(400).send({ error: 'Email and score are required.' });
                }

                db.run(`INSERT INTO scores (email, score) VALUES (?, ?)`, [email, score], function(err) {
                    if (err) {
                        console.error('Error inserting score:', err.message);
                        return res.status(500).send({ error: 'Failed to save score.' });
                    }
                    console.log(`A row has been inserted with rowid ${this.lastID}`);
                    res.status(200).send({ message: 'Score saved successfully!', id: this.lastID });
                });
            });

            // Endpoint to view all scores.
            app.get('/scores', (req, res) => {
                db.all("SELECT email, score, timestamp FROM scores ORDER BY timestamp DESC", [], (err, rows) => {
                    if (err) {
                        console.error('Error retrieving scores:', err.message);
                        return res.status(500).send({ error: 'Failed to retrieve scores.' });
                    }
                    res.status(200).json(rows);
                });
            });

            // Start the server only after the database is ready
            app.listen(port, () => {
                console.log(`Server running at http://localhost:${port}`);
            });
        }
    });
});

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        }
        console.log('Database connection closed.');
        process.exit(0);
    });
});
