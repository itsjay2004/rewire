import { create } from 'zustand';

/**
 * useAppStore – Global UI state
 * Manages modal visibility and active overlays.
 */

type ActiveModal = 'rescueMode' | 'checkIn' | 'relapse' | 'emergencyLock' | null;

interface AppState {
  activeModal: ActiveModal;
  isFirstLaunch: boolean;
  lockExpiryTimestamp: number | null; // Unix ms

  // Actions
  openModal: (modal: ActiveModal) => void;
  closeModal: () => void;
  setFirstLaunch: (val: boolean) => void;
  setLockExpiry: (ts: number | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeModal: null,
  isFirstLaunch: false,
  lockExpiryTimestamp: null,

  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
  setFirstLaunch: (val) => set({ isFirstLaunch: val }),
  setLockExpiry: (ts) => set({ lockExpiryTimestamp: ts }),
}));
