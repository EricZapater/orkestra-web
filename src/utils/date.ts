export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("ca-ES").format(new Date(dateString));
}

export function formatURLDate(dateString: string): string {
  var date = new Date(dateString);
  const formatted = date.toISOString().split("T")[0];
  return formatted;
}
