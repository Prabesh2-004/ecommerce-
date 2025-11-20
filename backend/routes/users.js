import express from 'express';
import { check, validationResult } from 'express-validator';
import gravatar from 'gravatar';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

const router = express.Router();

router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter at least 6 characters in password').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      // Get gravatar
      const avatar = gravatar.url(email, {
        s: '150',
        r: 'pg',
        d: 'mm',
      });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      user = await User.create({
        username,
        email,
        password: hashedPassword,
        avatar,
        cartData: {},
      });

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
            return res.status(500).json({ message: 'Error generating token' });
          }
          
          res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
              id: user._id,
              username: user.username,
              email: user.email,
              avatar: user.avatar,
            },
          });
        }
      );
    } catch (error) {
      console.error('Registration error:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

router.post(
  '/login',
  [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
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
            return res.status(500).json({ message: 'Error generating token' });
          }
          
          res.json({
            message: 'Login successful',
            token,
            user: {
              id: user._id,
              username: user.username,
              email: user.email,
              avatar: user.avatar,
            },
          });
        }
      );
    } catch (error) {
      console.error('Login error:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

export default router;