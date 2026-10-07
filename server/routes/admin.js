const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/admin/inquiries - List contact inquiries
router.get('/inquiries', (req, res) => {
  try {
    const inquiries = db.prepare('SELECT * FROM contact_inquiries ORDER BY created_at DESC').all();
    res.json({ success: true, data: inquiries });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch inquiries' });
  }
});

// PATCH /api/admin/inquiries/:id/status - Update inquiry status (read/unread/resolved)
router.patch('/inquiries/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    db.prepare('UPDATE contact_inquiries SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    res.status(500).json({ success: false, error: 'Failed to update status' });
  }
});

// GET /api/admin/registrations - List all event registrations
router.get('/registrations', (req, res) => {
  try {
    const query = `
      SELECT r.*, e.title as event_title, e.category as event_category, e.date as event_date
      FROM event_registrations r
      JOIN events e ON r.event_id = e.id
      ORDER BY r.registered_at DESC
    `;
    const registrations = db.prepare(query).all();
    res.json({ success: true, data: registrations });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch registrations' });
  }
});

// GET /api/admin/subscribers - List newsletter subscribers
router.get('/subscribers', (req, res) => {
  try {
    const subscribers = db.prepare('SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC').all();
    res.json({ success: true, data: subscribers });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch subscribers' });
  }
});

module.exports = router;
