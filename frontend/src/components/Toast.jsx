import { useEffect } from 'react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;
  const cls = 'toast toast--' + (toast.type || 'success');
  return (
    <div className={cls}>
      <div className="toast__title">{toast.title}</div>
      {toast.message && <div className="toast__message">{toast.message}</div>}
    </div>
  );
}
