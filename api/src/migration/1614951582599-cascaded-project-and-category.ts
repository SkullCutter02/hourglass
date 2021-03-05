import { MigrationInterface, QueryRunner } from "typeorm";

export class cascadedProjectAndCategory1614951582599 implements MigrationInterface {
  name = "cascadedProjectAndCategory1614951582599";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "FK_2fec10336297c7bb5282b5d3ce8" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_2fec10336297c7bb5282b5d3ce8"`);
  }
}
