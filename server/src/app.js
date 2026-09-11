const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const scheduleRoutes = require('./routes/scheduleRoutes');
const progressRoutes = require('./routes/progressRoutes');
const companionRoutes = require('./routes/companionRoutes');
const achievementRoutes = require('./routes/achievementRoutes');

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Study planner API is running' });
});

const authRoutes = require('./routes/authRoutes');
const houseRoutes = require('./routes/houseRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/companion', companionRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/house', houseRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
