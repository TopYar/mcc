import { MigrationInterface, QueryRunner } from 'typeorm';

export class addColumnDisplayTimeOnMeasurementPresets1678745806570 implements MigrationInterface {
    name = 'addColumnDisplayTimeOnMeasurementPresets1678745806570';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "measurement_presets" ADD "displayTime" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "measurement_presets" DROP COLUMN "displayTime"`);
    }

}
