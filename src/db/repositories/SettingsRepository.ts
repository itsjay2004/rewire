import { getDb } from '../index';

export const SettingsRepository = {
  /**
   * Set a setting value.
   */
  set: (key: string, value: string): void => {
    const db = getDb();
    db.runSync(
      'INSERT OR REPLACE INTO Settings (key, value) VALUES (?, ?);',
      [key, value]
    );
  },

  /**
   * Get a setting value.
   */
  get: (key: string): string | null => {
    const db = getDb();
    const result = db.getFirstSync<{ value: string }>(
      'SELECT value FROM Settings WHERE key = ?;',
      [key]
    );
    return result?.value || null;
  },

  /**
   * Remove a setting.
   */
  remove: (key: string): void => {
    const db = getDb();
    db.runSync('DELETE FROM Settings WHERE key = ?;', [key]);
  }
};
