import { IsNotEmpty, IsString } from "class-validator";

/**
 * Jwt Token Dto
 */
export class JwtTokenDto {
    /**
     * @param token
     * Jwt token
     */
    @IsString()
    @IsNotEmpty()
    token: string;

    /**
     * @param password
     * Password
     */
    @IsString()
    @IsNotEmpty()
    password: string;
}