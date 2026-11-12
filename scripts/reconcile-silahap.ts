import { readFile } from 'node:fs/promises';
import { and, eq, isNotNull, isNull } from 'drizzle-orm';
import * as XLSX from 'xlsx';

import { db } from '@/db/client';
import { findings } from '@/db/schema';
import { applyImport } from '@/features/findings/api/import-core';
import { importIdentity, mapSheetRows } from '@/features/findings/utils/import-xlsx';

const path = process.argv[2];
if (!path) throw new Error('Berikan path XLSX SILAHAP.');
const buffer = await readFile(path);
const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
  workbook.Sheets[workbook.SheetNames[0]],
  { defval: '' }
);
const { records, skipped } = mapSheetRows(rows);
if (skipped.length)
  throw new Error(`XLSX memiliki ${skipped.length} baris tidak valid; rekonsiliasi dibatalkan.`);

await db.transaction(async (tx) => {
  const existing = await tx
    .select()
    .from(findings)
    .where(
      and(
        isNull(findings.deletedAt),
        isNotNull(findings.lastImportBatchId),
        isNull(findings.silahapNo)
      )
    );
  const byKey = new Map<string, typeof records>();
  for (const record of records) {
    const key = importIdentity(record);
    byKey.set(key, [...(byKey.get(key) ?? []), record]);
  }
  const assigned = new Set<string>();
  for (const finding of existing) {
    const matches =
      byKey.get(importIdentity({ ...finding, kodeTemuan: finding.kodeTemuan ?? '' })) ?? [];
    if (matches.length !== 1 || assigned.has(matches[0].silahapNo))
      throw new Error(`Pemetaan tidak unik untuk ${finding.kodeDisplay}; transaksi dibatalkan.`);
    assigned.add(matches[0].silahapNo);
    await tx
      .update(findings)
      .set({ silahapNo: matches[0].silahapNo })
      .where(eq(findings.id, finding.id));
  }
  console.log(`Dipetakan ${existing.length} temuan lama.`);
});

const summary = await applyImport(buffer, path.split('/').pop() ?? 'silahap.xlsx', {
  id: null,
  email: 'system@local',
  name: null
});
console.log(JSON.stringify(summary));
process.exit(summary.failed || summary.skipped.length ? 1 : 0);
