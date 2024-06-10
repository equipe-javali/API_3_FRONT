import * as XLSX from 'xlsx';

export default function exportDataToExcel(data: any[], fileName = 'relatorio.xlsx') {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Relatorio');
  XLSX.writeFile(wb, fileName);
}
