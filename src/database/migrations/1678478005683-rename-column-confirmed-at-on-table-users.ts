import { MigrationInterface, QueryRunner } from 'typeorm';

export class renameColumnConfirmedAtOnTableUsers1678478005683 implements MigrationInterface {
    name = 'renameColumnConfirmedAtOnTableUsers1678478005683';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "emailConfirmedAt" TO "confirmedAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "confirmedAt" TO "emailConfirmedAt"`);
    }

}
