import { MigrationInterface, QueryRunner } from 'typeorm';

export class addColumnShowTimeOnMeasurements1678738564888 implements MigrationInterface {
    name = 'addColumnShowTimeOnMeasurements1678738564888';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "measurements" ADD "showTime" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "measurements" DROP COLUMN "showTime"`);
    }

}
