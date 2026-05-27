import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables from .env in local development.
dotenv.config();

// Create the Express application instance.
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing for incoming requests.
app.use(cors());
app.use(bodyParser.json());

// Declare the connection pool here so it can be initialized after the database exists.
let pool;

// Initialize the MySQL database and the todos table before starting the server.
async function initializeDatabase() {
  // Connect to MySQL without selecting a database first.
  const adminConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    // Ensure the application database exists.
    const databaseName = process.env.DB_NAME || 'todo_app';
    await adminConnection.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);
    console.log(`Database ${databaseName} created or already exists`);
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    await adminConnection.end();
  }

  // Create a connection pool now that the database has been ensured.
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'todo_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const connection = await pool.getConnection();
  try {
    // Create the todos table if it does not already exist.
    await connection.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        dueDate DATE,
        completed BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Retrieve all todos from the database.
app.get('/api/todos', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM todos ORDER BY createdAt DESC');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Create a new todo item in the database.
app.post('/api/todos', async (req, res) => {
  const { title, description, dueDate } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO todos (title, description, dueDate) VALUES (?, ?, ?)',
      [title, description || null, dueDate || null]
    );
    connection.release();

    res.status(201).json({
      id: result.insertId,
      title,
      description,
      dueDate,
      completed: false,
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Update an existing todo item by id.
app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, completed } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE todos SET title = ?, description = ?, dueDate = ?, completed = ? WHERE id = ?',
      [title, description || null, dueDate || null, completed || false, id]
    );
    connection.release();

    res.json({ id, title, description, dueDate, completed });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Delete a todo item by id.
app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM todos WHERE id = ?', [id]);
    connection.release();

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Start the server only after the database is ready.
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server due to database initialization error');
    process.exit(1);
  }
}

startServer();
