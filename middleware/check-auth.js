const jwt = require('jsonwebtoken'),
      config = require('../config/config');

module.exports.isAuthenticated =async (req,res,next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const data=  await jwt.verify(token, config.JWT_SECRET.Secret);
        req.userId = data.userid
        req.name =data.name
        next();
    }catch(error){
        res.status(401).json({
            message: 'Authentication Failed'
        });
    }

};
