import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import User from '../model/user.model.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('cartData');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ 
      success: true, 
      cartData: user.cartData || {} 
    });
  } catch (error) {
    console.error('Get cart error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

router.post('/add', protect, async (req, res) => {
  try {
    const { productId, size, quantity = 1 } = req.body;

    if (!productId || !size) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product ID and size are required' 
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.cartData) {
      user.cartData = {};
    }

    const cartKey = `${productId}_${size}`;

    if (user.cartData[cartKey]) {
      user.cartData[cartKey] += quantity;
    } else {
      user.cartData[cartKey] = quantity;
    }

    user.markModified('cartData');
    await user.save();

    res.json({ 
      success: true, 
      message: 'Item added to cart',
      cartData: user.cartData 
    });
  } catch (error) {
    console.error('Add to cart error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

router.post('/update', protect, async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;

    if (!productId || !size || quantity === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product ID, size, and quantity are required' 
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const cartKey = `${productId}_${size}`;

    if (!user.cartData || !user.cartData[cartKey]) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found in cart' 
      });
    }

    if (quantity <= 0) {
      delete user.cartData[cartKey];
    } else {
      user.cartData[cartKey] = quantity;
    }

    user.markModified('cartData');
    await user.save();

    res.json({ 
      success: true, 
      message: 'Cart updated',
      cartData: user.cartData 
    });
  } catch (error) {
    console.error('Update cart error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

router.post('/remove', protect, async (req, res) => {
  try {
    const { productId, size } = req.body;

    if (!productId || !size) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product ID and size are required' 
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const cartKey = `${productId}_${size}`;

    if (user.cartData && user.cartData[cartKey]) {
      delete user.cartData[cartKey];
      user.markModified('cartData');
      await user.save();
    }

    res.json({ 
      success: true, 
      message: 'Item removed from cart',
      cartData: user.cartData 
    });
  } catch (error) {
    console.error('Remove from cart error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

router.post('/clear', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.cartData = {};
    user.markModified('cartData');
    await user.save();

    res.json({ 
      success: true, 
      message: 'Cart cleared',
      cartData: {} 
    });
  } catch (error) {
    console.error('Clear cart error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});
router.post('/sync', protect, async (req, res) => {
  try {
    const { localCartData } = req.body;

    if (!localCartData || typeof localCartData !== 'object') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid cart data format' 
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.cartData) {
      user.cartData = {};
    }

    Object.keys(localCartData).forEach((cartKey) => {
      if (user.cartData[cartKey]) {

        user.cartData[cartKey] += localCartData[cartKey];
      } else {
        user.cartData[cartKey] = localCartData[cartKey];
      }
    });

    user.markModified('cartData');
    await user.save();

    res.json({ 
      success: true, 
      message: 'Cart synced successfully',
      cartData: user.cartData 
    });
  } catch (error) {
    console.error('Sync cart error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

export default router;