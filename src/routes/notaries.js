const express = require('express');
const auth = require('../middleware/auth');
const { getDB } = require('../models/db');
const router = express.Router();

// Notary: get pending listings to verify
router.get('/pending', auth, (req, res) => {
  const db = getDB();
  const listings = db.prepare(`
    SELECT l.*, u.name as seller_name,
    (SELECT COUNT(*) FROM verifications WHERE listing_id=l.id AND status='verified') as verified_count,
    (SELECT COUNT(*) FROM verifications WHERE listing_id=l.id AND notary_id=?) as already_verified
    FROM listings l JOIN users u ON l.user_id=u.id
    WHERE l.status IN ('pending','active')
    ORDER BY l.created_at DESC
  `).all(req.userId);
  listings.forEach(l => {
    l.media = db.prepare('SELECT * FROM listing_media WHERE listing_id=? AND type="photo" LIMIT 1').all(l.id);
  });
  res.json(listings);
});

// Notary: verify a listing
router.post('/:listingId/verify', auth, (req, res) => {
  const db = getDB();
  const user = db.prepare('SELECT role FROM users WHERE id=?').get(req.userId);
  if (!user || user.role !== 'notary') return res.status(403).json({ error: 'Solo los escribanos pueden verificar' });

  const already = db.prepare('SELECT id FROM verifications WHERE listing_id=? AND notary_id=?').get(req.params.listingId, req.userId);
  if (already) return res.status(409).json({ error: 'Ya verificaste esta propiedad' });

  const { status = 'verified', notes = '' } = req.body;
  db.prepare('INSERT INTO verifications (listing_id,notary_id,status,notes,verified_at) VALUES (?,?,?,?,CURRENT_TIMESTAMP)').run(req.params.listingId, req.userId, status, notes);

  const count = db.prepare('SELECT COUNT(*) as n FROM verifications WHERE listing_id=? AND status="verified"').get(req.params.listingId);
  db.prepare('UPDATE listings SET verifications_count=? WHERE id=?').run(count.n, req.params.listingId);

  if (count.n >= 5) {
    db.prepare("UPDATE listings SET status='active' WHERE id=?").run(req.params.listingId);
  }
  res.json({ success: true, verifications: count.n, activated: count.n >= 5 });
});

// GET /api/notary/verifications  (notary sees their own verifications)
router.get('/my', auth, (req, res) => {
  const db = getDB();
  const list = db.prepare('SELECT v.*, l.title, l.country, l.province FROM verifications v JOIN listings l ON v.listing_id=l.id WHERE v.notary_id=? ORDER BY v.created_at DESC').all(req.userId);
  res.json(list);
});

// Admin: promote user to notary
router.post('/promote/:userId', auth, (req, res) => {
  const db = getDB();
  const me = db.prepare('SELECT role FROM users WHERE id=?').get(req.userId);
  if (me.role !== 'admin') return res.status(403).json({ error: 'Solo admin' });
  db.prepare("UPDATE users SET role='notary', verified=1 WHERE id=?").run(req.params.userId);
  res.json({ success: true });
});

module.exports = router;
