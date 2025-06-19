const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }
});
const User = mongoose.model('User', userSchema);

// Analytics Schema
const analyticsSchema = new mongoose.Schema({
  event: String,
  target: String,
  page: String,
  timestamp: String
});
const Analytics = mongoose.model('Analytics', analyticsSchema); 

// Root Route


app.get('/', (req, res) => {
  res.json({ message: 'Welcome to AnalyticsTool API' });
});

// Sign-Up Endpoint
app.post('/api/signup', async (req, res) => {
  try {
    console.log('Signup request:', req.body); // Log incoming data
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const user = new User({ email });
    await user.save();
    res.json({ message: 'Sign-up successful' });
  } catch (error) {
    console.error('Signup error:', error); // Log errors
    res.status(400).json({ message: 'Error signing up: ' + error.message });
  }
});

// Analytics Tracking Endpoint

app.post('/api/track', async (req, res) => {
  try {
    console.log('Track request:', req.body); // Log incoming data
    const eventData = req.body;
    const analytics = new Analytics(eventData);
    await analytics.save();
    res.json({ message: 'Event tracked' });
  } catch (error) {
    console.error('Track error:', error); // Log errors
    res.status(400).json({ message: 'Error tracking event: ' + error.message });
  }
});
  // Get All Users Endpoint - AP
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get All Analytics Endpoint
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));