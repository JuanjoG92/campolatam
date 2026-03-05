const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const { getDB } = require('../models/db');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', '..', 'public', 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, Date.now() + '-' + Math.random().toString(36).slice(2) + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|mp4|mov|avi/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
  }
});

// GET /api/listings  (public - active listings)
router.get('/', (req, res) => {
  const db = getDB();
  const { country, province, minHa, maxHa, type, page = 1 } = req.query;
  let q = 'SELECT l.*, u.name as seller_name, u.country as seller_country FROM listings l JOIN users u ON l.user_id=u.id WHERE l.status="active"';
  const params = [];
  if (country) { q += ' AND l.country=?'; params.push(country); }
  if (province) { q += ' AND l.province=?'; params.push(province); }
  if (minHa) { q += ' AND l.hectares>=?'; params.push(parseFloat(minHa)); }
  if (maxHa) { q += ' AND l.hectares<=?'; params.push(parseFloat(maxHa)); }
  if (type) { q += ' AND l.transaction_type=?'; params.push(type); }
  q += ' ORDER BY l.created_at DESC LIMIT 20 OFFSET ?';
  params.push((parseInt(page) - 1) * 20);
  const listings = db.prepare(q).all(...params);
  listings.forEach(l => {
    l.media = db.prepare('SELECT * FROM listing_media WHERE listing_id=? ORDER BY display_order').all(l.id);
    l.agriculture_types = JSON.parse(l.agriculture_types || '[]');
    l.products = JSON.parse(l.products || '[]');
    l.fruit_trees = JSON.parse(l.fruit_trees || '[]');
  });
  res.json(listings);
});

// GET /api/listings/:id
router.get('/:id', (req, res) => {
  const db = getDB();
  const l = db.prepare('SELECT l.*, u.name as seller_name, u.email as seller_email, u.phone as seller_phone FROM listings l JOIN users u ON l.user_id=u.id WHERE l.id=?').get(req.params.id);
  if (!l) return res.status(404).json({ error: 'Propiedad no encontrada' });
  db.prepare('UPDATE listings SET views=views+1 WHERE id=?').run(l.id);
  l.media = db.prepare('SELECT * FROM listing_media WHERE listing_id=? ORDER BY display_order').all(l.id);
  l.verifications = db.prepare('SELECT v.*, u.name as notary_name FROM verifications v JOIN users u ON v.notary_id=u.id WHERE v.listing_id=?').all(l.id);
  l.agriculture_types = JSON.parse(l.agriculture_types || '[]');
  l.products = JSON.parse(l.products || '[]');
  l.fruit_trees = JSON.parse(l.fruit_trees || '[]');
  res.json(l);
});

// POST /api/listings (seller only)
router.post('/', auth, upload.array('media', 15), (req, res) => {
  try {
    const db = getDB();
    const d = req.body;
    const r = db.prepare(`INSERT INTO listings (user_id,title,transaction_type,country,province,city,hectares,price_per_hectare,total_price,currency,has_river,num_wells,num_houses,num_worker_houses,has_perimeter_fence,grass_type,has_bushes,has_forest,forest_percent,mixed_agri_percent,annual_rainfall,agriculture_types,products,fruit_trees,description,video_url)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
      req.userId, d.title, d.transaction_type || 'sale', d.country, d.province, d.city || '',
      parseFloat(d.hectares) || 0, parseFloat(d.price_per_hectare) || 0, parseFloat(d.total_price) || 0,
      d.currency || 'USD', d.has_river ? 1 : 0, parseInt(d.num_wells) || 0,
      parseInt(d.num_houses) || 0, parseInt(d.num_worker_houses) || 0, d.has_perimeter_fence ? 1 : 0,
      d.grass_type || '', d.has_bushes ? 1 : 0, d.has_forest ? 1 : 0,
      parseFloat(d.forest_percent) || 0, parseFloat(d.mixed_agri_percent) || 0, d.annual_rainfall || '',
      JSON.stringify(d.agriculture_types ? (Array.isArray(d.agriculture_types) ? d.agriculture_types : [d.agriculture_types]) : []),
      JSON.stringify(d.products ? (Array.isArray(d.products) ? d.products : [d.products]) : []),
      JSON.stringify(d.fruit_trees ? (Array.isArray(d.fruit_trees) ? d.fruit_trees : [d.fruit_trees]) : []),
      d.description || '', d.video_url || ''
    );
    const listingId = r.lastInsertRowid;
    if (req.files && req.files.length) {
      req.files.forEach((f, i) => {
        const type = f.mimetype.startsWith('video') ? 'video' : 'photo';
        db.prepare('INSERT INTO listing_media (listing_id,type,filename,display_order) VALUES (?,?,?,?)').run(listingId, type, f.filename, i);
      });
    }
    res.json({ id: listingId, message: 'Propiedad publicada, pendiente de verificación' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/listings/:id
router.delete('/:id', auth, (req, res) => {
  const db = getDB();
  const l = db.prepare('SELECT * FROM listings WHERE id=? AND user_id=?').get(req.params.id, req.userId);
  if (!l) return res.status(404).json({ error: 'No encontrada o no autorizado' });
  db.prepare('DELETE FROM listings WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

// POST /api/listings/:id/inquire (contact seller)
router.post('/:id/inquire', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Nombre, email y mensaje requeridos' });
  const db = getDB();
  const userId = req.userId || null;
  db.prepare('INSERT INTO inquiries (listing_id,from_user_id,from_name,from_email,message) VALUES (?,?,?,?,?)').run(req.params.id, userId, name, email, message);
  res.json({ success: true, message: 'Consulta enviada al vendedor' });
});

// GET /api/listings/my/listings (seller's own)
router.get('/my/listings', auth, (req, res) => {
  const db = getDB();
  const listings = db.prepare('SELECT * FROM listings WHERE user_id=? ORDER BY created_at DESC').all(req.userId);
  listings.forEach(l => {
    l.media = db.prepare('SELECT * FROM listing_media WHERE listing_id=? ORDER BY display_order LIMIT 1').all(l.id);
    l.verifications = db.prepare('SELECT COUNT(*) as cnt FROM verifications WHERE listing_id=? AND status="verified"').get(l.id);
  });
  res.json(listings);
});

module.exports = router;
