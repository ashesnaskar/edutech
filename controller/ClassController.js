const Common = require('../utils/response');
const Subscription = require('../model/subscription');
const Batch = require('../model/batch');
const Class = require('../model/class');
const mongoose = require('mongoose');
const Notification = require('../model/notification');
const axios = require('axios');
const moment =require('moment');
exports.createNewClass = (req,res) =>{
    let _id;
    if(!req.body._id){
        _id = new mongoose.mongo.ObjectID();
    }else {
        _id = req.body._id;
    }
    Class.findOneAndUpdate({_id},{
        batch_id: req.body.batch_id,
        course_id: req.body.course_id,
        class_taken_by:req.body.class_taken_by,
        time: req.body.time,
        class_join_link: req.body.class_join_link
    }, {upsert: true,new:true,  setDefaultsOnInsert: true})
        .then(resp=>{
            sendNotification(resp.batch_id, 'New Class', `You have a class by ${resp.class_taken_by} on ${moment(resp.time).format('MMMM Do YYYY, h:mm:ss a')}`);

            return res.json(Common.generateResponse(0, resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100,err));
        })
};
exports.getAllClassForUser = async (req,res) =>{
    const subs = await Subscription.findOne({userId: req.userId}).select(['batch_id', 'course_id']);
    Class.aggregate([
        {$match: {batch_id: subs.batch_id, course_id: subs.course_id}},
        {
            $addFields: {
                index: {$indexOfArray: ['$attented_user', new mongoose.Types.ObjectId(req.userId)]}
            }
        },
        {$addFields: {
                status: {$cond: {if: {$eq: ['$index', -1]}, then: 'MISSED', else: 'ATTENDED'}}
            }
        },
        {$sort: {time:-1}}
    ])
        .then(resp=>{
            return res.json(Common.generateResponse(0, resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100,err));
        })
};
exports.attendClass = (req,res)=>{
    Class.findOneAndUpdate({_id: req.params.cid}, {$push: {attented_user: req.userId}})
        .then(resp=>{
            return res.json(Common.generateResponse(0, 'Attendance Successful'));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100,err));

        })
};
exports.getAllBatchs = (req,res) =>{
    Batch.find({course_id: req.params.cid})
        .then(resp=>{
            return res.json(Common.generateResponse(0, resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100,err));

        })
};
exports.getNextClass = async (req,res) => {
    const subs = await Subscription.findOne({userId: req.userId}).select(['course_id','batch_id']);
    Class.aggregate([
        {$match: {course_id: subs.course_id, batch_id: subs.batch_id, time: {$gt: new Date()}}},
        {$limit: 1}
    ])
        .then(resp=>{
            if(resp.length !==0) return res.json(Common.generateResponse(0,resp[0]));
            return res.json(Common.generateResponse(0,null));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100,err));
        })
};
exports.getAllAddedClass = (req,res) => {
    Class.aggregate([
        {$match: {course_id: new mongoose.Types.ObjectId(req.params.cid)}}
    ])
        .then(resp=>{
            return res.json(Common.generateResponse(0,resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100,err));
        })
};
exports.deleteClass = (req,res) => {
    Class.findByIdAndRemove(req.params.id)
        .then(resp=>{
            sendNotification(resp.batch_id, 'Class Canceled', `The class by ${resp.class_taken_by} on ${moment(resp.time).format('MMMM Do YYYY, h:mm:ss a')} has been canceled`);
            return res.json(Common.generateResponse(0,resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100,err));
        })
};

const sendNotification = (batch_id, title, desc) =>{
    Batch.aggregate([
        {$match : {_id: batch_id}},
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        }
    ])
        .then(resp=>{
           let deviceIds =[];
           let notifications = [];
            for (let i=0;i<resp[0].user.length ; i++){
                deviceIds.push(resp[0].user[i].deviceId[0]);
                notifications.push({
                    user: resp[0].user[i]._id,
                    title,
                    description: desc
                });
            }
            Notification.insertMany(notifications);
            return  axios({
                method: 'post',
                url: 'https://onesignal.com/api/v1/notifications',
                headers: {
                    "Authorization" : "Basic " + process.env.ONESIGNAL_API_KEY
                },
                data: {
                    app_id: process.env.ONESIGNAL_APP_ID,
                    include_player_ids: deviceIds,
                    headings: {en: title},
                    contents: {en: desc}
                }
            })
        })

        .catch(err=>{
            console.log(err.response)
        })
};
exports.getAllNotification = (req,res) => {
    Notification.aggregate([
        {$match: {user: new mongoose.Types.ObjectId(req.userId)}}
    ])
        .then(resp=>{
            return res.json(Common.generateResponse(0,resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100,err));
        })
};
exports.getCalassPercentage = async (req,res) => {
    const subs = await Subscription.findOne({userId: req.userId}).select(['course_id','batch_id']);
    const p1 = Class.aggregate([
        {$match: {batch_id: subs.batch_id}},
        {
            $addFields: {
                index: {$indexOfArray: ['$attented_user', {$toObjectId: req.userId}]}
            }
        },
        {$addFields: {
                joined: {$cond: {if: {$ne: ['$index', -1]}, then: true, else: false}}
            }
        },
        {$project: {joined:1}}
    ]);
    const p2 = Class.find({batch_id: subs.batch_id}).countDocuments();
    Promise.all([p1,p2])
        .then(resp=>{
            const j = resp[0].filter(e=>e.joined === true).length;
            return res.json(Common.generateResponse(0, (j/resp[1]) * 100));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100,err));
        })
};
