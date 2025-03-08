import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../dto/create-user.dto';
import { NotFoundError } from 'rxjs';
import { User } from '../users.entity';
import { PasswordService } from '../password/password.service';
import { hash } from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly passwordService: PasswordService

    ) { }

    public async register(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.userService.findOneByEmail(createUserDto.email);

        if (existingUser) {
            throw new ConflictException('Email already exists!');
        }

        const user = await this.userService.createUser(createUserDto);

        return user;
    }

    public async login(email: string, password: string): Promise<string> {
        const user = await this.userService.findOneByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid Credentials!');
        }
        if (!(await this.passwordService.verifyPassword(password, user.password))) {
            throw new UnauthorizedException('Invalid Credentials!');
        }
        return this.generateToken(user);
    }

    private generateToken(user: User): string {
        const payload = {
            sub: user.id,
            name: user.name,
            roles : user.roles
        }
        return this.jwtService.sign(payload);
    }

}
