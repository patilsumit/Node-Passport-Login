const express=require('express');
const expressLayouts=require('express-ejs-layouts');
const mongoose=require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app=express();

// Passport Config
require('./config/passport')(passport);

//DB Config
const DB=require('./config/keys').MongoURI;

//Connect To Mongo
mongoose.connect(DB, {useNewUrlParser : true})
          .then(() => console.log('Database Connected...'))
          .catch(err => console.log(err))

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//Body Parser
app.use(express.urlencoded({ extended:false}));

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

  // Passport middleware
app.use(passport.initialize());
app.use(passport.session());

  // Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Routes
app.use('/' , require('./routes/index'))
app.use('/users' , require('./routes/users'))

const PORT=process.env.PORT || 8000

app.listen(PORT,console.log(`Server started on ${PORT}`));