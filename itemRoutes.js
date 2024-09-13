const express = require('express');
const ExpressError = require('./expressError');
const router = new express.Router();
const ITEMS = require('./fakeDb');
const middleware = require('./middleware');

router.get('/', (req, res) => {
  return res.json(ITEMS);
});

router.post('/', middleware.addItemMiddleware, (req, res, next) => {
    try {
        res.json({ message: 'Added item successfully!' });
    } catch (err) {
        return next(err)
    }
});

router.get('/:name', middleware.findItemMiddleware, (req, res, next) => {
    try {
        res.json(req.item);
    } catch (err) {
        return next(err)
    }  
});

router.patch('/:name', middleware.patchItemMiddleware, (req, res, next) => {
    try{
        res.json({ updated: req.item });
    } catch (err) {
        return next(err)
    }
});

router.delete('/:name', middleware.deleteItemMiddleware, (req, res, next) => {
    try {
        res.json({ message: 'Deleted' });
    } catch (err) {
        return next(err)
    }
});

module.exports = router;
