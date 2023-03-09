const app = require('../app');
const request = require('supertest');

const connectDB = require('../db/connect')
require('dotenv').config();
const Chance = require('chance');
const chance = new Chance();
const Challenge = require('../models/challenge')
const User = require('../models/user')

describe('/api/challenge', () => {
    let db;
    beforeEach(async () => {
        db = await connectDB(process.env.MONGO_URI_TEST);
    });

    afterEach(async () => {
        if (db.connection.readyState !== 0) {
            await db.disconnect();
        }
    });

    afterAll(async () => {
        db = await connectDB(process.env.MONGO_URI_TEST);
        await Challenge.deleteMany({});
        await db.disconnect();
    });

    describe('/create POST', () => {
        test('return 200 when opponentUsername is specified and exists', async () => {
            const username = chance.word({length: 10});
            const password = chance.word({length: 60});

            await User.create({username, password});

            const res = await request(app).post('/api/challenge/create').send({
                opponentUsername: username
            });

            await User.deleteOne({username});
            expect(res.statusCode).toBe(200);
        });

        test('return 404 when opponentUsername does not exist in db', async () => {
            const username = chance.word({length: 10})

            const res = await request(app).post('/api/challenge/create').send({
                opponentUsername: username
            });

            expect(res.statusCode).toBe(404);
        })

        test('return 400 when opponentUsername is not a string', async () => {
            const username = chance.word({length: 10})

            const res = await request(app).post('/api/challenge/create').send({
                opponentUsername: true
            });

            expect(res.statusCode).toBe(400);
        });

        test('return 500 when database is disconnected', async () => {
            db.disconnect();
            const res = await request(app).post('/api/challenge/create').send({
                opponentUsername: 'user'
            })

            expect(res.statusCode).toBe(500);
        });
    })

    describe('/respond PATCH', () => {
        test('return 200 when challengeId exists in db', async () => {
            const opponentUsername = chance.word({length: 10});
            const challenge = await Challenge.create({opponentUsername});
            const challengeId = challenge._id;
            const accepted = true;
            const res = await request(app).patch('/api/challenge/respond').send({
                challengeId,
                accepted
            });

            expect(res.statusCode).toBe(200);
        });

        test('update challenge to accepted when accepted is true', async () => {
            const opponentUsername = chance.word({length: 10});
            let challenge = await Challenge.create({opponentUsername});
            const challengeId = challenge._id;
            const accepted = true;
            await request(app).patch('/api/challenge/respond').send({
                challengeId,
                accepted
            });

            challenge = await Challenge.findOne({_id: challengeId});
            expect(challenge.status).toBe('accepted');
        });

        test('update challenge to rejected when accepted is false', async () => {
            const opponentUsername = chance.word({length: 10});
            let challenge = await Challenge.create({opponentUsername});
            const challengeId = challenge._id;
            const accepted = false;
            await request(app).patch('/api/challenge/respond').send({
                challengeId,
                accepted
            });

            challenge = await Challenge.findOne({_id: challengeId});
            expect(challenge.status).toBe('rejected');
        });

        test('return 404 when challengeId doesnt exist in db', async () => {

            const challengeId = '640817d7067f84628525e027';
            const accepted = false;
            const res = await request(app).patch('/api/challenge/respond').send({
                challengeId,
                accepted
            });

            expect(res.statusCode).toBe(404);
        });

        describe('return 400 when', () => {
            test('challengeId is not a string', async () => {

                const challengeId = 123;
                const accepted = false;
                const res = await request(app).patch('/api/challenge/respond').send({
                    challengeId,
                    accepted
                });
    
                expect(res.statusCode).toBe(400);
            });
    
            test('accepted is not a boolean', async () => {
    
                const challengeId = '640817d7067f84628525e027';
                const accepted = 'true';
                const res = await request(app).patch('/api/challenge/respond').send({
                    challengeId,
                    accepted
                });
    
                expect(res.statusCode).toBe(400);
            });
    
            test('challengeId is not a valid mongodb key', async () => {
    
                const challengeId = '647';
                const accepted = true;
                const res = await request(app).patch('/api/challenge/respond').send({
                    challengeId,
                    accepted
                });
    
                expect(res.statusCode).toBe(400);
            });
        })
        

        test('return 500 when database is disconnected', async () => {

            db.disconnect();
            const challengeId = '640817d7067f84628525e027';
            const accepted = true;
            const res = await request(app).patch('/api/challenge/respond').send({
                challengeId,
                accepted
            });

            expect(res.statusCode).toBe(500);
        });
    })
})
