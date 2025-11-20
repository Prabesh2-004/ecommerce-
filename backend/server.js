import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoute from './routes/auth.js';
import productRoute from './routes/product.js';
import usersRoute from './routes/users.js';
import cartRoute from './routes/cart.js';
import connectCloudinary from './config/cloudinary.js';
import orderRouter from './routes/order.js';
import contactRoute from './routes/contact.js'

dotenv.config();
const app = express();
connectDB();
connectCloudinary();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'https://ecommerce-forntend.onrender.com',
  'http://localhost:5174'
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', usersRoute);
app.use('/api/auth', authRoute);  
app.use('/api/product', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/orders', orderRouter)
app.use("/api/contact", contactRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
