const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const multerMiddleware = require('../middleware/multer-config');
const bookCtrl = require('../controllers/book');
const rateCtrl = require('../controllers/rating');
const router = express.Router();
const app = express();


app.use(express.static('./images')); // Utilité de l'avoir 2 fois ?

const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post('/', auth, upload.single("image"), multerMiddleware.uploadImage, bookCtrl.createBook);
router.post('/:id/rating', auth, rateCtrl.postRating);
router.get('/bestrating', rateCtrl.getBestRatings);
router.get('/', bookCtrl.getBooks);
router.get('/:id', bookCtrl.getOneBook);
router.put('/:id', auth, upload.single("image"), multerMiddleware.uploadImage, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
 
 module.exports = router;