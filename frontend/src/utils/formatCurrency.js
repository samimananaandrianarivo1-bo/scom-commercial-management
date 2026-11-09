export function formatAriary(value, { compact = false } = {}) {
  if (value === null || value === undefined || isNaN(value)) return '—';

  if (compact && Math.abs(value) >= 1_000_000) {
    const millions = value / 1_000_000;
    return `${millions.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} M Ar`;
  }

  return `${Math.round(value).toLocaleString('fr-FR')} Ar`;
}
