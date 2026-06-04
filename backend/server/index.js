import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

// Setup __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database paths
const USERS_DB_PATH = path.join(__dirname, '..', 'data', 'users.json');
const PETS_DB_PATH = path.join(__dirname, '..', 'data', 'pets.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
try {
  await fs.mkdir(dataDir, { recursive: true });
} catch (error) {
  console.error('Error creating data directory:', error);
}

// Initialize database files if they don't exist
async function initializeDatabase() {
  try {
    try {
      await fs.access(USERS_DB_PATH);
    } catch (error) {
      await fs.writeFile(USERS_DB_PATH, JSON.stringify({ users: [] }, null, 2));
      console.log('Users database initialized');
    }

    try {
      await fs.access(PETS_DB_PATH);
    } catch (error) {
      await fs.writeFile(PETS_DB_PATH, JSON.stringify({ pets: [] }, null, 2));
      console.log('Pets database initialized');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Read database
async function readDatabase(dbPath) {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading database at ${dbPath}:`, error);
    return null;
  }
}

// Write to database
async function writeDatabase(dbPath, data) {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing to database at ${dbPath}:`, error);
    return false;
  }
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ success: false, message: 'Access token required' });
  
  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// API Routes

// Register a new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, address, userType } = req.body;
    
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    const db = await readDatabase(USERS_DB_PATH);
    if (!db) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }
    
    // Check if email already exists
    if (db.users.some(user => user.email === email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already exists' 
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      address: address || '',
      userType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to database
    db.users.push(newUser);
    const success = await writeDatabase(USERS_DB_PATH, db);
    
    if (!success) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to save user data' 
      });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, userType: newUser.userType },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }
    
    const db = await readDatabase(USERS_DB_PATH);
    if (!db) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }
    
    // Find user by email
    const user = db.users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// Get current user
app.get('/api/users/me', authenticateToken, async (req, res) => {
  try {
    const db = await readDatabase(USERS_DB_PATH);
    if (!db) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }
    
    const user = db.users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Return user data without password
    const { password, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Register a new pet
app.post('/api/pets', authenticateToken, async (req, res) => {
  try {
    const { name, type, breed, age, gender, description, price, forSale } = req.body;
    
    if (!name || !type || !breed || !age || !gender) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    const db = await readDatabase(PETS_DB_PATH);
    if (!db) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }
    
    // Create new pet
    const newPet = {
      id: Date.now().toString(),
      ownerId: req.user.id,
      name,
      type,
      breed,
      age,
      gender,
      description: description || '',
      price: price || 0,
      forSale: forSale || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to database
    db.pets.push(newPet);
    const success = await writeDatabase(PETS_DB_PATH, db);
    
    if (!success) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to save pet data' 
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Pet registered successfully',
      pet: newPet
    });
  } catch (error) {
    console.error('Pet registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during pet registration' 
    });
  }
});

// Get all pets
app.get('/api/pets', async (req, res) => {
  try {
    const db = await readDatabase(PETS_DB_PATH);
    if (!db) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }
    
    res.json({
      success: true,
      pets: db.pets
    });
  } catch (error) {
    console.error('Error getting pets:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Get user's pets
app.get('/api/users/pets', authenticateToken, async (req, res) => {
  try {
    const db = await readDatabase(PETS_DB_PATH);
    if (!db) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }
    
    const userPets = db.pets.filter(pet => pet.ownerId === req.user.id);
    
    res.json({
      success: true,
      pets: userPets
    });
  } catch (error) {
    console.error('Error getting user pets:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  const staticPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(staticPath));
  
  // For any request that doesn't match an API route, send the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

// Initialize database and start server
await initializeDatabase();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;