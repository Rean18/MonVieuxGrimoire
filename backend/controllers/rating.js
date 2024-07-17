const { use } = require('../app');
const Book = require('../models/book');




exports.postRating = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
        .then(book => {
            // vérifie que le créateur et l'évaluateur n'ont pas déjà évalué le livre
            if (book.userId === req.auth.userId || book.ratings.userId === req.auth.userId){
                res.status(401).json({ message: 'Unauthorized'}) 
            } else {
                // Ajoute l'id de l'évaluateur et la note attribuée
                console.log(req.auth.userId);
                console.log(req.body.rating);
                
                Book.updateOne(
                    { _id: req.params.id },
                    { $push: { ratings: { userId: req.auth.userId, grade: parseInt(req.body.rating) } } }
                )
                .then(() => {
                    // Calcul de la note moyenne après l'ajout de la nouvelle note
                    Book.findOne({ _id: req.params.id })
                        .then(updatedBook => {
                           Book.aggregate([
                            {
                                $addFields: {
                                    averageRating: { $avg: "$ratings.grade" }
                                }
                            },
                           ])
                            // Sauvegarde du livre avec la nouvelle note moyenne
                            updatedBook.save()
                                .then(() => res.status(200).json(updatedBook))
                                .catch(() => res.status(400).json({ message: "Echec de la mise à jour de la note moyenne" }));
                        })
                        .catch(() => res.status(400).json({ message: "Echec de la récupération des notes mises à jour" }));
                })
                .catch(() => res.status(400).json({ message: "Echec de l'update" }));
            }
        })
        .catch(error => res.status(400).json({ error }));
}

exports.getBestRatings = (req, res, next) => {
    Book.aggregate([
        // Ajoute un nouveau champ `averageRating` avec la moyenne des notes
        {
            $addFields: {
                averageRating: { $avg: "$ratings.grade" }
            }
        },
        // Trie les livres par `averageRating` en ordre décroissant
        { $sort: { averageRating: -1 } }
    ])
    .then((books) => {
        console.log(req.body);
        return res.status(200).json(books);
    })
    .catch(error => res.status(400).json({ error }));
}