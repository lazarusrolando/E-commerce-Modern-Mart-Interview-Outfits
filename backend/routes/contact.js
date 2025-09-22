const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure your SMTP transporter here
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com', // Replace with your SMTP host
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@example.com', // Replace with your SMTP username
    pass: 'your-email-password' // Replace with your SMTP password
  }
});

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please provide name, email, and message.' });
  }

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: 'support@modernmart.com', // Replace with your support email
    subject: `Contact Form Submission from ${name}`,
    text: message,
    html: `<p>${message}</p><p>From: ${name} (${email})</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

module.exports = router;
