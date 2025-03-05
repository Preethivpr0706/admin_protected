// app.js
const express = require('express');
const cors = require('cors');
const pocRoutes = require('./routes/pocRoutes');
const authMiddleware = require('./routes/authMiddleware');
const app = express();

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} request made to: ${req.url}`);
    next(); // Pass to the next middleware/route handler
});

// Unprotected routes

const { matchLoginCredentials } = require('./controllers/pocController');
app.post('/api/poc-login', matchLoginCredentials);
app.post('/api/clients', (req, res) => {
    // Call the getClients function without authentication
    const clients = require('./controllers/pocController').getClients;
    clients(req, res);
});

app.use('/api', authMiddleware, pocRoutes);

// Handle root route
app.get('/', (req, res) => {
    res.send('Welcome to the Express server!');
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});