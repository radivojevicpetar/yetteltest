import { Request, Response } from 'express';
import { User } from '../models/user';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const createUser = async (req: Request, res: Response, db: any): Promise<void> => {
  const { firstName, lastName, username, email, password, role }: User = req.body;

  if (!firstName || !lastName || !username || !email || !password || !role) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  const checkUserQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
  try {
    const [results]: [RowDataPacket[]] = await db.query(checkUserQuery, [username, email]);

    if (results.length > 0) {
      res.status(400).json({ error: 'Username or email already exists' });
      return;
    }

    const insertUserQuery = 'INSERT INTO users (firstName, lastName, username, email, password, role) VALUES (?, ?, ?, ?, ?, ?)';
    const [result]: [ResultSetHeader] = await db.query(insertUserQuery, [firstName, lastName, username, email, password, role]);
    res.status(201).json({
      id: result.insertId,
      firstName,
      lastName,
      username,
      email,
      role
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error creating user:', err.message);
    }
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllUsers = async (req: Request, res: Response, db: any): Promise<void> => {
  const query = 'SELECT id, firstName, lastName, username, email, role FROM users';
  try {
    const [results]: [RowDataPacket[]] = await db.query(query);
    res.status(200).json(results);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error fetching users:', err.message);
    }
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateUser = async (req: Request, res: Response, db: any): Promise<void> => {
  const { firstName, lastName, username, email, password, role }: User = req.body;
  const userId = req.params.id;

  if (!firstName || !lastName || !username || !email || !password || !role) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  const checkUserQuery = 'SELECT * FROM users WHERE (username = ? OR email = ?) AND id != ?';
  try {
    const [results]: [RowDataPacket[]] = await db.query(checkUserQuery, [username, email, userId]);

    if (results.length > 0) {
      res.status(400).json({ error: 'Username or email already exists' });
      return;
    }

    const updateQuery = 'UPDATE users SET firstName = ?, lastName = ?, username = ?, email = ?, password = ?, role = ? WHERE id = ?';
    await db.query(updateQuery, [firstName, lastName, username, email, password, role, userId]);
    res.status(200).json({ message: 'User updated successfully' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error updating user:', err.message);
    }
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteUser = async (req: Request, res: Response, db: any): Promise<void> => {
  const userId = req.params.id;

  const deleteQuery = 'DELETE FROM users WHERE id = ?';
  try {
    await db.query(deleteQuery, [userId]);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error deleting user:', err.message);
    }
    res.status(500).json({ error: 'Server error' });
  }
};
