const express = require('express');
const cors = require('cors');

var bodyParser = require('body-parser');
const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({
    limit: '5mb',
    parameterLimit: 100000,
    extended: false 
}));

app.use(bodyParser.json({
    limit: '5mb'
}));

const notes=require('./data/nots');
const dotenv=require('dotenv');
const connectDb=require('./config/db');

const userRoutes = require('./routes/userRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const busSeatRoutes = require('./routes/busSeatRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
dotenv.config();
connectDb();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/busseatdetals', busSeatRoutes);


app.use(notFound);
app.use(errorHandler);
const PORT=process.env.PORT||5000;
app.listen(PORT,console.log(`server is started at the port of ${PORT}`));