const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter
	.route('/')
	.all((req, res, next) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/plain');
		next();
	})
	.get((req, res, next) => {
		res.end('Will send all the promos to you!');
	})
	.post((req, res, next) => {
		res.end(
			'Will add the promo: ' +
				req.body.name +
				' with details: ' +
				req.body.description
		);
	})
	.put((req, res, next) => {
		res.statusCode = 403;
		res.end('PUT operation not supported on /promos');
	})
	.delete((req, res, next) => {
		res.end('Deleting all promos');
	});

promoRouter
	.route('/:promoId')
	.get((req, res, next) => {
		res.end('Will send the detail of promo ' + req.params.promoId);
	})
	.post((req, res, next) => {
		res.statusCode = 403;
		res.end('POST operation not supported on /promos');
	})
	.put((req, res, next) => {
		res.end('Will update the promo: ' + req.params.promoId);
	})
	.delete((req, res, next) => {
		res.end('Deleting the promo ' + req.params.promoId);
	});

module.exports = promoRouter;
