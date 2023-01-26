import { MigrationInterface, QueryRunner } from "typeorm";

export class user1674736496656 implements MigrationInterface {
    name = 'user1674736496656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`full_name\` varchar(255) NULL DEFAULT '', \`first_name\` varchar(255) NULL DEFAULT '', \`last_name\` varchar(255) NULL DEFAULT '', \`email\` varchar(255) NOT NULL, \`username\` varchar(255) NULL DEFAULT '', \`password\` varchar(255) NOT NULL, \`user_type\` varchar(255) NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
