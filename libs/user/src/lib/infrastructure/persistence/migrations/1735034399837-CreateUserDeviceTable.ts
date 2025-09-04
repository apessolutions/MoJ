import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserDeviceTable1735034399837 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_device" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "user_id" integer NOT NULL, "device_id" character varying NOT NULL, "device_type" character varying, "fcm_token" character varying NOT NULL, CONSTRAINT "UQ_2da87388f5c1a960b375dc79eef" UNIQUE ("device_id"), CONSTRAINT "UQ_550eba4fb8bfc689d14d51132cd" UNIQUE ("fcm_token"), CONSTRAINT "PK_0232591a0b48e1eb92f3ec5d0d1" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "user_device" ADD CONSTRAINT "FK_4875276d131a82b6792e73b9b1a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_device" DROP CONSTRAINT "FK_4875276d131a82b6792e73b9b1a"`
    );

    await queryRunner.query(`DROP TABLE "user_device"`);
  }
}
