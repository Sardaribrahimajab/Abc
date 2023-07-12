import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Jwt Auth Guard to process jwt token
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
