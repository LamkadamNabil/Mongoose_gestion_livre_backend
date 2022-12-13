const express = require('express');

const { userById } = require('../middlewares/user');

const router = express.Router();



const { requireSignIn, isAuth, isAdmin } = require('../middlewares/auth');
const { allGenres, showGenre, createGenre, updateGenre, deleteGenre, genreId } = require('../controllers/genreController');

router.get('/', allGenres);

router.get('/:genreId', showGenre);

router.post('/create/:userId', [requireSignIn, isAuth, isAdmin], createGenre);

router.put('/:genreId/:userId', [requireSignIn, isAuth, isAdmin], updateGenre);

router.delete('/:genreId/:userId', [requireSignIn, isAuth, isAdmin], deleteGenre);


router.param('userId', userById)

router.param('genreId', genreId);

module.exports = router;