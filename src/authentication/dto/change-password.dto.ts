import { IsNotEmpty, IsString } from "class-validator";

/**
 * Change Password Dto
 */
export class ChangePasswordDTO {
    /**
     * @param old_password
     * Old password
     */
    @IsString()
    @IsNotEmpty()
    old_password: string;

    /**
     * @param new_password
     * New password
     */
    @IsString()
    @IsNotEmpty()
    new_password: string;
}