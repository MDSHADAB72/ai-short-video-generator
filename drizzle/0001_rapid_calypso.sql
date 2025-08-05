CREATE TABLE "scripts" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" integer,
	"content" text NOT NULL,
	"audio_url" varchar,
	"local_path" varchar,
	"voice_settings" json,
	"audio_generated" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);

ALTER TABLE "scripts" ADD CONSTRAINT "scripts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;