import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSessionTable1756387245925 implements MigrationInterface {
    name = 'CreateSessionTable1756387245925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."session_user_type_enum" AS ENUM('admin', 'user', 'system')`);
        await queryRunner.query(`CREATE TABLE "session" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "user_id" integer NOT NULL, "user_type" "public"."session_user_type_enum" NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_SESSION_USER_ID" ON "session" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_SESSION_USER_TYPE" ON "session" ("user_type") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_SESSION_USER_TYPE"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_SESSION_USER_ID"`);
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP TYPE "public"."session_user_type_enum"`);
    }

}
