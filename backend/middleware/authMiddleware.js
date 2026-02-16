import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    let token;

    // Check Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    // If token not found
    if (!token) {
        return res.status(401).json({ message: 'not authorized, no token' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user id to request
        req.user = { id: decoded.id };

        next();
    } catch (error) {
        return res.status(401).json({ message: 'not authorized, token failed' });
    }
};

export default verifyToken;
