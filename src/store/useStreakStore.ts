import { create } from 'zustand';
import { StreaksRepository } from '../db/repositories/StreaksRepository';
import { CheckInsRepository } from '../db/repositories/CheckInsRepository';

interface StreakState {
  currentStreakStartTimestamp: number | null; // Unix ms
  totalResisted: number;
  longestStreakDays: number;
  totalRelapses: number;
  isLoading: boolean;

  // Actions
  fetchData: () => void;
  startNewStreak: () => void;
  updateLocalResisted: (count: number) => void;
}

export const useStreakStore = create<StreakState>((set, get) => ({
  currentStreakStartTimestamp: null,
  totalResisted: 0,
  longestStreakDays: 0,
  totalRelapses: 0,
  isLoading: true,

  fetchData: () => {
    set({ isLoading: true });
    try {
      const activeStreak = StreaksRepository.getActiveStreak();
      const totalResisted = CheckInsRepository.getCount();
      // In a real app we'd calculate longest streak from all records
      const streaks = StreaksRepository.getAllStreaks();
      const longest = streaks.reduce((max, s) => {
        const start = new Date(s.start_date).getTime();
        const end = s.end_date ? new Date(s.end_date).getTime() : Date.now();
        const diffDays = (end - start) / (1000 * 60 * 60 * 24);
        return Math.max(max, Math.floor(diffDays));
      }, 0);

      set({
        currentStreakStartTimestamp: activeStreak ? new Date(activeStreak.start_date).getTime() : null,
        totalResisted,
        longestStreakDays: longest,
        totalRelapses: streaks.length > 0 ? streaks.length - (activeStreak ? 1 : 0) : 0,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching streak data:', error);
      set({ isLoading: false });
    }
  },

  startNewStreak: () => {
    const now = new Date().toISOString();
    StreaksRepository.createStreak(now);
    set({
      currentStreakStartTimestamp: new Date(now).getTime(),
    });
  },

  updateLocalResisted: (count) => set({ totalResisted: count }),
}));
