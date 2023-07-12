import { IsNotEmpty, IsString } from "class-validator";

/**
 * Profile Picture Key Dto
 */
export class ProfilePicKeyDto {
    /**
     * @param key
     * S3 storage key for profile picture
     */
    @IsString()
    @IsNotEmpty()
    key: string;
}