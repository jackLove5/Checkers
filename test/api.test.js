const app = require('../app');
const request = require('supertest');

const connectDB = require('../db/connect')
require('dotenv').config();
const Chance = require('chance');
const chance = new Chance();

const User = require('../models/user')

const bcrypt = require('bcrypt')

describe('/api/user/', () => {

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
        await User.deleteMany({});
        await db.disconnect();
    });

    describe('/register', () => {
        describe('Return status 200 when', () => {
            test('a new user successfully registers', async () => {
                const username = chance.word({length: 10});
                const password = chance.word({length: 10});
    
                const res = await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(200);
            });

            test('username is 3 characters', async () => {
                const username = chance.word({length: 3});
                const password = chance.word({length: 10});
    
                const res = await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(200);
            });

            test('username is 30 characters', async () => {
                const username = chance.word({length: 30});
                const password = chance.word({length: 10});
    
                const res = await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(200);
            });

            test('password field is 8 characters', async () => {
                const username = chance.word({length: 10});
                const password = chance.word({length: 8});
    
                const res = await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(200);
            });

            test('password field is 50 characters', async () => {
                const username = chance.word({length: 10});
                const password = chance.word({length: 50});
    
                const res = await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(200);
            });
        });

        describe('Return status 400 when', () => {
            test('username field is empty', async () => {
                const username = '';
                const password = chance.word({length: 10});
    
                const res = await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(400);
            });
    
            test('username is 1 character', async () => {
                const username = chance.word({length: 1});
                const password = chance.word({length: 10});
    
                const res = await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(400);
            });
    
            test('username is 2 characters', async () => {
                const username = chance.word({length: 2});
                const password = chance.word({length: 10});
    
                const res = await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(400);
            });
    
            test('username is 31 characters', async () => {
                const username = chance.word({length: 31});
                const password = chance.word({length: 10});
    
                const res = await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(400);
            });
    
            test('username field is null', async () => {
                const username = null;
                const password = chance.word({length: 10});
    
                const res = await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(400);
            });
    
            test('username field is undefined', async () => {
                const password = chance.word({length: 10});
    
                const res = await request(app).post('/api/user/register').send({
                    password
                });
    
                expect(res.statusCode).toBe(400);
            });
    
            test('username is a number', async () => {
                const username = 11;
                const password = chance.word({length: 10});
    
                const res = await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(400);
            });
    
            test('username is an object', async () => {
                const username = {key: 'value'};
                const password = chance.word({length: 10});
    
                const res = await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(400);
            });
    
            test("username contains a space character", async () => {
                const username = chance.word({length: 6}) + " " + "abc";
                const password = chance.word({length: 10});
    
                const res = await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(400);
            });
    
            test('username contains a control character', async () => {
                const username = chance.word({length: 6}) + String.fromCharCode(0) + "abc";
                const password = chance.word({length: 10});
    
                const res = await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(400);
            });
    
            test("username contains punction that's not _ or - character", async () => {
                const username = chance.word({length: 6}) + "<" + "abc";
                const password = chance.word({length: 10});
    
                const res = await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(400);
            });
    
            test('password field is 7 characters', async () => {
                const username = chance.word({length: 10});
                const password = chance.word({length: 7});
    
                const res = await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(400);
            });
    
            test('password field is 51 characters', async () => {
                const username = chance.word({length: 10});
                const password = chance.word({length: 51});
    
                const res = await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(400);
            });
    
            test('password is a number', async () => {
                const username = chance.word({length: 10});
                const password = 11;
    
                const res = await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(400);
            });
    
            test('password is an object', async () => {
                const username = chance.word({length: 10});
                const password = {key: "value"};
    
                const res = await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(400);
            });
    
            test('password field is empty', async () => {
                const username = chance.word({length: 10});
                const password = '';
    
                const res = await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(400);
            });
    
            test('password field is null', async () => {
                const username = chance.word({length: 10});
                const password = null;
    
                const res = await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(400);
            });
    
            test('password field is undefined', async () => {
                const username = chance.word({length: 10});
    
                const res = await request(app).post('/api/user/register').send({
                    username
                });
    
                expect(res.statusCode).toBe(400);
            });

            test('username already exists', async () => {
                const username = chance.word({length: 10});
                const password = chance.word({length: 10});
    
                await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                const res = await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(400);
    
            });
        });

        describe('Return status 500 when', () => {
            test('database is disconnected', async () => {
                const username = chance.word({length: 10});
                const password = chance.word({length: 10});
    
                await db.disconnect();
    
                const res = await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(500);
            });
        });

        test('The new user should appear in Users table after registering successfully', async () => {

            const username = chance.word({length: 10});
            const password = chance.word({length: 10});
            const res = await request(app).post('/api/user/register').send({
                username,
                password
            });

            const user = await User.findOneAndDelete({username});
            
            expect(user).toBeTruthy();
            expect(user.username).toBe(username);
        });

        test('All letters in the stored username should be lowercase', async () => {

            const username = chance.word({length: 7}) + "ABC";
            const password = chance.word({length: 10});
            const res = await request(app).post('/api/user/register').send({
                username,
                password
            });

            const lower = username.toLowerCase();
            const user = await User.findOneAndDelete({username: lower});
            
            expect(user).toBeTruthy();
        });

        test("The user's password should be stored as a bcrypt hash", async () => {
            const username = chance.word({length: 10});
            const password = chance.word({length: 10});

            const res = await request(app).post('/api/user/register').send({
                username,
                password
            });

            const user = await User.findOneAndDelete({username});
            expect(user.password).toBeTruthy();

            const match = await bcrypt.compare(password, user.password);
            expect(match).toBeTruthy();
        });
    });

    describe('/login', () => {
        describe('Return status 200 when', () => {
            test('credentials match an existing user record', async () => {
                const username = chance.word({length: 10});
                const password = chance.word({length: 10});
    
                await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                const res = await request(app).post('/api/user/login').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(200);
            });

            test('username has different case than the one used when registering', async () => {
                const lowerUsername = chance.word({length: 10}).toLowerCase();
                const upperUsername = lowerUsername.toUpperCase();
                let password = chance.word({length: 10});
    
                await request(app).post('/api/user/register').send({
                    username: lowerUsername,
                    password: password
                });
    
                const res = await request(app).post('/api/user/login').send({
                    username: upperUsername,
                    password
                });
    
                expect(res.statusCode).toBe(200);
            });
    
            test('password has equivalent unicode content to the one used when registering', async () => {
                const username = chance.word({length: 10});
                let password = chance.word({length: 10})
    
                await request(app).post('/api/user/register').send({
                    username: username,
                    password: password + "\u00F1"
                });
    
                const res = await request(app).post('/api/user/login').send({
                    username: username,
                    password: password + "\u006E\u0303"
                });
    
                expect(res.statusCode).toBe(200);
            });
        });

        describe('Return status 400 when', () => {
            test('username is null', async () => {
                const username = null;
                let password = chance.word({length: 10});
    
                const res = await request(app).post('/api/user/login').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(400);
            });
    
            test('username is not a string', async () => {
                const username = 1234;
                let password = chance.word({length: 10});
    
                const res = await request(app).post('/api/user/login').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(400);
            });
    
            test('password is null', async () => {
                const username = chance.word({length: 10});
                let password = null;
    
                const res = await request(app).post('/api/user/login').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(400);
            });
    
            test('password is not a string', async () => {
                const username = chance.word({length: 10});
                let password = 1234;
    
                const res = await request(app).post('/api/user/login').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(400);
            })
        });
        

        describe('Return status 401 when', () => {
            test('username has correct format, but does not exist', async () => {
                const username = chance.word({length: 10});
                const password = chance.word({length: 10});
    
                const res = await request(app).post('/api/user/login').send({
                    username,
                    password
                });
    
                expect(res.statusCode).toBe(401);
            });
    
            test('password is incorrect', async () => {
                const username = chance.word({length: 10});
                let password = chance.word({length: 10});
    
                await request(app).post('/api/user/register').send({
                    username,
                    password
                });
    
                password += "abc";
                const res = await request(app).post('/api/user/login').send({
                    username,
                    password
                })
    
                expect(res.statusCode).toBe(401);
            });    
        });
        
        describe('Return status 500 when', () => {
            
            test('database is disconnected', async () => {
                const username = chance.word({length: 10});
                let password = chance.word({length: 10});

                db.disconnect();
                const res = await request(app).post('/api/user/login').send({
                    username,
                    password
                });

                expect(res.statusCode).toBe(500);
            });
        });
    });

    describe('/rankings', () => {
        test('should return 200 status', async () => {
            const res = await request(app).get('/api/user/rankings');

            expect(res).toBeTruthy();
            expect(res.statusCode).toBe(200);
        });

        test('should return a list of all users in database', async () => {
            const numUsers = await User.count({});

            const res = await request(app).get('/api/user/rankings');

            expect(res.body.users).toBeTruthy();
            expect(res.body.users.length).toBe(numUsers);
        });

        test('should not include password hashes in the result', async () => {
            const res = await request(app).get('/api/user/rankings');

            expect(res.body.users.length).toBeGreaterThan(0);
            expect(res.body.users.every(user => user.password === undefined)).toBeTruthy();
        });

        test('should include username in the result', async () => {
            const res = await request(app).get('/api/user/rankings');

            expect(res.body.users.length).toBeGreaterThan(0);
            expect(res.body.users.every(user => user.username)).toBeTruthy();
        });

        test('should include rating in the result', async () => {
            const res = await request(app).get('/api/user/rankings');

            expect(res.body.users.length).toBeGreaterThan(0);
            expect(res.body.users.every(user => user.rating)).toBeTruthy();
        });

        test('should sort result by rating (descending)', async () => {

            const newUsers = [];
            for (let i = 0; i < 5; i++) {
                newUsers.push({
                    username: chance.word({length: 10}),
                    password: chance.word({length: 60}),
                    rating: chance.integer({min: 0, max: 3000})
                });
            }

            await User.create(newUsers);
            const res = await request(app).get('/api/user/rankings');

            expect(res.body.users.length).toBeGreaterThan(0);

            const ratings = res.body.users.map(x => x.rating);
            const isSortedDesc = ratings.every((_, i, arr) => i == 0 || arr[i-1] >= arr[i]);
            expect(isSortedDesc).toBeTruthy();
        });

        test('should return 500 when database is disconnected', async () => {
            await db.disconnect();

            const res = await request(app).get('/api/user/rankings');

            expect(res.statusCode).toBe(500);
        });
    });

    describe('/:username', () => {
        test('should return 200 status if request contains an existing username', async () => {
            const newUser = {
                username: chance.word({length: 10}),
                password: chance.word({length: 60}),
            };

            await User.create(newUser);

            const res = await request(app).get(`/api/user/${newUser.username}`);

            expect(res.statusCode).toBe(200);
        });

        test('should return 404 status if requested username does not exist', async () => {
            const username = chance.word({length: 10});
            const res = await request(app).get(`/api/user/${username}`);

            expect(res.statusCode).toBe(404);
        });

        test('should return 404 status if no username is specified', async () => {
            const res = await request(app).get(`/api/user/`);

            expect(res.statusCode).toBe(404);
        });

        test('should return 500 status when a db error occurs', async () => {
            const newUser = {
                username: chance.word({length: 10}),
                password: chance.word({length: 60}),
            };

            await User.create(newUser);
            
            await db.disconnect();

            const res = await request(app).get(`/api/user/${newUser.username}`);

            expect(res.statusCode).toBe(500);
        });
    });
});