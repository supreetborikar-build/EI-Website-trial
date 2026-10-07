const express = require('express');
const router = express.Router();
const db = require('../db/database');

// POST /api/contact - Submit a contact message
router.post('/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.'
      });
    }

    const insert = db.prepare(`
      INSERT INTO contact_inquiries (full_name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `);

    const result = insert.run(
      name.trim(),
      email.trim().toLowerCase(),
      (subject || 'General Inquiry').trim(),
      message.trim()
    );

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received. Our team will get back to you shortly.',
      inquiryId: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ success: false, error: 'Failed to send message. Please try again later.' });
  }
});

// POST /api/contact/newsletter - Subscribe to newsletter
router.post('/newsletter', (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email address is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM newsletter_subscribers WHERE email = ?').get(cleanEmail);

    if (existing) {
      return res.json({
        success: true,
        message: "You're already subscribed to our newsletter! Stay tuned for updates."
      });
    }

    db.prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)').run(cleanEmail);

    res.status(201).json({
      success: true,
      message: 'Subscribed successfully! Welcome to the Engineering India community.'
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({ success: false, error: 'Subscription failed. Please try again.' });
  }
});

module.exports = router;
