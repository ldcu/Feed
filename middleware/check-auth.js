const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => { // If the API executed doesn't have a valid "access_token", then it won't work to be executed.
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Oi, mate. Not good."
        });
    }
};