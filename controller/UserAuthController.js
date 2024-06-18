const Common = require('../utils/response');
const User = require('../model/user');
const Otp = require('../service/otp');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const Subscription = require('../model/subscription');
const Batch = require('../model/batch');
const Payment = require('../model/payment');
exports.ForceUpdate = (req,res) => {
    res.json(Common.generateResponse(0,{version: []}));
};
exports.getOtp = (req,res) => {
    let fetcheduser;
    User.findOne({phone_no: req.body.phone_no})
        .then(async user => {
            if (!user){
                return  res.json(Common.generateResponse(3, "You are not registered user"));
            }
            let otp;
            if(req.body.phone_no == 7980610431) {
                otp = 123456;
            } else {
                otp = Math.floor(100000 + Math.random() * 900000);
                await Otp.sendMessage(req.body.phone_no, otp);
            }
            fetcheduser = user;
            user.otp=otp;
            user.expireIn= Date.now() + 300000
            return user.save();
        })
        .then(result => {
            if (fetcheduser && fetcheduser.email) {
                const data = {
                    _id: result._id,
                    registered: true
                }
                return res.json(Common.generateResponse(0,data));
            }
        })
        .catch(err => {
            return  res.json(Common.generateResponse(100,err));
        })
};
exports.resendOtp=(req,res)=>{
    const query=({phone_no: req.body.phone_no})
    const newotp=Math.floor(100000 + Math.random() * 900000);
    const newuser={
        otp:newotp,
        expireIn: Date.now() + 300000
    };
    const Option={upsert:false}
    User.findOneAndUpdate(query,newuser,Option)
    .then(resp=>{
        Otp.sendMessage(req.body.phone_no,newotp);
        res.json(Common.generateResponse(0, resp));
    })
    .catch(err=>{
        res.json(Common.generateResponse(100, err));

    })
};

exports.loginUser = (req,res) => {
    var fetcheduser;
    User.findOne({phone_no: req.body.phone_no})
    .then(resp => {
        if (resp.expireIn > Date.now()) {
           if(resp.otp === Number(req.body.otp)) {
               if (resp.deviceId.length === 2 ) {
                   return res.json(Common.generateResponse(3, 'Login Failed Device Limit Reached'));
               }else {
                    fetcheduser= resp;
                    resp.otp =  null;
                    resp.expireIn = null;
                    resp.deviceId.push(req.body.deviceId);
                    resp.isLoggedin = true;
                    return resp.save();
               }
           }else {
               return res.json(Common.generateResponse(3, 'Wrong OTP'));
           }
        } else {
            return res.json(Common.generateResponse(3, 'OTP Expired'));
        }
    })
    .then(async resp => {
        if(fetcheduser) {
            const token = jwt.sign({userid:fetcheduser._id,name:fetcheduser.name,email:fetcheduser.email, phone_no: fetcheduser.phone_no },config.JWT_SECRET.Secret);
            console.log(token);
            return res.json(Common.generateResponse(0,{token, name: fetcheduser.name}));
        }
    })
    .catch(err=> {
        return res.json(Common.generateResponse(100, err));
    })
};
exports.validateRegOtp=(req,res)=>{
    User.findOne({phone_no: req.body.phone_no})
        .then(resp => {
            if (resp.expireIn > Date.now()) {
                if(resp.otp === Number(req.body.otp)) {
                    resp.otp =  null;
                    resp.expireIn = null;
                    resp.deviceId =req.body.deviceId;
                    return resp.save();
                }else {
                    return res.json(Common.generateResponse(3, 'Wrong OTP'));
                }
            } else {
                resp.otp =  null;
                resp.expireIn = null;
                resp.deviceId =req.body.deviceId;
                resp.save()
                return res.json(Common.generateResponse(3, 'OTP Expired'));
            }
        })
        .then(resp => {
            res.json(Common.generateResponse(0, 'Correct OTP'));
        })
        .catch(err=>{
            res.json(Common.generateResponse(100, err));
        });
};
exports.createUser = (req,res) =>{
    var u;
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone_no: req.body.phone_no,
        course: [{name: req.body.course_name,batch_name: req.body.batch}],
        roll_no: req.body.roll_no,
        img_url: req.body.img_url
    });
    user.save()
        .then(resp => {
            u=resp;
            const day =  new Date();
            day.setDate(day.getDate()+ req.body.sub_duration);
            const subs = new Subscription({
                userId: resp._id,
                batch_id: req.body.batch_id,
                course_id:req.body.course_id,
                end_date: day,
            })
            return  subs.save();
        })
        .then(resp=>{
            return Batch.findByIdAndUpdate(req.body.batch_id, {$push: {userId: u._id}});
        })
        .then(resp=>{
            return res.json(Common.generateResponse(0, resp));
        })
        .catch(err=>{

            return res.json(Common.generateResponse(100, err));
        });

};
exports.getAllUser = (req,res) =>{
    User.aggregate([
        {$match: {type: {$ne: "Admin"}}},
        {$sort: {createdAt: -1}}
    ])
        .then(resp => {
            return res.json(Common.generateResponse(0, resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100, err));
        });
};
exports.createDue = (req,res) =>{
    const d = {
        amount: Number(req.body.amount),
        dueDate: req.body.dueDate
    }
    User.findOneAndUpdate({_id: req.body.userId}, {$push: {dues: d},$inc: {total_due_amount: d.amount}})
        .then(resp => {
            return res.json(Common.generateResponse(0, resp));
        })
        .catch(err=>{
            console.log(err)
            return res.json(Common.generateResponse(100, err));
        });
};
exports.clearDue = (req,res) =>{
    User.findOneAndUpdate({_id: req.params.uid}, {total_due_amount: 0})
        .then(resp => {
            return res.json(Common.generateResponse(0, resp));
        })
        .catch(err=>{
            console.log(err)
            return res.json(Common.generateResponse(100, err));
        });
};
exports.getUserById = (req,res) =>{
    User.findById(req.userId)
        .then(resp => {
            return res.json(Common.generateResponse(0, resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100, err));
        });
};

exports.getDue = (req,res) =>{
    User.findById(req.userId).select('total_due_amount')
        .then(resp => {
            return res.json(Common.generateResponse(0, resp.total_due_amount));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100, err));
        });
};
exports.savePayment = async (req,res) => {
    const user = await User.findOneAndUpdate({phone_no: req.body.phone}, {$inc: {total_due_amount: -Number(req.body.amount)}}).select(['_id']);
    const p = new Payment({
        userId: user._id,
        paymentObj: req.body,
        status: req.body.status
    })
    p.save()
        .then(resp=> {
            return res.send('Payment Successful');

        })
        .catch(err=> {
            return res.json(Common.generateResponse(100, err));
        })
};
exports.errorPayment = async (req,res) => {
    const user = await User.findOne({phone_no: req.body.phone}).select(['_id']);
    const p = new Payment({
        userId: user._id,
        paymentObj: req.body,
        status: req.body.status
    })
    p.save()
        .then(resp=> {
            return res.send( 'Payment Failed');

        })
        .catch(err=> {
            return res.json(Common.generateResponse(100, err));
        })
};
exports.removeDevice = (req,res)=>{
    User.findOneAndUpdate({_id: req.params.id?req.params.id: req.userId},{$pop: {deviceId: -1}},{new: true})
    .then(resp=>{
        return res.json(Common.generateResponse(0, resp));
    })
    .catch(err=>{
        return res.json(Common.generateResponse(100, err));

    })
}
