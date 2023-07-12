import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

/**
 * Local Strategy for email and password
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * Entry point for Local Strategy
   */
  constructor(private authService: AuthenticationService
  ) {
     super({ usernameField: 'email' });
  }

  /**
   * Validate User by email and password
   * @param email
   * Email of User
   * @param password
   * Password of User
   * @returns
   * User or null
   */
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      return null;
    }
    return user;
  }
}