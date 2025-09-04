import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNotificationTable1735046839383 implements MigrationInterface {
    name = 'CreateNotificationTable1735046839383'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "body" character varying, "image" character varying, "title" character varying NOT NULL, "event" character varying NOT NULL, "additional" json, "user_id" integer NOT NULL, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "notification"`);
    }

}
