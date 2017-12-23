const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const exphbs  = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const logger = require('morgan');
const mongoose = require('mongoose');

const app = express();

// Load routes

// process.env.NODE_ENV setting
process.env.NODE_ENV = (process.env.NODE_ENV && (process.env.NODE_ENV).trim().toLowerCase() == 'production') ? 'production' : 'development';

// const exprs = require('./routes/expressions');
const users = require('./routes/users');

// DB Config
const db = require('./config/database');


// Map global promise - get rid of warning
mongoose.Promise = global.Promise;


// Connect to mongoose
mongoose.connect(db.mongoURI, {
  useMongoClient: true
})
  .then(() => {
    console.log('MongoDB [' + process.env.NODE_ENV + '] mode connected...')
  })
  .catch(err => {
    console.log(err)
  });

// Load Expr Model
require('./models/Expr');
const Expr = mongoose.model('exprs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));

// Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

// Cookie parser middleware
app.use(cookieParser());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Flash middleware
app.use(flash());


// Index page
app.get('/', (req, res) => {
  Expr.find({})
    .sort({date:'desc'})
    .then(allExpressions => {
      res.render('index', {
        allExpressions: allExpressions
      });
    });
});

// List page
app.get('/exprs/list', (req, res) => {
  Expr.find({})
    .sort({date:'desc'})
    .then(exprs => {
      res.render('exprs/list', {
        exprs: exprs
      })
    })
});

// Add page
app.get('/exprs/add', (req, res) => {
  res.render('exprs/add');
});

// Add expression
app.post('/exprs', (req, res) => {
  let errors = [];

  // Server side validation
  if (!req.body.eng) {
    errors.push({text: 'Please add english expression'});
  }
  if (!req.body.kor) {
    errors.push({text: 'Please add description'});
  }
  if (!req.body.tag) {
    errors.push({text: 'Please add at least one tag'});
  }

  if (errors.length > 0) {
    res.render('exprs/add', {
      errors: errors,
      eng: req.body.eng,
      kor: req.body.kor,
      tag: req.body.tag
    });
  } else {
    const newUser = {
      eng: req.body.eng,
      kor: req.body.kor,
      tag: req.body.tag
    };
    new Expr(newUser)
      .save()
      .then(() => {
        res.redirect('/exprs/list');
      })
  }
});

// Edit page
app.get('/exprs/edit/:id', (req, res) => {
  Expr.findOne({
    _id: req.params.id
  })
    .then(expr => {
      res.render('exprs/edit', {
        expr: expr
      })
    })
});

// Edit process
app.put('/exprs/:id', (req, res) => {
  Expr.findOne({
    _id: req.params.id
  })
    .then(expr => {
      // 새로운 값으로 할당
      expr.eng = req.body.eng;
      expr.kor = req.body.kor;
      expr.tag = req.body.tag;

      expr.save()
        .then(() => {
          res.redirect('/exprs/list')
        })
    })
});


// Delete process
app.delete('/exprs/:id', (req, res) => {
  Expr.remove({
    _id: req.params.id
  })
    .then(() => {
      res.redirect('/exprs/list')
    })
});



// Use routes
app.use('/users', users);


// WWW
const port = process.env.PORT || 5000;

app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});
