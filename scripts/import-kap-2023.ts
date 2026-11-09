import { config } from 'dotenv';
import postgres from 'postgres';
import * as XLSX from 'xlsx';

config({ path: '.env.local', quiet: true });
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const workbook = XLSX.readFile('data/KAP/Manajemen letter 2023.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '' });
for (const merge of sheet['!merges'] ?? []) {
  const value = rows[merge.s.r]?.[merge.s.c];
  for (let r = merge.s.r; r <= merge.e.r; r++) {
    for (let c = merge.s.c; c <= merge.e.c; c++) {
      if (rows[r] && (rows[r][c] === '' || rows[r][c] == null)) rows[r][c] = value;
    }
  }
}
const text = (value: unknown) =>
  String(value ?? '')
    .replaceAll(String.fromCharCode(0), '')
    .trim();
const sourceRows = rows.slice(2).filter((r) => r.slice(1, 8).some((v) => text(v)));
const skipped = sourceRows.filter((r) => !text(r[1])).length;
const records = sourceRows
  .filter((r) => text(r[1]))
  .map((r) => ({
    tahun: 2023,
    uraian_temuan: text(r[1]),
    uraian_rekomendasi: text(r[2]) || null,
    tanggapan_manajemen: text(r[4]) || null,
    status_tindak_lanjut: text(r[5]) || null,
    deskripsi_tindak_lanjut: text(r[6]) || null,
    hasil_akhir: text(r[7]) || null
  }));
if (records.length + skipped !== 19) throw new Error('Unexpected workbook structure');
const sql = postgres(process.env.DATABASE_URL, { prepare: false });
try {
  await sql.begin(async (tx) => {
    await tx`lock table kap_findings in share row exclusive mode`;
    const [existing] = await tx`select count(*)::int as count from kap_findings where tahun = 2023`;
    if (existing.count) throw new Error('KAP 2023 data already exists; import cancelled');
    await tx`insert into kap_findings ${tx(records, 'tahun', 'uraian_temuan', 'uraian_rekomendasi', 'tanggapan_manajemen', 'status_tindak_lanjut', 'deskripsi_tindak_lanjut', 'hasil_akhir')}`;
  });
  process.stdout.write(
    `Imported ${records.length} KAP rows; skipped ${skipped} without uraian temuan\n`
  );
} finally {
  await sql.end();
}
