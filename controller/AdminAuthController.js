const bcrypt = require('bcryptjs');
const Common = require('../utils/response');
const Admin = require('../model/admin');
const Config = require('../config/config');
const jwt = require('jsonwebtoken');

exports.createAdmin=(req,res)=>{
    bcrypt.hash(req.body.password,12)
    .then(resp=>{
        const newUser=new Admin({
            name:req.body.name,
            email:req.body.email,
            password:resp
        });
        return newUser.save();
    })
    .then(resp=>{
        return res.json(Common.generateResponse(0,resp));
    })
    .catch(err=>{
        return res.json(Common.generateResponse(100,err));
    })

}
exports.login=(req,res)=>{
    let fetcheduser;
    Admin.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                return res.json(Common.generateResponse(4))
            }
            fetcheduser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.json(Common.generateResponse(4))
            }
            const token = jwt.sign({userId: fetcheduser._id, name: fetcheduser.name},Config.JWT_SECRET.Secret);
            return  res.json(Common.generateResponse(0,{token,name: fetcheduser.name, imgUrl: null}));
        })
        .catch(err => {
            console.log(err)
            return  res.json(Common.generateResponse(100,err));
        })

}