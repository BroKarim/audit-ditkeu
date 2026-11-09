import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { listKapFindings } from '@/features/kap/api/service';
import { kapStatusCategory } from '@/features/kap/status';

export const metadata = { title: 'Dashboard : Temuan KAP' };
const normalized = (value: string | null) => (value ?? '').trim().toLowerCase();

export default async function KapPage({
  searchParams
}: {
  searchParams: Promise<{
    q?: string;
    tahun?: string;
    status?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const rows = await listKapFindings();
  const categories = [
    {
      label: 'Total Data KAP',
      count: rows.length,
      description: 'Seluruh baris temuan dan tindak lanjut'
    },
    {
      label: 'Sudah Ditindaklanjuti',
      count: rows.filter((r) => kapStatusCategory(r.statusTindakLanjut) === 'sudah').length,
      description: 'Berstatus sudah'
    },
    {
      label: 'Dalam Proses',
      count: rows.filter((r) => kapStatusCategory(r.statusTindakLanjut) === 'proses').length,
      description: 'Dalam proses atau menunggu verifikasi'
    },
    {
      label: 'Belum Ditindaklanjuti',
      count: rows.filter((r) => kapStatusCategory(r.statusTindakLanjut) === 'belum').length,
      description: 'Belum atau belum ada bukti tindak lanjut'
    }
  ];
  const statuses = [
    ...new Map(
      rows
        .filter((r) => r.statusTindakLanjut?.trim())
        .map((r) => [normalized(r.statusTindakLanjut), r.statusTindakLanjut!.trim()])
    ).values()
  ];
  const years = [...new Set(rows.map((r) => r.tahun))].toSorted((a, b) => b - a);
  const filtered = rows.filter(
    (r) =>
      (!params.q ||
        normalized(r.uraianRekomendasi).includes(params.q.trim().toLowerCase()) ||
        normalized(r.uraianTemuan).includes(params.q.trim().toLowerCase())) &&
      (!params.tahun || String(r.tahun) === params.tahun) &&
      (!params.status || normalized(r.statusTindakLanjut) === normalized(params.status))
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 10));
  const page = Math.min(pages, Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1));
  const linkForPage = (n: number) => {
    const p = new URLSearchParams();
    for (const [key, value] of Object.entries(params))
      if (value && key !== 'page') p.set(key, value);
    p.set('page', String(n));
    return `/dashboard/kap?${p}`;
  };
  const control = 'border-input bg-background h-10 w-full rounded-md border px-3 text-sm';
  return (
    <PageContainer
      pageTitle='Dashboard Temuan KAP'
      pageDescription='Ringkasan tindak lanjut Management Letter'
    >
      <div className='space-y-4'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {categories.map((item) => (
            <Card key={item.label}>
              <CardHeader>
                <CardDescription>{item.label}</CardDescription>
                <CardTitle className='text-3xl tabular-nums'>{item.count}</CardTitle>
              </CardHeader>
              <CardContent className='text-muted-foreground text-sm'>
                {item.description}
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Daftar Temuan</CardTitle>
            <CardDescription>Pilih temuan untuk melihat detail tindak lanjut.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <form className='grid gap-3 md:grid-cols-2 xl:grid-cols-4' action='/dashboard/kap'>
              <label className='space-y-1 text-sm font-medium'>
                Cari temuan
                <input
                  className={control}
                  aria-label='Cari temuan'
                  name='q'
                  defaultValue={params.q}
                  placeholder='Cari temuan atau rekomendasi'
                />
              </label>
              <label className='space-y-1 text-sm font-medium'>
                Tahun
                <select className={control} name='tahun' defaultValue={params.tahun ?? ''}>
                  <option value=''>Semua tahun</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </label>
              <label className='space-y-1 text-sm font-medium'>
                Status
                <select className={control} name='status' defaultValue={params.status ?? ''}>
                  <option value=''>Semua status</option>
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className='bg-primary text-primary-foreground h-10 self-end rounded-md px-4 text-sm font-medium hover:opacity-90'
                type='submit'
              >
                Terapkan filter
              </button>
            </form>
            <div className='overflow-x-auto rounded-md border'>
              <table className='w-full text-left text-sm'>
                <thead className='bg-muted/40'>
                  <tr>
                    {[
                      'Tahun',
                      'Uraian Temuan',
                      'Uraian Rekomendasi',
                      'Status',
                      'Nilai Temuan',
                      ''
                    ].map((h, i) => (
                      <th key={i} scope='col' className='px-3 py-3 font-medium whitespace-nowrap'>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice((page - 1) * 10, page * 10).map((r) => (
                    <tr key={r.id} className='hover:bg-muted/40 border-t'>
                      <td className='px-3 py-3'>{r.tahun}</td>
                      <td className='max-w-md min-w-64 px-3 py-3'>
                        <Link
                          className='hover:underline focus-visible:underline'
                          href={`/dashboard/kap/${r.id}`}
                        >
                          {r.uraianTemuan}
                        </Link>
                      </td>
                      <td className='max-w-md min-w-64 px-3 py-3'>{r.uraianRekomendasi}</td>
                      <td className='px-3 py-3'>
                        {r.statusTindakLanjut && (
                          <span className='bg-muted inline-block rounded-full px-2 py-1 text-xs whitespace-nowrap'>
                            {r.statusTindakLanjut}
                          </span>
                        )}
                      </td>
                      <td className='px-3 py-3 whitespace-nowrap'>
                        {r.nilaiTemuan === null
                          ? null
                          : new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR'
                            }).format(Number(r.nilaiTemuan))}
                      </td>
                      <td className='px-3 py-3'>
                        <Link
                          className='underline'
                          href={`/dashboard/kap/${r.id}`}
                          aria-label={`Lihat detail temuan tahun ${r.tahun}`}
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <p className='text-muted-foreground p-6 text-center text-sm'>
                  Tidak ada data yang sesuai.
                </p>
              )}
            </div>
            <div className='text-muted-foreground flex flex-wrap items-center justify-between gap-3 text-sm'>
              <span>
                {filtered.length} data · Halaman {page} dari {pages}
              </span>
              <div className='flex gap-3'>
                {page > 1 && (
                  <Link href={linkForPage(page - 1)} className='underline'>
                    Sebelumnya
                  </Link>
                )}
                {page < pages && (
                  <Link href={linkForPage(page + 1)} className='underline'>
                    Berikutnya
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
