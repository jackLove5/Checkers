const app = require('./app')
const connectDB = require('./db/connect')
require('dotenv').config();


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI_DEV)
        app.listen(process.env.PORT, () => {
            console.log(`Server started on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error(error);
    }
}

start();
