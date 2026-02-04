/**
 * Timer URL encoding/decoding utilities
 * URL format: /timer/5h30m-1738681200?title=Meeting%20Starts
 */

export interface TimerData {
  createdAt: number; // Unix timestamp (seconds)
  duration: number; // Duration in seconds
  title?: string; // Optional timer title
}

// Maximum duration: 30 days in seconds
export const MAX_DURATION_SECONDS = 30 * 24 * 60 * 60; // 2,592,000 seconds

/**
 * Parse duration string to seconds
 * Supports: 5h, 30m, 45s, 5h30m, 1d, 1d5h30m, etc.
 */
export function parseDuration(str: string): number {
  const match = str.match(/(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
  if (!match) return 0;

  const [, d, h, m, s] = match;
  const days = parseInt(d) || 0;
  const hours = parseInt(h) || 0;
  const minutes = parseInt(m) || 0;
  const seconds = parseInt(s) || 0;

  return days * 86400 + hours * 3600 + minutes * 60 + seconds;
}

/**
 * Format seconds to duration string
 * e.g., 19800 -> "5h30m"
 */
export function formatDurationString(seconds: number): string {
  if (seconds <= 0) return "0s";

  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  let result = "";
  if (d) result += `${d}d`;
  if (h) result += `${h}h`;
  if (m) result += `${m}m`;
  // Only show seconds if no days/hours or if seconds exist
  if (s && !d) result += `${s}s`;

  return result || "0s";
}

/**
 * Format seconds to human-readable string
 * e.g., 19800 -> "5 hours 30 minutes"
 */
export function formatDurationHuman(seconds: number): string {
  if (seconds <= 0) return "0 seconds";

  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const parts: string[] = [];
  if (d) parts.push(`${d} day${d > 1 ? "s" : ""}`);
  if (h) parts.push(`${h} hour${h > 1 ? "s" : ""}`);
  if (m) parts.push(`${m} minute${m > 1 ? "s" : ""}`);
  if (s && !d && !h) parts.push(`${s} second${s > 1 ? "s" : ""}`);

  return parts.join(" ") || "0 seconds";
}

/**
 * Create a timer token from duration (in seconds)
 * Returns: "5h30m-1738681200"
 */
export function encodeTimer(durationSeconds: number): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const clampedDuration = Math.min(durationSeconds, MAX_DURATION_SECONDS);
  return `${formatDurationString(clampedDuration)}-${timestamp}`;
}

/**
 * Decode a timer token
 * Returns null if invalid
 */
export function decodeTimer(token: string): TimerData | null {
  const lastDashIndex = token.lastIndexOf("-");
  if (lastDashIndex === -1) return null;

  const durationPart = token.substring(0, lastDashIndex);
  const timestampPart = token.substring(lastDashIndex + 1);

  const duration = parseDuration(durationPart);
  const createdAt = parseInt(timestampPart);

  if (!duration || !createdAt || isNaN(createdAt)) return null;

  // Validate timestamp (should be reasonable - within last 31 days and not in future)
  const now = Math.floor(Date.now() / 1000);
  const thirtyOneDaysAgo = now - 31 * 24 * 60 * 60;

  if (createdAt > now + 60) return null; // Allow 60s clock skew
  if (createdAt < thirtyOneDaysAgo) return null; // Too old

  return { createdAt, duration };
}

/**
 * Get remaining time in seconds
 * Returns 0 if expired
 */
export function getTimeRemaining(data: TimerData): number {
  const now = Math.floor(Date.now() / 1000);
  const elapsed = now - data.createdAt;
  return Math.max(0, data.duration - elapsed);
}

/**
 * Get end timestamp
 */
export function getEndTime(data: TimerData): number {
  return data.createdAt + data.duration;
}

/**
 * Check if timer is expired
 */
export function isTimerExpired(data: TimerData): boolean {
  return getTimeRemaining(data) <= 0;
}

/**
 * Format remaining time as HH:MM:SS
 */
export function formatTimeDisplay(seconds: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return { days: d, hours: h, minutes: m, seconds: s };
}

/**
 * Calculate progress percentage (0-100)
 * 100 = just started, 0 = finished
 */
export function getProgressPercentage(data: TimerData): number {
  const remaining = getTimeRemaining(data);
  if (data.duration <= 0) return 0;
  return (remaining / data.duration) * 100;
}

/**
 * Format date for display
 */
export function formatCreatedDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Validate duration input
 */
export function validateDuration(
  hours: number,
  minutes: number,
  seconds: number
): { valid: boolean; error?: string; totalSeconds: number } {
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  if (totalSeconds <= 0) {
    return { valid: false, error: "Please set a duration", totalSeconds: 0 };
  }

  if (totalSeconds > MAX_DURATION_SECONDS) {
    return {
      valid: false,
      error: "Maximum duration is 30 days",
      totalSeconds,
    };
  }

  return { valid: true, totalSeconds };
}
