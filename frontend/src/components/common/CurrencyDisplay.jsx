import { formatAriary } from '../../utils/formatCurrency.js';

export default function CurrencyDisplay({ value, compact = false, size = 'md' }) {
  const sizes = { sm: '14px', md: '18px', lg: '24px' };
  return (
    <span style={{ whiteSpace: 'nowrap', fontWeight: 500, fontSize: sizes[size] }}>
      {formatAriary(value, { compact }).replace(' Ar', '')}
      <span style={{ fontSize: '0.7em', fontWeight: 400, color: '#888', marginLeft: '4px' }}>
        Ar
      </span>
    </span>
  );
}
