export const authenticate = (req, res, next) => {
    // Middleware logic to check user authentication
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token logic here (e.g., using JWT)
    // If valid, call next(), otherwise return an error response

    next();
};