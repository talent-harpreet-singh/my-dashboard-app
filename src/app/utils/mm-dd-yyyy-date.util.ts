

function toCalendarDate(year: number, month: number, day: number): Date | null {
  const candidate = new Date(0);
  candidate.setFullYear(year, month - 1, day);
  candidate.setHours(0, 0, 0, 0);
  if (
    candidate.getFullYear() === year &&
    candidate.getMonth() === month - 1 &&
    candidate.getDate() === day
  ) {
    return candidate;
  }
  return null;
}

export function formatMmDdYyyy(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = String(date.getFullYear()).padStart(4, '0');
  return `${mm}-${dd}-${yyyy}`;
}

export function parseFlexibleToDate(valueStr: string): Date | null {
  if (!valueStr || typeof valueStr !== 'string') {
    return null;
  }
  const trimmed = valueStr.trim();
  if (!trimmed) {
    return null;
  }

  const normalized = trimmed.replace(/\//g, '-');
  let datePart = normalized;
  if (normalized.includes('T')) {
    datePart = normalized.split('T')[0]!;
  } else if (/\s/.test(normalized)) {
    datePart = normalized.split(/\s+/)[0]!;
  }

  const parts = datePart.split('-');
  if (parts.length === 3) {
    const p0 = parseInt(parts[0]!, 10);
    const p1 = parseInt(parts[1]!, 10);
    let p2 = parseInt(parts[2]!, 10);
    if (isNaN(p0) || isNaN(p1) || isNaN(p2)) {
      return null;
    }

    if (parts[0]!.length >= 4) {
      return toCalendarDate(p0, p1, p2);
    }

    if (parts[2]!.length <= 2 && p2 < 100) {
      p2 += p2 < 70 ? 2000 : 1900;
    }
    return toCalendarDate(p2, p0, p1);
  }

  const d = new Date(trimmed);
  if (isNaN(d.getTime())) {
    return null;
  }
  return toCalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
}
