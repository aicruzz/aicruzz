import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/pool';
import { AuthRequest } from '../middleware/auth.middleware';

function signToken(userId: string): string {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
  );
}

// POST /api/v1/auth/register
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Bad Request', message: 'name, email and password are required' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ error: 'Bad Request', message: 'Password must be at least 8 characters' });
      return;
    }

    // Check if email already taken
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rowCount && existing.rowCount > 0) {
      res.status(409).json({ error: 'Conflict', message: 'An account with this email already exists' });
      return;
    }

    const password_hash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (email, name, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, avatar_url, plan, credits_used, credits_limit, created_at, updated_at`,
      [email.toLowerCase(), name, password_hash]
    );

    const user = result.rows[0];
    const token = signToken(user.id);

    res.status(201).json({ token, user });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// POST /api/v1/auth/login
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Bad Request', message: 'email and password are required' });
      return;
    }

    const result = await pool.query(
      `SELECT id, email, name, avatar_url, plan, credits_used, credits_limit,
              password_hash, created_at, updated_at
       FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (!result.rowCount || result.rowCount === 0) {
      res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password' });
      return;
    }

    const row = result.rows[0];
    const valid = await bcrypt.compare(password, row.password_hash);

    if (!valid) {
      res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password' });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...user } = row;
    const token = signToken(user.id);

    res.json({ token, user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// GET /api/v1/auth/me
export async function me(req: AuthRequest, res: Response): Promise<void> {
  try {
    const result = await pool.query(
      `SELECT id, email, name, avatar_url, plan, credits_used, credits_limit, created_at, updated_at
       FROM users WHERE id = $1`,
      [req.userId]
    );

    if (!result.rowCount || result.rowCount === 0) {
      res.status(404).json({ error: 'Not Found', message: 'User not found' });
      return;
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// PATCH /api/v1/auth/me
export async function updateMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { name, avatar_url } = req.body;

    const result = await pool.query(
      `UPDATE users SET
         name = COALESCE($1, name),
         avatar_url = COALESCE($2, avatar_url),
         updated_at = NOW()
       WHERE id = $3
       RETURNING id, email, name, avatar_url, plan, credits_used, credits_limit, created_at, updated_at`,
      [name || null, avatar_url || null, req.userId]
    );

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('UpdateMe error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
