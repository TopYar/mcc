import { MigrationInterface, QueryRunner } from 'typeorm';

export class addRuLangToPresets1679214793375 implements MigrationInterface {
    name = 'addRuLangToPresets1679214793375';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "measurement_presets" ADD "name_ru" character varying`);
        await queryRunner.query(`ALTER TABLE "measurement_presets" ADD "unit_ru" character varying`);
        await queryRunner.query(`ALTER TABLE "condition_presets" ADD "name_ru" character varying`);
        await queryRunner.query(`ALTER TABLE "condition_presets" ADD "recommended_ru" text array`);
        await queryRunner.query(`ALTER TABLE "condition_presets" ADD "limited_ru" text array`);
        await queryRunner.query(`ALTER TABLE "condition_presets" ADD "forbidden_ru" text array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "condition_presets" DROP COLUMN "forbidden_ru"`);
        await queryRunner.query(`ALTER TABLE "condition_presets" DROP COLUMN "limited_ru"`);
        await queryRunner.query(`ALTER TABLE "condition_presets" DROP COLUMN "recommended_ru"`);
        await queryRunner.query(`ALTER TABLE "condition_presets" DROP COLUMN "name_ru"`);
        await queryRunner.query(`ALTER TABLE "measurement_presets" DROP COLUMN "unit_ru"`);
        await queryRunner.query(`ALTER TABLE "measurement_presets" DROP COLUMN "name_ru"`);
    }

}
