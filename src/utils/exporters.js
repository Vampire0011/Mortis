// Simple CSV and PDF export helpers (run in the browser, no server).
export function downloadCSV(filename, rows) {
  if (!rows.length) return
  const keys = Object.keys(rows[0])
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = [keys.join(','), ...rows.map((r) => keys.map((k) => esc(r[k])).join(','))].join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}
export async function downloadPDF(filename, title, rows) {
  const { jsPDF } = await import('jspdf') // loaded only when a PDF is requested
  const doc = new jsPDF()
  doc.setFontSize(16)
  doc.text(title, 14, 16)
  doc.setFontSize(9)
  doc.text('Demo export - generated in the browser. Confidential records are excluded.', 14, 23)
  let y = 32
  rows.forEach((r, i) => {
    const line = `${i + 1}. ` + Object.values(r).map((v) => String(v ?? '')).join('  |  ')
    doc.splitTextToSize(line, 180).forEach((t) => { if (y > 280) { doc.addPage(); y = 16 } doc.text(t, 14, y); y += 5 })
    y += 2
  })
  doc.save(filename)
}
