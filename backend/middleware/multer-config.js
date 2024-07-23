const multer = require('multer');
const express = require('express');
const sharp = require('sharp');
const fs = require('fs');


exports.uploadImage = async (req, res, next) => {

    if (!req.file) {
        // Si aucun fichier n'est téléchargé, passer au middleware suivant
        return next();
    }
    fs.access("./images", (error) => {
        if (error) {
            fs.mkdirSync('./images');
        }
        
    });
   
    const { buffer, originalname } = req.file;
    const newName = originalname.split('.')[0];
    const timestamp = new Date().toISOString();
    const ref = `${timestamp}-${newName}.webp`;
        await sharp(buffer)
        .webp({ quality: 50 })
        .toFile("./images/" + ref);
        

        // Obtenir l'hôte et le port actuels
        const host = req.get('host');

        // Générer l'URL de l'image
        const imageUrl = `http://${host}/images/${ref}`;
        // Ajouter l'URL de l'image à la requête pour une utilisation ultérieure
        req.imageUrl = imageUrl;

        next();
}



// const MIME_TYPES = {
    //     'image/jpg' : 'jpg',
    //     'image/jpeg' : 'jpeg',
    //     'image/png' : 'png'
    //  };
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