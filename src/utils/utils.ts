import * as dotenv from 'dotenv';
import { nanoid } from 'nanoid';

dotenv.config();

/**
 * Get short reference no
 * @returns 
 * Short reference no
 */
export function getUUID() {
    return nanoid(12);
}