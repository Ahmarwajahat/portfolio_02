require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route for Health Check
app.get('/', (req, res) => {
  res.status(200).json({ status: 'Online', message: 'Premium Portfolio API is running smoothly 🚀' });
});

// Import Routes
const projectsRoutes = require('./src/routes/projects');
const skillsRoutes = require('./src/routes/skills');
const messagesRoutes = require('./src/routes/messages');
const profileRoutes = require('./src/routes/profile');
const certificationsRoutes = require('./src/routes/certifications');
const blogsRoutes = require('./src/routes/blogs');

// Use Routes
app.use('/api/projects', projectsRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/certifications', certificationsRoutes);
app.use('/api/blogs', blogsRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ error: 'Something went wrong on the server!' });
});

if (require.main === module || process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 API Server is running on http://localhost:${PORT}`);
  });
}

// Export the app for Netlify functions
module.exports = app;
