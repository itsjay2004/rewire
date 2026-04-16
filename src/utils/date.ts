/**
 * Date utility for streak calculations.
 */

export interface TimeElapsed {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Calculates the difference between now and a start timestamp.
 */
export function getTimeElapsed(startTimestamp: number): TimeElapsed {
  const now = Date.now();
  const diff = now - startTimestamp;

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds };
}

/**
 * Formats time elapsed into a readable string: "Xd Yh Zm"
 */
export function formatTimeElapsed(elapsed: TimeElapsed): string {
  const parts = [];
  if (elapsed.days > 0) parts.push(`${elapsed.days}d`);
  if (elapsed.hours > 0 || elapsed.days > 0) parts.push(`${elapsed.hours}h`);
  parts.push(`${elapsed.minutes}m`);
  
  return parts.join(' ');
}

/**
 * Formats time into full HH:MM:SS format
 */
export function formatTimer(elapsed: TimeElapsed): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  if (elapsed.days > 0) {
    return `${elapsed.days}d ${pad(elapsed.hours)}:${pad(elapsed.minutes)}:${pad(elapsed.seconds)}`;
  }
  return `${pad(elapsed.hours)}:${pad(elapsed.minutes)}:${pad(elapsed.seconds)}`;
}
