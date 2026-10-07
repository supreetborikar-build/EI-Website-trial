const API_BASE = '/api';

export const api = {
  // Stats
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // Events
  async getEvents(category = 'all', search = '') {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE}/events?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
  },

  async getEventById(id) {
    const res = await fetch(`${API_BASE}/events/${id}`);
    if (!res.ok) throw new Error('Failed to fetch event');
    return res.json();
  },

  async registerForEvent(id, data) {
    const res = await fetch(`${API_BASE}/events/${id}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Registration failed');
    return result;
  },

  // Announcements
  async getAnnouncements(category = 'all', search = '', sort = 'trending') {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    if (sort) params.append('sort', sort);

    const res = await fetch(`${API_BASE}/announcements?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch announcements');
    return res.json();
  },

  async likeAnnouncement(id) {
    const res = await fetch(`${API_BASE}/announcements/${id}/like`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to like announcement');
    return res.json();
  },

  // Committee
  async getCommittee() {
    const res = await fetch(`${API_BASE}/committee`);
    if (!res.ok) throw new Error('Failed to fetch committee data');
    return res.json();
  },

  // Contact
  async sendContact(data) {
    const res = await fetch(`${API_BASE}/contact/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to submit contact message');
    return result;
  },

  // Newsletter
  async subscribeNewsletter(email) {
    const res = await fetch(`${API_BASE}/contact/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to subscribe');
    return result;
  },

  // Admin
  async getAdminInquiries() {
    const res = await fetch(`${API_BASE}/admin/inquiries`);
    if (!res.ok) throw new Error('Failed to fetch admin inquiries');
    return res.json();
  },

  async updateInquiryStatus(id, status) {
    const res = await fetch(`${API_BASE}/admin/inquiries/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update inquiry status');
    return res.json();
  },

  async getAdminRegistrations() {
    const res = await fetch(`${API_BASE}/admin/registrations`);
    if (!res.ok) throw new Error('Failed to fetch admin registrations');
    return res.json();
  },

  async getAdminSubscribers() {
    const res = await fetch(`${API_BASE}/admin/subscribers`);
    if (!res.ok) throw new Error('Failed to fetch admin subscribers');
    return res.json();
  }
};
