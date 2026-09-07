# Engineering India – College Club Full-Stack Platform

A modern, full-stack React web application with an Express.js & SQLite database backend for the **Engineering India (Pallotti Chapter)** college club.

---

## 🌟 Features

- **Home (`/`)**: Hero gallery carousel with auto-rotation, vision statement, about preview, live upcoming events, and contact form.
- **About Us (`/about`)**: Interactive live particle canvas with spring physics, scroll progress indicator, animated statistic counters, and core pillars.
- **Executive Committee (`/committee`)**: Domain filter tabs, live search, team cards, teammate hover tooltips, and detailed leader modal dialogs.
- **Events (`/events`)**: Live marquee announcement ticker, mega event swipe carousel, live countdown timer, category filters, and an interactive **Event Registration Modal** logging attendees to the SQLite database.
- **News & Announcements (`/news`)**: Space Grotesk statistics badges, engagement sorting, category filters, and **Article Reader Modal** with likes and bookmarks.
- **Contact Us (`/contact`)**: Form validation with messages saved directly into the SQLite database.
- **Operations Portal (`/admin`)**: Operational view for committee leaders to review student registrations, incoming inquiries, and newsletter subscribers.
- **Theme**: Light & Dark mode support persisted in browser `localStorage`.

---

## 🚀 Quick Start

Run both the frontend and backend concurrently with a single command from the project root:

```bash
npm run dev
```

- **React Frontend**: [http://localhost:5173](http://localhost:5173)
- **API Backend**: [http://localhost:5000](http://localhost:5000)

---

## 📁 Project Structure

```
├── client/                     # React Frontend (Vite)
│   ├── public/                 # Static assets (images, banners, logos)
│   │   ├── assets/
│   │   ├── assets_events/
│   │   └── assets_news/
│   ├── src/
│   │   ├── components/         # Reusable UI components & modals
│   │   ├── context/            # ThemeContext (Light/Dark mode)
│   │   ├── pages/              # Route pages (Home, About, Committee, Events, News, Contact, Admin)
│   │   ├── services/           # API service client
│   │   ├── styles/             # Modular CSS stylesheets
│   │   ├── App.jsx             # Router and layout configuration
│   │   └── main.jsx            # Entry point
│   ├── index.html
│   └── vite.config.js
│
├── server/                     # Backend API & Database
│   ├── data/                   # SQLite database file (club.db)
│   ├── db/                     # Schema initialization and auto-seeder
│   ├── routes/                 # RESTful route handlers (events, news, committee, contact, admin, stats)
│   ├── package.json
│   └── server.js               # Express application entry point
│
├── package.json                # Monorepo runner scripts
└── README.md
```

---

## 🛠️ Individual Commands

```bash
# Start backend server only:
npm run server

# Start frontend Vite server only:
npm run client

# Build frontend for production:
npm run build
```
