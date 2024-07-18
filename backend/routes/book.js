const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const bookCtrl = require('../controllers/book');
const rateCtrl = require('../controllers/rating');
const router = express.Router();



router.post('/', auth, upload.single('image'), multer, bookCtrl.createBook);
router.post('/:id/rating', auth, rateCtrl.postRating);
router.get('/bestrating', rateCtrl.getBestRatings);
router.get('/', bookCtrl.getBooks);
router.get('/:id', bookCtrl.getOneBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
 
 module.exports = router;