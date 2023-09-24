import * as request from 'supertest';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UsersModule } from '../src/users/users.module';
import { userModelMock, userTest } from './mocks/userModel.mock';

describe('UsersController (e2e)', () => {
    let app: INestApplication;
    const wrongId = '5f8d0a3e9d2d7c5e5c3a3f3a';
    const userDto = {
        fullName: 'John Doe',
        email: 'john@google.com',
        password: '123456',
        isActive: true,
        roles: ['ROLE_USER']
    }

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UsersModule],
        })
            .overrideProvider(getModelToken('User'))
            .useValue(userModelMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    describe('Create User', () => {
        it('should return a user', async () => {
            const response = await request(app.getHttpServer())
                .post('/users')
                .send(userDto);
            expect(response.status).toBe(201);
            expect(response.body._id).toBeDefined();
            expect(response.body.password).not.toBe(userDto.password);
        });

        it('should return a status 400', async () => {
            const response = await request(app.getHttpServer())
                .post('/users')
                .send(userTest);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(`User already exists, ${JSON.stringify({ email: userTest.email })}`);
        });
    });

    describe('Find All Users', () => {
        it('should return an array of users', async () => {
            const response = await request(app.getHttpServer()).get('/users');
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe('Find One User', () => {
        it('should return a user', async () => {
            const response = await request(app.getHttpServer()).get(`/users/${userTest._id}`);
            expect(response.status).toBe(200);
            expect(response.body._id).toBe(userTest._id);
        });

        it('should return a status 404', async () => {
            const response = await request(app.getHttpServer()).get(`/users/${wrongId}`);
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(`User with id: '${wrongId}' not found`);
        });
    });

    describe('Update User', () => {
        it('should return an updated user', async () => {
            const response = await request(app.getHttpServer())
                .patch(`/users/${userTest._id}`)
                .send({ fullName: 'Jane Doe' });
            expect(response.status).toBe(200);
            expect(response.body._id).toBe(userTest._id);
            expect(response.body.fullName).toBe('Jane Doe');
            expect(response.body.email).toBe(userTest.email);
        });

        it('should return a status 404', async () => {
            const response = await request(app.getHttpServer())
                .patch(`/users/${wrongId}`)
                .send({ fullName: 'Jane Doe' });
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(`User with id: '${wrongId}' not found`);
        });
    });

    describe('Remove User', () => {
        it('should return a string', async () => {
            const response = await request(app.getHttpServer()).delete(`/users/${userTest._id}`);
            expect(response.status).toBe(200);
            expect(response.text).toBe(`User with the id: '${userTest._id}' was removed`);
        });

        it('should return a status 404', async () => {
            const response = await request(app.getHttpServer()).delete(`/users/${wrongId}`);
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(`User with id: '${wrongId}' not found`);
        });
    });



    afterAll(async () => {
        await app.close();
    });
});
