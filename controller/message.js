const Common = require('../utils/response');
const Message = require('../model/message');
const mongoose = require('mongoose');
const User = require('../model/user');
const axios = require('axios');
exports.getAllMessageUsers =(req,res)=>{
    Message.aggregate([
        {$match: {$or: [{sender:  new mongoose.Types.ObjectId(req.userId)},
                    {receiver:  new mongoose.Types.ObjectId(req.userId)}]}},
    ])
        .then(resp=>{
            return res.json(Common.generateResponse(0, resp));
        })
        .catch(err =>{
            return res.json(Common.generateResponse(100, err));
        })
};
exports.getAllMessageAdmin =(req,res)=>{
    Message.aggregate([
        {$match: {receiver:  new mongoose.Types.ObjectId('5f98fe492774be2900ff9ce5')}},
        {
            $group: {
                _id: '$sender',
                message: {$last: '$message'},
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: {
                path: '$user',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {_id: 1, name: '$user.name', message: 1, img_url: '$user.img_url'}
        }
    ])
        .then(resp=>{
            console.log(resp)
            return res.json(Common.generateResponse(0, resp));
        })
        .catch(err =>{
            console.log(err);
            return res.json(Common.generateResponse(100, err));
        })
};
exports.getSingleMessageBySenderId = (req,res)=> {
    Message.aggregate([
        {$match: {$or: [{sender:  new mongoose.Types.ObjectId(req.params.senderId)},
                    {receiver:  new mongoose.Types.ObjectId(req.params.senderId)}]}},
    ])
        .then(resp=>{
            return res.json(Common.generateResponse(0, resp));
        })
        .catch(err =>{
            return res.json(Common.generateResponse(100, err));
        })
};
exports.createMessage= (req,res) => {
    const message = new Message({
        sender: req.userId,
        receiver: '5f98fe492774be2900ff9ce5',
        message: req.body.message,
        created: req.body.created
    });
    message.save()
        .then(resp=>{
            return res.json(Common.generateResponse(0, resp));
        })
        .catch(err =>{
            return res.json(Common.generateResponse(100, err));
        })
};
exports.sendMessageAdmin = (req,res) => {
    const message = new Message({
        sender: '5f98fe492774be2900ff9ce5',
        receiver: req.body.receiver,
        message: req.body.message,
        created: req.body.created
    });
    message.save()
        .then(resp=>{
            sendNotification(resp.receiver, 'New Message', resp.message)
            return res.json(Common.generateResponse(0, resp));
        })
        .catch(err =>{
            return res.json(Common.generateResponse(100, err));
        })
};
const sendNotification = (receiver, title, desc) =>{
        User.findOne({_id: receiver})
            .then(resp => {
                if (resp) {
                    return  axios({
                        method: 'post',
                        url: 'https://onesignal.com/api/v1/notifications',
                        headers: {
                            "Authorization" : "Basic " + process.env.ONESIGNAL_API_KEY
                        },
                        data: {
                            app_id: process.env.ONESIGNAL_APP_ID,
                            include_player_ids: resp.deviceId,
                            headings: {en: title},
                            contents: {en: desc}
                        }
                    })
                }
            })
        .catch(err=>{
            console.log(err.response)
        })
};
