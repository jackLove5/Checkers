const {app, sessionMiddleware} = require('./app')
const connectDB = require('./db/connect')
const setupSocketServer = require('./socket/setup')
const http = require('http');
require('dotenv').config();
const sharedsession = require('express-socket.io-session');


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI_DEV)
        
        const server = http.createServer(app);
        //const io = setupSocketServer(server);
        
        //io.use(sharedsession(sessionMiddleware, {autoSave: true}));

        server.listen(process.env.PORT, console.log(`Server listening on port ${process.env.PORT}`))

    } catch (error) {
        console.error(error);
    }
}

start();
