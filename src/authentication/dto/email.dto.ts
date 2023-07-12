import { IsEmail, IsNotEmpty } from "class-validator";

/**
 * Email Dto
 */
export class EmailDto {

    /**
     * @param email
     * Email
     */
    @IsEmail()
    @IsNotEmpty()
    email: string;
}