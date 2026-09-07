import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';

// Import shared styles
import './styles/variables.css';
import './styles/main.css';
import './styles/navbar.css';
import './styles/shared-navbar.css';
import './styles/hero.css';
import './styles/about.css';
import './styles/events.css';
import './styles/news.css';
import './styles/contact.css';
import './styles/footer.css';
import './styles/responsive.css';
import './styles/home-refresh.css';
import './styles/cinematic-system.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
