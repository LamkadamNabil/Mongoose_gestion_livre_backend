const Livre = require('../models/livre');
const _ = require('lodash');
const fs = require('fs');
const Joi = require('joi');

const formidable = require('formidable')

exports.createLivre = (req, res) => {

    let form = new formidable.IncomingForm();

    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {

        if(err) {
            return res.status(400).json({
                error: 'Image could not uploaded !'
            })
        }


        let livre = new Livre(fields);

        if(files.photo) {
           
            if(files.photo.size > Math.pow(10, 6)) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size !'
                })
            }

            livre.photo.data = fs.readFileSync(files.photo.path)
            livre.photo.contentType = files.photo.type
        }

        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.required(),
            quantity: Joi.required(),
            genre: Joi.required()
        })

        const { error } = schema.validate(fields);

        if(error) {
            return res.status(400).json({
                error: error.details[0].message
            })
        }

        livre.save((err, livre) => {
            if(err) {
                return res.status(400).json({
                    err: 'livre not persist '
                })
            }

            res.json({
                livre
            })
        })

    })
}



exports.livreById = (req, res, next, id) => {

    Livre.findById(id).exec((err, livre) => {

        if(err || !livre) {
            return res.status(404).json({
                error: 'livre not found !'
            })
        }

        req.livre = livre;
        next()

    })

}


exports.showLivre = (req, res) => {

    req.livre.photo = undefined;

    res.json({
        livre: req.livre
    })
}


exports.updateLivre = (req, res) => {

    let form = new formidable.IncomingForm();

    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {

        if(err) {
            return res.status(400).json({
                error: 'Image could not uploaded !'
            })
        }


        let livre = req.livre;
        
        livre = _.extend(livre, fields)


        if(files.photo) {
           
            if(files.photo.size > Math.pow(10, 6)) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size !'
                })
            }

            livre.photo.data = fs.readFileSync(files.photo.path)
            livre.photo.contentType = files.photo.type
        }

        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.required(),
            quantity: Joi.required(),
            category: Joi.required()
        })

        const { error } = schema.validate(fields);

        if(error) {
            return res.status(400).json({
                error: error.details[0].message
            })
        }

        livre.save((err, livre) => {
            if(err) {
                return res.status(400).json({
                    err: 'livre not updated '
                })
            }

            res.json({
                livre
            })
        })

    })
}



exports.livreById = (req, res, next, id) => {

    Livre.findById(id).exec((err, livre) => {

        if(err || !livre) {
            return res.status(404).json({
                error: 'livre not found !'
            })
        }

        req.livre = livre;
     
        next()

    })

}


exports.showLivre = (req, res) => {

    req.livre.photo = undefined;

    res.json({
        livre: req.livre
    })
}


exports.removeLivre = (req, res) => {

    let livre = req.livre

    livre.remove((err, livre) => {

        if(err) {
            return res.status(404).json({
                error: "livre not found !"
            })
        }

        res.status(204).json({})

    })

}

exports.allLivre = (req, res) => {

    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let order = req.query.order ? req.query.order : 'asc';
    let limit = req.query.limit ? parseInt(req.query.limit) : 100;

    Livre.find()
           .select("-photo")
           .populate('genre')
           .sort([[sortBy, order]])
           .limit(limit)
           .exec((err, livres) => {

              if(err) {
                  return res.status(404).json({
                      error: "livres not found !"
                  })
              }

              res.json({
                livres
              })
           })

}

exports.relatedLivre= (req, res) => {
    
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Livre.find({category: req.livre.genre, _id: { $ne: req.livre._id }})
           .limit(limit)
           .select('-photo')
           .populate('genre', '_id name')
           .exec((err, livres) => {

                if(err) {
                    return res.status(404).json({
                        error: "livres not found !"
                    })
                }

                res.json({
                    livres
                })

           })

}

exports.SearchLivre= (req, res) => {

    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let order = req.query.order ? req.query.order : 'asc';
    let limit = req.query.limit ? parseInt(req.query.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
    

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Livre.find(findArgs)
           .select("-photo")
           .populate('genre')
           .sort([[sortBy, order]])
           .limit(limit)
           .skip(skip)
           .exec((err, livres) => {

              if(err) {
                  return res.status(404).json({
                      error: "livres not found !"
                  })
              }

              res.json({
                livres
              })
           })

}

exports.photoLivre = (req, res) => {

    const { data, contentType } = req.livre.photo;

    if(data) {

        res.set('Content-Type', contentType)

        return res.send(data)

    }

}





 
