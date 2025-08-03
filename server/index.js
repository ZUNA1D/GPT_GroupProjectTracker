import express from 'express';  
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';

dotenv.config();

const app = express();

app.use(cors({
    origin:process.env.FRONTEND_URL, // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods
    allowedHeaders: ["Content-Type","Authorization"],// Allow specific headers
    })
);

app.use(morgan('dev')); // Logging middleware
app.use(express.json());

// db connection
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB connected successfully');  
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});


const PORT = process.env.PORT || 5000;

app.get('/', async(req, res) => {
    res.status(200).json({
        message: 'Welcome to the GPT App Server'
    });
});


app.use('/api', routes);

// error middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        
    });
});

// not found middleware
app.use((req, res) => {
    res.status(404).json({
        message: 'NOT FOUND',
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});