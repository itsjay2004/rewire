import { getDb } from '../index';

export interface Streak {
  id: number;
  start_date: string;
  end_date: string | null;
  is_active: number; // 0 or 1
}

export const StreaksRepository = {
  /**
   * Get the current active streak.
   */
  getActiveStreak: (): Streak | null => {
    const db = getDb();
    const result = db.getFirstSync<Streak>(
      'SELECT * FROM Streaks WHERE is_active = 1 ORDER BY start_date DESC LIMIT 1;'
    );
    return result;
  },

  /**
   * Start a new streak.
   */
  createStreak: (startDate: string): void => {
    const db = getDb();
    
    // Deactivate any existing active streaks
    db.runSync('UPDATE Streaks SET is_active = 0 WHERE is_active = 1;');
    
    // Insert new streak
    db.runSync(
      'INSERT INTO Streaks (start_date, is_active) VALUES (?, 1);',
      [startDate]
    );
  },

  /**
   * Deactivate current streak (on relapse).
   */
  deactivateCurrentStreak: (endDate: string): void => {
    const db = getDb();
    db.runSync(
      'UPDATE Streaks SET is_active = 0, end_date = ? WHERE is_active = 1;',
      [endDate]
    );
  },

  /**
   * Get all streaks.
   */
  getAllStreaks: (): Streak[] => {
    const db = getDb();
    return db.getAllSync<Streak>('SELECT * FROM Streaks ORDER BY start_date DESC;');
  },

  /**
   * Get total number of days across all streaks (optional utility).
   */
  getTotalDaysClean: (): number => {
    const db = getDb();
    // This is a simplified calculation, ideally you'd parse dates in JS for accuracy
    const result = db.getFirstSync<{ total: number }>(`
      SELECT SUM(
        CASE 
          WHEN is_active = 1 THEN julianay('now') - julianay(start_date)
          ELSE julianay(end_date) - julianay(start_date)
        END
      ) as total FROM Streaks;
    `);
    return Math.floor(result?.total || 0);
  }
};
