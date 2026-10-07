const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/committee - Get Executive Committee members
router.get('/', (req, res) => {
  try {
    const members = db.prepare(`
      SELECT id, name, linkedin, github, tagline, avatar
      FROM committee_members
      ORDER BY id ASC
    `).all();

    const formatted = members.map(member => ({
      id: member.id,
      name: member.name,
      linkedin: member.linkedin || '',
      github: member.github || '',
      tagline: member.tagline || '',
      avatar: member.avatar || ''
    }));

    res.json({
      success: true,
      data: formatted
    });
  } catch (error) {
    console.error('Error fetching committee:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch committee data'
    });
  }
});

module.exports = router;