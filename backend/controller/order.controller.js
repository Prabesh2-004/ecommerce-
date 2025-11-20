// controllers/order.controller.js
import orderModel from '../model/order.model.js';
import userModel from '../model/user.model.js';

// Place Order (User)
export const placeOrder = async (req, res) => {
  try {
    const { items, amount, address, paymentMethod } = req.body;
    
    // Validate cart is not empty
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const userId = req.user?.id || req.user?._id;

    const orderData = {
      userId, // normalized id
      items,
      amount,
      address,
      paymentMethod: paymentMethod || 'COD', // FIX: use correct field name
      payment: paymentMethod === 'card' ? true : false,
      status: 'Order Placed',
      date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Clear user's cart after order
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ 
      success: true, 
      message: 'Order placed successfully!',
      orderId: newOrder._id 
    });

  } catch (error) {
    console.error('Order placement error:', error);
    res.status(500).json({ success: false, message: 'Order placement failed' });
  }
};

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

// Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // Valid statuses
    const validStatuses = [
      'Order Placed',
      'Processing',
      'Shipped',
      'Out for Delivery',
      'Delivered',
      'Cancelled'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Order status updated',
      order 
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
};

// Get user's orders (User)
export const getUserOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error('Fetch user orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

// Cancel order (User - only if not shipped)
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if order belongs to user
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Can only cancel if not shipped
    if (['Shipped', 'Out for Delivery', 'Delivered'].includes(order.status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot cancel shipped orders' 
      });
    }

    order.status = 'Cancelled';
    await order.save();

    res.json({ success: true, message: 'Order cancelled successfully' });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel order' });
  }
};