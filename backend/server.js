// Set the timezone to UTC to ensure all time operations use Coordinated Universal Time
process.env.TZ = 'UTC';

// Import required modules
const express = require('express');
const cors = require('cors');

// Create an Express application
const app = express();
const port = process.env.PORT || 3000;

// Optional fixed deadline, e.g. DEADLINE=2027-06-01T00:00:00Z
const fixedDeadline = process.env.DEADLINE ? new Date(process.env.DEADLINE) : null;
if (fixedDeadline && isNaN(fixedDeadline.getTime())) {
    console.error(`Invalid DEADLINE value: "${process.env.DEADLINE}". Use an ISO 8601 date, e.g. 2027-01-01T00:00:00Z`);
    process.exit(1);
}

/**
 * Returns the deadline as a Date. If DEADLINE is set, it is used as-is;
 * otherwise the deadline is the next New Year's Day at midnight UTC,
 * so the countdown never goes stale.
 */
function getDeadline(now = new Date()) {
    if (fixedDeadline) return fixedDeadline;
    return new Date(Date.UTC(now.getUTCFullYear() + 1, 0, 1));
}

// Configure CORS options to allow requests only from the Angular development server
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    optionsSuccessStatus: 200 // For legacy browser support
};

// Apply CORS middleware with the specified options
app.use(cors(corsOptions));

// Define the API endpoint to get seconds left until the deadline
app.get('/api/deadline', (req, res) => {
    const now = new Date();
    const deadline = getDeadline(now);

    // Calculate seconds left, ensuring it's not negative
    const secondsLeft = Math.max(0, Math.floor((deadline.getTime() - now.getTime()) / 1000));

    res.json({ secondsLeft, deadline: deadline.toISOString() });
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Current UTC time: ${new Date().toISOString()}`);
    console.log(`Deadline is set to: ${getDeadline().toISOString()}${fixedDeadline ? ' (from DEADLINE)' : ' (next New Year)'}`);
});
