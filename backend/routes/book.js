const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const multerMiddelware = require('../middleware/multer-config');
const bookCtrl = require('../controllers/book');
const rateCtrl = require('../controllers/rating');
const router = express.Router();
const app = express();


app.use(express.static('./images')); 

const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post('/', auth, upload.single("image"), multerMiddelware.uploadImage, bookCtrl.createBook);
router.post('/:id/rating', auth, rateCtrl.postRating);
router.get('/bestrating', rateCtrl.getBestRatings);
router.get('/', bookCtrl.getBooks);
router.get('/:id', bookCtrl.getOneBook);
router.put('/:id', auth, upload.single("image"), multerMiddelware.uploadImage, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
 
 module.exports = router;