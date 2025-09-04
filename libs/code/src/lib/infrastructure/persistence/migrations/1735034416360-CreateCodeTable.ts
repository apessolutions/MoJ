import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCodeTable1735034416360 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."code_user_type_enum" AS ENUM('admin', 'user', 'system')`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."code_code_type_enum" AS ENUM('verify_email', 'forget_otp')`
    );
    await queryRunner.query(
      `CREATE TABLE "code" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "code" character varying NOT NULL, "user_id" integer NOT NULL, "user_type" "public"."code_user_type_enum" NOT NULL, "code_type" "public"."code_code_type_enum" NOT NULL, CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "code"`);
    await queryRunner.query(`DROP TYPE "public"."code_code_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."code_user_type_enum"`);
  }
}
