import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_page_content_1_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum_pages_blocks_page_content_1_link_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost', 'link', 'link-underline');
  CREATE TYPE "public"."enum_pages_blocks_page_content_2_items_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum_pages_blocks_page_content_2_items_link_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost', 'link', 'link-underline');
  CREATE TYPE "public"."enum_example_block_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum_example_block_link_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost', 'link', 'link-underline');
  CREATE TYPE "public"."enum_pages_hero_cta_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum_pages_hero_cta_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost', 'link', 'link-underline');
  CREATE TYPE "public"."enum__pages_v_blocks_page_content_1_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum__pages_v_blocks_page_content_1_link_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost', 'link', 'link-underline');
  CREATE TYPE "public"."enum__pages_v_blocks_page_content_2_items_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum__pages_v_blocks_page_content_2_items_link_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost', 'link', 'link-underline');
  CREATE TYPE "public"."enum__example_block_v_link_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum__example_block_v_link_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost', 'link', 'link-underline');
  CREATE TYPE "public"."enum__pages_v_version_hero_cta_type" AS ENUM('custom', 'reference');
  CREATE TYPE "public"."enum__pages_v_version_hero_cta_variant" AS ENUM('primary', 'secondary', 'outline', 'ghost', 'link', 'link-underline');
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" uuid
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" uuid
  );
  
  CREATE TABLE "footer_settings_links_locales" (
  	"link_label" varchar,
  	"link_url" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" uuid
  );
  
  CREATE TABLE "cookie_settings_locales" (
  	"link_label" varchar,
  	"link_url" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "cookie_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" uuid
  );
  
  ALTER TABLE "pages_blocks_page_content_1_locales" RENAME COLUMN "button_text" TO "link_label";
  ALTER TABLE "pages_blocks_page_content_1_locales" RENAME COLUMN "button_link" TO "link_url";
  ALTER TABLE "pages_blocks_page_content_2_items_locales" RENAME COLUMN "link_text" TO "link_label";
  ALTER TABLE "example_block_locales" RENAME COLUMN "cta_text" TO "link_label";
  ALTER TABLE "pages_locales" RENAME COLUMN "hero_cta_text" TO "hero_cta_label";
  ALTER TABLE "_pages_v_blocks_page_content_1_locales" RENAME COLUMN "button_text" TO "link_label";
  ALTER TABLE "_pages_v_blocks_page_content_1_locales" RENAME COLUMN "button_link" TO "link_url";
  ALTER TABLE "pages_blocks_page_content_1" ADD COLUMN "link_type" "enum_pages_blocks_page_content_1_link_type" DEFAULT 'custom';
  ALTER TABLE "pages_blocks_page_content_1" ADD COLUMN "link_variant" "enum_pages_blocks_page_content_1_link_variant" DEFAULT 'primary';
  ALTER TABLE "pages_blocks_page_content_1" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "pages_blocks_page_content_2_items" ADD COLUMN "link_type" "enum_pages_blocks_page_content_2_items_link_type" DEFAULT 'custom';
  ALTER TABLE "pages_blocks_page_content_2_items" ADD COLUMN "link_variant" "enum_pages_blocks_page_content_2_items_link_variant" DEFAULT 'primary';
  ALTER TABLE "pages_blocks_page_content_2_items" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "example_block" ADD COLUMN "link_type" "enum_example_block_link_type" DEFAULT 'custom';
  ALTER TABLE "example_block" ADD COLUMN "link_variant" "enum_example_block_link_variant" DEFAULT 'primary';
  ALTER TABLE "example_block" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "example_block_locales" ADD COLUMN "link_url" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_cta_type" "enum_pages_hero_cta_type" DEFAULT 'custom';
  ALTER TABLE "pages" ADD COLUMN "hero_cta_variant" "enum_pages_hero_cta_variant" DEFAULT 'primary';
  ALTER TABLE "pages" ADD COLUMN "hero_cta_new_tab" boolean;
  ALTER TABLE "pages_locales" ADD COLUMN "hero_cta_url" varchar;
  ALTER TABLE "_pages_v_blocks_page_content_1" ADD COLUMN "link_type" "enum__pages_v_blocks_page_content_1_link_type" DEFAULT 'custom';
  ALTER TABLE "_pages_v_blocks_page_content_1" ADD COLUMN "link_variant" "enum__pages_v_blocks_page_content_1_link_variant" DEFAULT 'primary';
  ALTER TABLE "_pages_v_blocks_page_content_1" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_page_content_2_items" ADD COLUMN "link_type" "enum__pages_v_blocks_page_content_2_items_link_type" DEFAULT 'custom';
  ALTER TABLE "_pages_v_blocks_page_content_2_items" ADD COLUMN "link_variant" "enum__pages_v_blocks_page_content_2_items_link_variant" DEFAULT 'primary';
  ALTER TABLE "_pages_v_blocks_page_content_2_items" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_page_content_2_items_locales" ADD COLUMN "link_label" varchar;
  ALTER TABLE "_example_block_v" ADD COLUMN "link_type" "enum__example_block_v_link_type" DEFAULT 'custom';
  ALTER TABLE "_example_block_v" ADD COLUMN "link_variant" "enum__example_block_v_link_variant" DEFAULT 'primary';
  ALTER TABLE "_example_block_v" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_example_block_v_locales" ADD COLUMN "link_label" varchar;
  ALTER TABLE "_example_block_v_locales" ADD COLUMN "link_url" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_cta_type" "enum__pages_v_version_hero_cta_type" DEFAULT 'custom';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_cta_variant" "enum__pages_v_version_hero_cta_variant" DEFAULT 'primary';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_cta_new_tab" boolean;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_cta_label" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_cta_url" varchar;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_settings_links_locales" ADD CONSTRAINT "footer_settings_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_settings_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_settings_rels" ADD CONSTRAINT "footer_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_settings_rels" ADD CONSTRAINT "footer_settings_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cookie_settings_locales" ADD CONSTRAINT "cookie_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cookie_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cookie_settings_rels" ADD CONSTRAINT "cookie_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cookie_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cookie_settings_rels" ADD CONSTRAINT "cookie_settings_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id");
  CREATE UNIQUE INDEX "footer_settings_links_locales_locale_parent_id_unique" ON "footer_settings_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_settings_rels_order_idx" ON "footer_settings_rels" USING btree ("order");
  CREATE INDEX "footer_settings_rels_parent_idx" ON "footer_settings_rels" USING btree ("parent_id");
  CREATE INDEX "footer_settings_rels_path_idx" ON "footer_settings_rels" USING btree ("path");
  CREATE INDEX "footer_settings_rels_pages_id_idx" ON "footer_settings_rels" USING btree ("pages_id");
  CREATE UNIQUE INDEX "cookie_settings_locales_locale_parent_id_unique" ON "cookie_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "cookie_settings_rels_order_idx" ON "cookie_settings_rels" USING btree ("order");
  CREATE INDEX "cookie_settings_rels_parent_idx" ON "cookie_settings_rels" USING btree ("parent_id");
  CREATE INDEX "cookie_settings_rels_path_idx" ON "cookie_settings_rels" USING btree ("path");
  CREATE INDEX "cookie_settings_rels_pages_id_idx" ON "cookie_settings_rels" USING btree ("pages_id");
  ALTER TABLE "example_block" DROP COLUMN "cta_url";
  ALTER TABLE "pages" DROP COLUMN "hero_cta_enabled";
  ALTER TABLE "pages" DROP COLUMN "hero_cta_url";
  ALTER TABLE "_pages_v_blocks_page_content_2_items_locales" DROP COLUMN "link_text";
  ALTER TABLE "_example_block_v" DROP COLUMN "cta_url";
  ALTER TABLE "_example_block_v_locales" DROP COLUMN "cta_text";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_cta_enabled";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_cta_url";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_cta_text";
  ALTER TABLE "footer_settings_links" DROP COLUMN "link_label";
  ALTER TABLE "footer_settings_links" DROP COLUMN "link_url";
  ALTER TABLE "cookie_settings" DROP COLUMN "link_label";
  ALTER TABLE "cookie_settings" DROP COLUMN "link_url";`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "footer_settings_links_locales" CASCADE;
  DROP TABLE "footer_settings_rels" CASCADE;
  DROP TABLE "cookie_settings_locales" CASCADE;
  DROP TABLE "cookie_settings_rels" CASCADE;
  ALTER TABLE "pages_blocks_page_content_1_locales" ADD COLUMN "button_text" varchar;
  ALTER TABLE "pages_blocks_page_content_1_locales" ADD COLUMN "button_link" varchar;
  ALTER TABLE "pages_blocks_page_content_2_items_locales" ADD COLUMN "link_text" varchar DEFAULT 'Mehr Sehen';
  ALTER TABLE "example_block" ADD COLUMN "cta_url" varchar DEFAULT '/';
  ALTER TABLE "example_block_locales" ADD COLUMN "cta_text" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_cta_enabled" boolean DEFAULT false;
  ALTER TABLE "pages" ADD COLUMN "hero_cta_url" varchar DEFAULT '/';
  ALTER TABLE "pages_locales" ADD COLUMN "hero_cta_text" varchar DEFAULT 'Learn More';
  ALTER TABLE "_pages_v_blocks_page_content_1_locales" ADD COLUMN "button_text" varchar;
  ALTER TABLE "_pages_v_blocks_page_content_1_locales" ADD COLUMN "button_link" varchar;
  ALTER TABLE "_pages_v_blocks_page_content_2_items_locales" ADD COLUMN "link_text" varchar DEFAULT 'Mehr Sehen';
  ALTER TABLE "_example_block_v" ADD COLUMN "cta_url" varchar DEFAULT '/';
  ALTER TABLE "_example_block_v_locales" ADD COLUMN "cta_text" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_cta_enabled" boolean DEFAULT false;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_cta_url" varchar DEFAULT '/';
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_cta_text" varchar DEFAULT 'Learn More';
  ALTER TABLE "footer_settings_links" ADD COLUMN "link_label" varchar;
  ALTER TABLE "footer_settings_links" ADD COLUMN "link_url" varchar;
  ALTER TABLE "cookie_settings" ADD COLUMN "link_label" varchar;
  ALTER TABLE "cookie_settings" ADD COLUMN "link_url" varchar;
  ALTER TABLE "pages_blocks_page_content_1" DROP COLUMN "link_type";
  ALTER TABLE "pages_blocks_page_content_1" DROP COLUMN "link_variant";
  ALTER TABLE "pages_blocks_page_content_1" DROP COLUMN "link_new_tab";
  ALTER TABLE "pages_blocks_page_content_1_locales" DROP COLUMN "link_label";
  ALTER TABLE "pages_blocks_page_content_1_locales" DROP COLUMN "link_url";
  ALTER TABLE "pages_blocks_page_content_2_items" DROP COLUMN "link_type";
  ALTER TABLE "pages_blocks_page_content_2_items" DROP COLUMN "link_variant";
  ALTER TABLE "pages_blocks_page_content_2_items" DROP COLUMN "link_new_tab";
  ALTER TABLE "pages_blocks_page_content_2_items_locales" DROP COLUMN "link_label";
  ALTER TABLE "example_block" DROP COLUMN "link_type";
  ALTER TABLE "example_block" DROP COLUMN "link_variant";
  ALTER TABLE "example_block" DROP COLUMN "link_new_tab";
  ALTER TABLE "example_block_locales" DROP COLUMN "link_label";
  ALTER TABLE "example_block_locales" DROP COLUMN "link_url";
  ALTER TABLE "pages" DROP COLUMN "hero_cta_type";
  ALTER TABLE "pages" DROP COLUMN "hero_cta_variant";
  ALTER TABLE "pages" DROP COLUMN "hero_cta_new_tab";
  ALTER TABLE "pages_locales" DROP COLUMN "hero_cta_label";
  ALTER TABLE "pages_locales" DROP COLUMN "hero_cta_url";
  ALTER TABLE "_pages_v_blocks_page_content_1" DROP COLUMN "link_type";
  ALTER TABLE "_pages_v_blocks_page_content_1" DROP COLUMN "link_variant";
  ALTER TABLE "_pages_v_blocks_page_content_1" DROP COLUMN "link_new_tab";
  ALTER TABLE "_pages_v_blocks_page_content_1_locales" DROP COLUMN "link_label";
  ALTER TABLE "_pages_v_blocks_page_content_1_locales" DROP COLUMN "link_url";
  ALTER TABLE "_pages_v_blocks_page_content_2_items" DROP COLUMN "link_type";
  ALTER TABLE "_pages_v_blocks_page_content_2_items" DROP COLUMN "link_variant";
  ALTER TABLE "_pages_v_blocks_page_content_2_items" DROP COLUMN "link_new_tab";
  ALTER TABLE "_pages_v_blocks_page_content_2_items_locales" DROP COLUMN "link_label";
  ALTER TABLE "_example_block_v" DROP COLUMN "link_type";
  ALTER TABLE "_example_block_v" DROP COLUMN "link_variant";
  ALTER TABLE "_example_block_v" DROP COLUMN "link_new_tab";
  ALTER TABLE "_example_block_v_locales" DROP COLUMN "link_label";
  ALTER TABLE "_example_block_v_locales" DROP COLUMN "link_url";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_cta_type";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_cta_variant";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_cta_new_tab";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_cta_label";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_cta_url";
  DROP TYPE "public"."enum_pages_blocks_page_content_1_link_type";
  DROP TYPE "public"."enum_pages_blocks_page_content_1_link_variant";
  DROP TYPE "public"."enum_pages_blocks_page_content_2_items_link_type";
  DROP TYPE "public"."enum_pages_blocks_page_content_2_items_link_variant";
  DROP TYPE "public"."enum_example_block_link_type";
  DROP TYPE "public"."enum_example_block_link_variant";
  DROP TYPE "public"."enum_pages_hero_cta_type";
  DROP TYPE "public"."enum_pages_hero_cta_variant";
  DROP TYPE "public"."enum__pages_v_blocks_page_content_1_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_page_content_1_link_variant";
  DROP TYPE "public"."enum__pages_v_blocks_page_content_2_items_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_page_content_2_items_link_variant";
  DROP TYPE "public"."enum__example_block_v_link_type";
  DROP TYPE "public"."enum__example_block_v_link_variant";
  DROP TYPE "public"."enum__pages_v_version_hero_cta_type";
  DROP TYPE "public"."enum__pages_v_version_hero_cta_variant";`);
}
