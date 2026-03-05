const express = require('express');
const { getDB } = require('../models/db');
const router = express.Router();

router.get('/', (req, res) => {
  const db = getDB();
  const { q, country, province, minHa, maxHa, minPrice, maxPrice, type, page = 1 } = req.query;
  let sql = 'SELECT l.*, u.name as seller_name FROM listings l JOIN users u ON l.user_id=u.id WHERE l.status="active"';
  const params = [];
  if (q) { sql += ' AND (l.title LIKE ? OR l.description LIKE ? OR l.city LIKE ?)'; const w = '%' + q + '%'; params.push(w, w, w); }
  if (country) { sql += ' AND l.country=?'; params.push(country); }
  if (province) { sql += ' AND l.province LIKE ?'; params.push('%' + province + '%'); }
  if (minHa) { sql += ' AND l.hectares>=?'; params.push(parseFloat(minHa)); }
  if (maxHa) { sql += ' AND l.hectares<=?'; params.push(parseFloat(maxHa)); }
  if (minPrice) { sql += ' AND l.total_price>=?'; params.push(parseFloat(minPrice)); }
  if (maxPrice) { sql += ' AND l.total_price<=?'; params.push(parseFloat(maxPrice)); }
  if (type) { sql += ' AND l.transaction_type=?'; params.push(type); }
  sql += ' ORDER BY l.created_at DESC LIMIT 24 OFFSET ?';
  params.push((parseInt(page) - 1) * 24);
  const results = db.prepare(sql).all(...params);
  results.forEach(l => {
    l.media = db.prepare('SELECT * FROM listing_media WHERE listing_id=? AND type="photo" ORDER BY display_order LIMIT 1').all(l.id);
  });
  const total = db.prepare('SELECT COUNT(*) as n FROM listings WHERE status="active"').get();
  res.json({ results, total: total.n });
});

router.get('/countries', (req, res) => {
  res.json({
    'Argentina': ['Buenos Aires', 'Córdoba', 'Santa Fe', 'Mendoza', 'Tucumán', 'Entre Ríos', 'Salta', 'Misiones', 'Chaco', 'Corrientes', 'Santiago del Estero', 'San Luis', 'La Pampa', 'Jujuy', 'Río Negro', 'Neuquén', 'Formosa', 'Chubut', 'San Juan', 'La Rioja', 'Catamarca', 'Santa Cruz', 'Tierra del Fuego'],
    'Brasil': ['São Paulo', 'Minas Gerais', 'Rio de Janeiro', 'Bahia', 'Paraná', 'Rio Grande do Sul', 'Pernambuco', 'Ceará', 'Pará', 'Santa Catarina', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Amazonas'],
    'Chile': ['Metropolitana', 'Valparaíso', 'Biobío', 'La Araucanía', 'Los Lagos', 'O\'Higgins', 'Maule', 'Los Ríos', 'Antofagasta', 'Coquimbo', 'Atacama', 'Aysén', 'Magallanes'],
    'Colombia': ['Antioquia', 'Cundinamarca', 'Valle del Cauca', 'Santander', 'Boyacá', 'Nariño', 'Cauca', 'Tolima', 'Huila', 'Meta', 'Caldas', 'Risaralda'],
    'Paraguay': ['Central', 'Alto Paraná', 'Caaguazú', 'San Pedro', 'Itapúa', 'Cordillera', 'Concepción', 'Misiones', 'Guairá', 'Caazapá'],
    'Uruguay': ['Montevideo', 'Canelones', 'San José', 'Colonia', 'Soriano', 'Río Negro', 'Paysandú', 'Salto', 'Artigas', 'Rivera', 'Tacuarembó', 'Durazno'],
    'Bolivia': ['Santa Cruz', 'La Paz', 'Cochabamba', 'Potosí', 'Oruro', 'Tarija', 'Chuquisaca', 'Beni', 'Pando'],
    'Perú': ['Lima', 'Arequipa', 'Cusco', 'La Libertad', 'Piura', 'Lambayeque', 'Junín', 'Puno', 'Loreto', 'San Martín'],
    'Ecuador': ['Pichincha', 'Guayas', 'Manabí', 'El Oro', 'Los Ríos', 'Azuay', 'Esmeraldas', 'Tungurahua'],
    'Venezuela': ['Zulia', 'Miranda', 'Carabobo', 'Bolívar', 'Anzoátegui', 'Aragua', 'Barinas', 'Mérida'],
    'Guyana': ['Demerara-Mahaica', 'East Berbice-Corentyne', 'Essequibo Islands-West Demerara'],
    'Suriname': ['Paramaribo', 'Wanica', 'Nickerie', 'Commewijne'],
  });
});

router.get('/stats', (req, res) => {
  const db = getDB();
  const total = db.prepare('SELECT COUNT(*) as n FROM listings WHERE status="active"').get();
  const countries = db.prepare('SELECT country, COUNT(*) as n FROM listings WHERE status="active" GROUP BY country ORDER BY n DESC').all();
  const recent = db.prepare('SELECT l.*, u.name as seller_name FROM listings l JOIN users u ON l.user_id=u.id WHERE l.status="active" ORDER BY l.created_at DESC LIMIT 6').all();
  recent.forEach(l => { l.media = db.prepare('SELECT * FROM listing_media WHERE listing_id=? AND type="photo" ORDER BY display_order LIMIT 1').all(l.id); });
  res.json({ total: total.n, countries, recent });
});

module.exports = router;
