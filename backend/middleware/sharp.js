const sharp = require('sharp');
const path = require('path');

const sharpImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send('Aucun fichier téléchargé.');
  }

  // Définir le chemin de sortie pour l'image traitée
  const outputPath = path.join(__dirname, 'images', req.file.originalname.split('.')[0] + '.webp');

  try {
    // Utilisation de Sharp pour traiter l'image et l'enregistrer
    await sharp(req.file.buffer)
      .webp({ quality: 80 })
      .toFile(outputPath);

    req.file.processedPath = outputPath; // Ajouter le chemin de l'image traitée à req.file
    next(); // Passer au middleware suivant
  } catch (err) {
    console.error('Erreur lors du traitement de l\'image:', err);
    res.status(500).send('Erreur lors du traitement de l\'image.');
  }
};

module.exports = sharpImage;

