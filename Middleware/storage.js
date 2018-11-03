let multer = require('multer');
const AWS = require('aws-sdk');
var multerS3 = require('multer-s3');

//***************************************************************************************************************** */
//
//                                    Upload file to s3 bucket using multer
//
//****************************************************************************************************************** */

const BUCKET_NAME = 'ankit-cloud'; // bucket name of s3
const IAM_USER_KEY = 'AKIAJW2AC2ZIBKPAOT3Q'; //  ninja.suban@gmail.com  s3 key Access id key
const IAM_USER_SECRET = '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'; // Secret Key


var s3 = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    Bucket: BUCKET_NAME,
}); // define s3 var with new AWS.S3 object
//===================== export this variable =======================

module.exports = (folder) => {
    try {
        console.log('uuuuuuuuu')
        var upload = multer({ 
            storage: multerS3({
                s3: s3,
                acl: 'public-read',
                contentType: multerS3.AUTO_CONTENT_TYPE,
                bucket: BUCKET_NAME+'/' + folder,
                metadata: function (req, file, cb) {
                    cb(null, {
                        fieldName: file.fieldname
                    });
                },
                key: function (req, file, cb) {
                    cb(null, Date.now().toString() + file.originalname);
                }
            })
        })
    } catch (error) {
        console.log('error occured', error)
    }
    return upload
}


