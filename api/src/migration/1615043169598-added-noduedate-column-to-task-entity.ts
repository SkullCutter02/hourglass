import {MigrationInterface, QueryRunner} from "typeorm";

export class addedNoduedateColumnToTaskEntity1615043169598 implements MigrationInterface {
    name = 'addedNoduedateColumnToTaskEntity1615043169598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD "noDueDate" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "noDueDate"`);
    }

}
