import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Local Auth Guard to process email and password 
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}