import { MigrationInterface, QueryRunner } from 'typeorm';

export class userMigration1669876287425 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` ADD `tempPass` BOOLEAN NOT NULL AFTER `isFirstLogin`'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user` DROP `tempPass`');
  }
}
