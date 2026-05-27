// MySQL Configuration Options

// If you need to change your database credentials, edit the pool configuration in server.js

// OPTION 1: Default (Local MySQL with no password)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todo_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// OPTION 2: With Password
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your_password_here',  // Add your password
  database: 'todo_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// OPTION 3: Remote MySQL Server
const pool = mysql.createPool({
  host: '192.168.1.100',           // Your server IP
  user: 'your_username',
  password: 'your_password',
  database: 'todo_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// OPTION 4: Docker MySQL
const pool = mysql.createPool({
  host: 'mysql-container',          // Docker container name
  user: 'root',
  password: 'root_password',
  database: 'todo_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// STEPS TO CHANGE CONFIGURATION:

// 1. Open server.js in your editor
// 2. Find the pool configuration (around line 13-19)
// 3. Update the credentials to match your MySQL setup
// 4. Save the file
// 5. Restart the server: npm run server

// COMMON ISSUES:

// "connect ECONNREFUSED 127.0.0.1:3306"
// → MySQL is not running. Start your MySQL server first.

// "Access denied for user 'root'@'localhost'"
// → Wrong password. Update the password field in pool config.

// "Unknown database 'todo_app'"
// → Database not created. Run: CREATE DATABASE todo_app;

// "ER_BAD_FIELD_ERROR: Unknown column"
// → The table wasn't created. Restart the server with npm run server
