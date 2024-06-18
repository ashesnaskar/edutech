const Common = require('../utils/response');
const Course = require('../model/course');
const CourseTopic = require('../model/course_topic');
const VideoContent = require('../model/video_content');
const Batch = require('../model/batch');
const Subscription = require('../model/subscription');
const mongoose = require('mongoose');
const CompressFile = require('../middleware/file_service').CompressFile;
exports.createCourse =(req,res)=>{
    let _id;
    if(!req.body._id){
        _id = new mongoose.mongo.ObjectID();
    }else {
        _id = req.body._id;
    }
    Course.findOneAndUpdate({_id},{
        name: req.body.name,
        description: req.body.description,
        img_url: req.body.img_url,
        teachers: req.body.teachers
    },{upsert: true, new: true, setDefaultsOnInsert: true})
    .then(resp=>{
        return res.json(Common.generateResponse(0,resp));
    })
    .catch(err=>{
        return res.json(Common.generateResponse(100,err));
    })
};

exports.getAllCourse=(req,res)=>{
    Course.find()
    .then(resp=>{
        return res.json(Common.generateResponse(0,resp));
    })
    .catch(err=>{
        return res.json(Common.generateResponse(100,err));
    })
};
exports.UpdateFile = (req,res)=>{
    return res.json(Common.generateResponse(0,req.file.location));
};
exports.createTopic = (req,res)=>{
    const topic = new CourseTopic({
        topic_name: req.body.topic_name,
        course_id: req.body.course_id,
        img_url: req.body.img_url
    });
    topic.save()
        .then(resp=>{
            return res.json(Common.generateResponse(0,resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100,err));
        })
};
exports.getAllTopicsByCourseId = (req,res)=>{
   CourseTopic.aggregate([
       {$match: {course_id: new mongoose.Types.ObjectId(req.params.cid)}},
       {
           $lookup:{
                from: 'video_contents',
                localField: 'videos',
                foreignField: '_id',
                as: 'videos'
           }
       },
   ])
       .then(resp=>{
            return res.json(Common.generateResponse(0, resp));
       })
       .catch(err=>{
            return res.json(Common.generateResponse(100,err));
       });
};
exports.uploadVideo = async (req,res)=>{
    let _id;
    if(!req.body._id){
        _id = new mongoose.mongo.ObjectID();
    }else {
        _id = req.body._id;
    }
    const j = await CompressFile(req.body.url);
    VideoContent.findOneAndUpdate({_id},{
        title: req.body.title,
        description: req.body.description,
        url: j.filename,
        attachment_url: req.body.attachment_url,
        topic_id: req.body.topic_id,
        course_id: req.body.course_id,
        thumbnail: j.thumbnail
    },{upsert: true,new:true,  setDefaultsOnInsert: true})
        .then(resp=>{
            return CourseTopic.findByIdAndUpdate(req.body.topic_id, {$push: {videos: resp._id}});
        })
        .then(resp=>{
            return res.json(Common.generateResponse(0,resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100,err));
        })
};
exports.createNewBatch = (req,res) =>{
    const batch = new Batch({
        batch_name: req.body.batch_name,
        course_id: req.body.course_id
    })
    batch.save()
        .then(resp=>{
            return res.json(Common.generateResponse(0,resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100,err));
        })
};
exports.getAllBatchByCourseId =(req,res)=>{
    Batch.find({course_id: req.params.cid})
        .then(resp=>{
            return res.json(Common.generateResponse(0,resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100,err));
        })
};

exports.getAllTopicFront = async (req,res) =>{
    const subs = await Subscription.findOne({userId: req.userId}).select(['course_id'])
    CourseTopic.aggregate([
        {$match: {course_id: subs.course_id}},
        {$sample : {size: 4}}
    ])
        .then(resp=>{
            return res.json(Common.generateResponse(0,resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100,err));
        })
};

exports.getAllVideoFront = async (req,res) =>{
    const subs = await Subscription.findOne({userId: req.userId}).select(['course_id'])
    VideoContent.aggregate([
        {$match: {course_id: subs.course_id}},
        {
            $lookup: {
                from: 'course_topics',
                localField: 'topic_id',
                foreignField: '_id',
                as: 'topic_id'
            }
        },
        {
            $unwind: {
                path: '$topic_id',
                preserveNullAndEmptyArrays: true
            }
        },
        {$sample : {size: 3}}
    ])
        .then(resp=>{
            return res.json(Common.generateResponse(0,resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100,err));
        })
};
exports.getAllTopicApp = async (req,res) =>{
    const subs = await Subscription.findOne({userId: req.userId}).select(['course_id'])
    CourseTopic.aggregate([
        {$match: {course_id:  subs.course_id}},
    ])
        .then(resp=>{
            return res.json(Common.generateResponse(0,resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100,err));
        })
};
exports.getAllVideoApp = async (req,res) =>{
    VideoContent.aggregate([
        {$match: {topic_id: new mongoose.Types.ObjectId(req.params.tid)}}
    ])
        .then(resp=>{
            return res.json(Common.generateResponse(0,resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100,err));
        })
};
exports.getCourseById = (req,res) =>{
    Course.findOne({_id: req.params.id})
        .then(resp=>{
            return res.json(Common.generateResponse(0,resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100,err));
        })
};
exports.getAllTopicWithVideos = (req,res) =>{
    CourseTopic.aggregate([
        {$match: {course_id:  req.params.cid}},
        {
            $lookup: {
                from: 'video_contents',
                localField: 'videos',
                foreignField: '_id',
                as: 'videos'
            }
        }
    ])
        .then(resp=> {
            return res.json(Common.generateResponse(0,resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100,err));
        });
};

