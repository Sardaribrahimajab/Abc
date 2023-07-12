import { IsInt, IsNotEmpty } from "class-validator";

/**
 * Delete User Dto
 */
export class DeleteUserDTO {
    /**
     * @param id
     * id of user
     */
    @IsInt()
    @IsNotEmpty()
    id: number;
}