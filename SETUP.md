# To-Do App

A full-stack to-do application built with React, TailwindCSS, Node.js/Express, and MySQL.

## Features

- ✅ Create todos with title, description, and due date
- ✅ View all todos in a beautiful list
- ✅ Edit existing todos inline
- ✅ Mark todos as complete/incomplete
- ✅ Delete todos
- ✅ Persistent storage with MySQL database
- ✅ Responsive design with TailwindCSS

## Prerequisites

- Node.js (v14+)
- MySQL server running locally
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Create MySQL Database

Open MySQL and create the database:

```sql
CREATE DATABASE todo_app;
```

Make sure you have MySQL running on `localhost:3306` with user `root` and no password (or update `server.js` with your credentials).

### 3. Run the Backend Server

In a new terminal, start the Express server:

```bash
npm run server
```

The server will run on `http://localhost:5000` and automatically create the todos table.

### 4. Run the Frontend (in another terminal)

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Project Structure

```
├── src/
│   ├── App.jsx          # Main app component
│   ├── TodoForm.jsx     # Form for creating/adding todos
│   ├── TodoList.jsx     # List container for todos
│   ├── TodoItem.jsx     # Individual todo item component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── server.js            # Express API server
├── package.json         # Dependencies
├── tailwind.config.js   # TailwindCSS config
└── vite.config.js       # Vite config
```

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Database Schema

The todos table has the following columns:
- `id` (INT, AUTO_INCREMENT PRIMARY KEY)
- `title` (VARCHAR(255), NOT NULL)
- `description` (TEXT)
- `dueDate` (DATE)
- `completed` (BOOLEAN, DEFAULT FALSE)
- `createdAt` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

## Technologies Used

- **Frontend**: React 18, TailwindCSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **API**: REST with JSON

Enjoy organizing your tasks! 📝
