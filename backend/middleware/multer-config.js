const multer = require('multer');
const express = require('express');
const sharp = require('sharp');
const fs = require('fs');

 const MIME_TYPES = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpeg',
    'image/png' : 'png'
 };



// app.post("/", upload.single("image")       Ou le mettre ? dans Books Routes ? 
exports.uploadImage = async (req, res, next) => {
    fs.access("./images", (error) => {
        if (error) {
            fs.mkdirSync('./images');
        }
        
    });
    console.log(req.file)
    const { buffer, originalname } = req.file;
    originalname = originalname.split('.')[0]
    const timestamp = new Date().toISOString();
    const ref = `${timestamp}-${originalname}.webp`;
    console.log(ref)
        await sharp(buffer)
        .webp({ quality: 20 })
        .toFile("./images/" + ref);
    
        next();

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