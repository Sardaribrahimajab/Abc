import * as bcrypt from "bcrypt";
import { MigrationInterface, QueryRunner } from "typeorm";
import { Role } from "../enum/role.enum";
import { User } from "src/user/entity/user.entity";
import { Permissions } from "src/user/permissions/entity/permissions.entity";
import { rolepermissions } from "src/user/entity/rolepermissions.entity";
import { roles } from "src/user/roles/entity/role.entity";

/**
 * seedingWebconfigEntity1672848587924
 */

export class userseeder1689149109699 implements MigrationInterface {
    /**
     * Name of migration
     */
    name = 'seedingrolepermission1670324266844'

    /**
     * Up function of migration
     */

    public async up(queryRunner: QueryRunner): Promise<void> {

        const permission = queryRunner.manager.create<Permissions>(Permissions, {
            title: 'add user',
            permissions: 'add user',
            active: true
        });
        await queryRunner.manager.save(Permissions, permission);

        const Roles = queryRunner.manager.create<roles>(roles, {
            title: 'Super Admin',
            active: true
        });
        await queryRunner.manager.save(roles, Roles);

        const rolePermission = queryRunner.manager.create<rolepermissions>(rolepermissions, {
            role : 1,
            permission: 1
        });

        await queryRunner.manager.save(rolepermissions, rolePermission);

        const hash = await bcrypt.hash('admin123', 10);
        const saveUser = await queryRunner.manager.save(
            queryRunner.manager.create<User>(User, {
                user_type: Role.SUPER_ADMIN,
                full_name: 'Super Admin',
                is_active: true,
                email: 'admin@gmail.com',
                password: hash,
                role: 1,
            })
        );
    }

    /**
     * Down function of migration
     */
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM \`web_config\``);
    }

}
