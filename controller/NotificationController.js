const Common = require('../utils/response');
const Notification = require('../model/notification');
const Batch = require('../model/batch');
const axios = require('axios');
const mongoose = require('mongoose')
exports.sendNotification = async (req,res)=>{
    if(req.body.type === 'All'){
        axios({
            method: 'post',
            url: 'https://onesignal.com/api/v1/notifications',
            headers: {
                "Authorization" : `Basic ${process.env.ONESIGNAL_API_KEY}`
              },
            data: {
                app_id: process.env.ONESIGNAL_APP_ID,
                included_segments: ["Active Users", "Inactive Users"],
                headings: {"en": req.body.title},
                contents: {"en": req.body.description}
            }
          })
          .then(push=>{
            return res.json(Common.generateResponse(0,push));
          })
          .catch(err=>{
                return res.json(Common.generateResponse(100,err))
            })
    } else if (req.body.batch_id.length>0) {
        const batch_id = req.body.batch_id.map(e=>new mongoose.Types.ObjectId(e))
        Batch.aggregate([
            {$match: {_id: {$in: batch_id}}},
            {
                $lookup:{
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {$project: {deviceId: '$user.deviceId'}}
        ])
        .then(resp=>{
            let user = [];
            for (let i = 0; i < resp.length; i++) {
                user = [...user, ...resp[i].deviceId];
            }
            return sendNoti(user, req.body.title,req.body.description);
        })
        .then(push=>{
            return res.json(Common.generateResponse(0,'Notification Send'));
          })
        .catch(err=>{
            console.log(err);
            return res.json(Common.generateResponse(100,err));
        })
    } else {
        Batch.aggregate([
            {$match: {course_id: req.body.course_id}},
            {
                $lookup:{
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {$project: {deviceId: '$user.deviceId'}}
        ])
        .then(resp=>{
            let user = [];
            for (let i = 0; i < resp.length; i++) {
                user = [...user, ...resp[i].deviceId];
            }
            return sendNoti(user, req.body.title,req.body.description);
        })
        .then(push=>{
            return res.json(Common.generateResponse(0,push));
          })
        .catch(err=>{
            return res.json(Common.generateResponse(100,err))
        })
    }
}
const sendNoti=(user, title, desc)=>{
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: 'https://onesignal.com/api/v1/notifications',
            headers: {
                "Authorization" : `Basic ${process.env.ONESIGNAL_API_KEY}`
              },
            data: {
                app_id: process.env.ONESIGNAL_APP_ID,
                include_player_ids: user,
                headings: {"en": title},
                contents: {"en": desc}
            }
          })
            .then(push=>{
                resolve(push);
            })
            .catch(err=>{
                reject(err)
            })
    });
}
