import * as dotenv from 'dotenv';

dotenv.config();
/**
 * Options for JWT Module
 */

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};