ALTER TABLE "scripts" DROP CONSTRAINT "scripts_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "scripts" ALTER COLUMN "user_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");