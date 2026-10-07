import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import NewsReaderModal from '../components/NewsReaderModal';
import { useToast } from '../components/Toast';
import TiltCard from '../components/TiltCard';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/news-page.css';

export default function News() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('trending');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Bookmarks stored in localStorage
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ei_svpcet_bookmarks') || '[]');
    } catch {
      return [];
    }
  });

  const { addToast } = useToast();

  const fetchNews = () => {
    api.getAnnouncements(activeFilter, searchQuery, sortOption)
      .then(res => setAnnouncements(res.data || []))
      .catch(err => console.error('Error loading news:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNews();
  }, [activeFilter, searchQuery, sortOption]);

  const handleLike = async (id) => {
    try {
      const res = await api.likeAnnouncement(id);
      setAnnouncements(prev =>
        prev.map(item => (item.id === id ? { ...item, likes: res.likes } : item))
      );
      if (selectedArticle && selectedArticle.id === id) {
        setSelectedArticle(prev => ({ ...prev, likes: res.likes }));
      }
      addToast('Marked as helpful! 👍', 'success');
    } catch {
      addToast('Failed to like announcement', 'error');
    }
  };

  const toggleBookmark = (id) => {
    let updated;
    if (bookmarks.includes(id)) {
      updated = bookmarks.filter(b => b !== id);
      addToast('Removed from saved articles', 'info');
    } else {
      updated = [...bookmarks, id];
      addToast('Article saved to bookmarks! 🔖', 'success');
    }
    setBookmarks(updated);
    localStorage.setItem('ei_svpcet_bookmarks', JSON.stringify(updated));
  };

  const handleOpenArticle = (item) => {
    setSelectedArticle(item);
    setIsModalOpen(true);
  };

  // Dynamic stats calculation
  const totalCount = announcements.length;
  const techCount = announcements.filter(a => a.category === 'technical').length;
  const socialCount = announcements.filter(a => a.category === 'social').length;
  const urgentCount = announcements.filter(a => a.is_urgent || a.category === 'urgent').length;

  const featuredItem = announcements.find(a => a.is_featured);
  const containerRef = useScrollReveal([announcements]);

  return (
    <div className="news-page-container blueprint-paper-canvas" ref={containerRef} style={{ position: 'relative' }}>
      {/* Top CAD Architectural Millimeter Ruler */}
      <div className="blueprint-ruler-top">
        <span>05 // DISPATCHES &amp; EDITORIAL ARCHIVE // JOURNAL</span>
        <span>SYS_STATUS: LIVE_STREAM</span>
        <span>TOTAL_ENTRIES: {announcements.length} // CLASSIFIED: PUBLIC</span>
      </div>

      {/* SKY & MINT HERO HEADER */}
      <section className="hero-announcements" data-reveal="fade-up">
        <div className="container hero-content">
          <div className="telemetry-tag" style={{ marginBottom: '1rem' }}>
            <span>05 // DISPATCHES &amp; EDITORIAL ARCHIVE // JOURNAL</span>
          </div>
          <div className="hero-pill">
            <img src="/assets_news/megaphone.png" alt="Megaphone" className="hero-pill-icon" />{' '}
            Club Updates &amp; Insights
          </div>
          <h1 className="editorial-section-title" style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}>
            News &amp; <span className="outline-text">Announcements</span>
          </h1>
          <div className="hero-badge-wrap">
            <span className="live-bullet"></span>
            <span className="hero-live-text">
              Live Updates • Engineering India Community Portal
            </span>
          </div>

          <p className="hero-subtitle editorial-lead">
            Explore our latest technical breakthroughs, social impact projects, and community
            updates from Engineering India.
          </p>

          {/* Space Grotesk Statistic Counters */}
          <div className="hero-stats">
            <TiltCard className="stat-item">
              <span className="stat-number" id="stat-total">{totalCount}</span>
              <span className="stat-label">Total Published</span>
            </TiltCard>
            <TiltCard className="stat-item">
              <span className="stat-number" id="stat-tech">{techCount}</span>
              <span className="stat-label">
                <img src="/assets_news/technical.png" className="cat-icon" alt="Tech" /> Technical
              </span>
            </TiltCard>
            <TiltCard className="stat-item">
              <span className="stat-number" id="stat-social">{socialCount}</span>
              <span className="stat-label">
                <img src="/assets_news/social.png" className="cat-icon" alt="Social" /> Social
              </span>
            </TiltCard>
            <TiltCard className="stat-item">
              <span className="stat-number" id="stat-urgent">{urgentCount}</span>
              <span className="stat-label">
                <img src="/assets_news/urgent.png" className="cat-icon" alt="Urgent" /> Urgent Alerts
              </span>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* CONTROLS SECTION */}
      <main className="container">
        <section className="controls-section">
          <div className="controls-wrapper">
            {/* Live Search */}
            <div className="search-box">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input
                type="text"
                id="search-input"
                className="search-input"
                placeholder="Search news, topics, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Pills */}
            <div className="filter-pills" id="filter-pills">
              <button
                className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                <i className="fa-solid fa-layer-group"></i> All Updates
              </button>
              <button
                className={`filter-pill ${activeFilter === 'technical' ? 'active' : ''}`}
                onClick={() => setActiveFilter('technical')}
              >
                <img src="/assets_news/technical.png" className="cat-icon" alt="Tech" /> Technical
              </button>
              <button
                className={`filter-pill ${activeFilter === 'social' ? 'active' : ''}`}
                onClick={() => setActiveFilter('social')}
              >
                <img src="/assets_news/social.png" className="cat-icon" alt="Social" /> Social Initiatives
              </button>
              <button
                className={`filter-pill ${activeFilter === 'urgent' ? 'active' : ''}`}
                onClick={() => setActiveFilter('urgent')}
              >
                <img src="/assets_news/urgent.png" className="cat-icon" alt="Urgent" /> Urgent Alerts
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="sort-box">
              <label htmlFor="sort-select">
                <i className="fa-solid fa-arrow-down-short-wide"></i> Sort:
              </label>
              <select
                id="sort-select"
                className="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="trending">Top Engagement</option>
                <option value="newest">Latest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </section>

        {/* FEATURED TOP HIGHLIGHT */}
        {activeFilter === 'all' && !searchQuery && featuredItem && (
          <section className="featured-section" id="featured-section" style={{ display: 'block', marginBottom: '40px' }}>
            <TiltCard
              maxTilt={2}
              className="featured-card blueprint-sheet-card cad-frame-wrap"
              onClick={() => handleOpenArticle(featuredItem)}
              style={{
                cursor: 'pointer',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <div className="cad-corner-marker tl" />
              <div className="cad-corner-marker tr" />
              <div className="cad-corner-marker bl" />
              <div className="cad-corner-marker br" />

              <img
                src={featuredItem.image.startsWith('/') ? featuredItem.image : `/${featuredItem.image}`}
                alt={featuredItem.title}
                style={{ width: '100%', height: '100%', minHeight: '260px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = '/assets_news/hackathon.jpg';
                }}
              />
              <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="blueprint-spec-header" style={{ margin: '-32px -32px 18px -32px' }}>
                  <span>LEAD_DISPATCH // ARCHIVE_PRIMARY</span>
                  <span>{featuredItem.category?.toUpperCase() || 'EDITORIAL'}</span>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                  <span
                    style={{
                      background: 'rgba(21, 94, 239, 0.1)',
                      color: 'var(--blueprint-blue, #155EEF)',
                      border: '1px solid var(--blueprint-blue, #155EEF)',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontFamily: 'Space Grotesk, monospace',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}
                  >
                    Featured Story
                  </span>
                  <span style={{ fontSize: '0.85rem', opacity: 0.7, fontFamily: 'Space Grotesk, monospace' }}>• {featuredItem.date}</span>
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '6px 0 12px 0' }}>
                  {featuredItem.title}
                </h2>
                <p style={{ opacity: 0.85, lineHeight: 1.6, marginBottom: '20px' }}>
                  {featuredItem.excerpt}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--blueprint-blue, #155EEF)', fontWeight: 600 }}>Read Full Story &rarr;</span>
                  <span style={{ opacity: 0.75, fontSize: '0.9rem' }}>
                    <i className="fa-regular fa-thumbs-up"></i> {featuredItem.likes}
                  </span>
                </div>
              </div>
            </TiltCard>
          </section>
        )}

        {/* ANNOUNCEMENTS GRID */}
        <section className="announcements-grid-section">
          <div className="section-header-row">
            <h2 className="section-title">
              <i className="fa-regular fa-newspaper" style={{ color: 'var(--blueprint-blue, #155EEF)' }}></i> Recent Dispatches
            </h2>
            <span className="results-count" style={{ fontFamily: 'Space Grotesk, monospace' }}>
              Showing {announcements.length} updates // INDEX: LIVE
            </span>
          </div>

          <div className="announcements-grid" id="announcements-grid">
            {loading ? (
              <p style={{ textAlign: 'center', gridColumn: '1/-1', fontFamily: 'Space Grotesk, monospace' }}>
                // INITIALIZING DISPATCH TELEMETRY...
              </p>
            ) : announcements.length > 0 ? (
              announcements.map((item, idx) => {
                const isBookmarked = bookmarks.includes(item.id);
                return (
                  <TiltCard
                    as="article"
                    key={item.id || idx}
                    className="news-card blueprint-sheet-card cad-frame-wrap"
                    style={{ cursor: 'pointer', borderRadius: '8px' }}
                  >
                    <div className="cad-corner-marker tl" />
                    <div className="cad-corner-marker tr" />
                    <div className="cad-corner-marker bl" />
                    <div className="cad-corner-marker br" />

                    <div className="blueprint-spec-header">
                      <span>DISPATCH_{String(idx + 1).padStart(3, '0')} // CAD_SPEC</span>
                      <span>{item.category?.toUpperCase() || 'ARTICLE'}</span>
                    </div>
                    <div className="news-image" onClick={() => handleOpenArticle(item)}>
                      <img
                        src={item.image.startsWith('/') ? item.image : `/${item.image}`}
                        alt={item.title}
                        onError={(e) => {
                          e.target.src = '/assets_news/hackathon.jpg';
                        }}
                      />
                      {item.is_urgent && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: '#EF4444',
                            color: '#fff',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}
                        >
                          URGENT
                        </div>
                      )}
                    </div>

                    <div className="news-content">
                      <div className="news-meta" onClick={() => handleOpenArticle(item)}>
                        <span className="news-category">{item.category_label || item.category}</span>
                        <span className="news-date">{item.date}</span>
                        <span className="news-read">{item.read_time}</span>
                      </div>

                      <h3 onClick={() => handleOpenArticle(item)} style={{ cursor: 'pointer' }}>
                        {item.title}
                      </h3>
                      <p onClick={() => handleOpenArticle(item)}>{item.excerpt}</p>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: '16px',
                          paddingTop: '12px',
                          borderTop: '1px solid rgba(150,150,150,0.15)'
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(item.id);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '0.9rem'
                          }}
                          title="Helpful"
                        >
                          <i className="fa-regular fa-thumbs-up" style={{ color: '#2563EB' }}></i>
                          <span>{item.likes}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(item.id);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: isBookmarked ? '#f59e0b' : 'inherit',
                            fontSize: '0.95rem'
                          }}
                          title={isBookmarked ? 'Saved' : 'Save article'}
                        >
                          <i className={isBookmarked ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}></i>
                        </button>

                        <button
                          onClick={() => handleOpenArticle(item)}
                          className="news-link"
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                        >
                          Read Article &rarr;
                        </button>
                      </div>
                    </div>
                  </TiltCard>
                );
              })
            ) : (
              <p style={{ textAlign: 'center', gridColumn: '1/-1', padding: '40px 0' }}>
                No updates found matching your search.
              </p>
            )}
          </div>
        </section>
      </main>

      {/* ARTICLE READER MODAL */}
      <NewsReaderModal
        item={selectedArticle}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLike={handleLike}
        isBookmarked={selectedArticle ? bookmarks.includes(selectedArticle.id) : false}
        onToggleBookmark={toggleBookmark}
      />
    </div>
  );
}
