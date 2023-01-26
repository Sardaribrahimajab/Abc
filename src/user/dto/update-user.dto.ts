import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsEmail, IsInt, IsOptional } from "class-validator";

/**
 * Update User Dto
 */
export class UpdateUserDto {

    /**
     * @param id
     * Id of user
     */
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    id?: number;

    /**
     * @param full_name
     * Full name of user
     */
    @IsString()
    @IsOptional()
    full_name?: string;

    /**
     * @param first_name
     * First name of user
     */
    @IsString()
    @IsOptional()
    first_name?: string;

    @IsEmail()
    @IsOptional()
    email: string;
    /**
     * @param last_name
     * Last name of user
     */
    @IsString()
    @IsOptional()
    last_name?: string;
}