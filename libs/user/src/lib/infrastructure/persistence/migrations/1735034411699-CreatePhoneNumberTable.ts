import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePhoneNumberTable1735034411699 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "phone_number" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "phone_number" character varying NOT NULL, "verification_code" character varying NOT NULL, "code_created_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_4ce3a36930ea58a37da00f49239" UNIQUE ("phone_number"), CONSTRAINT "PK_c16f58426537a660b3f2a26e983" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "phone_number"`);
  }
}
