/**
 * Export utilities — CSV, XLSX (XML Spreadsheet), PDF (print-based)
 * Pure client-side, no npm dependencies.
 */

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function timestamp() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`;
}

/**
 * Build rows from data + columns config.
 * columns: [{ key, label, render? }]
 * Extracts plain text values, falling back to key access.
 */
function buildRows(data, columns) {
  return data.map(row =>
    columns.map(col => {
      if (col.render) {
        const raw = col.render(row);
        if (raw == null) return '';
        if (typeof raw === 'string' || typeof raw === 'number') return String(raw);
        if (raw?.props?.children != null) {
          const c = raw.props.children;
          if (typeof c === 'string' || typeof c === 'number') return String(c);
          if (Array.isArray(c)) return c.map(x => x?.props?.children ?? x ?? '').join(' ');
          return String(c);
        }
        return '';
      }
      return row[col.key] != null ? String(row[col.key]) : '';
    })
  );
}

/* ─── CSV ──────────────────────────────────────────── */
export function exportCSV(data, columns, filename = 'export') {
  if (!data?.length) return;
  const headers = columns.map(c => c.label);
  const rows = buildRows(data, columns);
  const csvContent =
    '\uFEFF' +
    headers.map(h => `"${h.replace(/"/g, '""')}"`).join(';') + '\n' +
    rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\n');
  triggerDownload(
    new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }),
    `${filename}_${timestamp()}.csv`
  );
}

/* ─── XLSX (XML Spreadsheet 2003) ─────────────────── */
export function exportXLSX(data, columns, filename = 'export') {
  if (!data?.length) return;
  const headers = columns.map(c => c.label);
  const rows = buildRows(data, columns);

  const escapeXml = (s) =>
    String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<?mso-application progid="Excel.Sheet"?>`,
    `<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"`,
    ` xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">`,
    `<Styles>`,
    `  <Style ss:ID="header"><Font ss:Bold="1" ss:Size="11" ss:Color="#FFFFFF"/>`,
    `    <Interior ss:Color="#13294B" ss:Pattern="Solid"/><Alignment ss:Horizontal="Center"/></Style>`,
    `  <Style ss:ID="currency"><NumberFormat ss:Format="#,##0 &quot;Ar&quot;"/></Style>`,
    `  <Style ss:ID="date"><NumberFormat ss:Format="dd/mm/yyyy"/></Style>`,
    `  <Style ss:ID="default"><Font ss:Size="10"/></Style>`,
    `</Styles>`,
    `<Worksheet ss:Name="Données">`,
    `<Table>`,
    `  <Row ss:StyleID="header">`,
    ...headers.map(h => `    <Cell><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`),
    `  </Row>`,
    ...rows.map(r =>
      `  <Row>` +
      r.map((v, i) => {
        const numVal = typeof v === 'string' ? v.replace(/[^0-9.,\-]/g, '').replace(',', '.') : v;
        const isNum = numVal && !isNaN(Number(numVal)) && String(numVal).trim() !== '';
        return `    <Cell${isNum ? ' ss:StyleID="currency"' : ''}><Data ss:Type="${isNum ? 'Number' : 'String'}">${escapeXml(v)}</Data></Cell>`;
      }).join('') +
      `  </Row>`
    ),
    `</Table>`,
    `</Worksheet>`,
    `</Workbook>`
  ].join('\n');

  triggerDownload(
    new Blob([xml], { type: 'application/vnd.ms-excel' }),
    `${filename}_${timestamp()}.xls`
  );
}

/* ─── PDF (print-based) ───────────────────────────── */
export function exportPDF(data, columns, title = 'Export', filename = 'export') {
  if (!data?.length) return;
  const headers = columns.map(c => c.label);
  const rows = buildRows(data, columns);

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<title>${title}</title>
<style>
  @page { size: A4 landscape; margin: 15mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; padding: 20mm; }
  .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #13294B; padding-bottom: 12px; margin-bottom: 20px; }
  .header h1 { font-size: 22px; color: #13294B; }
  .header .meta { font-size: 11px; color: #64748b; text-align: right; }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
  th { background: #13294B; color: #fff; padding: 10px 12px; text-align: left; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-size: 10px; }
  td { padding: 8px 12px; border-bottom: 1px solid #e2e8f0; }
  tr:nth-child(even) { background: #f8fafc; }
  tr:hover { background: #eff6ff; }
  .footer { margin-top: 30px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 9px; font-weight: 600; }
  .badge-primary { background: #dbeafe; color: #2563EB; }
  .badge-success { background: #d1fae5; color: #059669; }
  .badge-warning { background: #fef3c7; color: #d97706; }
  .badge-danger { background: #fee2e2; color: #dc2626; }
</style>
</head>
<body>
  <div class="header">
    <div>
      <h1>${title}</h1>
      <p style="color:#64748b; font-size:12px; margin-top:4px;">SCOM — Système de Commande</p>
    </div>
    <div class="meta">
      <div>Généré le ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
      <div>${data.length} enregistrement(s)</div>
    </div>
  </div>
  <table>
    <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(r => `<tr>${r.map(v => `<td>${v || '—'}</td>`).join('')}</tr>`).join('')}</tbody>
  </table>
  <div class="footer">
    <span>SCOM — Rapport automatique</span>
    <span>Page 1</span>
  </div>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 400);
  }
}
