const Genre = require('../models/genre');

exports.createGenre = (req, res) => {

    const genre = new Genre(req.body);

    genre.save((err, genre) => {
         
        if(err) {
            return res.status(400).json({
                error: 'bad Request !'
            })
        }

        res.json({
            genre: genre
        })
    })

}

exports.genreId = (req, res, next, id) => {

    Genre.findById(id).exec((err, genre) => {

        if(err || !genre) {
            return res.status(404).json({
                error: "genre not found !"
            })
        }

        req.genre = genre;
        next()
    })

} 


exports.showGenre = (req, res) => {

    let genre = req.genre;

    res.json({
        genre
    })
}


exports.updateGenre = (req, res) => {

    let genre = req.genre;

    genre.name = req.body.name;

    genre.save((err, genre) => {

        if(err) {
            return res.status(400).json({
                error: "bad request !"
            })
        }

        res.json({
            genre,
            message: 'genre updated '
        })

    })

}


exports.deleteGenre = (req, res) => {

    let genre = req.genre;

    genre.remove((err, genre) => {

        if(err) {
            return res.status(404).json({
                error: "genre not found !"
            })
        }

        res.status(204).json({
            message: 'genre deleted '
        })

    })

}

exports.allGenres = (req, res) => {

    Genre.find().exec((err, genre) => {
        if(err){
            return res.status(500).json({
                error: err
            })
        }

        res.json({
            genre
        })
    })
}



