import { MigrationInterface, QueryRunner } from 'typeorm';

export class addConditionPresets1678728808926 implements MigrationInterface {
    name = 'addConditionPresets1678728808926';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "condition_presets" ("id" character varying(36) NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "recommended" text array NOT NULL, "limited" text array NOT NULL, "forbidden" text array NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_c9befa9e3991d23afbd39d149da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "conditions" ADD "conditionPresetId" character varying(36)`);
        await queryRunner.query(`ALTER TABLE "conditions" ADD CONSTRAINT "FK_a57a7d081659f7f09dc91f350fe" FOREIGN KEY ("conditionPresetId") REFERENCES "condition_presets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conditions" DROP CONSTRAINT "FK_a57a7d081659f7f09dc91f350fe"`);
        await queryRunner.query(`ALTER TABLE "conditions" DROP COLUMN "conditionPresetId"`);
        await queryRunner.query(`DROP TABLE "condition_presets"`);
    }

}
