import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20251008090000 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'ALTER TABLE IF EXISTS "company" ADD COLUMN IF NOT EXISTS "registration_number" text NULL, ADD COLUMN IF NOT EXISTS "tax_id" text NULL, ADD COLUMN IF NOT EXISTS "kyb_status" text CHECK ("kyb_status" IN (\'pending\', \'approved\', \'rejected\')) NOT NULL DEFAULT \'pending\';'
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'ALTER TABLE IF EXISTS "company" DROP COLUMN IF EXISTS "registration_number", DROP COLUMN IF EXISTS "tax_id", DROP COLUMN IF EXISTS "kyb_status";'
    );
  }
}
