import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import TiltCard from '../components/TiltCard';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('registrations');
  const [stats, setStats] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [statsRes, regRes, inqRes, subRes] = await Promise.all([
        api.getStats().catch(() => ({})),
        api.getAdminRegistrations().catch(() => ({ data: [] })),
        api.getAdminInquiries().catch(() => ({ data: [] })),
        api.getAdminSubscribers().catch(() => ({ data: [] }))
      ]);

      setStats(statsRes.data || null);
      setRegistrations(regRes.data || []);
      setInquiries(inqRes.data || []);
      setSubscribers(subRes.data || []);
    } catch (err) {
      console.error('Error loading admin portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.updateInquiryStatus(id, status);
      setInquiries(prev =>
        prev.map(item => (item.id === id ? { ...item, status } : item))
      );
      addToast(`Inquiry marked as ${status}`, 'success');
    } catch {
      addToast('Failed to update status', 'error');
    }
  };

  return (
    <div style={{ minHeight: '80vh', padding: '100px 20px 60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'inline-block', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
          EXECUTIVE COMMITTEE PORTAL
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '4px 0 8px 0' }}>
          Club Operations &amp; Database
        </h1>
        <p style={{ opacity: 0.8, maxWidth: '650px', lineHeight: 1.6 }}>
          Live operational view of Engineering India SQLite database records: review student
          event registrations, incoming inquiries, and community newsletter members.
        </p>
      </div>

      {/* Summary KPI Cards */}
      {stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '36px'
          }}
        >
          <TiltCard style={{ background: 'var(--card-bg, #ffffff)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <span style={{ fontSize: '0.85rem', opacity: 0.7, fontWeight: 600 }}>Total Events</span>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#2563EB', margin: '6px 0 0 0' }}>
              {stats.events?.total || 0}
            </h3>
          </TiltCard>

          <TiltCard style={{ background: 'var(--card-bg, #ffffff)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <span style={{ fontSize: '0.85rem', opacity: 0.7, fontWeight: 600 }}>Event Registrations</span>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981', margin: '6px 0 0 0' }}>
              {registrations.length}
            </h3>
          </TiltCard>

          <TiltCard style={{ background: 'var(--card-bg, #ffffff)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <span style={{ fontSize: '0.85rem', opacity: 0.7, fontWeight: 600 }}>Contact Inquiries</span>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#F59E0B', margin: '6px 0 0 0' }}>
              {inquiries.length}
            </h3>
          </TiltCard>

          <TiltCard style={{ background: 'var(--card-bg, #ffffff)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <span style={{ fontSize: '0.85rem', opacity: 0.7, fontWeight: 600 }}>Subscribers</span>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#8B5CF6', margin: '6px 0 0 0' }}>
              {subscribers.length}
            </h3>
          </TiltCard>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid rgba(150,150,150,0.2)', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('registrations')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'registrations' ? '3px solid #2563EB' : '3px solid transparent',
            color: activeTab === 'registrations' ? '#2563EB' : 'inherit',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}
        >
          Event Attendees ({registrations.length})
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'inquiries' ? '3px solid #2563EB' : '3px solid transparent',
            color: activeTab === 'inquiries' ? '#2563EB' : 'inherit',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}
        >
          Inquiries ({inquiries.length})
        </button>

        <button
          onClick={() => setActiveTab('subscribers')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'subscribers' ? '3px solid #2563EB' : '3px solid transparent',
            color: activeTab === 'subscribers' ? '#2563EB' : 'inherit',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}
        >
          Subscribers ({subscribers.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '60px 0' }}>Loading database entries...</p>
      ) : activeTab === 'registrations' ? (
        <div style={{ overflowX: 'auto', background: 'var(--card-bg, #ffffff)', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(37,99,235,0.06)', borderBottom: '1px solid rgba(150,150,150,0.2)' }}>
                <th style={{ padding: '14px 16px', fontWeight: 600, fontSize: '0.85rem' }}>STUDENT NAME</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, fontSize: '0.85rem' }}>EVENT</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, fontSize: '0.85rem' }}>EMAIL &amp; PHONE</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, fontSize: '0.85rem' }}>COLLEGE &amp; YEAR</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, fontSize: '0.85rem' }}>REGISTERED AT</th>
              </tr>
            </thead>
            <tbody>
              {registrations.length > 0 ? (
                registrations.map(reg => (
                  <tr key={reg.id} style={{ borderBottom: '1px solid rgba(150,150,150,0.1)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{reg.full_name}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ display: 'inline-block', background: 'rgba(37,99,235,0.1)', color: '#2563EB', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                        {reg.event_title || reg.event_id}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.9rem' }}>
                      <div>{reg.email}</div>
                      <div style={{ opacity: 0.7, fontSize: '0.8rem' }}>{reg.phone}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.9rem' }}>
                      <div>{reg.college}</div>
                      <div style={{ opacity: 0.7, fontSize: '0.8rem' }}>{reg.year_branch}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.85rem', opacity: 0.75 }}>
                      {reg.registered_at}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: '30px', textAlign: 'center', opacity: 0.7 }}>
                    No student registrations logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : activeTab === 'inquiries' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {inquiries.length > 0 ? (
            inquiries.map(inq => (
              <div
                key={inq.id}
                style={{
                  background: 'var(--card-bg, #ffffff)',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                  borderLeft: inq.status === 'resolved' ? '4px solid #10B981' : inq.status === 'read' ? '4px solid #3B82F6' : '4px solid #F59E0B'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{inq.subject}</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', opacity: 0.8 }}>
                      From: <strong>{inq.full_name}</strong> ({inq.email}) • {inq.created_at}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: inq.status === 'resolved' ? 'rgba(16,185,129,0.1)' : inq.status === 'read' ? 'rgba(37,99,235,0.1)' : 'rgba(245,158,11,0.1)',
                        color: inq.status === 'resolved' ? '#10B981' : inq.status === 'read' ? '#2563EB' : '#F59E0B'
                      }}
                    >
                      {inq.status}
                    </span>

                    {inq.status !== 'resolved' && (
                      <button
                        onClick={() => handleUpdateStatus(inq.id, 'resolved')}
                        style={{
                          background: '#10B981',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Mark Resolved ✓
                      </button>
                    )}
                  </div>
                </div>

                <p style={{ lineHeight: 1.6, opacity: 0.9, fontSize: '0.95rem', margin: '12px 0 0 0', background: 'rgba(150,150,150,0.06)', padding: '12px', borderRadius: '8px' }}>
                  {inq.message}
                </p>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', padding: '40px 0', opacity: 0.7 }}>
              No inquiries recorded in the database.
            </p>
          )}
        </div>
      ) : (
        <div style={{ background: 'var(--card-bg, #ffffff)', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Newsletter Subscribers List</h3>
          {subscribers.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {subscribers.map(sub => (
                <li
                  key={sub.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: '1px solid rgba(150,150,150,0.1)',
                    fontSize: '0.95rem'
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{sub.email}</span>
                  <span style={{ opacity: 0.7, fontSize: '0.85rem' }}>Subscribed: {sub.subscribed_at}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ opacity: 0.7 }}>No newsletter subscribers yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
