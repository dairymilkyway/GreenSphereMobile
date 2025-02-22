const jwt = require("jsonwebtoken");
const User = require("../model/User");

const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Unauthorized" });

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
