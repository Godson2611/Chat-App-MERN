import common from "../common/common.js";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        const decodedToken = await common.decodeToken(token);
        if (!decodedToken) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        const userId = decodedToken.payload;
        if (!userId) {
            return res.status(404).json({ error: "User ID not found in token" });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export default {protectRoute}