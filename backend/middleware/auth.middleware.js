import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers['x-auth-token']) {
      token = req.headers['x-auth-token'];
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.headers.token) {
      token = req.headers.token;
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token, authorization denied' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded?.user?.id || decoded?.id || decoded;
    req.user = { id: userId, _id: userId };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid' 
    });
  }
};