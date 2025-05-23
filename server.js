// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoute'); // Make sure file is named authRoute.js
const imagesRoutes = require('./routes/imagesRoute'); // Make sure file is named authRoute.js
const StripeRoutes = require('./routes/stripe'); // Make sure file is named authRoute.js

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const videoRoutes = require("./routes/videoRoutes");
const path = require("path");
// Middleware


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // if you're using cookies or auth headers
}));

app.use(express.json());

// Routes
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve static images

// Routes
app.use("/api/", videoRoutes);
app.use('/api', authRoutes);
app.use('/api', imagesRoutes);
app.use('/api', StripeRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});
