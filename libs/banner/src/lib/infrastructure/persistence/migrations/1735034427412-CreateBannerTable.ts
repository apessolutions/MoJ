import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBannerTable1735034427412 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "banner" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "title" character varying NOT NULL, "type" character varying NOT NULL, "internal_type" character varying, "link_value" character varying NOT NULL, "media_id" integer NOT NULL, "order" integer NOT NULL, "status" boolean NOT NULL DEFAULT true, "from" date, "to" date, CONSTRAINT "PK_6d9e2570b3d85ba37b681cd4256" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "banner" ADD CONSTRAINT "FK_568fd1fdbc22ce1ce06b6a49b13" FOREIGN KEY ("media_id") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "banner" DROP CONSTRAINT "FK_568fd1fdbc22ce1ce06b6a49b13"`
    );

    await queryRunner.query(`DROP TABLE "banner"`);
  }
}
