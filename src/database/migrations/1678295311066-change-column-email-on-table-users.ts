import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeColumnEmailOnTableUsers1678295311066 implements MigrationInterface {
    name = 'changeColumnEmailOnTableUsers1678295311066';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
    }

}
