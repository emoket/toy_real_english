const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Load Expr Model
require('../models/Expr');
const Expr = mongoose.model('exprs');


// Expr Index Page
router.get('/', (req, res) => {
  Expr.find({user: req.user.id})
    .sort({date:'desc'})
    .then(exprs => {
      res.render('exprs/list', {
        exprs:exprs
      });
    });
});

// Add Expression Form
router.get('/add', (req, res) => {
  res.render('exprs/add');
});


module.exports = router;
