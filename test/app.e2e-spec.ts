import 'jest';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as dotenv from 'dotenv';
import request from 'supertest';
import { ILike } from 'typeorm';

import { AppModule } from '../src/app.module';
import { ServiceResponse } from '../src/common/ServiceResponse';
import { UsersRepository } from '../src/modules/users/users.repository';

dotenv.config();

class JWT {
    ACCESS: string | null = null;
    REFRESH: string | null = null;
    CONFIRMATION: string | null = null;
}
describe('AppController (e2e)', () => {
    let app: INestApplication;
    let moduleFixture: TestingModule;

    let usersRepository: UsersRepository;
    const state: any = {};
    const jwt = new JWT();
    const jestEmailUser = process.env.MCC_JEST_EMAIL_USER;
    const jestEmailDomain = process.env.MCC_JEST_EMAIL_DOMAIN;

    const now = new Date().toJSON();

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
            providers: [UsersRepository],
        }).compile();

        app = moduleFixture.createNestApplication();
        usersRepository = moduleFixture.get<UsersRepository>(UsersRepository);

        await app.init();
    });


    it('Register', async () => {
        const user = {
            name: `test-${now}`,
            email: `${jestEmailUser}+test${now}@${jestEmailDomain}`,
            password: 'Qwerty123',
        };

        const response = await request(process.env.MCC_BASE_URL)
            .post('/auth/register')
            .send(user);

        expect(response.body.success).toBe(true);
        expect(response.body.result.token).toBeDefined;

        jwt.CONFIRMATION = response.body.result.token;
    });

    it('Fail login unconfirmed user', async () => {
        const user = {
            email: `${jestEmailUser}+test${now}@${jestEmailDomain}`,
            password: 'Qwerty123',
        };

        const response = await request(process.env.MCC_BASE_URL)
            .post('/auth/login')
            .send(user);

        expect(response.body.success).toBe(false);
        expect(response.body.error.code).toBe(ServiceResponse.CODES.ERROR_EMAIL_IS_NOT_CONFIRMED.code);
    });

    it('Fail confirm', async () => {
        const response = await request(process.env.MCC_BASE_URL)
            .post('/auth/confirm')
            .set('jwt', jwt.CONFIRMATION!)
            .send({
                code: '00000000', // we use 4-digit code
            });

        expect(response.body.success).toBe(false);
        expect(response.body.error.code).toBe(ServiceResponse.CODES.VALIDATION_ERROR.code);
    });

    it('Login', async () => {
        const user = {
            email: `${jestEmailUser}+test${now}@${jestEmailDomain}`,
            password: 'Qwerty123',
        };

        // Confirm user directly in database
        await usersRepository.update({ email: ILike(user.email) }, { confirmedAt: new Date() });

        const response = await request(process.env.MCC_BASE_URL)
            .post('/auth/login')
            .send(user);

        expect(response.body.success).toBe(true);
        expect(response.body.result.accessToken).toBeDefined();
        expect(response.body.result.refreshToken).toBeDefined();

        jwt.ACCESS = response.body.result.accessToken;
        jwt.REFRESH = response.body.result.refreshToken;
    });


    it('Get dashboard', async () => {
        const response = await request(process.env.MCC_BASE_URL)
            .get('/dashboard')
            .set('jwt', jwt.ACCESS!);

        expect(response.body.success).toBe(true);
        expect(response.body.result.conditions).toBeDefined();
        expect(response.body.result.diet).toBeDefined();
    });

    it('Get condition presets', async () => {
        const response = await request(process.env.MCC_BASE_URL)
            .get('/conditions/presets')
            .set('jwt', jwt.ACCESS!);

        expect(response.body.success).toBe(true);
        expect(response.body.result).toBeInstanceOf(Array);

        if (response.body.result.length) {
            for (const preset of response.body.result) {
                expect(preset.id).toBeDefined();
                expect(preset.name).toBeDefined();
            }

            state.conditionPresetId = response.body.result[0].id;
        }
    });

    it('Get available measurement presets', async () => {
        const response = await request(process.env.MCC_BASE_URL)
            .get('/measurements/available')
            .query({ conditionPresetId: state.conditionPresetId })
            .set('jwt', jwt.ACCESS!);

        expect(response.body.success).toBe(true);
        expect(response.body.result.presets).toBeInstanceOf(Array);

        if (response.body.result.presets.length) {
            for (const preset of response.body.result.presets) {
                expect(preset.id).toBeDefined();
                expect(preset.name).toBeDefined();
                expect(preset.unit).toBeDefined();
                expect(preset.displayTime).toBeDefined();
                expect(preset.isTracking).toBe(false);
            }

            state.measurementPresetId = response.body.result.presets[0].id;
        }
    });


    it('Create condition', async () => {
        const response = await request(process.env.MCC_BASE_URL)
            .post('/conditions')
            .set('jwt', jwt.ACCESS!)
            .send({ name: 'Test condition' });

        expect(response.body.success).toBe(true);
        expect(response.body.result).toBeDefined();
        expect(response.body.result.id).toBeDefined();
        expect(response.body.result.name).toBe('Test condition');

        state.conditionId = response.body.result.id;
    });


    it('Create condition from preset', async () => {
        const response = await request(process.env.MCC_BASE_URL)
            .post('/conditions')
            .set('jwt', jwt.ACCESS!)
            .send({ conditionPresetId: state.conditionPresetId });

        expect(response.body.success).toBe(true);
        expect(response.body.result).toBeDefined();
        expect(response.body.result.id).toBeDefined();
    });

    it('Get condition', async () => {
        const response = await request(process.env.MCC_BASE_URL)
            .get('/conditions')
            .query({ id: state.conditionId })
            .set('jwt', jwt.ACCESS!)
            .send({ conditionPresetId: state.conditionPresetId });

        expect(response.body.success).toBe(true);
        expect(response.body.result).toBeDefined();
        expect(response.body.result.id).toBeDefined();
        expect(response.body.result.name).toBe('Test condition');
    });

    it('Create measurement', async () => {
        const response = await request(process.env.MCC_BASE_URL)
            .post('/measurements')
            .set('jwt', jwt.ACCESS!)
            .send({
                'name': 'My new measure',
                'unit': 'my unit',
                'displayTime': true,
            });

        expect(response.body.success).toBe(true);
        expect(response.body.result).toBeDefined();
        expect(response.body.result.id).toBeDefined();
        expect(response.body.result.name).toBe('My new measure');
        expect(response.body.result.unit).toBe('my unit');
        expect(response.body.result.displayTime).toBe(true);

        state.measurementId = response.body.result.id;
    });

    it('Get measurement', async () => {
        const response = await request(process.env.MCC_BASE_URL)
            .get('/measurements')
            .query({ id: state.measurementId })
            .set('jwt', jwt.ACCESS!);

        expect(response.body.success).toBe(true);
        expect(response.body.result).toBeDefined();
        expect(response.body.result.id).toBeDefined();
        expect(response.body.result.name).toBe('My new measure');
        expect(response.body.result.unit).toBe('my unit');
        expect(response.body.result.displayTime).toBe(true);
    });

    it('Update measurement', async () => {
        const response = await request(process.env.MCC_BASE_URL)
            .put('/measurements')
            .set('jwt', jwt.ACCESS!)
            .send({
                'id': state.measurementId,
                'name': 'My new measure 2',
                'unit': 'my unit 2',
                'displayTime': false,
            });

        expect(response.body.success).toBe(true);
        expect(response.body.result).toBeDefined();
        expect(response.body.result.id).toBeDefined();
        expect(response.body.result.name).toBe('My new measure 2');
        expect(response.body.result.unit).toBe('my unit 2');
        expect(response.body.result.displayTime).toBe(false);
    });

    it('Get measurement after update', async () => {
        const response = await request(process.env.MCC_BASE_URL)
            .get('/measurements')
            .query({ id: state.measurementId })
            .set('jwt', jwt.ACCESS!);

        expect(response.body.success).toBe(true);
        expect(response.body.result).toBeDefined();
        expect(response.body.result.id).toBeDefined();
        expect(response.body.result.name).toBe('My new measure 2');
        expect(response.body.result.unit).toBe('my unit 2');
        expect(response.body.result.displayTime).toBe(false);
    });

    it('Get all measurements and find previously updated one', async () => {
        const response = await request(process.env.MCC_BASE_URL)
            .get('/measurements')
            .set('jwt', jwt.ACCESS!);

        expect(response.body.success).toBe(true);
        expect(response.body.result).toBeInstanceOf(Array);
        expect(response.body.result[0].id).toBeDefined();
        expect(response.body.result[0].name).toBe('My new measure 2');
        expect(response.body.result[0].unit).toBe('my unit 2');
        expect(response.body.result[0].displayTime).toBe(false);
    });

    it('Add measurement value', async () => {
        const response = await request(process.env.MCC_BASE_URL)
            .post('/measurements/values')
            .set('jwt', jwt.ACCESS!)
            .send({ measurementId: state.measurementId, value: '1.345' });

        expect(response.body.success).toBe(true);
        expect(response.body.result.id).toBeDefined();
        expect(response.body.result.value).toBe('1.345');
        expect(response.body.result.measurementId).toBe(state.measurementId);

        state.measurementValueId = response.body.result.id;
    });


    it('Retrieve measurement values and find added value', async () => {
        const response = await request(process.env.MCC_BASE_URL)
            .get('/measurements')
            .set('jwt', jwt.ACCESS!);

        expect(response.body.success).toBe(true);
        expect(response.body.result).toBeInstanceOf(Array);
        expect(response.body.result[0].values).toBeInstanceOf(Array);
        expect(response.body.result[0].values[0].id).toBe(state.measurementValueId);
        expect(response.body.result[0].values[0].value).toBe('1.345');
    });


    it('Delete measurement', async () => {
        const response = await request(process.env.MCC_BASE_URL)
            .delete('/measurements')
            .query({ id: state.measurementId })
            .set('jwt', jwt.ACCESS!);

        expect(response.body.success).toBe(true);
    });

    it('Fail get measurement (after delete, measurement not found)', async () => {
        const response = await request(process.env.MCC_BASE_URL)
            .get('/measurements')
            .query({ id: state.measurementId })
            .set('jwt', jwt.ACCESS!);

        expect(response.body.success).toBe(false);
        expect(response.body.error.code).toBe(ServiceResponse.CODES.FAIL_MEASUREMENT_NOT_FOUND.code);
    });

    it('Logout', async () => {
        const response = await request(process.env.MCC_BASE_URL)
            .delete('/auth/logout')
            .set('jwt', jwt.ACCESS!);

        expect(response.body.success).toBe(true);
    });

    it('Fail logout (access token was invalidated)', async () => {
        const response = await request(process.env.MCC_BASE_URL)
            .delete('/auth/logout')
            .set('jwt', jwt.ACCESS!);

        expect(response.body.success).toBe(false);
        expect(response.body.error.code).toBe(ServiceResponse.CODES.ERROR_JWT_TOKEN_IS_INVALID.code);
    });
});
