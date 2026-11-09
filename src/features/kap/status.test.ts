import { expect, test } from 'bun:test';
import { kapStatusCategory } from './status';

test('mengelompokkan status KAP tanpa menganggap status kosong sudah selesai', () => {
  expect(kapStatusCategory(' Sudah ')).toBe('sudah');
  expect(kapStatusCategory('Dalam proses')).toBe('proses');
  expect(kapStatusCategory('Diklaim selesai oleh manajemen, belum diverifikasi')).toBe('proses');
  expect(kapStatusCategory('Belum')).toBe('belum');
  expect(kapStatusCategory('Belum ada bukti tindak lanjut')).toBe('belum');
  expect(kapStatusCategory(null)).toBeNull();
  expect(kapStatusCategory('status lain')).toBeNull();
});
