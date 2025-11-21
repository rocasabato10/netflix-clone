import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import multer from 'multer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const { Pool } = pkg;
const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'appdb',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432
});

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename(req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  }
});
const upload = multer({ storage });

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password obbligatorie' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, hashed]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email già registrata' });
    }
    console.error(err);
    res.status(500).json({ error: 'Errore server' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1d'
    });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore server' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await pool.query('SELECT * FROM categories ORDER BY "order", id');
    const subcategories = await pool.query(
      'SELECT * FROM subcategories ORDER BY "order", id'
    );
    res.json({
      categories: categories.rows,
      subcategories: subcategories.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore caricamento categorie' });
  }
});

app.post('/api/categories', authMiddleware, async (req, res) => {
  try {
    const { name, order } = req.body;
    const result = await pool.query(
      'INSERT INTO categories (name, "order") VALUES ($1, $2) RETURNING *',
      [name, order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore creazione categoria' });
  }
});

app.post('/api/subcategories', authMiddleware, async (req, res) => {
  try {
    const { category_id, name, order } = req.body;
    const result = await pool.query(
      'INSERT INTO subcategories (category_id, name, "order") VALUES ($1, $2, $3) RETURNING *',
      [category_id, name, order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore creazione sottocategoria' });
  }
});

app.post(
  '/api/videos',
  authMiddleware,
  upload.single('video'),
  async (req, res) => {
    try {
      const { title, description, category_id, subcategory_id } = req.body;
      if (!req.file) {
        return res.status(400).json({ error: 'File video mancante' });
      }
      const videoUrl = '/uploads/' + req.file.filename;
      const result = await pool.query(
        `INSERT INTO videos (title, description, category_id, subcategory_id, video_url)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          title,
          description || null,
          category_id ? Number(category_id) : null,
          subcategory_id ? Number(subcategory_id) : null,
          videoUrl
        ]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Errore upload video' });
    }
  }
);

app.get('/api/videos', async (req, res) => {
  try {
    const { categoryId, subcategoryId } = req.query;
    let query = 'SELECT * FROM videos WHERE 1=1';
    const params = [];
    if (categoryId) {
      params.push(Number(categoryId));
      query += ` AND category_id = $${params.length}`;
    }
    if (subcategoryId) {
      params.push(Number(subcategoryId));
      query += ` AND subcategory_id = $${params.length}`;
    }
    query += ' ORDER BY created_at DESC, id DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore caricamento video' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend in ascolto sulla porta ${PORT}`);
});
