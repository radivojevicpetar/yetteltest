import { Request, Response } from 'express';
import { Task } from '../models/task';
import { RowDataPacket, ResultSetHeader } from 'mysql2';


export const createTask = async (req: Request, res: Response, db: any): Promise<void> => {
  const { body, userId }: Task = req.body;

  if (!body || !userId) {
    res.status(400).json({ error: 'Task body and userId are required' });
    return;
  }

  const insertTaskQuery = 'INSERT INTO tasks (body, userId) VALUES (?, ?)';
  try {
    const [result]: [ResultSetHeader] = await db.query(insertTaskQuery, [body, userId]);
    res.status(201).json({
      taskId: result.insertId,
      body,
      userId
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error inserting task:', err.message);
    }
    res.status(500).json({ error: 'Server error' });
  }
};


export const getAllTasks = async (req: Request, res: Response, db: any): Promise<void> => {
  const { order = 'ASC', page = 1, limit = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  const query = `SELECT * FROM tasks ORDER BY createdAt ${order} LIMIT ? OFFSET ?`;
  try {
    const [results]: [RowDataPacket[]] = await db.query(query, [Number(limit), offset]);
    res.status(200).json(results);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error fetching tasks:', err.message);
    }
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateTask = async (req: Request, res: Response, db: any): Promise<void> => {
  const { body }: Task = req.body;
  const taskId = req.params.id;
  const userId = req.body.userId;

  if (!body) {
    res.status(400).json({ error: 'Task body is required' });
    return;
  }

  const taskQuery = 'SELECT * FROM tasks WHERE id = ? AND (userId = ? OR ? = "admin")';
  try {
    const [results]: [RowDataPacket[]] = await db.query(taskQuery, [taskId, userId, req.body.role]);

    if (results.length === 0) {
      res.status(403).json({ error: 'Forbidden: You do not have permission to update this task' });
      return;
    }

    const updateQuery = 'UPDATE tasks SET body = ? WHERE id = ?';
    await db.query(updateQuery, [body, taskId]);
    res.status(200).json({ message: 'Task updated successfully' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error updating task:', err.message);
    }
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteTask = async (req: Request, res: Response, db: any): Promise<void> => {
  const taskId = req.params.id;
  const userId = req.body.userId;

  const taskQuery = 'SELECT * FROM tasks WHERE id = ? AND (userId = ? OR ? = "admin")';
  try {
    const [results]: [RowDataPacket[]] = await db.query(taskQuery, [taskId, userId, req.body.role]);

    if (results.length === 0) {
      res.status(403).json({ error: 'Forbidden: You do not have permission to delete this task' });
      return;
    }

    const deleteQuery = 'DELETE FROM tasks WHERE id = ?';
    await db.query(deleteQuery, [taskId]);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error deleting task:', err.message);
    }
    res.status(500).json({ error: 'Server error' });
  }
};
