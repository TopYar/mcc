import { MigrationInterface, QueryRunner } from 'typeorm';

export class addMeasurementValues1678735752399 implements MigrationInterface {
    name = 'addMeasurementValues1678735752399';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "measurement_values" ("id" character varying(36) NOT NULL DEFAULT uuid_generate_v4(), "value" numeric NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "deletedAt" TIMESTAMP WITH TIME ZONE, "measurementId" character varying(36), CONSTRAINT "PK_4c1097399c7fca441d0a1da10bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "measurement_values" ADD CONSTRAINT "FK_25d2cd9dfc93141bcc61cf7b710" FOREIGN KEY ("measurementId") REFERENCES "measurements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "measurement_values" DROP CONSTRAINT "FK_25d2cd9dfc93141bcc61cf7b710"`);
        await queryRunner.query(`DROP TABLE "measurement_values"`);
    }

}
