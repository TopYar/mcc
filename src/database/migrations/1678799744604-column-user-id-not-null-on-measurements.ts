import { MigrationInterface, QueryRunner } from 'typeorm';

export class columnUserIdNotNullOnMeasurements1678799744604 implements MigrationInterface {
    name = 'columnUserIdNotNullOnMeasurements1678799744604';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "measurements" DROP CONSTRAINT "FK_2d508b791a9a6fcc0845207bb26"`);
        await queryRunner.query(`ALTER TABLE "measurements" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "measurements" ADD CONSTRAINT "FK_2d508b791a9a6fcc0845207bb26" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "measurements" DROP CONSTRAINT "FK_2d508b791a9a6fcc0845207bb26"`);
        await queryRunner.query(`ALTER TABLE "measurements" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "measurements" ADD CONSTRAINT "FK_2d508b791a9a6fcc0845207bb26" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
