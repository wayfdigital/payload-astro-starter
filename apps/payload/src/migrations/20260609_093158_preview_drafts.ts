import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('default', 'exampleHero', 'category', 'categoriesGrid');
  CREATE TYPE "public"."enum__pages_v_version_hero_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__pages_v_version_hero_background" AS ENUM('none', 'light-gray', 'dark', 'gradient');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('en', 'pl', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'sv', 'da', 'fi', 'cs', 'sk', 'hu', 'ro', 'bg', 'hr', 'sl', 'lt', 'lv', 'et', 'el', 'mt', 'ga', 'ua');
  CREATE TABLE "_pages_v_blocks_page_content_1" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"image_id" uuid,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_page_content_1_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"content" varchar,
  	"button_text" varchar,
  	"button_link" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_page_content_2_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"icon_id" uuid,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_page_content_2_items_locales" (
  	"title" varchar,
  	"content" varchar,
  	"link_text" varchar DEFAULT 'Mehr Sehen',
  	"link_url" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_page_content_2" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_page_content_2_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_page_content_3_audience" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_page_content_3_audience_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_page_content_3" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_page_content_3_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"form_id" uuid,
  	"enable_intro" boolean,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_block_locales" (
  	"intro_content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "_example_block_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"cta_url" varchar DEFAULT '/',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_example_block_v_locales" (
  	"title" varchar,
  	"description" varchar,
  	"cta_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "_pages_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_slug" varchar,
  	"version_hero_type" "enum__pages_v_version_hero_type" DEFAULT 'default',
  	"version_hero_alignment" "enum__pages_v_version_hero_alignment" DEFAULT 'center',
  	"version_hero_background" "enum__pages_v_version_hero_background" DEFAULT 'none',
  	"version_hero_cta_enabled" boolean DEFAULT false,
  	"version_hero_cta_url" varchar DEFAULT '/',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_hero_title" varchar,
  	"version_hero_description" varchar,
  	"version_hero_eyebrow" varchar,
  	"version_hero_cta_text" varchar DEFAULT 'Learn More',
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" uuid,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  ALTER TABLE "pages_blocks_form_block" ALTER COLUMN "form_id" DROP NOT NULL;
  ALTER TABLE "example_block_locales" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "pages" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "pages" ALTER COLUMN "hero_type" DROP NOT NULL;
  ALTER TABLE "admins" ADD COLUMN "enable_a_p_i_key" boolean;
  ALTER TABLE "admins" ADD COLUMN "api_key" varchar;
  ALTER TABLE "admins" ADD COLUMN "api_key_index" varchar;
  ALTER TABLE "pages" ADD COLUMN "_status" "enum_pages_status" DEFAULT 'draft';
  ALTER TABLE "_pages_v_blocks_page_content_1" ADD CONSTRAINT "_pages_v_blocks_page_content_1_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_content_1" ADD CONSTRAINT "_pages_v_blocks_page_content_1_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_content_1_locales" ADD CONSTRAINT "_pages_v_blocks_page_content_1_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_page_content_1"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_content_2_items" ADD CONSTRAINT "_pages_v_blocks_page_content_2_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_content_2_items" ADD CONSTRAINT "_pages_v_blocks_page_content_2_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_page_content_2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_content_2_items_locales" ADD CONSTRAINT "_pages_v_blocks_page_content_2_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_page_content_2_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_content_2" ADD CONSTRAINT "_pages_v_blocks_page_content_2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_content_2_locales" ADD CONSTRAINT "_pages_v_blocks_page_content_2_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_page_content_2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_content_3_audience" ADD CONSTRAINT "_pages_v_blocks_page_content_3_audience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_page_content_3"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_content_3_audience_locales" ADD CONSTRAINT "_pages_v_blocks_page_content_3_audience_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_page_content_3_audience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_content_3" ADD CONSTRAINT "_pages_v_blocks_page_content_3_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_content_3_locales" ADD CONSTRAINT "_pages_v_blocks_page_content_3_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_page_content_3"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block_locales" ADD CONSTRAINT "_pages_v_blocks_form_block_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_form_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_example_block_v" ADD CONSTRAINT "_example_block_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_example_block_v_locales" ADD CONSTRAINT "_example_block_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_example_block_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_pages_v_blocks_page_content_1_order_idx" ON "_pages_v_blocks_page_content_1" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_content_1_parent_id_idx" ON "_pages_v_blocks_page_content_1" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_content_1_path_idx" ON "_pages_v_blocks_page_content_1" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_page_content_1_image_idx" ON "_pages_v_blocks_page_content_1" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_page_content_1_locales_locale_parent_id_uniq" ON "_pages_v_blocks_page_content_1_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_page_content_2_items_order_idx" ON "_pages_v_blocks_page_content_2_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_content_2_items_parent_id_idx" ON "_pages_v_blocks_page_content_2_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_content_2_items_icon_idx" ON "_pages_v_blocks_page_content_2_items" USING btree ("icon_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_page_content_2_items_locales_locale_parent_i" ON "_pages_v_blocks_page_content_2_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_page_content_2_order_idx" ON "_pages_v_blocks_page_content_2" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_content_2_parent_id_idx" ON "_pages_v_blocks_page_content_2" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_content_2_path_idx" ON "_pages_v_blocks_page_content_2" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_page_content_2_locales_locale_parent_id_uniq" ON "_pages_v_blocks_page_content_2_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_page_content_3_audience_order_idx" ON "_pages_v_blocks_page_content_3_audience" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_content_3_audience_parent_id_idx" ON "_pages_v_blocks_page_content_3_audience" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_page_content_3_audience_locales_locale_paren" ON "_pages_v_blocks_page_content_3_audience_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_page_content_3_order_idx" ON "_pages_v_blocks_page_content_3" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_content_3_parent_id_idx" ON "_pages_v_blocks_page_content_3" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_content_3_path_idx" ON "_pages_v_blocks_page_content_3" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_page_content_3_locales_locale_parent_id_uniq" ON "_pages_v_blocks_page_content_3_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_form_block_order_idx" ON "_pages_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_block_parent_id_idx" ON "_pages_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_block_path_idx" ON "_pages_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_block_form_idx" ON "_pages_v_blocks_form_block" USING btree ("form_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_form_block_locales_locale_parent_id_unique" ON "_pages_v_blocks_form_block_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_example_block_v_order_idx" ON "_example_block_v" USING btree ("_order");
  CREATE INDEX "_example_block_v_parent_id_idx" ON "_example_block_v" USING btree ("_parent_id");
  CREATE INDEX "_example_block_v_path_idx" ON "_example_block_v" USING btree ("_path");
  CREATE UNIQUE INDEX "_example_block_v_locales_locale_parent_id_unique" ON "_example_block_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");

  -- Existing pages were live before drafts were enabled. The new "_status" column
  -- defaults to 'draft', which would hide them from the public (non-draft) API.
  -- Backfill them to 'published' so they stay visible. New rows manage their own status.
  UPDATE "pages" SET "_status" = 'published' WHERE "_status" = 'draft' OR "_status" IS NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_pages_v_blocks_page_content_1" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_page_content_1_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_page_content_2_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_page_content_2_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_page_content_2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_page_content_2_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_page_content_3_audience" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_page_content_3_audience_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_page_content_3" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_page_content_3_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_form_block_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_example_block_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_example_block_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_pages_v_blocks_page_content_1" CASCADE;
  DROP TABLE "_pages_v_blocks_page_content_1_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_page_content_2_items" CASCADE;
  DROP TABLE "_pages_v_blocks_page_content_2_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_page_content_2" CASCADE;
  DROP TABLE "_pages_v_blocks_page_content_2_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_page_content_3_audience" CASCADE;
  DROP TABLE "_pages_v_blocks_page_content_3_audience_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_page_content_3" CASCADE;
  DROP TABLE "_pages_v_blocks_page_content_3_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_form_block" CASCADE;
  DROP TABLE "_pages_v_blocks_form_block_locales" CASCADE;
  DROP TABLE "_example_block_v" CASCADE;
  DROP TABLE "_example_block_v_locales" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP INDEX "pages__status_idx";
  ALTER TABLE "pages_blocks_form_block" ALTER COLUMN "form_id" SET NOT NULL;
  ALTER TABLE "example_block_locales" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "pages" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET NOT NULL;
  ALTER TABLE "admins" DROP COLUMN "enable_a_p_i_key";
  ALTER TABLE "admins" DROP COLUMN "api_key";
  ALTER TABLE "admins" DROP COLUMN "api_key_index";
  ALTER TABLE "pages" DROP COLUMN "_status";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  DROP TYPE "public"."enum__pages_v_version_hero_alignment";
  DROP TYPE "public"."enum__pages_v_version_hero_background";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";`)
}
