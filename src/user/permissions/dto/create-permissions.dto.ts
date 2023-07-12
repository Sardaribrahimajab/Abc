import { IsString, IsNotEmpty, IsEmail, IsOptional, IsIn, IsInt, IsBoolean } from "class-validator";

/**
 * Create User Dto
 */
export class CreatePermissionDto {

    /**
     * @param title
     * Full name of user
     */
    @IsString()
    @IsNotEmpty()
    title: string;

    /**
     * @param permissions
     * First name of user
     */
    @IsString()
    @IsOptional()
    permissions?: string;

    /**
     * @param description
     * Last name of user
     */
    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    active: boolean;
}