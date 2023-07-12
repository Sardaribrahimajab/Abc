import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { AuthenticationService } from './authentication.service';

/**
 * Jwt Strategy for Jwt Token
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Entry point for JwtStrategy
   */
  constructor(private authService: AuthenticationService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true
    });
  }

  /**
   * Validate user by jwt token
   * @param payload
   * Payload contains user fields
   * @returns
   * User object
   */
  async validate(req: any, payload: any) {
    // const isSessionValid = await this.authService.isSessionValid(rawToken);
    // if (isSessionValid) {
      const user = await this.authService.getUserById(payload.id);
      if (user) {
        return user;
      }
      return null;
    // } else
      // return null;
  }
}