const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/stats - Global club statistics
router.get('/', (req, res) => {
  try {
    const totalEvents = db.prepare('SELECT COUNT(*) as count FROM events').get().count;
    const totalRegistrations = db.prepare('SELECT COUNT(*) as count FROM event_registrations').get().count;
    const totalNews = db.prepare('SELECT COUNT(*) as count FROM announcements').get().count;
    const techNews = db.prepare("SELECT COUNT(*) as count FROM announcements WHERE category = 'technical'").get().count;
    const socialNews = db.prepare("SELECT COUNT(*) as count FROM announcements WHERE category = 'social'").get().count;
    const urgentNews = db.prepare("SELECT COUNT(*) as count FROM announcements WHERE is_urgent = 1 OR category = 'urgent'").get().count;

    const committeeDomains = db.prepare('SELECT teammates FROM committee_domains').all();
    let totalTeammates = 0;
    committeeDomains.forEach(d => {
      try {
        const team = JSON.parse(d.teammates);
        totalTeammates += Array.isArray(team) ? team.length : 0;
      } catch (e) {}
    });
    const totalLeaders = committeeDomains.length;
    const totalMembers = totalLeaders + totalTeammates;

    const totalInquiries = db.prepare('SELECT COUNT(*) as count FROM contact_inquiries').get().count;
    const totalSubscribers = db.prepare('SELECT COUNT(*) as count FROM newsletter_subscribers').get().count;

    res.json({
      success: true,
      data: {
        events: {
          total: totalEvents,
          registrations: totalRegistrations
        },
        announcements: {
          total: totalNews,
          technical: techNews,
          social: socialNews,
          urgent: urgentNews
        },
        community: {
          leaders: totalLeaders,
          teamMembers: totalMembers,
          pallottiMembers: 50,
          alumniChapters: 15,
          nationalVolunteers: 500
        },
        engagement: {
          inquiries: totalInquiries,
          subscribers: totalSubscribers
        }
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

module.exports = router;
