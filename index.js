const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator')

//Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const genresRoutes = require('./routes/genres');
const livreRoutes = require('./routes/livres');

//Config App
require('dotenv').config();
const app = express();

//Db mongoDB
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
.then(() => console.log('db connected'))
.catch(() => console.log('not nonnect to the database !'))

//Middlewares
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(expressValidator())

//Routes Middleware
app.use('/api', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/genre', genresRoutes);
app.use('/api/livre', livreRoutes);


const port = process.env.PORT || 3000; 
app.listen(port, () => console.log(`app is running on port ${port}`));