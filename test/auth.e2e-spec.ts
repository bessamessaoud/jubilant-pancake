import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestSetup } from './utils/test-setup';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/users.entity';
import { Role } from '../src/users/enums/role.enum';
import { PasswordService } from '../src/users/password/password.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthController (e2e)', () => {
    let testSetup: TestSetup;

    beforeEach(async () => {
        testSetup = await TestSetup.create(AppModule);

    });

    afterEach(async () => {
        await testSetup.cleanup();
    });

    afterAll(async () => {
        await testSetup.teardown();
    })

    const testUser = {
        email: 'bessa656445@gmail.com',
        password: '14ipop02Bb****',
        name: 'bessa1402'
    };
    it('auth/register (POST)', () => {
        return request(testSetup.app.getHttpServer())
            .post('/auth/register')
            .send(testUser)
            .expect(201)
            .expect((res) => {
                expect(res.body.email).toBe(testUser.email)
                expect(res.body.name).toBe(testUser.name)
                expect(res.body).not.toHaveProperty('password')

            })
    })

    it('auth/register (POST) - duplicate email', async () => {
        await request(testSetup.app.getHttpServer())
            .post('/auth/register')
            .send(testUser);
        return await request(testSetup.app.getHttpServer())
            .post('/auth/register')
            .send(testUser)
            .expect(409);
    })

    it('auth/login (POST)', async () => {
        await request(testSetup.app.getHttpServer())
            .post('/auth/register')
            .send(testUser);
        const response = await request(testSetup.app.getHttpServer())
            .post('/auth/login')
            .send({ email: testUser.email, password: testUser.password });

        expect(response.status).toBe(201);
        expect(response.body.access_token).toBeDefined();
    })

    it('auth/profile (GET)', async () => {
        await request(testSetup.app.getHttpServer())
            .post('/auth/register')
            .send(testUser);

        const response = await request(testSetup.app.getHttpServer())
            .post('/auth/login')
            .send({ email: testUser.email, password: testUser.password });

        const token = response.body.access_token;
        return await request(testSetup.app.getHttpServer())
            .get('/auth/profile')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(testUser.email)
                expect(res.body.name).toBe(testUser.name)
                expect(res.body).not.toHaveProperty('password')

            }

            )

    })

    it('shoul include roles in JWT', async () => {
        const userRepository = testSetup.app.get(getRepositoryToken(User));

        await userRepository.save({
            ...testUser,
            roles: [Role.ADMIN],
            password: await testSetup.app.get(PasswordService).hashPassword(testUser.password)
        });


        const response = await request(testSetup.app.getHttpServer())
            .post('/auth/login')
            .send({ email: testUser.email, password: testUser.password });

        const decode = testSetup.app.get(JwtService).decode(response.body.access_token);
        expect(decode.roles).toBeDefined();
        expect(decode.roles).toContain(Role.ADMIN);
    })

    it('auth/admin (GET) -admin access', async () => {
        const userRepository = testSetup.app.get(getRepositoryToken(User));

        await userRepository.save({
            ...testUser,
            roles: [Role.ADMIN],
            password: await testSetup.app.get(PasswordService).hashPassword(testUser.password)
        });


        const response = await request(testSetup.app.getHttpServer())
            .post('/auth/login')
            .send({ email: testUser.email, password: testUser.password });
        const token = response.body.access_token;

        return await request(testSetup.app.getHttpServer())
            .get('/auth/admin')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.message).toContain('ADMIN')
            }

            )
    })

    it('auth/admin (GET) -admin acess fail', async () => {
        const userRepository = testSetup.app.get(getRepositoryToken(User));

        await userRepository.save({
            ...testUser,
            roles: [Role.USER],
            password: await testSetup.app.get(PasswordService).hashPassword(testUser.password)
        });


        const response = await request(testSetup.app.getHttpServer())
            .post('/auth/login')
            .send({ email: testUser.email, password: testUser.password });
        const token = response.body.access_token;

        return await request(testSetup.app.getHttpServer())
            .get('/auth/admin')
            .set('Authorization', `Bearer ${token}`)
            .expect(403)
            .expect((res) => {
                expect(res.body.message).not.toContain('ADMIN')
            }
            )
    })

});
