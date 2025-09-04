import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1735034394480 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."user_gender_enum" AS ENUM('male', 'female')`);

    await queryRunner.query(
      `CREATE TABLE "user" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "first_name" character varying, "last_name" character varying, "gender" "public"."user_gender_enum", "email" character varying, "user_name" character varying, "photo_id" integer, "phone_number" character varying NOT NULL, "date_of_birth" date, "status" boolean NOT NULL DEFAULT true, CONSTRAINT "REL_2863d588f4efce8bf42c9c6352" UNIQUE ("photo_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_2a365a5009064b0a3f184fb84a" ON "user" ("user_name") WHERE user_name IS NOT NULL AND deleted_at IS NULL`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b9f79fce3976732864f52721c1" ON "user" ("phone_number") WHERE deleted_at IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_2863d588f4efce8bf42c9c63526" FOREIGN KEY ("photo_id") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_2863d588f4efce8bf42c9c63526"`
    );

    await queryRunner.query(
      `DROP INDEX "public"."IDX_b9f79fce3976732864f52721c1"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2a365a5009064b0a3f184fb84a"`
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
  }
}
