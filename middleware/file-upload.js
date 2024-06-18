const aws = require('aws-sdk'),
multers3 = require('multer-s3'),
multer = require('multer');

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-south-1'
});
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'video/x-flv':	'flv',
    'video/mp4': 'mp4',
    'image/gif': 'gif',
    'application/x-mpegURL': 'm3u8',
    'video/3gpp': '3gp',
    'video/quicktime' : 'mov',
    'video/x-msvideo' : 'avi',
    'video/x-ms-wmv' : 'wmv',
    'video/x-matroska': 'mkv'
};
module.exports = multer({
    storage: multers3({
      s3: s3,
      bucket: process.env.BUCKET_NAME,
      contentType: multers3.AUTO_CONTENT_TYPE,
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, {fieldName : file.fieldname});
      },
      key: function (req, file, cb) {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name+'-'+Date.now()+'.'+ext);
      }
    })
  });
