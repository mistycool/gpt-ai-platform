// Import required modules
const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Middleware to handle CORS
require('dotenv').config(); // Load environment variables from .env file

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for all routes (allows frontend to communicate with backend)

// Hugging Face API Configuration
const HF_API_TOKEN = process.env.HUGGING_FACE_API_TOKEN; // API token from environment variables
const HF_API_URL = "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5"; // Model endpoint

// Text-to-Image Endpoint
app.post('/text-to-image', async (req, res) => {
    try {
        // Extract the 'prompt' from the request body
        const { prompt } = req.body;

        // Validate that a prompt is provided
        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).send({ error: "Please provide a valid text prompt." });
        }

        // Call the Hugging Face API to generate an image
        const response = await axios.post(
            HF_API_URL,
            { inputs: prompt }, // Send the prompt as input
            {
                headers: {
                    Authorization: `Bearer ${HF_API_TOKEN}`, // Add the API token for authentication
                },
                responseType: 'arraybuffer', // Expect binary data (image)
            }
        );

        // Set the response content type to image/png and send the image data
        res.set('Content-Type', 'image/png');
        res.send(response.data);
    } catch (error) {
        // Handle errors gracefully
        console.error("Error generating image:", error.message);

        // Check if the error is due to an invalid response from Hugging Face
        if (error.response && error.response.status === 400) {
            return res.status(400).send({ error: "Invalid request. Please check your input." });
        }

        // For other errors, return a generic server error
        res.status(500).send({ error: "An error occurred while processing your request." });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});
