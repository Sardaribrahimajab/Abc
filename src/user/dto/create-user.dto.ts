import { IsString, IsNotEmpty, IsEmail, IsOptional, IsIn, IsInt } from "class-validator";
import { Role } from "../../enum/role.enum";

/**
 * Create User Dto
 */
export class CreateUserDto {
   
    /**
     * @param full_name
     * Full name of user
     */
    @IsString()
    @IsNotEmpty()
    full_name: string;

    /**
     * @param first_name
     * First name of user
     */
    @IsString()
    @IsOptional()
    first_name?: string;

    /**
     * @param last_name
     * Last name of user
     */
    @IsString()
    @IsOptional()
    last_name?: string;

    /**
     * @param email
     * Email of user
     */
    @IsEmail()
    @IsNotEmpty()
    email: string;

    /**
     * @param username
     * Username of user
     */
    @IsString()
    @IsOptional()
    username?: string;
    
    /**
     * @param password
     * Password of user
     */
    @IsString()
    @IsOptional()
    password?: string;

    /**
     * @param user_type
     * User type of user
     */
     @IsIn(Object.values(Role))
     user_type: Role;
}