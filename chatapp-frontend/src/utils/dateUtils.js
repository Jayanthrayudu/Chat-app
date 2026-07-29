/**
 * Formats an ISO datetime string (e.g. backend "createdAt") into a short
 * time label like "14:05" for message bubbles.
 */
export function formatMessageTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Formats a date into a conversation-list-friendly relative label.
 */
export function formatRelativeDay(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return formatMessageTime(isoString);
  if (isYesterday) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

/**
 * Returns a day-divider label ("Today", "Yesterday", or a full date) used
 * to group messages in the message list.
 */
export function formatDayDivider(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";
  return date.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
}

export function isSameDay(isoA, isoB) {
  if (!isoA || !isoB) return false;
  return new Date(isoA).toDateString() === new Date(isoB).toDateString();
}
