import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminTable1735034582769 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "admin" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "status" boolean NOT NULL DEFAULT true, "password" character varying, "fcm_token" character varying, "is_super" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_efadc1fc3e542451c5229da0bd" ON "admin" ("first_name") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2d9b7975b8a9cb32cb07de9b10" ON "admin" ("last_name") `
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ADMIN_EMAIL" ON "admin" ("email") WHERE deleted_at IS NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2d9b7975b8a9cb32cb07de9b10"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_efadc1fc3e542451c5229da0bd"`
    );
    await queryRunner.query(`DROP TABLE "admin"`);
  }
}
