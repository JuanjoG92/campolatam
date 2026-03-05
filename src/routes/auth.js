const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB } = require('../models/db');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, name, password, role = 'buyer', country = '', province = '', phone = '' } = req.body;
    if (!email || !name || !password) return res.status(400).json({ error: 'Campos obligatorios: email, nombre, contraseña' });
    if (!['buyer', 'seller', 'notary'].includes(role)) return res.status(400).json({ error: 'Rol inválido' });
    const db = getDB();
    if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) return res.status(409).json({ error: 'Email ya registrado' });
    const hash = await bcrypt.hash(password, 12);
    const r = db.prepare('INSERT INTO users (email,name,password_hash,role,country,province,phone) VALUES (?,?,?,?,?,?,?)').run(email, name, hash, role, country, province, phone);
    const token = jwt.sign({ id: r.lastInsertRowid, email, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: r.lastInsertRowid, email, name, role } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = getDB();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !await bcrypt.compare(password, user.password_hash)) return res.status(401).json({ error: 'Credenciales inválidas' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/me', require('../middleware/auth'), (req, res) => {
  const user = getDB().prepare('SELECT id,email,name,role,country,province,phone,bio,verified,created_at FROM users WHERE id=?').get(req.userId);
  if (!user) return res.status(404).json({ error: 'No encontrado' });
  res.json(user);
});

module.exports = router;
