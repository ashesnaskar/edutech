const Common = require('../utils/response');
const Subscription = require('../model/subscription');
const Quiz = require('../model/quiz');
const QuizAnswer = require('../model/quiz_answer');
const mongoose = require('mongoose');
exports.createQuiz = (req,res) => {
    let _id;
    if (!req.body._id) {
        _id =new mongoose.mongo.ObjectID();
    }else {
        _id= req.body._id;
    }

    Quiz.findOneAndUpdate({_id},{
        questions: req.body.questions,
        title: req.body.title,
        course_id: req.body.course,
        live: true,
        total_marks: req.body.total_marks,
        time: req.body.time
    }, {upsert: true, new: true, setDefaultsOnInsert: true} )
        .then(resp=>{
            return res.json(Common.generateResponse(0, resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100, err));
        })
};
exports.getAllQuizForAdmin = (req,res) => {
     Quiz.aggregate([
         {$sort: {createdAt: -1}},
         {
             $lookup: {
                 from: 'courses',
                 localField: 'course_id',
                 foreignField: '_id',
                 as: 'course'
             }
         },
         {
             $unwind: {
                 path: '$course',
                 preserveNullAndEmptyArrays: true
             }
         },
         {$project: {course: '$course.name', title: 1, total_marks: 1}}
     ])
        .then(resp=>{
            return res.json(Common.generateResponse(0, resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100, err));
        })
};
exports.getAllQuizUser = async (req,res) => {
    const course = await Subscription.findOne({userId: req.userId}).select(['course_id']);
    Quiz.aggregate([
        {$match: {course_id: course.course_id}},
        {$sort: {createdAt: -1}},
        {$project: {title: 1, total_marks: 1, _id: 1}}
    ])
        .then(resp=>{
            console.log(resp);
            return res.json(Common.generateResponse(0, resp));
    })
        .catch(err=>{
            return res.json(Common.generateResponse(100, err));
        })

};
exports.getTest = (req,res) =>{
    Quiz.findOne({_id: req.params.tid})
        .then(resp=>{
            return res.json(Common.generateResponse(0, resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100, err));
        })
};
exports.getUserTest = (req,res) => {
    let hasQ = false;
    QuizAnswer.findOne({quiz_id: req.params.tid, userId: req.userId})
        .then(async resp=>{
            if (resp){
                hasQ = true;
                return res.json(Common.generateResponse(0, resp));
            }else {
                const quiz =  await Quiz.findOne({_id: req.params.tid});
                const userQuiz = new QuizAnswer({
                    quiz_id: req.params.tid,
                    userId: req.userId,
                    questions: quiz.questions.map(ele=> {
                        return {
                            correct: ele.answer
                        };
                    }),
                    end_time: Date.now() + 1000*60*quiz.time,
                    total_marks: quiz.total_marks,
                });
                return userQuiz.save();
            }
        })
        .then(resp=>{
            if (!hasQ)
                return res.json(Common.generateResponse(0, resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100, err));
        })
};
exports.createUserTest = async (req,res) => {
    const quiz =  await Quiz.findOne({_id: req.params.tid});
    const userQuiz = new QuizAnswer({
        quiz_id: req.params.tid,
        userId: req.userId,
        questions: quiz.questions.map(ele=> {
            return {
                correct: ele.answer
            };
        }),
        end_time: Date.now() + 1000*60*quiz.time,
        total_marks: quiz.total_marks,
    });
    userQuiz
        .then(resp=>{
            return res.json(Common.generateResponse(0, resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100, err));
        })
};
exports.FinishTest = (req,res) =>{
    QuizAnswer.findOneAndUpdate({_id: req.params.utid},{isEnded: true},{new: true})
        .then(resp=>{
            return res.json(Common.generateResponse(0, resp));
        })
        .catch(err=>{
            return res.json(Common.generateResponse(100, err));
        })
};
exports.SaveAnswer = (req,res) =>{
    let marks = 0;
    if (JSON.stringify(req.body.ans) === JSON.stringify(req.body.question.answer)){
        marks+=req.body.question.marks;
    }
    QuizAnswer.findOneAndUpdate({"questions._id": req.body.user_test_updateIndexId}, {
        "questions.$.answer" : req.body.ans,
        "questions.$.status" : 'Answered',
        "questions.$.marks" : marks,
        $inc:{obtained_marks:  marks}
    }, {new: true})
        .then(resp=>{
            return res.json(Common.generateResponse(0, resp));
        })
        .catch(err=>{
            console.log(err);
            return res.json(Common.generateResponse(100, err));

        })
};

exports.getAllAnswers = (req, res) => {
    QuizAnswer.aggregate([
        {$match: {quiz_id: new mongoose.Types.ObjectId(req.params.id)}},
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
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
            $project: {
                name: '$user.name', roll_no: '$user.roll_no',total_marks:1,
                obtained_marks:1
            }
        }
    ])
    .then(resp=>{
        return res.json(Common.generateResponse(0, resp));
    })
    .catch(err=>{
        console.log(err);
        return res.json(Common.generateResponse(100, err));

    })
}