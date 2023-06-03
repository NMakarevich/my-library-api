import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedUserId1685798356732 implements MigrationInterface {
  name = 'AddCreatedUserId1685798356732';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "author" ADD "createdUserId" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "book" ADD "createdUserId" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "createdUserId"`);
    await queryRunner.query(`ALTER TABLE "author" DROP COLUMN "createdUserId"`);
  }
}
