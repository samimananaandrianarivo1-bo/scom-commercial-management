export { formatAriary as money } from './formatCurrency.js';

export const nombre = (n) =>
  new Intl.NumberFormat('fr-FR').format(Number(n || 0));

export const dateFR = (d) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('fr-FR'); } catch { return d; }
};
