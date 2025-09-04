import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoleTable1735034611711 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text, "permissions" text array NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4a74ca47fe1aa34a28a6db3c72" ON "role" ("title") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4a74ca47fe1aa34a28a6db3c72"`
    );
    await queryRunner.query(`DROP TABLE "role"`);
  }
}
