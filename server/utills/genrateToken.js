import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();  // Ensure .env variables are loaded

const generateToken = (res, user, message) => {
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
    
    return res.status(200)
        .cookie("token", token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000  // 1 day in milliseconds
        })
        .json({
            success: true,
            message,
            user
        });
};
export default generateToken;
