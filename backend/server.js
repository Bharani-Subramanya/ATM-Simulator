const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/atm_simulator';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    console.log(`📦 Database: atm_simulator`);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  cardNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  pin: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 1000.00,
    min: 0
  },
  transactions: [{
    type: {
      type: String,
      enum: ['deposit', 'withdraw'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    balance: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

// ==================== API ROUTES ====================

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '🎉 Backend is running!',
    database: 'Connected to MongoDB'
  });
});

// 1. SIGNUP Route
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, cardNumber, pin, balance } = req.body;

    // Validation
    if (!name || !email || !cardNumber || !pin) {
      return res.status(400).json({ 
        success: false,
        message: '❌ All fields are required' 
      });
    }

    // Clean card number (remove spaces)
    const cleanCardNumber = cardNumber.replace(/\s+/g, '');

    // Check if card number is valid (4-16 digits)
    if (!/^\d{4,16}$/.test(cleanCardNumber)) {
      return res.status(400).json({ 
        success: false,
        message: '❌ Card number must be 4-16 digits' 
      });
    }

    // Check if PIN is valid (4-6 digits)
    if (!/^\d{4,6}$/.test(pin)) {
      return res.status(400).json({ 
        success: false,
        message: '❌ PIN must be 4-6 digits' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { cardNumber: cleanCardNumber }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: '❌ Email or Card number already registered' 
      });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      cardNumber: cleanCardNumber,
      pin, // In production, you should hash this!
      balance: balance || 1000.00
    });

    await newUser.save();

    res.status(201).json({ 
      success: true,
      message: '✅ Account created successfully!',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        cardNumber: newUser.cardNumber,
        balance: newUser.balance
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false,
      message: '❌ Server error during signup' 
    });
  }
});

// 2. LOGIN Route
app.post('/api/login', async (req, res) => {
  try {
    const { cardNumber, pin } = req.body;

    // Validation
    if (!cardNumber || !pin) {
      return res.status(400).json({ 
        success: false,
        message: '❌ Card number and PIN are required' 
      });
    }

    // Clean card number (remove spaces)
    const cleanCardNumber = cardNumber.replace(/\s+/g, '');

    // Find user
    const user = await User.findOne({ cardNumber: cleanCardNumber });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: '❌ Invalid card number or PIN' 
      });
    }

    // Check PIN
    if (user.pin !== pin) {
      return res.status(401).json({ 
        success: false,
        message: '❌ Invalid card number or PIN' 
      });
    }

    res.json({ 
      success: true,
      message: '✅ Login successful!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        cardNumber: user.cardNumber,
        balance: user.balance,
        transactions: user.transactions
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: '❌ Server error during login' 
    });
  }
});

// 3. GET User Details
app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: '❌ User not found' 
      });
    }

    res.json({ 
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        cardNumber: user.cardNumber,
        balance: user.balance,
        transactions: user.transactions
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false,
      message: '❌ Server error' 
    });
  }
});

// 4. DEPOSIT Money
app.post('/api/deposit', async (req, res) => {
  try {
    const { userId, amount } = req.body;

    // Validation
    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ 
        success: false,
        message: '❌ Invalid deposit amount' 
      });
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: '❌ User not found' 
      });
    }

    // Update balance
    user.balance += parseFloat(amount);

    // Add transaction
    user.transactions.unshift({
      type: 'deposit',
      amount: parseFloat(amount),
      balance: user.balance,
      date: new Date()
    });

    await user.save();

    res.json({ 
      success: true,
      message: `✅ Successfully deposited $${amount}`,
      balance: user.balance,
      transaction: user.transactions[0]
    });

  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({ 
      success: false,
      message: '❌ Server error during deposit' 
    });
  }
});

// 5. WITHDRAW Money
app.post('/api/withdraw', async (req, res) => {
  try {
    const { userId, amount } = req.body;

    // Validation
    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ 
        success: false,
        message: '❌ Invalid withdrawal amount' 
      });
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: '❌ User not found' 
      });
    }

    // Check sufficient balance
    if (user.balance < parseFloat(amount)) {
      return res.status(400).json({ 
        success: false,
        message: '❌ Insufficient funds' 
      });
    }

    // Update balance
    user.balance -= parseFloat(amount);

    // Add transaction
    user.transactions.unshift({
      type: 'withdraw',
      amount: parseFloat(amount),
      balance: user.balance,
      date: new Date()
    });

    await user.save();

    res.json({ 
      success: true,
      message: `✅ Successfully withdrew $${amount}`,
      balance: user.balance,
      transaction: user.transactions[0]
    });

  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({ 
      success: false,
      message: '❌ Server error during withdrawal' 
    });
  }
});

// 6. GET Transaction History
app.get('/api/transactions/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: '❌ User not found' 
      });
    }

    res.json({ 
      success: true,
      transactions: user.transactions
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ 
      success: false,
      message: '❌ Server error' 
    });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 API Endpoints:`);
  console.log(`   - POST http://localhost:${PORT}/api/signup`);
  console.log(`   - POST http://localhost:${PORT}/api/login`);
  console.log(`   - GET  http://localhost:${PORT}/api/user/:id`);
  console.log(`   - POST http://localhost:${PORT}/api/deposit`);
  console.log(`   - POST http://localhost:${PORT}/api/withdraw`);
  console.log(`   - GET  http://localhost:${PORT}/api/transactions/:userId`);
  console.log(`\n💡 Open MongoDB Compass to see your database!\n`);
});