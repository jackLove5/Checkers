const {app} = require('../app');
const request = require('supertest');

const connectDB = require('../db/connect')
require('dotenv').config();
const Chance = require('chance');
const chance = new Chance();

const User = require('../models/user')

describe('/rankings', () => {
    let db;

    beforeEach(async () => {
        db = await connectDB(process.env.MONGO_URI_TEST);
        
        const newUsers = [];
        for (let i = 0; i < 5; i++) {
            newUsers.push({
                username: chance.word({length: 10}),
                password: chance.word({length: 60}),
                rating: chance.integer({min: 0, max: 3000})
            });
        }

        await User.create(newUsers);
    });

    afterEach(async () => {
        if (db.connection.readyState !== 0) {
            await db.disconnect();
        }
    });

    afterAll(async () => {
        db = await connectDB(process.env.MONGO_URI_TEST);
        await User.deleteMany({});
        await db.disconnect();
    });

    describe('/ GET', () => {
        test('should return 200 status', async () => {
            const res = await request(app).get('/api/rankings');
    
            expect(res).toBeTruthy();
            expect(res.statusCode).toBe(200);
        });
    
        test('should return a list of all users in database', async () => {
            const numUsers = await User.count({});
    
            const res = await request(app).get('/api/rankings');
    
            expect(res.body.users).toBeTruthy();
            expect(res.body.users.length).toBe(numUsers);
        });
    
        test('should not include password hashes in the result', async () => {
            const res = await request(app).get('/api/rankings');
    
            expect(res.body.users.length).toBeGreaterThan(0);
            expect(res.body.users.every(user => user.password === undefined)).toBeTruthy();
        });
    
        test('should include username in the result', async () => {
            const res = await request(app).get('/api/rankings');
    
            expect(res.body.users.length).toBeGreaterThan(0);
            expect(res.body.users.every(user => user.username)).toBeTruthy();
        });
    
        test('should include rating in the result', async () => {
            const res = await request(app).get('/api/rankings');
            
    
            expect(res.body.users.length).toBeGreaterThan(0);
            expect(res.body.users.every(user => user.rating)).toBeTruthy();
        });
    
        test('should sort result by rating (descending)', async () => {
            const res = await request(app).get('/api/rankings');
    
            expect(res.body.users.length).toBeGreaterThan(0);
    
            const ratings = res.body.users.map(x => x.rating);
            const isSortedDesc = ratings.every((_, i, arr) => i == 0 || arr[i-1] >= arr[i]);
            expect(isSortedDesc).toBeTruthy();
        });
    
        test('should return 500 when database is disconnected', async () => {
            await db.disconnect();
    
            const res = await request(app).get('/api/rankings');
    
            expect(res.statusCode).toBe(500);
        });
    })
   
});