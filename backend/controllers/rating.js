const { use } = require('../app');
const Book = require('../models/book');

exports.getBestRatings = (req, res, next) => {
    Book.find()
        .then((books) => {
           
                    return  res.status(200).json(books)
                }
                
            
     
        )
        .catch(error => res.status(400).json({ error }))
}


exports.postRating = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
        .then(book => {
            // vérifie que le créateur et l'évaluateur n'ont pas déjà évalué le livre
            if (book.userId === req.auth.userId || book.ratings.userId === req.auth.userId){
                res.status(401).json({ message: 'Unauthorized'}) 
            } else {

                // Ajoute l'id de l'évaluateur et la note attribuée
                console.log(req.auth.userId)
                console.log(req.body.rating)
                Book.updateOne(
                    { _id: req.params.id },
                    { $push: { ratings : {userId: req.auth.userId, grade: parseInt(req.body.rating)}}}
                )
                .catch(error => res.status(400).json({ message: "Echec de l'update" }))
                //calcul de la moyenne
                const allRatings = book.ratings.map(rating => rating.grade); // extrait les notes
                const sumRating = allRatings.reduce((acc, grade) => acc + grade, 0); //additione toutes les notes du tableau 
                book.averageRating = sumRating/allRatings.length;
                Book.findOne()
                    .then(ratings => res.status(200).json(ratings))
                    
      
}})
        .catch(error => res.status(400).json({ error }))

}
