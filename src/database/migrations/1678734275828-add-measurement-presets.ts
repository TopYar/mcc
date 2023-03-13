import { MigrationInterface, QueryRunner } from 'typeorm';

export class addMeasurementPresets1678734275828 implements MigrationInterface {
    name = 'addMeasurementPresets1678734275828';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "measurement_presets" ("id" character varying(36) NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "unit" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_ac6623bba40dd64a94b4151fe94" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "conditions_measurements_presets" ("conditionPresetsId" character varying(36) NOT NULL, "measurementPresetsId" character varying(36) NOT NULL, CONSTRAINT "PK_c28415a13b86c8c4b8419322a3e" PRIMARY KEY ("conditionPresetsId", "measurementPresetsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_042e740149f5e39547c3d8d9b0" ON "conditions_measurements_presets" ("conditionPresetsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_94d7d3adc6376557e06b3699e8" ON "conditions_measurements_presets" ("measurementPresetsId") `);
        await queryRunner.query(`ALTER TABLE "conditions_measurements_presets" ADD CONSTRAINT "FK_042e740149f5e39547c3d8d9b03" FOREIGN KEY ("conditionPresetsId") REFERENCES "condition_presets"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "conditions_measurements_presets" ADD CONSTRAINT "FK_94d7d3adc6376557e06b3699e80" FOREIGN KEY ("measurementPresetsId") REFERENCES "measurement_presets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conditions_measurements_presets" DROP CONSTRAINT "FK_94d7d3adc6376557e06b3699e80"`);
        await queryRunner.query(`ALTER TABLE "conditions_measurements_presets" DROP CONSTRAINT "FK_042e740149f5e39547c3d8d9b03"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_94d7d3adc6376557e06b3699e8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_042e740149f5e39547c3d8d9b0"`);
        await queryRunner.query(`DROP TABLE "conditions_measurements_presets"`);
        await queryRunner.query(`DROP TABLE "measurement_presets"`);
    }

}
