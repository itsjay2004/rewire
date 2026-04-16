import { getDb } from '../index';

export interface CheckIn {
  id?: number;
  timestamp: string;
  urge_intensity: number;
  had_urge: number;
  activity: string;
  mood: string;
  context: string;
  reflection: string;
}

export const CheckInsRepository = {
  /**
   * Insert a new check-in.
   */
  insert: (data: CheckIn): void => {
    const db = getDb();
    db.runSync(
      `INSERT INTO CheckIns (timestamp, urge_intensity, had_urge, activity, mood, context, reflection) 
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        data.timestamp,
        data.urge_intensity,
        data.had_urge,
        data.activity,
        data.mood,
        data.context,
        data.reflection
      ]
    );
  },

  /**
   * Get latest check-ins.
   */
  getLatest: (limit: number = 10): CheckIn[] => {
    const db = getDb();
    return db.getAllSync<CheckIn>(
      'SELECT * FROM CheckIns ORDER BY timestamp DESC LIMIT ?;',
      [limit]
    );
  },

  /**
   * Count total check-ins.
   */
  getCount: (): number => {
    const db = getDb();
    const result = db.getFirstSync<{ count: number }>('SELECT COUNT(*) as count FROM CheckIns;');
    return result?.count || 0;
  },

  /**
   * Get weekly intensity trends.
   */
  getIntensityTrends: (): { date: string; intensity: number }[] => {
    const db = getDb();
    // Simplified: Getting avg intensity per day for last 7 days
    const res = db.getAllSync<{ date: string; intensity: number }>(`
      SELECT date(timestamp) as date, AVG(urge_intensity) as intensity 
      FROM CheckIns 
      WHERE timestamp >= date('now', '-7 days')
      GROUP BY date(timestamp)
      ORDER BY date ASC;
    `);
    return res;
  }
};
