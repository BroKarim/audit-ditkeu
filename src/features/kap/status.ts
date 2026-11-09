export function kapStatusCategory(status: string | null): 'sudah' | 'proses' | 'belum' | null {
  switch (status?.trim().toLowerCase()) {
    case 'sudah':
      return 'sudah';
    case 'dalam proses':
    case 'diklaim selesai oleh manajemen, belum diverifikasi':
      return 'proses';
    case 'belum':
    case 'belum ada bukti tindak lanjut':
      return 'belum';
    default:
      return null;
  }
}
