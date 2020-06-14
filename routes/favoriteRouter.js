const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');
const Favorites = require('../models/favorite');
var authenticate = require('../authenticate');
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => {
		res.sendStatus(200);
	})
	.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
		Favorites.findOne({ user: req.user._id.toString() })
			.populate('dishes')
			.populate('user')
			.then(
				(favorites) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(favorites);
				},
				(err) => next(err)
			)
			.catch((err) => next(err));
	})
	.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		Favorites.findOne({ user: req.user._id.toString() }).then(
			(favorite) => {
				if (favorite) {
					for (var i = 0; i < req.body.length; i++) {
						favorite.dishes.push(req.body[i]._id);
					}

					favorite.save().then(
						(favorite) => {
							Favorites.findById(favorite._id)
								.populate('dishes')
								.populate('user')
								.then((favorite) => {
									res.statusCode = 200;
									res.setHeader('Content-Type', 'application/json');
									res.json(favorite);
								});
						},
						(err) => {
							return next(err);
						}
					);
				} else {
					var favorite = new Favorites({
						user: req.user._id,
						dishes: req.body,
					});

					favorite.save().then((favorite) => {
						Favorites.findById(favorite._id)
							.populate('user._id', 'dishes._id')
							.then(
								(favorite) => {
									res.statusCode = 200;
									res.setHeader('Content-Type', 'application/json');
									res.json(favorite);
								},
								(err) => {
									return next(err);
								}
							);
					});
				}
			},
			(err) => {
				return next(err);
			}
		);
	})
	.put(
		cors.corsWithOptions,
		authenticate.verifyUser,

		(req, res, next) => {
			res.statusCode = 403;
			res.end('PUT operation not supported on /Favorites');
		}
	)
	.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		Favorites.remove({})
			.then(
				(resp) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(resp);
				},
				(err) => next(err)
			)
			.catch((err) => next(err));
	});

// favoriteRouter
// 	.route('/:leaderId')
// 	.options(cors.corsWithOptions, (req, res) => {
// 		res.sendStatus(200);
// 	})
// 	.get(cors.cors, (req, res, next) => {
// 		Favorites.findById(req.params.leaderId)
// 			.then(
// 				(leader) => {
// 					res.statusCode = 200;
// 					res.setHeader('Content-Type', 'application/json');
// 					res.json(leader);
// 				},
// 				(err) => next(err)
// 			)
// 			.catch((err) => next(err));
// 	})
// 	.post(
// 		cors.corsWithOptions,
// 		authenticate.verifyUser,
// 		authenticate.verifyAdmin,
// 		(req, res, next) => {
// 			res.statusCode = 403;
// 			res.end('POST operation not supported on /Favorites');
// 		}
// 	)
// 	.put(
// 		cors.corsWithOptions,
// 		authenticate.verifyUser,
// 		authenticate.verifyAdmin,
// 		(req, res, next) => {
// 			Favorites.findByIdAndUpdate(
// 				req.params.leaderId,
// 				{
// 					$set: req.body,
// 				},
// 				{ new: true }
// 			)
// 				.then(
// 					(leader) => {
// 						res.statusCode = 200;
// 						res.setHeader('Content-Type', 'application/json');
// 						res.json(leader);
// 					},
// 					(err) => next(err)
// 				)
// 				.catch((err) => next(err));
// 		}
// 	)
// 	.delete(
// 		cors.corsWithOptions,
// 		authenticate.verifyUser,
// 		authenticate.verifyAdmin,
// 		(req, res, next) => {
// 			Favorites.findByIdAndRemove(req.params.leaderId)
// 				.then(
// 					(resp) => {
// 						res.statusCode = 200;
// 						res.setHeader('Content-Type', 'application/json');
// 						res.json(resp);
// 					},
// 					(err) => next(err)
// 				)
// 				.catch((err) => next(err));
// 		}
// 	);

module.exports = favoriteRouter;
