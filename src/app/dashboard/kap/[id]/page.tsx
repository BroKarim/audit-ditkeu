import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icons } from '@/components/icons';
import PageContainer from '@/components/layout/page-container';
import { getKapFinding } from '@/features/kap/api/service';
import { cn } from '@/lib/utils';

const sections = [
  { id: 'temuan', label: 'Uraian Temuan' },
  { id: 'rekomendasi', label: 'Uraian Rekomendasi' },
  { id: 'tanggapan', label: 'Tanggapan Manajemen' },
  { id: 'tindak-lanjut', label: 'Tindak Lanjut' },
  { id: 'hasil-akhir', label: 'Hasil Akhir' }
];

export default async function KapDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await getKapFinding(id);
  if (!row) notFound();
  const amount =
    row.nilaiTemuan === null
      ? null
      : new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR'
        }).format(Number(row.nilaiTemuan));
  const status = row.statusTindakLanjut;
  const statusClass =
    status?.trim().toLowerCase() === 'sudah'
      ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200'
      : 'bg-muted text-foreground';

  return (
    <PageContainer
      pageTitle='Detail Temuan KAP'
      pageDescription={`Management Letter · Tahun ${row.tahun}`}
      pageHeaderAction={
        <Link
          className='border-input hover:bg-accent focus-visible:ring-ring inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none'
          href='/dashboard/kap'
        >
          <Icons.chevronLeft aria-hidden className='size-4' /> Kembali ke daftar
        </Link>
      }
    >
      <div className='grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_220px]'>
        <article className='bg-card text-card-foreground min-w-0 rounded-xl border p-5 shadow-sm sm:p-8'>
          <header className='border-b pb-6'>
            {row.uraianTemuan && (
              <h2 className='text-2xl font-semibold tracking-tight break-words sm:text-3xl'>
                {row.uraianTemuan}
              </h2>
            )}
            <div className='mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm'>
              <span className='bg-muted rounded-md px-2.5 py-1 font-medium'>Tahun {row.tahun}</span>
              {status && (
                <span className={cn('rounded-md px-2.5 py-1 font-medium', statusClass)}>
                  {status}
                </span>
              )}
              <span>Nilai Temuan: {amount}</span>
            </div>
          </header>
          <section id='temuan' className='scroll-mt-6 border-b py-5'>
            <h3 className='text-lg font-semibold'>Uraian Temuan</h3>
            <p className='mt-2 text-sm leading-6 whitespace-pre-wrap break-words'>
              {row.uraianTemuan}
            </p>
          </section>
          <section id='rekomendasi' className='scroll-mt-6 border-b py-5'>
            <h3 className='text-lg font-semibold'>Uraian Rekomendasi</h3>
            <div className='bg-muted/70 mt-2 rounded-lg p-4 text-sm leading-6 whitespace-pre-wrap break-words'>
              {row.uraianRekomendasi}
            </div>
          </section>
          <section id='tanggapan' className='scroll-mt-6 border-b py-5'>
            <h3 className='text-lg font-semibold'>Tanggapan Manajemen</h3>
            <p className='mt-2 text-sm leading-6 whitespace-pre-wrap break-words'>
              {row.tanggapanManajemen}
            </p>
          </section>
          <section id='tindak-lanjut' className='scroll-mt-6 border-b py-5'>
            <h3 className='text-lg font-semibold'>Tindak Lanjut</h3>
            <dl className='mt-3 grid gap-3 text-sm sm:grid-cols-[180px_minmax(0,1fr)]'>
              <dt className='text-muted-foreground'>Status Tindak Lanjut</dt>
              <dd>{status}</dd>
              <dt className='text-muted-foreground'>Deskripsi Tindak Lanjut</dt>
              <dd className='leading-6 whitespace-pre-wrap break-words'>
                {row.deskripsiTindakLanjut}
              </dd>
            </dl>
          </section>
          <section id='hasil-akhir' className='scroll-mt-6 pt-5'>
            <h3 className='text-lg font-semibold'>Hasil Akhir</h3>
            <div className='mt-2 rounded-md border-l-4 border-green-700 bg-green-50 p-4 text-sm leading-6 whitespace-pre-wrap break-words dark:border-green-500 dark:bg-green-950/40'>
              {row.hasilAkhir}
            </div>
          </section>
        </article>
        <nav aria-label='Pada halaman ini' className='xl:sticky xl:top-6 xl:border-l xl:pl-5'>
          <p className='mb-3 text-sm font-semibold'>Pada halaman ini</p>
          <ul className='flex flex-wrap gap-1 xl:flex-col'>
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  className='text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring block rounded-md px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none'
                  href={`#${section.id}`}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </PageContainer>
  );
}
