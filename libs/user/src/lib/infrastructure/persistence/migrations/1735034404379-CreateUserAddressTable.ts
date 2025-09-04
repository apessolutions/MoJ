import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAddressTable1735034404379 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_address" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "device_id" character varying NOT NULL, "user_id" integer, "lat" double precision NOT NULL, "long" double precision NOT NULL, CONSTRAINT "UQ_49e8ad37b8f40bc137a38af4425" UNIQUE ("device_id"), CONSTRAINT "REL_29d6df815a78e4c8291d3cf5e5" UNIQUE ("user_id"), CONSTRAINT "PK_302d96673413455481d5ff4022a" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" ADD CONSTRAINT "FK_29d6df815a78e4c8291d3cf5e53" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_address" DROP CONSTRAINT "FK_29d6df815a78e4c8291d3cf5e53"`
    );

    await queryRunner.query(`DROP TABLE "user_address"`);
  }
}
