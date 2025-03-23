const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import CORS
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Hugging Face API details
const HF_API_TOKEN = process.env.HUGGING_FACE_API_TOKEN;

// Text-to-Image Endpoint
app.post('/text-to-image', async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
            { inputs: prompt },
            {
                headers: { Authorization: `Bearer ${HF_API_TOKEN}` },
                responseType: 'arraybuffer'
            }
        );
        res.set('Content-Type', 'image/png');
        res.send(response.data);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
