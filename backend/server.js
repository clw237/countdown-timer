// Set the timezone to UTC to ensure all time operations use Coordinated Universal Time
process.env.TZ = 'UTC';

// Import required modules
const express = require('express');
const cors = require('cors');

// Create an Express application
const app = express();
const port = 3000;

// Set a fixed deadline to January 1, 2025, at midnight UTC
// Using .getTime() to convert to milliseconds since Unix epoch
const deadline = new Date('2025-01-01T00:00:00Z').getTime();

// Configure CORS options to allow requests only from the Angular development server
const corsOptions = {
    origin: 'http://localhost:4200', // Allow only this origin
    optionsSuccessStatus: 200 // For legacy browser support
};

// Apply CORS middleware with the specified options
app.use(cors(corsOptions));

// Define the API endpoint to get seconds left until the deadline
app.get('/api/deadline', (req, res) => {
    // Get current time in milliseconds
    const currentTime = Date.now();
    
    // Calculate seconds left, ensuring it's not negative
    const secondsLeft = Math.max(0, Math.floor((deadline - currentTime) / 1000));
    
    // Send the response as JSON
    res.json({ secondsLeft: secondsLeft });
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Current UTC time: ${new Date().toISOString()}`);
    console.log(`Deadline is set to: ${new Date(deadline).toISOString()}`);
});
