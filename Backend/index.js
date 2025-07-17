const express = require('express');
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const vendorRoutes = require('./routes/vendorRoutes.js');
const firmRoutes = require('./routes/firmRoutes.js');
const productRoutes = require('./routes/productRoutes.js');

const app = express();



app.use(cors());


const PORT = process.env.PORT || 4000;

dotEnv.config();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Middlewares
app.use(bodyParser.json());

// Routes
app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);
app.use('/uploads', express.static('uploads'));

// Test/Home Route
app.get('/', (req, res) => {
  res.send('Welcome to DelishDrop!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
