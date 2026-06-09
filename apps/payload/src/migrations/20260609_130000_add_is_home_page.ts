import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" ADD COLUMN "is_home_page" boolean DEFAULT false;
  ALTER TABLE "_pages_v" ADD COLUMN "version_is_home_page" boolean DEFAULT false;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP COLUMN "is_home_page";
  ALTER TABLE "_pages_v" DROP COLUMN "version_is_home_page";`)
}
