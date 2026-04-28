export function formatDate(date: string | null | undefined): string {
  if (!date) return 'Not dated';
  return date;
}

export function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
