import {MigrationInterface, QueryRunner} from "typeorm";

export class AddGroupNameAndCalendar1598399534592 implements MigrationInterface {
    name = 'AddGroupNameAndCalendar1598399534592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "calendarUrl" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_group" ADD "name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_group" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "calendarUrl"`);
    }

}
