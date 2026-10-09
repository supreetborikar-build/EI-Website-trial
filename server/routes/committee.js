const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/committee - Get Executive Committee domains & members
router.get('/', (req, res) => {
  try {
    const domains = db.prepare(`
      SELECT * FROM committee_domains
      ORDER BY rowid ASC
    `).all();

    const members = db.prepare(`
      SELECT * FROM committee_members
      ORDER BY id ASC
    `).all();

    const formattedDomains = domains.map(dom => {
      const domMembers = members.filter(m => m.domain_id === dom.id).map(m => ({
        id: m.id,
        name: m.name,
        role: m.role,
        year: m.year,
        branch: m.branch,
        uid: m.uid || '',
        avatar: m.avatar || '',
        isHead: Boolean(m.is_head),
        isCoHead: Boolean(m.is_co_head),
        linkedin: m.linkedin || '',
        github: m.github || '',
        tagline: m.tagline || ''
      }));

      // Find domain head
      const head = domMembers.find(m => m.isHead) || {
        name: dom.leader_name,
        role: dom.leader_title,
        year: dom.leader_year,
        branch: dom.leader_branch,
        uid: dom.leader_uid || '',
        avatar: dom.leader_avatar || '',
        isHead: true,
        isCoHead: false
      };

      return {
        id: dom.id,
        domainName: dom.domain_name,
        shortName: dom.short_name,
        description: dom.description || '',
        icon: dom.icon,
        badgeColor: dom.badge_color,
        head,
        members: domMembers,
        memberCount: domMembers.length
      };
    });

    const allMembersFormatted = members.map(m => ({
      id: m.id,
      domainId: m.domain_id,
      name: m.name,
      role: m.role,
      year: m.year,
      branch: m.branch,
      uid: m.uid || '',
      avatar: m.avatar || '',
      isHead: Boolean(m.is_head),
      isCoHead: Boolean(m.is_co_head),
      linkedin: m.linkedin || '',
      github: m.github || '',
      tagline: m.tagline || ''
    }));

    res.json({
      success: true,
      domains: formattedDomains,
      allMembers: allMembersFormatted,
      totalMembers: allMembersFormatted.length,
      totalDomains: formattedDomains.length,
      // legacy support
      data: allMembersFormatted
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