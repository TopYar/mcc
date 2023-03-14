import { MigrationInterface, QueryRunner } from 'typeorm';

export class columnMeasurementIdNotNullOnMeasurementValues1678799834448 implements MigrationInterface {
    name = 'columnMeasurementIdNotNullOnMeasurementValues1678799834448';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "measurement_values" DROP CONSTRAINT "FK_25d2cd9dfc93141bcc61cf7b710"`);
        await queryRunner.query(`ALTER TABLE "measurement_values" ALTER COLUMN "measurementId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "measurement_values" ADD CONSTRAINT "FK_25d2cd9dfc93141bcc61cf7b710" FOREIGN KEY ("measurementId") REFERENCES "measurements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "measurement_values" DROP CONSTRAINT "FK_25d2cd9dfc93141bcc61cf7b710"`);
        await queryRunner.query(`ALTER TABLE "measurement_values" ALTER COLUMN "measurementId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "measurement_values" ADD CONSTRAINT "FK_25d2cd9dfc93141bcc61cf7b710" FOREIGN KEY ("measurementId") REFERENCES "measurements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
