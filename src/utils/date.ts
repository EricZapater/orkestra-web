export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("ca-ES").format(new Date(dateString));
}

export function formatURLDate(dateString: string): string {
  var date = new Date(dateString);
  const formatted = date.toISOString().split("T")[0];
  return formatted;
}

export function setStartOfDay(date: Date | null): Date | null {
  if (!date) return null;
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

export function setEndOfDay(date: Date | null): Date | null {
  if (!date) return null;
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}
