const COLORS = [
  ['#1d4ed8','#3b82f6'], ['#059669','#10b981'], ['#d97706','#f59e0b'],
  ['#7c3aed','#8b5cf6'], ['#dc2626','#ef4444'], ['#0891b2','#06b6d4'],
  ['#c026d3','#d946ef'], ['#4f46e5','#6366f1'],
];

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function Avatar({ photo, name, size = 38, radius, fontSize, className, style }) {
  const r = radius ?? Math.round(size * 0.26);
  const fs = fontSize ?? Math.round(size * 0.34);
  const initials = (name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const [c1, c2] = COLORS[hashStr(name || '') % COLORS.length];

  const base = {
    width: size, height: size, borderRadius: r,
    display: 'grid', placeItems: 'center',
    flexShrink: 0, overflow: 'hidden',
    maxWidth: '100%',
  };

  if (photo) {
    return (
      <img src={photo} alt={name}
        style={{ ...base, objectFit: 'cover', height: 'auto', ...style }}
        className={className} />
    );
  }

  return (
    <div className={className} style={{
      ...base,
      background: `linear-gradient(135deg, ${c1}, ${c2})`,
      color: '#fff', fontWeight: 700, fontSize: fs,
      letterSpacing: '0.02em', textTransform: 'uppercase',
      ...style,
    }}>
      {initials}
    </div>
  );
}
