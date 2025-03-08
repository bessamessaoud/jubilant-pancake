import { Body, ClassSerializerInterceptor, Controller, Post, SerializeOptions, UseInterceptors, Request, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../users.entity';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { LoginResponse } from '../responses/login.response';
import { AuthRequest } from '../dto/auth.request';
import { UserService } from '../user/user.service';
import { AuthGuard } from '../guards/auth.guard';
import { Public } from '../decorators/public.decorator';
import { AdminResponse } from '../responses/admi,.response';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({strategy:'excludeAll'})
export class AuthController {
    constructor(
        private readonly authService: AuthService, 
        private readonly userService: UserService) { }
    @Post('register')
    @Public()
    async register(@Body() createUserDto: CreateUserDto): Promise<User> {
        return await this.authService.register(createUserDto);
    }

    @Post('login')
    @Public()
    async login(@Body() login: LoginDto): Promise<LoginResponse> {
        const access_token = await this.authService.login(login.email, login.password);
        return new LoginResponse({access_token});
    }

    @Get('profile')
    async profile(@Request() req : AuthRequest) : Promise<User | null> {
        const user = await this.userService.findOne(req.user.sub);
        if(user) return user;
        throw new NotFoundException();
    }

    @Get('admin')
    @Roles(Role.ADMIN)
    async adminOnly() : Promise<AdminResponse> {
        return new AdminResponse({message :'YOU ARE AN ADMIN!'})
    }
}
