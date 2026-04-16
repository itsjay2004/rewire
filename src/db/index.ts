import * as SQLite from 'expo-sqlite';
import { MIGRATIONS } from './schema';

const DB_NAME = 'rewire.db';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Get or initialize the database connection.
 */
export function getDb() {
  if (!db) {
    db = SQLite.openDatabaseSync(DB_NAME);
  }
  return db;
}

/**
 * Run migrations and initialize tables.
 */
export async function initDb() {
  const database = getDb();
  
  try {
    // Enable foreign keys
    database.execSync('PRAGMA foreign_keys = ON;');
    
    // Run each migration inside a single transaction if possible, 
    // but here we just run them sequentially for simplicity in init.
    for (const sql of MIGRATIONS) {
      database.execSync(sql);
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}
