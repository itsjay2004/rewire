import { getDb } from '../index';

export interface Relapse {
  id?: number;
  streak_id: number;
  timestamp: string;
  trigger: string;
  thoughts: string;
  activity: string;
  emotion: string;
  prevention_note: string;
  general_notes: string;
}

export const RelapsesRepository = {
  /**
   * Log a new relapse.
   */
  insert: (data: Relapse): void => {
    const db = getDb();
    db.runSync(
      `INSERT INTO Relapses (streak_id, timestamp, trigger, thoughts, activity, emotion, prevention_note, general_notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        data.streak_id,
        data.timestamp,
        data.trigger,
        data.thoughts,
        data.activity,
        data.emotion,
        data.prevention_note,
        data.general_notes
      ]
    );
  },

  /**
   * Get all relapses.
   */
  getAll: (): Relapse[] => {
    const db = getDb();
    return db.getAllSync<Relapse>('SELECT * FROM Relapses ORDER BY timestamp DESC;');
  },

  /**
   * Get total relapse count.
   */
  getCount: (): number => {
    const db = getDb();
    const result = db.getFirstSync<{ count: number }>('SELECT COUNT(*) as count FROM Relapses;');
    return result?.count || 0;
  },

  /**
   * Get distribution of triggers.
   */
  getTriggerDistribution: (): { x: string; y: number }[] => {
    const db = getDb();
    const res = db.getAllSync<{ trigger: string; count: number }>(`
      SELECT trigger as x, COUNT(*) as y FROM Relapses GROUP BY trigger ORDER BY y DESC;
    `);
    return res;
  },

  /**
   * Calculate high-risk hour (Most common relapse hour).
   */
  getRiskHour: (): number | null => {
    const db = getDb();
    const res = db.getFirstSync<{ hour: number }>(`
      SELECT CAST(strftime('%H', timestamp) as INT) as hour, COUNT(*) as count 
      FROM Relapses 
      GROUP BY hour 
      ORDER BY count DESC 
      LIMIT 1;
    `);
    return res ? res.hour : null;
  }
};
