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

    test('It should respond with 201 created', async () => {
        const response = await request(app)
            .post('/launches')
            .send(completeLaunchData)
            .expect('Content-Type', /json/)
            .expect(201);

        const requestDate = new Date(completeLaunchData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
        expect(requestDate).toBe(responseDate);
            
        expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test('It should catch missing required properties', () => {

    });

    test('It should catch invalid dates', () => {

    })
});