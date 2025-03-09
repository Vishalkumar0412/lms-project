import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies?.token; // Ensure cookies exist
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            });
        }


        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                message: "Invailed Token",
                success: false
            })
        }

        req.id = decode.userId;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
            success: false,
            error: error.message
        });
    }
};

export default isAuthenticated;
