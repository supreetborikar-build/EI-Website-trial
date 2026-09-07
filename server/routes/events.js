const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/events - List events with optional category and search filter
router.get('/', (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM events WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category.toLowerCase());
    }

    if (search) {
      query += ' AND (LOWER(title) LIKE ? OR LOWER(description) LIKE ?)';
      const term = `%${search.toLowerCase()}%`;
      params.push(term, term);
    }

    query += ' ORDER BY created_at ASC';
    const events = db.prepare(query).all(...params);

    // Attach registration count to each event
    const regCountStmt = db.prepare('SELECT COUNT(*) as count FROM event_registrations WHERE event_id = ?');
    const enrichedEvents = events.map(event => {
      const reg = regCountStmt.get(event.id);
      return {
        ...event,
        registered_count: reg ? reg.count : 0
      };
    });

    res.json({ success: true, data: enrichedEvents });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch events' });
  }
});

// GET /api/events/:id - Get single event
router.get('/:id', (req, res) => {
  try {
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const regCount = db.prepare('SELECT COUNT(*) as count FROM event_registrations WHERE event_id = ?').get(event.id);
    res.json({
      success: true,
      data: {
        ...event,
        registered_count: regCount ? regCount.count : 0
      }
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch event' });
  }
});

// POST /api/events/:id/register - Register attendee for event
router.post('/:id/register', (req, res) => {
  try {
    const eventId = req.params.id;
    const { fullName, email, phone, college, yearBranch } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Full name, email, and phone number are required.'
      });
    }

    // Verify event exists
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found.' });
    }

    // Check if already registered
    const existing = db.prepare('SELECT id FROM event_registrations WHERE event_id = ? AND email = ?').get(eventId, email);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'You have already registered for this event with this email address.'
      });
    }

    const insert = db.prepare(`
      INSERT INTO event_registrations (event_id, full_name, email, phone, college, year_branch)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      eventId,
      fullName.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      (college || 'SVPCET').trim(),
      (yearBranch || 'Student').trim()
    );

    const totalReg = db.prepare('SELECT COUNT(*) as count FROM event_registrations WHERE event_id = ?').get(eventId);

    res.status(201).json({
      success: true,
      message: `Registration successful for ${event.title}!`,
      data: {
        registrationId: result.lastInsertRowid,
        eventTitle: event.title,
        registeredCount: totalReg.count
      }
    });
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({ success: false, error: 'Registration failed. Please try again.' });
  }
});

// POST /api/events - Create new event (Admin)
router.post('/', (req, res) => {
  try {
    const { id, title, category, date, location, description, image, badge, seats, isMega } = req.body;
    if (!title || !category || !date) {
      return res.status(400).json({ success: false, error: 'Title, category, and date are required.' });
    }

    const eventId = id || `event-${Date.now()}`;
    const insert = db.prepare(`
      INSERT INTO events (id, title, category, date, location, description, image, badge, seats, is_mega)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      eventId,
      title,
      category.toLowerCase(),
      date,
      location || 'Campus Innovation Lab',
      description || '',
      image || 'assets_events/gallery1.jpg',
      badge || category.toUpperCase(),
      seats || 100,
      isMega ? 1 : 0
    );

    res.status(201).json({ success: true, message: 'Event created successfully', eventId });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ success: false, error: 'Failed to create event' });
  }
});

module.exports = router;
