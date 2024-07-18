const multer = require('multer');
const express = require('express');
const fs = require('fs')
const app = express();

 const MIME_TYPES = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpeg',
    'image/png' : 'png'
 };

app.use(express.static('./images'));

const storage = multer.memoryStorage();
const upload = multer({ storage });

// app.post("/", upload.single("image")       Ou le mettre ? dans Books Routes ? 
exports.uploadImage = async (req, res, next) => {
    fs.access("../images", (error) => {
        if (error) {
            fs.mkdirSync('../images');
        }
        
    });
    const { buffer, originalname } = req.file;
    const timestamp = new Date().toISOString();
    const ref = `${timestamp}-${originalname}.webp`;
        await sharp(buffer)
        .webp({ quality: 20 })
        .toFile("../images/" + ref);

}




// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, 'images')
//     },
//     filename: (req, file, callback) => {
//         const name = file.originalname.split(' ').join('_');
//         const extension = MIME_TYPES[file.mimetype];
//         callback(null, name + Date.now() + '.' + extension); // question Etienne : Pourquoi le null ? 
//     }
    
// });

// module.exports = multer({ storage }).single('image');