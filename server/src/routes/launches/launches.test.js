const { describe, test } = require('node:test');
const { deepStrictEqual } = require('node:assert');

const request = require('supertest');
const app = require('../../app');

describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
        const response = await request(app)
            .get('/launches')
            .expect("Content-Type", /json/)
            .expect(200)
    });
});

describe('Test POST /launches', () => {
    const completeLaunchData = {
        launchDate: 'January 4, 2100',
        mission: 'USS Enterprise',
        rocket: 'NCC 170-D',
        target: 'Kepler-186 f',
    };

    const launchDataWithoutDate = {
        mission: 'USS Enterprise',
        rocket: 'NCC 170-D',
        target: 'Kepler-186 f',
    };

    const launchDataWithInvalidDate = {
        launchDate: 'zoot',
        mission: 'USS Enterprise',
        rocket: 'NCC 170-D',
        target: 'Kepler-186 f',
    };

    const launchWithInvalidHistoricalDate = {
        launchDate: 'January 4, 1950',
        mission: 'USS Enterprise',
        rocket: 'NCC 170-D',
        target: 'Kepler-186 f',
    };

    const launchWithInvalidCurrentDate = {
        launchDate: new Date().toISOString(),
        mission: 'USS Enterprise',
        rocket: 'NCC 170-D',
        target: 'Kepler-186 f',
    };

    test('It should respond with 201 created', async () => {
        const response = await request(app)
            .post('/launches')
            .send(completeLaunchData)
            .expect('Content-Type', /json/)
            .expect(201);

        const requestDate = new Date(completeLaunchData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
        deepStrictEqual(requestDate, responseDate);
           
        const { mission, rocket, target } = response.body;
        deepStrictEqual({ mission, rocket, target }, launchDataWithoutDate);
    });

    test('It should catch missing required properties', async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400);

        deepStrictEqual(response.body, {
            error: `Missing required launch property`,
        });
    });

    test('It should catch invalid dates', async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchDataWithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400);

        deepStrictEqual(response.body, {
            error: 'Invalid launch date',
        });
    });

    test('It should catch a launch date set in history', async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchWithInvalidHistoricalDate)
            .expect('Content-Type', /json/)
            .expect(400);

        deepStrictEqual(response.body, {
            error: 'Launch date must be in the future',
        });
    });

    test('It should catch a launch date set to the current day', async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchWithInvalidCurrentDate)
            .expect('Content-Type', /json/)
            .expect(400);

        deepStrictEqual(response.body, {
            error: 'Launch date must be in the future',
        })
    })
});