import { Injectable } from '@nestjs/common';
import * as brypt from 'bcrypt'

@Injectable()
export class PasswordService {
    private readonly SALT_ROUNDS = 10;

    public async hashPassword(password : string): Promise<string> {
        return await brypt.hash(password, this.SALT_ROUNDS);
    }

    public async verifyPassword(password : string, hashedPassword : string) : Promise<Boolean> {
        return await brypt.compare(password, hashedPassword);
    }

}
