import express from 'express';
import adminAuth from '../middleware/admin.middleware.js';
import { protect } from '../middleware/auth.middleware.js';
import {
  placeOrder,
  getAllOrders,
  updateOrderStatus,
  getUserOrders,
  cancelOrder
} from '../controller/order.controller.js';

const orderRouter = express.Router();

// User routes
orderRouter.post('/place', protect, placeOrder);
orderRouter.get('/userorders', protect, getUserOrders);
orderRouter.post('/cancel', protect, cancelOrder);

// Admin routes
orderRouter.get('/list', adminAuth, getAllOrders);
orderRouter.post('/status', adminAuth, updateOrderStatus);

export default orderRouter;