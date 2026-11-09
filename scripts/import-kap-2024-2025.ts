import dotenv from 'dotenv';
import postgres from 'postgres';
import * as XLSX from 'xlsx';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: '.env.local', quiet: true });
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const clean = (value: unknown) =>
  String(value ?? '')
    .replaceAll(String.fromCharCode(0), '')
    .trim();
const nullable = (value: unknown) => clean(value) || null;
const text = (path: string, rowOffset: number, column: number) => {
  const workbook = XLSX.readFile(path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '' });
  return rows.slice(rowOffset).filter((row) => clean(row[column]));
};
const file2024 = fileURLToPath(
  new URL('../data/KAP/Matrik Managemen Letter KAP Tahun 2024.xlsx', import.meta.url)
);
const file2025 = fileURLToPath(
  new URL('../data/KAP/Matriks_Tindak_Lanjut_ML_USK_2025.xlsx', import.meta.url)
);
const rows2024 = text(file2024, 1, 4);
const rows2025 = text(file2025, 3, 3);
if (rows2024.length !== 19 || rows2025.length !== 28)
  throw new Error(`Unexpected source row count: 2024=${rows2024.length}, 2025=${rows2025.length}`);
const records = [
  ...rows2024.map((row) => ({
    tahun: 2024,
    uraian_temuan: clean(row[4]),
    uraian_rekomendasi: nullable(row[6]),
    nilai_temuan: nullable(row[9]),
    tanggapan_manajemen:
      [
        row[7] && `Tanggapan Manajemen:\n${clean(row[7])}`,
        row[8] && `Komitmen Manajemen:\n${clean(row[8])}`
      ]
        .filter(Boolean)
        .join('\n\n') || null,
    status_tindak_lanjut: nullable(row[10]),
    deskripsi_tindak_lanjut:
      [row[11] && `Sisa: ${clean(row[11])}`, row[12] && `Keterangan: ${clean(row[12])}`]
        .filter(Boolean)
        .join('\n\n') || null,
    hasil_akhir: null
  })),
  ...rows2025.map((row) => ({
    tahun: 2025,
    uraian_temuan: clean(row[3]),
    uraian_rekomendasi: `${clean(row[4])}: ${clean(row[5])}`,
    nilai_temuan: null,
    tanggapan_manajemen: nullable(row[8]),
    status_tindak_lanjut: nullable(row[7]),
    deskripsi_tindak_lanjut: null,
    hasil_akhir: null
  }))
];
const sql = postgres(process.env.DATABASE_URL, { prepare: false });
try {
  await sql.begin(async (tx) => {
    await tx`lock table kap_findings in share row exclusive mode`;
    const existing =
      await tx`select tahun, count(*)::int as count from kap_findings where tahun in (2024, 2025) group by tahun`;
    if (existing.length)
      throw new Error(`Rows already exist for years: ${JSON.stringify(existing)}`);
    await tx`insert into kap_findings ${tx(records, 'tahun', 'uraian_temuan', 'uraian_rekomendasi', 'nilai_temuan', 'tanggapan_manajemen', 'status_tindak_lanjut', 'deskripsi_tindak_lanjut', 'hasil_akhir')}`;
  });
  const result =
    await sql`select tahun, count(*)::int as count from kap_findings where tahun in (2024, 2025) group by tahun order by tahun`;
  console.log(JSON.stringify(result));
} finally {
  await sql.end();
}
