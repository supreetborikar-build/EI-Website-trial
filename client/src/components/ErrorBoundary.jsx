import React from 'react';

/**
 * Living Blueprint Architectural Error Boundary
 * Prevents blank white screens if any unexpected runtime error occurs.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CRITICAL [ErrorBoundary] caught an error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            background: 'var(--paper, #F3F1EA)',
            color: 'var(--graphite, #111315)',
            fontFamily: 'Space Grotesk, sans-serif'
          }}
        >
          <div
            style={{
              maxWidth: '560px',
              width: '100%',
              padding: '36px',
              border: '1.5px solid var(--cad-border, #155EEF)',
              background: '#FFFFFF',
              boxShadow: '0 20px 50px rgba(17, 19, 21, 0.08)',
              position: 'relative'
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'Space Grotesk, monospace',
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                color: '#155EEF',
                textTransform: 'uppercase',
                marginBottom: '16px'
              }}
            >
              <span>[!] SYSTEM NOTICE // RECOVERY PROTOCOL</span>
            </div>

            <h2
              style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                margin: '0 0 12px 0',
                color: '#111315'
              }}
            >
              Blueprint View Interrupted
            </h2>

            <p
              style={{
                fontSize: '0.92rem',
                lineHeight: 1.6,
                color: '#475569',
                margin: '0 0 24px 0'
              }}
            >
              A temporary layout execution error was intercepted by the architecture shield.
              Click below to reset and re-initialize the engineering canvas.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  background: '#155EEF',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px 22px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}
              >
                Reload Blueprint Canvas &rarr;
              </button>

              <button
                type="button"
                onClick={() => { window.location.href = '/'; }}
                style={{
                  background: 'transparent',
                  color: '#111315',
                  border: '1px solid #CBD5E1',
                  padding: '10px 20px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Return to Base
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
