import { MigrationInterface, QueryRunner } from 'typeorm';

export class addColumnEmailConfirmedAtOnTableUsers1678302580753 implements MigrationInterface {
    name = 'addColumnEmailConfirmedAtOnTableUsers1678302580753';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "emailConfirmedAt" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "emailConfirmedAt"`);
    }

}
