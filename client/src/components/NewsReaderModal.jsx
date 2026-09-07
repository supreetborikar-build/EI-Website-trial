import React, { useEffect } from 'react';
import { useToast } from './Toast';

export default function NewsReaderModal({
  item,
  isOpen,
  onClose,
  onLike,
  isBookmarked,
  onToggleBookmark
}) {
  const { addToast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Article link copied to clipboard!', 'info');
  };

  return (
    <div
      className="modal-backdrop active"
      id="article-modal"
      role="dialog"
      aria-modal="true"
      style={{ display: 'flex' }}
      onClick={(e) => {
        if (e.target.classList.contains('modal-backdrop')) onClose();
      }}
    >
      <div className="modal-card cad-frame-wrap" data-lenis-prevent style={{ position: 'relative' }}>
        <span className="cad-corner-marker tl"></span>
        <span className="cad-corner-marker tr"></span>
        <span className="cad-corner-marker bl"></span>
        <span className="cad-corner-marker br"></span>

        <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="blueprint-spec-header" style={{ padding: '10px 18px', background: 'var(--paper-surface, #FAFAF7)' }}>
          <span style={{ color: 'var(--blueprint-blue, #155EEF)', fontWeight: 700 }}>
            SPEC_DISPATCH // {(item.category || 'BULLETIN').toUpperCase()}
          </span>
          <span style={{ opacity: 0.6 }}>DOC_ID: {item.id} // CAD_ARCHIVE</span>
        </div>

        <img
          src={item.image.startsWith('/') ? item.image : `/${item.image}`}
          alt={item.title}
          className="modal-hero-img"
          onError={(e) => {
            e.target.src = '/assets_news/hackathon.jpg';
          }}
        />

        <div className="modal-content">
          <div className="modal-meta-row" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
            <span className="badge" style={{ textTransform: 'capitalize', fontWeight: 600 }}>
              {item.category_label || item.category}
            </span>
            <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>• {item.date}</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>• {item.read_time}</span>
          </div>

          <h2 className="modal-title" style={{ fontSize: '1.6rem', fontWeight: 700, margin: '8px 0 16px 0' }}>
            {item.title}
          </h2>

          <div
            className="modal-body-text"
            dangerouslySetInnerHTML={{ __html: item.body }}
            style={{ lineHeight: 1.7, opacity: 0.9, fontSize: '1rem', marginBottom: '24px' }}
          />

          {item.takeaways && item.takeaways.length > 0 && (
            <div
              className="key-takeaways"
              style={{
                background: 'rgba(37, 99, 235, 0.07)',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '24px',
                borderLeft: '4px solid #2563EB'
              }}
            >
              <h3 className="takeaways-heading" style={{ fontSize: '1.05rem', margin: '0 0 10px 0', color: '#2563EB' }}>
                <i className="fa-solid fa-lightbulb"></i> Key Highlights
              </h3>
              <ul className="takeaways-list" style={{ paddingLeft: '20px', margin: 0 }}>
                {item.takeaways.map((point, idx) => (
                  <li key={idx} style={{ marginBottom: '6px', fontSize: '0.95rem' }}>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="modal-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div className="reaction-buttons" style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-reaction"
                onClick={() => onLike(item.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(150,150,150,0.3)',
                  cursor: 'pointer',
                  background: 'inherit',
                  color: 'inherit'
                }}
              >
                <i className="fa-regular fa-thumbs-up" style={{ color: '#2563EB' }}></i>
                <span>{item.likes} Helpful</span>
              </button>

              <button
                className="btn-reaction"
                onClick={() => onToggleBookmark(item.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(150,150,150,0.3)',
                  cursor: 'pointer',
                  background: isBookmarked ? 'rgba(245, 158, 11, 0.15)' : 'inherit',
                  color: isBookmarked ? '#f59e0b' : 'inherit'
                }}
              >
                <i className={isBookmarked ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}></i>
                <span>{isBookmarked ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            <button
              className="btn-share"
              onClick={handleShare}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '8px',
                background: '#2563EB',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              <i className="fa-solid fa-share-nodes"></i> Share Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
