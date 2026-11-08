import { schoolService } from './schoolService.js';

export const reportService = {
  /**
   * Format export data tabel menjadi CSV (kompatibel Excel)
   */
  exportToCSV(filename, headers, rows) {
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${(val ?? '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\r\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Cetak halaman cetak ramah browser (PDF Native)
   */
  triggerPrint() {
    window.print();
  }
};
