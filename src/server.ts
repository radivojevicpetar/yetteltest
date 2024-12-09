import express from 'express';
import mysql from 'mysql2';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

// Create a MySQL connection pool with promise-based API
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'mydb',
  port: 3306,
});

// Use the promise API for async/await support
const promiseDb = db.promise(); // <--- this gives you a promise-based API

app.use(express.json());

// Use routes, no need to pass promiseDb here anymore
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export promiseDb for use in controllers
export { promiseDb };
