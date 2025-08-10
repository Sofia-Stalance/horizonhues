// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Pool } = require('pg'); // Import the PostgreSQL client library

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Create a connection pool to the PostgreSQL database using the environment variable
// The DATABASE_URL environment variable will be set on Render
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        // This is necessary for Render's managed PostgreSQL service
        rejectUnauthorized: false
    }
});

// Check the database connection and create the table if it doesn't exist
// This is the first thing your server will do on startup
pool.connect()
    .then(client => {
        console.log('Connected to PostgreSQL database.');
        return client.query(`
            CREATE TABLE IF NOT EXISTS scores (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                score INTEGER NOT NULL,
                timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `).then(() => {
            // Release the client back to the pool
            client.release();
            console.log('Scores table is ready.');

            // --- Define API Endpoints first to avoid conflicts with static files ---
            
            // Endpoint to submit a score.
            app.post('/submit-score', (req, res) => {
                const { email, score } = req.body;

                if (!email || typeof score === 'undefined') {
                    return res.status(400).send({ error: 'Email and score are required.' });
                }
                
                const query = 'INSERT INTO scores (email, score) VALUES ($1, $2) RETURNING *';
                pool.query(query, [email, score])
                    .then(result => {
                        console.log(`A new score has been inserted for ${email} with id ${result.rows[0].id}`);
                        res.status(200).send({ message: 'Score saved successfully!', id: result.rows[0].id });
                    })
                    .catch(err => {
                        console.error('Error inserting score:', err.message);
                        res.status(500).send({ error: 'Failed to save score.' });
                    });
            });

            // Endpoint to view all scores.
            app.get('/scores', (req, res) => {
                pool.query("SELECT email, score, timestamp FROM scores ORDER BY timestamp DESC")
                    .then(result => {
                        res.status(200).json(result.rows);
                    })
                    .catch(err => {
                        console.error('Error retrieving scores:', err.message);
                        res.status(500).send({ error: 'Failed to retrieve scores.' });
                    });
            });

            // --- Serve static files from the 'public' directory (Defined last) ---
            app.use(express.static(path.join(__dirname, 'public')));

            // Start the server only after the database is confirmed ready
            app.listen(port, () => {
                console.log(`Server running at http://localhost:${port}`);
            });

        }).catch(err => {
            // If the table creation fails, release the client and log the error
            client.release();
            console.error('Error creating scores table:', err.message);
        });
    })
    .catch(err => {
        console.error('Error connecting to the database pool:', err.message);
    });

// Handle graceful shutdown by closing the database connection pool
process.on('SIGINT', () => {
    pool.end(() => {
        console.log('Database pool closed.');
        process.exit(0);
    });
});
