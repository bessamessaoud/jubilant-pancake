import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users.entity';
import { PasswordService } from '../password/password.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository : Repository<User>,
        private readonly passwordService : PasswordService

    ) {}

    public async findOneByEmail(email : string) : Promise<User | null> {
        return await this.userRepository.findOneBy({email});
    }

    public async createUser(createUserDto : CreateUserDto) : Promise<User> {
        const hashedPassword = await this.passwordService.hashPassword(createUserDto.password)
        createUserDto.password = hashedPassword;
        const user = await this.userRepository.create({
            ...createUserDto,
            password : hashedPassword
        });
        return await this.userRepository.save(user);
    }

    public async findOne(id : string) : Promise<User | null> {
        return await this.userRepository.findOneBy({id});
    }

}
