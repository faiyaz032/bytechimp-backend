//dependencies
const multer = require('multer');
const path = require('path');

//upload folder
const UPLOAD_FOLDER = `${__dirname}/../public/uploads/`;

const processMulterUpload = function () {
   //prepare the storage
   const storage = multer.diskStorage({
      destination: (req, file, cb) => {
         cb(null, UPLOAD_FOLDER);
      },
      filename: (req, file, cb) => {
         const extname = path.extname(file.originalname);
         const fileName = file.originalname.replace(extname, '').toLowerCase().split(' ').join('-') + '-' + Date.now();
         const fullFileName = `${fileName}${extname}`;
         cb(null, fullFileName);
      },
   });

   //preapare the multer object
   const upload = multer({
      storage: storage,
      fileFilter: (req, file, cb) => {
         const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
         if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
         } else {
            cb('There was an error in file filter-mimetypes');
         }
      },
   });

   //return the upload object
   return upload;
};

const processMulterImage = function (req, res, next) {
   const upload = processMulterUpload();
   upload.single('image')(req, res, (error) => {
      if (error) res.status(500).json({ message: error.message });
      next();
   });
};

module.exports = processMulterImage;
