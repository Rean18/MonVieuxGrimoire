const Book = require('../models/book');
const fs = require('fs');


  exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: req.imageUrl // récupérée du multer-config
    });

    book.save()
        .then(() => {
            res.status(201).json({ message: 'Livre enregistré !' });
        })
        .catch(error => {
            res.status(400).json({ error });
            console.error('Error saving book:', error);
        });
};

  exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => {
            res.status(404).json({ error });
            console.error('Error fetching book:', error);
        });
};
  exports.getBooks = (req, res, next) => {
    Book.aggregate([
        {
            $addFields: {
                averageRating: { $avg: "$ratings.grade" }
            }
        },
        { $sort: { averageRating: -1 } }
    ])
    
        .then(books => res.status(200).json(books))
        .catch(error => {
            res.status(400).json({ error });
            console.error('Error fetching books:', error);
        });
};
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: req.imageUrl // récupérée du multer-config
  } : { ...req.body };

  delete bookObject.userId;

  Book.findOne({ _id: req.params.id })
      .then((book) => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({ message: 'Non-autorisé' });
          }
          // Conserver le lien déjà présent lorsque la modification d'un livre n'inclut pas la modif de l'image
          if (!req.file){
            bookObject.imageUrl = book.imageUrl
          }
              Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                  .then(() => res.status(200).json({ message: 'Livre modifié !' }))
                  .catch(error => {
                      res.status(401).json({ error });
                      console.error('Error updating book:', error);
                  });
          
      })
      .catch(error => {
          res.status(400).json({ error });
          console.error('Error finding book:', error);
      });
};
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
      .then(book => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({ message: 'Not authorized' });
          } else {
              const filename = book.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Book.deleteOne({ _id: req.params.id })
                      .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
                      .catch(error => {
                          res.status(401).json({ error });
                          console.error('Error deleting book:', error);
                      });
              });
          }
      })
      .catch(error => {
          res.status(500).json({ error });
          console.error('Error finding book:', error);
      });
};