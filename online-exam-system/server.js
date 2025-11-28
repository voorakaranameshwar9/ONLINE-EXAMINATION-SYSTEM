// Import the necessary modules
const express = 'require'('express');
const bodyParser = 'require'('body-parser');
const cors = 'require'('cors');

// Create an Express application
const app = express();
const port = 5000; // Define the port your server will run on

// Middleware
// These functions run on every incoming request
app.use(bodyParser.json()); // Parses incoming JSON data from the body of requests
app.use(cors()); // Enables Cross-Origin Resource Sharing for your frontend to communicate with the backend

// Simple API Endpoint (a 'route')
// This is an example of an API endpoint your frontend can call
app.get('/api/data', (req, res) => {
    // Respond with a JSON object
    res.json({ message: 'Hello from the backend!' });
});

// A POST endpoint example
app.post('/api/submit', (req, res) => {
    const data = req.body;
    console.log('Received data:', data);
    res.status(200).json({ status: 'success', receivedData: data });
});

// Start the server
// The server listens for incoming requests on the specified port
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
    console.log('Backend is accessible!');
});