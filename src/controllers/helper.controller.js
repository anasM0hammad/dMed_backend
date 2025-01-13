const jwt = require('jsonwebtoken');

const authorizationGuard = (req, res, next) => {
    try{
        const headers = req.headers;
        const accessToken = headers['authorization'];
        const role = headers['x-role'];
        const address = headers['x-address'];

        if(!address || !role || !accessToken){
            return res.status(400).json({
                message: 'missing headers'
            });
        }

        const token = accessToken.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SALT);
        if(decodedToken.address !== address || decodedToken.role !== role){
            return res.status(403).json({
                message: 'User unauthorized'
            });
        }

        next();
    }
    catch(err){
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

module.exports = { authorizationGuard };