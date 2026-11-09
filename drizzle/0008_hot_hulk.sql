ALTER TABLE "kap_findings" ALTER COLUMN "uraian_temuan" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "kap_findings" ALTER COLUMN "uraian_rekomendasi" DROP NOT NULL;--> statement-breakpoint
UPDATE "kap_findings"
SET
  "uraian_temuan" = NULLIF(BTRIM("uraian_temuan"), ''),
  "uraian_rekomendasi" = NULLIF(BTRIM("uraian_rekomendasi"), ''),
  "tanggapan_manajemen" = NULLIF(BTRIM("tanggapan_manajemen"), ''),
  "status_tindak_lanjut" = NULLIF(BTRIM("status_tindak_lanjut"), ''),
  "deskripsi_tindak_lanjut" = NULLIF(BTRIM("deskripsi_tindak_lanjut"), ''),
  "hasil_akhir" = NULLIF(BTRIM("hasil_akhir"), '');--> statement-breakpoint
ALTER TABLE "kap_findings" DROP COLUMN "satker";--> statement-breakpoint
ALTER TABLE "kap_findings" DROP COLUMN "kode_satker";--> statement-breakpoint
ALTER TABLE "kap_findings" DROP COLUMN "judul_pemeriksaan";--> statement-breakpoint
ALTER TABLE "kap_findings" DROP COLUMN "kode_rekomendasi";--> statement-breakpoint
ALTER TABLE "kap_findings" DROP COLUMN "komitmen_manajemen";--> statement-breakpoint
ALTER TABLE "kap_findings" DROP COLUMN "action_plan";--> statement-breakpoint
ALTER TABLE "kap_findings" DROP COLUMN "sisa";--> statement-breakpoint
ALTER TABLE "kap_findings" DROP COLUMN "keterangan";
