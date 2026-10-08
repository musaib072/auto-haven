import { isSameDay } from "date-fns";

/** Returns true when the slot is already in the past (or within the next hour) for today. */
export function isSlotUnavailable(date: Date | undefined, hour: number, now = new Date()) {
  if (!date || !isSameDay(date, now)) return false;
  return hour <= now.getHours() + 1;
}
