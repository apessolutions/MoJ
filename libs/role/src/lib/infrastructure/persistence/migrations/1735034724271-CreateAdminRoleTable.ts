import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminRoleTable1735034724271 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "admin_roles_role" ("admin_id" integer NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "PK_f1a14a301aa7645547168d0863e" PRIMARY KEY ("admin_id", "role_id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6da8b13b020bfadf2383db3ad0" ON "admin_roles_role" ("admin_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4f6c2743dc52e5d0d5cd600d6d" ON "admin_roles_role" ("role_id") `
    );
    await queryRunner.query(
      `ALTER TABLE "admin_roles_role" ADD CONSTRAINT "FK_6da8b13b020bfadf2383db3ad02" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "admin_roles_role" ADD CONSTRAINT "FK_4f6c2743dc52e5d0d5cd600d6d9" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_roles_role" DROP CONSTRAINT "FK_4f6c2743dc52e5d0d5cd600d6d9"`
    );
    await queryRunner.query(
      `ALTER TABLE "admin_roles_role" DROP CONSTRAINT "FK_6da8b13b020bfadf2383db3ad02"`
    );

    await queryRunner.query(
      `DROP INDEX "public"."IDX_4f6c2743dc52e5d0d5cd600d6d"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6da8b13b020bfadf2383db3ad0"`
    );
    await queryRunner.query(`DROP TABLE "admin_roles_role"`);
  }
}
