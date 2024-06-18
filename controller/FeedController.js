const Common = require('../utils/response');
const Feed = require('../model/feed');
const mongoose = require('mongoose');
const CompressFile = require('../middleware/file_service').CompressFile
exports.createFeed = async (req,res) =>{
    let _id;
    if(!req.body._id){
        _id = new mongoose.mongo.ObjectID();
    }else {
        _id = req.body._id;
    }
    const j = await CompressFile(req.body.url);
    Feed.findOneAndUpdate({_id: _id},{
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        url: j.filename,
        thumbnail: j.thumbnail,
        hashTag: req.body.description.split(' ').filter(v=> v.startsWith('#'))
    },{upsert: true,new:true,  setDefaultsOnInsert: true})
        .then(resp=>{
            return res.json(Common.generateResponse(0,resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100,err));
        })
};
exports.deleteFeed = (req, res)=> {
    Feed.findOneAndUpdate({_id: req.params.id},{isDeleted: true})
        .then(resp=>{
            return res.json(Common.generateResponse(0,resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100,err));
        })
};
exports.getFeedForAdmin = (req,res) =>{
    const skip = Number(req.query.page-1)*5;
    const p1 = Feed.aggregate([
        {$match:{isDeleted: false}},
        {$sort:{createdAt: -1}},
        {$skip: skip},
        {$limit: 5},
        {$addFields: {
                likes: {$size: "$likes"}
            }
        }
    ]);
    const p2 =  Feed.aggregate([
        {$match:{isDeleted: false}},
        {$count: 'total'}
        ])

    Promise.all([p1,p2])
        .then(resp=>{
            console.log(resp);
            return res.json(Common.generateResponse(0,{post: resp[0], total: resp[1]?resp[1].total : 0}));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100,err));
        })
};


exports.getFeedForUser = (req,res) =>{
    const skip = Number(req.query.page-1)*5;
    let q = [
        {$match:{isDeleted: false}},
    ];
    if(req.body.hashTag && req.body.hashTag.length>0){
        q = [...q, {$match: {hashTag: {$in: req.body.hashTag}}}];
    }
    q = [...q,
        {$sort:{createdAt: -1}},
        {$skip: skip},
        {$limit: 5},
        {
            $addFields: {
                index: {$indexOfArray: ['$likes', {$toObjectId: req.userId}]}
            }
        },
        {$addFields: {
                liked: {$cond: {if: {$ne: ['$index', -1]}, then: true, else: false}}
            }
        }
    ]
    Feed.aggregate(q)
        .then(resp=>{
            return res.json(Common.generateResponse(0,resp));
        })
        .catch(err=>{
            console.log(err);
            return res.json(Common.generateResponse(100,err));
        })
};
exports.getSingleFeed = (req, res)=>{
    Feed.findOne({_id: req.params.id})
        .then(resp=>{
        return res.json(Common.generateResponse(0,resp));
    })
        .catch(err=>{
            return res.json(Common.generateResponse(100,err));
        })
};
exports.LikeFeed = (req,res) => {
    Feed.aggregate([
        {$match: {_id: new mongoose.Types.ObjectId(req.params.id)}},
        {
            $addFields: {
                index: {$indexOfArray: ['$likes', {$toObjectId: req.userId}]}
            }
        },
        {$project: {index:1}}
    ])
        .then(resp=>{
            console.log(resp[0]);
            if(resp[0].index === -1)
                return Feed.findOneAndUpdate({_id: req.params.id}, {$push: {likes: req.userId}});
            else
                return Feed.findOneAndUpdate({_id: req.params.id}, {$pull: {likes: req.userId}});
        })
        .then(resp=>{
            return res.json(Common.generateResponse(0,resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100,err));
        })
};
