import jwt from 'jsonwebtoken';

const adminAuth = async (req,res,next) => {
    try {
        let token;
        if (req.headers['x-auth-token']) token = req.headers['x-auth-token'];
        else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) token = req.headers.authorization.split(' ')[1];
        else if (req.headers.token) token = req.headers.token;

        if(!token) {
            return res.status(401).json({success:false, message: 'Token missing, Not Authorized to change'});
        }

        const decoded_token = jwt.verify(token, process.env.JWT_SECRET);

        const payloadStr = typeof decoded_token === 'string' ? decoded_token : (decoded_token?.user || JSON.stringify(decoded_token));

        if(payloadStr !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            return res.status(403).json({success:false, message: 'Token Failed, Not Authorized to change'});
        }

        next();
    } catch (error) {
        console.error(error.message);
        return res.status(401).json({message: error.message, success: false})
    }
}

export default adminAuth;