const fs = require('fs');
const path = require('path');
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const app = express()
require('dotenv').config();

const userRouter = require('./routes/api/user')
const gameRouter = require('./routes/api/game')
const rankingsRouter = require('./routes/api/rankings')
const playRouter = require('./routes/pages/play');

const {addMenuItems} = require('./middleware/navbar');
const sessionMiddleware = session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI_DEV
    })
});

app.use(sessionMiddleware);

app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/rankings', rankingsRouter);
app.use('/api/game', gameRouter);
app.use(addMenuItems);

const sendHtml = filename => (req, res) => {
    res.send(fs.readFileSync(path.resolve(__dirname, `./html/${filename}`), {encoding: 'utf-8'}));
}
fs.readdirSync(path.resolve(__dirname, './html')).forEach(filename => {
    const path = filename === 'homepage.html' ? '' : filename.split(/\./)[0];
    const router = express.Router();
    router.route('/').get(sendHtml(filename));
    app.use(`/${path}`, router);
});

app.use(express.static('./public'));

app.use('/play', playRouter);



module.exports = {app, sessionMiddleware};