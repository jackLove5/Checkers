const app = require('../app');
const request = require('supertest');

const connectDB = require('../db/connect')
require('dotenv').config();
const Chance = require('chance');
const chance = new Chance();

const Game = require('../models/game')


describe('/api/game/', () => {

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
        await Game.deleteMany({});
        await db.disconnect();
    });

    describe('/create POST', () => {
        test("return created game's id on success", async () => {
            const res = await request(app).post('/api/game/create').send({
                isRanked: false,
                vsCpu: false
            });

            expect(res.body._id).toBeTruthy();
        });

        test('return status 200 when game created successfully', async () => {
            const res = await request(app).post('/api/game/create').send({
                isRanked: false,
                vsCpu: false
            });
    
            expect(res.statusCode).toBe(200);
        });


        describe('return status 400 when', () => {
            test("isRanked field is not a boolean type", async () => {
                const res = await request(app).post('/api/game/create').send({
                    isRanked: 'true',
                    vsCpu: false
                });
    
                expect(res.statusCode).toBe(400);
            });
    
            test("vsCpu field is not a boolean type", async () => {
                const res = await request(app).post('/api/game/create').send({
                    isRanked: true,
                    vsCpu: 'true'
                });
    
                expect(res.statusCode).toBe(400);
            });
        })

        test("database is disconnected", async () => {
            await db.disconnect();
            const res = await request(app).post('/api/game/create').send({
                isRanked: true,
                vsCpu: true
            });
    
            expect(res.statusCode).toBe(500);
        })
    });

    describe('/:id GET', () => {
        test('return status 200 when game id exists in db', async () => {
            const game = await Game.create({
                isRanked: false,
                vsCpu: false,
                playerBlack: 'user'
            });
    
            const res = await request(app).get(`/api/game/${game._id}`);
            expect(res.statusCode).toBe(200);
        });


        describe('return status 404 when', () => {
            test('id is invalid format', async () => {
                const id = chance.word({length: 10});
                const res = await request(app).get(`/api/game/${id}`);
                expect(res.statusCode).toBe(404);
            });
    
            test('id doesnt exist in db', async () => {
                const id = '640817d7067f84628525e027';
                const res = await request(app).get(`/api/game/${id}`);
                expect(res.statusCode).toBe(404);
            });
        });

        test('return status 500 when database is disconnected', async () => {
            const id = '640817d7067f84628525e027';
            db.disconnect();
            const res = await request(app).get(`/api/game/${id}`);
            expect(res.statusCode).toBe(500);
        });
    });

    describe('/?u GET', () => {
        test('should return 200', async () => {
            const res = await request(app).get('/api/game?u=user');
            expect(res.statusCode).toBe(200);
        });

        test('should return empty array when user doesnt exist in db', async () => {
            const username = chance.word({length: 10});
            const res = await request(app).get(`/api/game?u=${username}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.games.length).toBe(0);
        });
    
        test('should return a list of games played by the specified user', async () => {
            await Game.create({
                isRanked: false,
                vsCpu: false,
                playerBlack: 'user'
            },{
                isRanked: false,
                vsCpu: false,
                playerBlack: 'guest',
                playerWhite: 'user'
            });

            const found1 = await Game.find({playerBlack: 'user'});
            const found2 = await Game.find({playerWhite: 'user'});
    
            const res = await request(app).get('/api/game?u=user');
    
            expect(res.body.games).toBeTruthy();
            expect(res.body.games.length).toBe(found1.length + found2.length);
        });
    
        test('should return 500 when a database is unavailable', async () => {
            db.disconnect();
            const res = await request(app).get('/api/game?u=user');
            expect(res.statusCode).toBe(500);
        });
            
    });
});