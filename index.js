
const express = require('express');
const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.GOOGLE_API_KEY;
const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

// Use express.json() middleware to parse request bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.post('/generate-news', async (req, res) => {
    // Check if the expected properties exist in req.body
    if (!req.body || !req.body.preference1 || !req.body.preference2 || !req.body.preference3 || !req.body.location) {
        return res.status(400).json({ error: 'Required fields missing' });
    }
    const { preference1, preference2, preference3, location } = req.body;

    
    // Prepare the API request payload
const promptText = `Please provide me with concise news updates from the last 24 hours in ${location}, covering ${preference1}, ${preference2}, and ${preference3}. Include recent Headlines. Give 3 main points (In Plain Text) for every different genre. Don't Give Any Images or Links. Just Give Text. Use Numbers instead of bullet points`;

const apiRequestPayload = {
    model: "models/chat-bison-001", 
    temperature: 0.5,
    candidateCount: 1,
    prompt: {
        context: "Generate news based on user preferences and location",
        examples: [],
        messages: [{ content: promptText }]
    }
};


    // Log the API request payload
    console.log("Sending API Request to Google's Generative AI service with payload:", apiRequestPayload);

    
    try {
        const result = await client.generateMessage(apiRequestPayload);
        const newsSummary = result[0]?.candidates[0]?.content || 'No news generated.';
        res.json({ newsSummary });
    } catch (error) {
        console.error('Error in making API request to Google Generative AI:', error);
        res.status(500).json({ error: 'Failed to generate news.' });
    }
    

    
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});