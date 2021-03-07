import {MigrationInterface, QueryRunner} from "typeorm";

export class addedNoduedateColumnToTaskEntity1615082986835 implements MigrationInterface {
    name = 'addedNoduedateColumnToTaskEntity1615082986835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD "noDueDate" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "noDueDate"`);
    }

}
