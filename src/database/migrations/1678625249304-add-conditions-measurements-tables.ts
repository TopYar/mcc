import { MigrationInterface, QueryRunner } from "typeorm";

export class addConditionsMeasurementsTables1678625249304 implements MigrationInterface {
    name = 'addConditionsMeasurementsTables1678625249304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "measurements" ("id" character varying(36) NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "unit" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "deletedAt" TIMESTAMP WITH TIME ZONE, "userId" character varying(36), CONSTRAINT "PK_3c0e7812563f27fd68e8271661b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "conditions" ("id" character varying(36) NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "deletedAt" TIMESTAMP WITH TIME ZONE, "userId" character varying(36), CONSTRAINT "PK_3938bdf2933c08ac7af7e0e15e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "conditions_measurements" ("conditionsId" character varying(36) NOT NULL, "measurementsId" character varying(36) NOT NULL, CONSTRAINT "PK_74742c2581297934a41007cb87c" PRIMARY KEY ("conditionsId", "measurementsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_67bea8cc36fafc2b37bebf6abd" ON "conditions_measurements" ("conditionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a6583df5913c143bf5e7d8eae5" ON "conditions_measurements" ("measurementsId") `);
        await queryRunner.query(`ALTER TABLE "measurements" ADD CONSTRAINT "FK_2d508b791a9a6fcc0845207bb26" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conditions" ADD CONSTRAINT "FK_71f57741e5ac475c6647c283298" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conditions_measurements" ADD CONSTRAINT "FK_67bea8cc36fafc2b37bebf6abdb" FOREIGN KEY ("conditionsId") REFERENCES "conditions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "conditions_measurements" ADD CONSTRAINT "FK_a6583df5913c143bf5e7d8eae5e" FOREIGN KEY ("measurementsId") REFERENCES "measurements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conditions_measurements" DROP CONSTRAINT "FK_a6583df5913c143bf5e7d8eae5e"`);
        await queryRunner.query(`ALTER TABLE "conditions_measurements" DROP CONSTRAINT "FK_67bea8cc36fafc2b37bebf6abdb"`);
        await queryRunner.query(`ALTER TABLE "conditions" DROP CONSTRAINT "FK_71f57741e5ac475c6647c283298"`);
        await queryRunner.query(`ALTER TABLE "measurements" DROP CONSTRAINT "FK_2d508b791a9a6fcc0845207bb26"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a6583df5913c143bf5e7d8eae5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_67bea8cc36fafc2b37bebf6abd"`);
        await queryRunner.query(`DROP TABLE "conditions_measurements"`);
        await queryRunner.query(`DROP TABLE "conditions"`);
        await queryRunner.query(`DROP TABLE "measurements"`);
    }

}
