const jwt = require("jsonwebtoken");
const User = require("../model/User");

const verifyUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(401).json({ message: "Unauthorized" });

        req.user = user; // Attach user to the request
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};

module.exports = { verifyUser };