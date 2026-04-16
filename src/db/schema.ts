export const SCHEMA = {
  STREAKS: `
    CREATE TABLE IF NOT EXISTS Streaks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      start_date TEXT NOT NULL,
      end_date TEXT,
      is_active INTEGER DEFAULT 1
    );
  `,
  CHECKINS: `
    CREATE TABLE IF NOT EXISTS CheckIns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      urge_intensity INTEGER,
      had_urge INTEGER,
      activity TEXT,
      mood TEXT,
      context TEXT,
      reflection TEXT
    );
  `,
  RELAPSES: `
    CREATE TABLE IF NOT EXISTS Relapses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      streak_id INTEGER,
      timestamp TEXT NOT NULL,
      trigger TEXT,
      thoughts TEXT,
      activity TEXT,
      emotion TEXT,
      prevention_note TEXT,
      general_notes TEXT,
      FOREIGN KEY (streak_id) REFERENCES Streaks (id)
    );
  `,
  SETTINGS: `
    CREATE TABLE IF NOT EXISTS Settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `,
};

export const MIGRATIONS = [
  SCHEMA.STREAKS,
  SCHEMA.CHECKINS,
  SCHEMA.RELAPSES,
  SCHEMA.SETTINGS,
];
