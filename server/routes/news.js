const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/announcements - Fetch announcements with filtering and sorting
router.get('/', (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = 'SELECT * FROM announcements WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      if (category === 'urgent') {
        query += " AND (is_urgent = 1 OR category = 'urgent')";
      } else {
        query += ' AND category = ?';
        params.push(category.toLowerCase());
      }
    }

    if (search) {
      query += ' AND (LOWER(title) LIKE ? OR LOWER(excerpt) LIKE ? OR LOWER(body) LIKE ?)';
      const term = `%${search.toLowerCase()}%`;
      params.push(term, term, term);
    }

    if (sort === 'newest') {
      query += ' ORDER BY timestamp DESC';
    } else if (sort === 'oldest') {
      query += ' ORDER BY timestamp ASC';
    } else {
      // Default: trending or by timestamp
      query += ' ORDER BY is_featured DESC, timestamp DESC';
    }

    const items = db.prepare(query).all(...params);

    // Parse JSON takeaways
    const parsed = items.map(item => ({
      ...item,
      is_featured: Boolean(item.is_featured),
      is_urgent: Boolean(item.is_urgent),
      takeaways: item.takeaways ? JSON.parse(item.takeaways) : []
    }));

    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch announcements' });
  }
});

// POST /api/announcements/:id/like - Increment like count
router.post('/:id/like', (req, res) => {
  try {
    const id = req.params.id;
    const update = db.prepare('UPDATE announcements SET likes = likes + 1 WHERE id = ?').run(id);

    if (update.changes === 0) {
      return res.status(404).json({ success: false, error: 'Announcement not found' });
    }

    const item = db.prepare('SELECT likes FROM announcements WHERE id = ?').get(id);
    res.json({ success: true, likes: item.likes });
  } catch (error) {
    console.error('Error liking announcement:', error);
    res.status(500).json({ success: false, error: 'Failed to like announcement' });
  }
});

// POST /api/announcements - Create announcement (Admin)
router.post('/', (req, res) => {
  try {
    const { title, category, categoryLabel, date, readTime, isFeatured, isUrgent, image, excerpt, body, takeaways } = req.body;
    if (!title || !category || !excerpt) {
      return res.status(400).json({ success: false, error: 'Title, category, and excerpt are required' });
    }

    const id = `news-${Date.now()}`;
    const insert = db.prepare(`
      INSERT INTO announcements (id, title, category, category_label, date, timestamp, read_time, is_featured, is_urgent, image, excerpt, body, takeaways, likes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `);

    insert.run(
      id,
      title,
      category.toLowerCase(),
      categoryLabel || category,
      date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      Date.now(),
      readTime || '3 min read',
      isFeatured ? 1 : 0,
      isUrgent ? 1 : 0,
      image || 'assets_news/hackathon.jpg',
      excerpt,
      body || `<p>${excerpt}</p>`,
      JSON.stringify(takeaways || [])
    );

    res.status(201).json({ success: true, message: 'Announcement created', id });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ success: false, error: 'Failed to create announcement' });
  }
});

module.exports = router;
