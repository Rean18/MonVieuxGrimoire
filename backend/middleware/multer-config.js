const sharp = require('sharp');
const fs = require('fs');


exports.uploadImage = async (req, res, next) => {
       
    // Si aucun fichier n'est téléchargé, passer au middleware suivant
    if (!req.file) {
        return next();
    }

    // créer le dossier images s'il n'existe pas
    fs.access("./images", (error) => {
        if (error) {
            fs.mkdirSync('./images');
        }
    });
   
    const { buffer, originalname } = req.file;
    // Supprimer l'extension originale
    const newName = originalname.split('.')[0];
    const timestamp = new Date().toISOString();
    const ref = `${timestamp}-${newName}.webp`;
        await sharp(buffer)
        .webp({ quality: 50 })
        .toFile("./images/" + ref);
        

        const host = req.get('host');
        const imageUrl = `http://${host}/images/${ref}`;
        req.imageUrl = imageUrl;

        next();
}
