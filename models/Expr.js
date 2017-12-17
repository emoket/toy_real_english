const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ExprSchema = new Schema({
  eng:{
    type: String,
    required: true
  },
  kor:{
    type: String,
    required: true
  },
  tag:{
    type: String,
    required:true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('exprs', ExprSchema);
