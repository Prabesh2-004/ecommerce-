import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { check, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../model/user.model.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post(
  '/',
  [
    check('email', 'Email is Required').isEmail(),
    check('password', 'Password is Required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid Credential' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid Credential' });
      }

      const payload = {
        user: {
          id: user._id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
        (err, token) => {
          if (err) {
            console.error('JWT signing error:', err);
            return res.status(500).json({ success: false, message: 'Error generating token' });
          }
        
          res.json({ 
            success: true,
            token,
            user: {
              id: user._id,
              username: user.username,
              email: user.email,
              avatar: user.avatar,
            }
          });
        }
      );
    } catch (error) {
      console.error('Login error:', error.message);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
);

export default router;