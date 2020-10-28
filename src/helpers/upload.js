const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'assets/uploads/')
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.')[file.originalname.split('.').length - 1]
    const filename = new Date().getTime().toString().concat('.').concat(ext)
    cb(null, filename)
  }//,
  // onFileUploadStart: file => !file.mimetype.match(/^image\//),
  // limits: {
  //   fileSize: 1024 * 1024 * 10
  // }
})

module.exports = multer({ storage }).single('picture')
