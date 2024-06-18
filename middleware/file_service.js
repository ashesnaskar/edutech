const fs = require('fs');
const aws = require('aws-sdk');
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'ap-south-1',
});
const s3 = new aws.S3();
const transcoder = new aws.ElasticTranscoder();

exports.CompressFile = (url) => new Promise((resolve, reject) => {
  const decoded = decodeURIComponent(url);
  const path = require('path'); // Default node module
  const filename = decoded.substring(decoded.lastIndexOf('/') + 1);
  const pathToSnapshot = path.join(__dirname, 'thumbnail', filename);
  transcoder.createJob({
    PipelineId: '1602362877516-mz44cc', // specifies output/input buckets in S3
    // OutputKeyPrefix: '/videos' ,
    Input: {
      Key: filename,
      FrameRate: 'auto',
      Resolution: 'auto',
      AspectRatio: 'auto',
      Interlaced: 'auto',
      Container: 'auto',
    },
    Outputs: [
      {
        Key: `${filename}2000`,
        SegmentDuration: '10',
        PresetId: '1351620000001-200015',
        ThumbnailPattern: `${filename}_{count}`,
        Rotate: 'auto',
      },
      {
        Key: `${filename}1000`,
        SegmentDuration: '10',
        PresetId: '1351620000001-200035',
        Rotate: 'auto',
      },
      {
        Key: `${filename}600`,
        SegmentDuration: '10',
        PresetId: '1351620000001-200045',
        Rotate: 'auto',
      },
      {
        Key: `${filename}aud160`,
        SegmentDuration: '10',
        PresetId: '1351620000001-200060',
        Rotate: 'auto',
      },
      {
        Key: `${filename}400`,
        SegmentDuration: '10',
        PresetId: '1351620000001-200055',
        Rotate: 'auto',
      },
    ],
    Playlists: [
      {
        Format: 'HLSv4',
        Name: `${filename}final`,
        OutputKeys: [
          `${filename}2000`,
          `${filename}1000`,
          `${filename}600`,
          `${filename}400`,
          `${filename}aud160`,
        ],
      },
    ],
  }, (error, data) => {
    // handle callback
    if (error) {
      reject(error);
    } else {
      const objectToResolve = {
        filename: `https://opus-videos.s3.ap-south-1.amazonaws.com/${filename}final` + '.m3u8',
        thumbnail: `https://opus-videos.s3.ap-south-1.amazonaws.com/${filename}_00001.png`,
        jobid: data.Job.Id,
      };
      resolve(objectToResolve);
    }
  });
});