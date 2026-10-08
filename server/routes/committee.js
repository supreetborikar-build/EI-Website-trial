const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/committee - Get committee domains, leaders, and teammates
router.get('/', (req, res) => {
  try {
    const domains = db.prepare('SELECT * FROM committee_domains ORDER BY rowid ASC').all();

    const formatted = domains.map(item => ({
      id: item.id,
      domain: item.domain_name,
      icon: item.icon,
      badgeColor: item.badge_color,
      leader: {
        name: item.leader_name,
        title: item.leader_title,
        avatar: item.leader_avatar,
        linkedin: item.leader_linkedin,
        bio: item.leader_bio,
        skills: item.leader_skills ? JSON.parse(item.leader_skills) : []
      },
      teammates: item.teammates ? JSON.parse(item.teammates) : []
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('Error fetching committee:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch committee data' });
  }
});

module.exports = router;
