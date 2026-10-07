const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialize Database & Seeding
require('./db/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from client public folder
app.use('/assets', express.static(path.join(__dirname, '../client/public/assets')));
app.use('/assets_events', express.static(path.join(__dirname, '../client/public/assets_events')));
app.use('/assets_news', express.static(path.join(__dirname, '../client/public/assets_news')));

// Routes
const eventsRouter = require('./routes/events');
const newsRouter = require('./routes/news');
const committeeRouter = require('./routes/committee');
const contactRouter = require('./routes/contact');
const statsRouter = require('./routes/stats');
const adminRouter = require('./routes/admin');

app.use('/api/events', eventsRouter);
app.use('/api/announcements', newsRouter);
app.use('/api/committee', committeeRouter);
app.use('/api/contact', contactRouter);
app.use('/api/stats', statsRouter);
app.use('/api/admin', adminRouter);

// Root healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Engineering India College Club API is active and healthy.',
    time: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Engineering India Club API Server running at http://localhost:${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/api/health`);
});
