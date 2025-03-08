import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestSetup } from './utils/test-setup';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/users.entity';
import { Role } from '../src/users/enums/role.enum';
import { PasswordService } from '../src/users/password/password.service';
import { JwtService } from '@nestjs/jwt';
import { TaskStatus } from '../src/tasks/tasks.model';

describe('Tasks (e2e)', () => {
    let testSetup: TestSetup;
    let authToken: string;
    let taskId: string;
    const testUser = {
        email: 'bessa6564458888@gmail.com',
        password: '14ipop0002Bb****',
        name: 'bessa1555402'
    };


    beforeEach(async () => {
        testSetup = await TestSetup.create(AppModule);
        await request(testSetup.app.getHttpServer())
            .post('/auth/register')
            .send(testUser);
        const loginResponse = await request(testSetup.app.getHttpServer())
            .post('/auth/login')
            .send({email : testUser.email, password : testUser.password});
        authToken = loginResponse.body.access_token;
        const response = await request(testSetup.app.getHttpServer())
            .post('/tasks')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                description: 'azeazeeza',
                title: 'hello',
                status: TaskStatus.OPEN,
                labels: [{ name: 'test' }]
            })
        taskId = response.body.id;

    });

    afterEach(async () => {
        await testSetup.cleanup();
    });

    afterAll(async () => {
        await testSetup.teardown();
    })

    it('should not allow access to other users tasks', async () => {
        const othersUser = { ...testUser, email: 'bessatesttt014@gmail.com' };

        await request(testSetup.app.getHttpServer())
            .post('/auth/register')
            .send(othersUser)
            .expect(201);
        const loginResponses = await request(testSetup.app.getHttpServer())
            .post('/auth/login')
            .send({email : othersUser.email, password : othersUser.password})
            .expect(201);
        const otherToken = loginResponses.body.access_token;
        await request(testSetup.app.getHttpServer())
            .get(`/tasks/${taskId}`)
            .set('Authorization', `Bearer ${otherToken}`)
            .expect(403)
    })

    it('should list users tasks only', async () => {
        
        const othersUser = { ...testUser, email: 'bessatesttt014@gmail.com' };

        await request(testSetup.app.getHttpServer())
            .post('/auth/register')
            .send(othersUser)
            .expect(201);
        const loginResponses = await request(testSetup.app.getHttpServer())
            .post('/auth/login')
            .send({email : othersUser.email, password : othersUser.password})
            .expect(201);
        const otherToken = loginResponses.body.access_token;
        await request(testSetup.app.getHttpServer())
            .get(`/tasks`)
            .set('Authorization', `Bearer ${otherToken}`)
            .expect(200)
            .expect((res) => 
            expect(res.body.meta.total).toBe(0)
        )
    })
})