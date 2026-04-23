import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260419140415 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "wallet" drop constraint if exists "wallet_ambassador_id_unique";`);
    this.addSql(`alter table if exists "ambassador" drop constraint if exists "ambassador_referral_code_unique";`);
    this.addSql(`alter table if exists "ambassador" drop constraint if exists "ambassador_customer_id_unique";`);
    this.addSql(`create table if not exists "ambassador" ("id" text not null, "customer_id" text not null, "referral_code" text not null, "sponsor_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "ambassador_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_ambassador_customer_id_unique" ON "ambassador" ("customer_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_ambassador_referral_code_unique" ON "ambassador" ("referral_code") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_ambassador_sponsor_id" ON "ambassador" ("sponsor_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_ambassador_deleted_at" ON "ambassador" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "wallet" ("id" text not null, "balance" numeric not null default 0, "ambassador_id" text not null, "raw_balance" jsonb not null default '{"value":"0","precision":20}', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "wallet_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_wallet_ambassador_id_unique" ON "wallet" ("ambassador_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_wallet_deleted_at" ON "wallet" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "ledger_entry" ("id" text not null, "amount" numeric not null, "wallet_id" text not null, "order_id" text not null, "status" text check ("status" in ('pending', 'available', 'paid')) not null default 'pending', "raw_amount" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "ledger_entry_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_ledger_entry_wallet_id" ON "ledger_entry" ("wallet_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_ledger_entry_order_id" ON "ledger_entry" ("order_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_ledger_entry_deleted_at" ON "ledger_entry" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "ambassador" add constraint "ambassador_sponsor_id_foreign" foreign key ("sponsor_id") references "ambassador" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table if exists "wallet" add constraint "wallet_ambassador_id_foreign" foreign key ("ambassador_id") references "ambassador" ("id") on update cascade;`);

    this.addSql(`alter table if exists "ledger_entry" add constraint "ledger_entry_wallet_id_foreign" foreign key ("wallet_id") references "wallet" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "ambassador" drop constraint if exists "ambassador_sponsor_id_foreign";`);

    this.addSql(`alter table if exists "wallet" drop constraint if exists "wallet_ambassador_id_foreign";`);

    this.addSql(`alter table if exists "ledger_entry" drop constraint if exists "ledger_entry_wallet_id_foreign";`);

    this.addSql(`drop table if exists "ambassador" cascade;`);

    this.addSql(`drop table if exists "wallet" cascade;`);

    this.addSql(`drop table if exists "ledger_entry" cascade;`);
  }

}
