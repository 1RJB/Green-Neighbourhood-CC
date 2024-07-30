const { verify } = require('jsonwebtoken');
require('dotenv').config();

const validateToken = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.sendStatus(401);
        }

        const accessToken = authHeader.split(" ")[1];
        if (!accessToken) {
            return res.sendStatus(401);
        }

        const payload = verify(accessToken, process.env.APP_SECRET);

        if (payload.role === 'staff') {
            req.staff = payload;
        } else if (payload.role === 'customer') {
            req.customer = payload;
        } else {
            return res.sendStatus(401);
        }

        return next();
    } catch (err) {
        return res.sendStatus(401);
    }
}

module.exports = { validateToken };
