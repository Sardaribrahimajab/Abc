import { MigrationInterface, QueryRunner } from "typeorm";

export class rolepermissions1689149109622 implements MigrationInterface {
    name = 'rolepermissions1689149109622'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`rolepermissions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`roleId\` int NULL, \`permissionId\` int NULL, UNIQUE INDEX \`REL_720e7912c4ff5734339c91be2d\` (\`roleId\`), UNIQUE INDEX \`REL_18be7dd9302eec9e86aec7b0af\` (\`permissionId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`roles\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_c28e52f758e7bbc53828db92194\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`roleId\` \`roleId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`permissions\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_c28e52f758e7bbc53828db92194\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rolepermissions\` ADD CONSTRAINT \`FK_720e7912c4ff5734339c91be2d1\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rolepermissions\` ADD CONSTRAINT \`FK_18be7dd9302eec9e86aec7b0af3\` FOREIGN KEY (\`permissionId\`) REFERENCES \`permissions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rolepermissions\` DROP FOREIGN KEY \`FK_18be7dd9302eec9e86aec7b0af3\``);
        await queryRunner.query(`ALTER TABLE \`rolepermissions\` DROP FOREIGN KEY \`FK_720e7912c4ff5734339c91be2d1\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_c28e52f758e7bbc53828db92194\``);
        await queryRunner.query(`ALTER TABLE \`permissions\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`roleId\` \`roleId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_c28e52f758e7bbc53828db92194\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`roles\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`DROP INDEX \`REL_18be7dd9302eec9e86aec7b0af\` ON \`rolepermissions\``);
        await queryRunner.query(`DROP INDEX \`REL_720e7912c4ff5734339c91be2d\` ON \`rolepermissions\``);
        await queryRunner.query(`DROP TABLE \`rolepermissions\``);
    }

}
