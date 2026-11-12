ALTER TABLE "findings" DROP CONSTRAINT "findings_status_check";--> statement-breakpoint
DROP INDEX "findings_natural_key_uq";--> statement-breakpoint
ALTER TABLE "findings" ALTER COLUMN "kode_temuan" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "findings" ADD COLUMN "silahap_no" text;--> statement-breakpoint
CREATE UNIQUE INDEX "findings_silahap_no_uq" ON "findings" USING btree ("silahap_no") WHERE deleted_at is null;--> statement-breakpoint
ALTER TABLE "findings" ADD CONSTRAINT "findings_status_check" CHECK ("findings"."status" in ('Sesuai Rekomendasi', 'Belum Sesuai', 'Belum Ditindaklanjuti', 'Sudah Ditindaklanjuti', 'Tidak Dapat Ditindaklanjuti', 'Input SIPTL'));