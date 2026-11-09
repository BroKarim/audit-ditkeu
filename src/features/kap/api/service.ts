'use server';

import { asc, eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { kapFindings } from '@/db/schema';
import { requireAuth } from '@/lib/rbac';

export async function listKapFindings() {
  await requireAuth();
  return db
    .select()
    .from(kapFindings)
    .orderBy(asc(kapFindings.tahun), asc(kapFindings.createdAt), asc(kapFindings.id));
}

export async function getKapFinding(id: string) {
  await requireAuth();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null;
  const [row] = await db.select().from(kapFindings).where(eq(kapFindings.id, id)).limit(1);
  return row ?? null;
}
