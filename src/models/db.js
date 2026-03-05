const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

let db;
function getDB() {
  if (!db) {
    db = new Database(path.join(DATA_DIR, 'campolatam.db'));
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function initDB() {
  const c = getDB();
  c.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'buyer',
      country TEXT DEFAULT '',
      province TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      bio TEXT DEFAULT '',
      verified INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      transaction_type TEXT NOT NULL DEFAULT 'sale',
      country TEXT NOT NULL,
      province TEXT NOT NULL,
      city TEXT DEFAULT '',
      hectares REAL DEFAULT 0,
      price_per_hectare REAL DEFAULT 0,
      total_price REAL DEFAULT 0,
      currency TEXT DEFAULT 'USD',
      has_river INTEGER DEFAULT 0,
      num_wells INTEGER DEFAULT 0,
      num_houses INTEGER DEFAULT 0,
      num_worker_houses INTEGER DEFAULT 0,
      has_perimeter_fence INTEGER DEFAULT 0,
      grass_type TEXT DEFAULT '',
      has_bushes INTEGER DEFAULT 0,
      has_forest INTEGER DEFAULT 0,
      forest_percent REAL DEFAULT 0,
      mixed_agri_percent REAL DEFAULT 0,
      annual_rainfall TEXT DEFAULT '',
      agriculture_types TEXT DEFAULT '[]',
      products TEXT DEFAULT '[]',
      fruit_trees TEXT DEFAULT '[]',
      description TEXT DEFAULT '',
      video_url TEXT DEFAULT '',
      status TEXT DEFAULT 'pending',
      verifications_count INTEGER DEFAULT 0,
      views INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS listing_media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listing_id INTEGER NOT NULL,
      type TEXT NOT NULL DEFAULT 'photo',
      filename TEXT NOT NULL,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS verifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listing_id INTEGER NOT NULL,
      notary_id INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      notes TEXT DEFAULT '',
      verified_at DATETIME DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
      FOREIGN KEY (notary_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS buyer_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      country TEXT DEFAULT '',
      province TEXT DEFAULT '',
      min_hectares REAL DEFAULT 0,
      max_hectares REAL DEFAULT 0,
      min_price REAL DEFAULT 0,
      max_price REAL DEFAULT 0,
      transaction_type TEXT DEFAULT 'sale',
      requirements TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listing_id INTEGER NOT NULL,
      from_user_id INTEGER,
      from_name TEXT DEFAULT '',
      from_email TEXT DEFAULT '',
      message TEXT NOT NULL,
      replied INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_listings_country ON listings(country);
    CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
    CREATE INDEX IF NOT EXISTS idx_listings_user ON listings(user_id);
  `);
  console.log('CampoLatam DB initialized');
}

module.exports = { getDB, initDB };
