require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const path = require('path');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs'); // Replace bcrypt with bcryptjs

const app = express();
const port = process.env.PORT || 3000;

// MongoDB URI and Client
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Error: MONGODB_URI is not defined in environment variables.");
  process.exit(1); // Exit if MONGODB_URI is missing
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process if MongoDB connection fails
  }
}
connectToMongoDB();

// Middleware for parsing JSON
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route สำหรับหน้า Home
app.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-store'); // หลีกเลี่ยงการแคชไฟล์ HTML
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

// Route สำหรับไฟล์ date.html
app.get('/date.html', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(path.join(__dirname, 'templates', 'date.html'));
});

// Route สำหรับไฟล์ profile.html
app.get('/about.html', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(path.join(__dirname, 'templates', 'about.html'));
});

// Route สำหรับไฟล์ index.html
app.get('/index.html', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

// Route สำหรับไฟล์ login.html
app.get('/login.html', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(path.join(__dirname, 'templates', 'login.html'));
});

// Route สำหรับไฟล์ upload.html
app.get('/upload.html', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(path.join(__dirname, 'templates', 'upload.html'));
});

// Route สำหรับไฟล์ files.html
app.get('/files.html', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(path.join(__dirname, 'templates', 'files.html'));
});

// Route สำหรับไฟล์ suport.html
app.get('/suport.html', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(path.join(__dirname, 'templates', 'suport.html'));
});

// Route สำหรับส่งข้อมูล MongoDB
app.get('/data', async (req, res) => {
  try {
    const collection = client.db("Link").collection("link");
    const data = await collection.find().toArray();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

// Route สำหรับเพิ่มลิงก์ใหม่
app.post('/add-link', async (req, res) => {
  const { url, name, date } = req.body;
  if (!url || !name) {
    return res.status(400).send('URL และชื่อของลิงก์จำเป็นต้องมี');
  }

  try {
    const collection = client.db("Link").collection("link");
    await collection.insertOne({ url, name, date });
    res.status(201).send('เพิ่มลิงก์สำเร็จ');
  } catch (error) {
    console.error("Error adding link:", error);
    res.status(500).send("Error adding link");
  }
});

// Route สำหรับแก้ไขชื่อลิงก์
app.put('/edit-link/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  console.log('Received edit request:', { id, name }); // เพิ่ม log เพื่อดูข้อมูลที่ส่งมา

  if (!name) {
      console.log('Name is missing');
      return res.status(400).send('ต้องระบุชื่อใหม่');
  }

  try {
      const collection = client.db("Link").collection("link");
      
      // ตรวจสอบว่า id ถูกต้องหรือไม่
      if (!ObjectId.isValid(id)) {
          console.log('Invalid ObjectId:', id);
          return res.status(400).send('ID ไม่ถูกต้อง');
      }

      const result = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { name: name } }
      );

      console.log('Update result:', result); // ดูผลลัพธ์

      if (result.matchedCount === 0) {
          return res.status(404).send('ไม่พบลิงก์ที่ต้องการแก้ไข');
      }

      if (result.modifiedCount === 0) {
          return res.status(400).send('ไม่มีการเปลี่ยนแปลงข้อมูล');
      }

      res.status(200).send('แก้ไขชื่อลิงก์สำเร็จ');
  } catch (error) {
      console.error("Error updating link:", error);
      res.status(500).send(`Error updating link: ${error.message}`);
  }
});


// Route สำหรับแก้ไข URL ของลิงก์
app.put('/edit-link-url/:id', async (req, res) => {
  const { id } = req.params;
  const { url } = req.body;

  if (!url) {
    return res.status(400).send('ต้องระบุ URL ใหม่');
  }

  try {
    const collection = client.db("Link").collection("link");
    
    // ตรวจสอบว่า id ถูกต้องหรือไม่
    if (!ObjectId.isValid(id)) {
        return res.status(400).send('ID ไม่ถูกต้อง');
    }

    const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { url: url } }
    );

    if (result.matchedCount === 0) {
        return res.status(404).send('ไม่พบลิงก์ที่ต้องการแก้ไข');
    }

    if (result.modifiedCount === 0) {
        return res.status(400).send('ไม่มีการเปลี่ยนแปลงข้อมูล');
    }

    res.status(200).send('แก้ไข URL ลิงก์สำเร็จ');
  } catch (error) {
    console.error("Error updating link URL:", error);
    res.status(500).send(`Error updating link URL: ${error.message}`);
  }
});

// Route สำหรับลบลิงก์
app.delete('/delete-link/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const collection = client.db("Link").collection("link");
    await collection.deleteOne({ _id: new ObjectId(id) });
    res.status(200).send('ลบลิงก์สำเร็จ');
  } catch (error) {
    console.error("Error deleting link:", error);
    res.status(500).send("Error deleting link");
  }
});

// User registration endpoint
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send('กรุณากรอกข้อมูลให้ครบถ้วน');
  }

  try {
    const usersCollection = client.db("Link").collection("User");
    const existingUser = await usersCollection.findOne({ username });

    if (existingUser) {
      return res.status(400).send('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash password using bcryptjs
    await usersCollection.insertOne({ username, email, password: hashedPassword, createdAt: new Date() });

    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Error registering user");
  }
});

// User login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('กรุณากรอกข้อมูลให้ครบถ้วน');
  }

  try {
    const usersCollection = client.db("Link").collection("User");
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(401).send('Invalid username or password');
    }

    const passwordMatch = await bcrypt.compare(password, user.password); // Compare password using bcryptjs
    if (!passwordMatch) {
      return res.status(401).send('Invalid username or password');
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Error logging in");
  }
});

// Serve environment variables to the frontend
app.get('/env', (req, res) => {
  res.json({
    API_KEY: process.env.API_KEY,
    CLIENT_ID: process.env.CLIENT_ID,
    FOLDER_ID: process.env.FOLDER_ID,
  });
});

// Handle unhandled routes
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// Export app for Vercel compatibility
module.exports = app;

// Start the server only if not running in a serverless environment
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}