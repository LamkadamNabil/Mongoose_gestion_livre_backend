const express = require('express');

const { userById } = require('../middlewares/user');

const router = express.Router();


const { requireSignIn, isAuth, isAdmin } = require('../middlewares/auth');
const { allLivre, showLivre, relatedLivre, createLivre, SearchLivre, photoLivre, updateLivre, removeLivre, livreById } = require('../controllers/livreController');

router.get('/', allLivre);

router.get('/:livreId', showLivre);

router.get('/related/:livreId', relatedLivre);

router.post('/create/:userId', [requireSignIn, isAuth, isAdmin], createLivre);

router.post('/search', SearchLivre);

router.get('/photo/:livreId', photoLivre);

router.put('/:livreId/:userId', [requireSignIn, isAuth, isAdmin], updateLivre)

router.delete('/:livreId/:userId', [requireSignIn, isAuth, isAdmin], removeLivre)

router.param('userId', userById)
router.param('livreId', livreById)

module.exports = router;


