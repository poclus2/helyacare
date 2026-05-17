import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260517180000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "ambassador" add column if not exists "placement_id" text null;`);
    this.addSql(`alter table if exists "ambassador" add column if not exists "binary_position" text check ("binary_position" in ('LEFT', 'RIGHT')) null;`);
    this.addSql(`alter table if exists "ambassador" add column if not exists "left_bv" jsonb not null default '{"value":"0","precision":20}';`);
    this.addSql(`alter table if exists "ambassador" add column if not exists "right_bv" jsonb not null default '{"value":"0","precision":20}';`);
    this.addSql(`alter table if exists "ambassador" add column if not exists "placement_preference" text check ("placement_preference" in ('LEFT', 'RIGHT', 'WEAKER_LEG', 'AUTOMATIC')) not null default 'AUTOMATIC';`);
    
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_ambassador_placement_id" ON "ambassador" ("placement_id") WHERE deleted_at IS NULL;`);
    this.addSql(`alter table if exists "ambassador" add constraint "ambassador_placement_id_foreign" foreign key ("placement_id") references "ambassador" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "ambassador" drop constraint if exists "ambassador_placement_id_foreign";`);
    this.addSql(`drop index if exists "IDX_ambassador_placement_id";`);
    this.addSql(`alter table if exists "ambassador" drop column if exists "placement_id";`);
    this.addSql(`alter table if exists "ambassador" drop column if exists "binary_position";`);
    this.addSql(`alter table if exists "ambassador" drop column if exists "left_bv";`);
    this.addSql(`alter table if exists "ambassador" drop column if exists "right_bv";`);
    this.addSql(`alter table if exists "ambassador" drop column if exists "placement_preference";`);
  }
}
