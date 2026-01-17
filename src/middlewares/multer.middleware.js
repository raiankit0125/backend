import multer from "multer";

//diskstorage
//configuration setting of multer
const storage = multer.diskStorage({
    dstination: function (req, file, cb){
        cb(null,"./public/temp")
    },
    filename: function (req, file, cb) {
        
        cb(null, file.originalname)
    }
})

export const upload = multer({ 
    storage,
})