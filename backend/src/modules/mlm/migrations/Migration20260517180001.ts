import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260517180001 extends Migration {

  override async up(): Promise<void> {
    // Adding the missing "numeric" and "raw_" JSONB columns required by Medusa's bigNumber()
    // left_bv and right_bv might have been added as jsonb by the previous flawed migration,
    // so we need to fix them.
    
    // First, let's rename the existing wrong ones to raw_ if they are jsonb, or just drop and recreate
    this.addSql(`alter table if exists "ambassador" drop column if exists "left_bv";`);
    this.addSql(`alter table if exists "ambassador" drop column if exists "right_bv";`);

    this.addSql(`alter table if exists "ambassador" add column if not exists "left_bv" numeric not null default 0;`);
    this.addSql(`alter table if exists "ambassador" add column if not exists "raw_left_bv" jsonb not null default '{"value":"0","precision":20}';`);
    
    this.addSql(`alter table if exists "ambassador" add column if not exists "right_bv" numeric not null default 0;`);
    this.addSql(`alter table if exists "ambassador" add column if not exists "raw_right_bv" jsonb not null default '{"value":"0","precision":20}';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "ambassador" drop column if exists "left_bv";`);
    this.addSql(`alter table if exists "ambassador" drop column if exists "raw_left_bv";`);
    this.addSql(`alter table if exists "ambassador" drop column if exists "right_bv";`);
    this.addSql(`alter table if exists "ambassador" drop column if exists "raw_right_bv";`);
  }
}
