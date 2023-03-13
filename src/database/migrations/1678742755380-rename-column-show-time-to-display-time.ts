import { MigrationInterface, QueryRunner } from 'typeorm';

export class renameColumnShowTimeToDisplayTime1678742755380 implements MigrationInterface {
    name = 'renameColumnShowTimeToDisplayTime1678742755380';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "measurements" RENAME COLUMN "showTime" TO "displayTime"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "measurements" RENAME COLUMN "displayTime" TO "showTime"`);
    }

}
