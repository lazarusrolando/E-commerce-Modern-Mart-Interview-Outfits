const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Chatbot responses endpoint
router.post('/response', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Create a prompt for the AI assistant
    const prompt = `You are a helpful customer support assistant for Modern Mart, an e-commerce store specializing in premium interview outfits including formal shirts, pants, ties, watches, bags, socks, and shoes.

Key information about Modern Mart:
- Free shipping on orders above ₹999 across India
- Delivery typically takes 3-7 business days
- 30-day return policy (items must be in original condition with tags)
- Products range from ₹499 to ₹2999
- Support email: support@modernmart.com
- Support phone: +91 1800-123-4567
- Wide range of premium interview outfits

Customer message: "${message}"

Please provide a helpful, friendly, and concise response as a customer support assistant. Keep responses professional and focused on assisting with their query.`;

    // Generate response using Gemini AI
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ response });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
