// Dependencies
// =============================================================
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var exphbs = require('express-handlebars');
var firebase = require('firebase');
var orm = require(__dirname+'/config/orm.js');
// require('firebase/auth');
// require('firebase/database');

//for login
var cookieParser = require('cookie-parser');
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var session = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
var LocalStrategy = require('passport-local').Strategy;

// Sets up the Express App
// =============================================================

var PORT = 4000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

//set up static files
app.use('/static', express.static(path.join(__dirname, 'public')));

//use handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//// PASSPORT ////////////////////

var db = require('./models/index.js').sequelize

db.sync();
var User = require('./models').User;
// var app = express();

passport.use('local', new LocalStrategy(
  function(username, password, done) {
    console.log("hi")
    User.findOne( { where: { username: username} } ).then(function(user) {
      if (!user) {
        return done(null, false);
      }
      if (!user.username) {
        return done(null, false);
      }

      bcrypt.compare(password, user.password, function(err, result) {
        if (result) {
          return done(null, false);
        }
      })     

      return done(null, user);
    })
    .catch(function(err) {
      throw err;
    })
  }
));

passport.serializeUser(function(user, cb) {
  console.log("hi there",user.id)
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findOne( {where: {id: id} }).then(function(user) {
    cb(null, user);
  }).catch(function(err) {
    if (err) {
      return cb(err);
    }
  });
});

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({
  secret: 'keyboard cat',
  store: new SequelizeStore({
    db: db
  }),
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());




//////////////////////////////////



//FIREBASE
// Initialize Firebase
// var config = {
// 	apiKey: "AIzaSyA_oyWpCsZ91yjI_YU9fVEu8Tjji17XBko",
// 	authDomain: "image-upload-test-a6531.firebaseapp.com",
// 	databaseURL: "https://image-upload-test-a6531.firebaseio.com",
// 	storageBucket: "image-upload-test-a6531.appspot.com",
// };
// firebase.initializeApp(config);

// console.log('yay?');

//doesn't work
// var storage = firebase.storage();

	// Create a root reference
	// var storageRef = firebase.storage().ref();



// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get('/', function (req, res) {
	res.render('index.handlebars');
});


app.get('/upload', function (req, res) {
	// res.sendFile(__dirname+'/public/index.html');

	// this is what i actually need
	if (req.user) {
		console.log(req.user)
		console.log(req.user.username);
		var user = req.user.username;
		orm.getPrices(user, function (toHandlebars) {
			res.render('upload.handlebars', toHandlebars);
		})
		
		// res.render('upload.handlebars');
	} else {
		console.log('why am i doing this?');
		res.redirect('/login');
	}

	//only here for testing
	// res.render('upload.handlebars');
});

app.get('/login', function (req, res) {
	res.render('login.handlebars');
});

app.post('/login', passport.authenticate('local', {
	successRedirect: '/upload', 
	failureRedirect: '/login'
}));

app.post('/upload', function (req, res) {
	console.log('i was posted to');
	console.log(req.body);
	// console.log(req.body.file);
	console.log('user');
	console.log(req.user);
	// console.log(req.body.imgURL);
	orm.addOrder(req.user.id, req.body, function () {
		res.send('nice job');

		//this didn't work :(
		// res.redirect('/order-confirm-page');
	})
});

app.get('/new-user', function (req, res) {
	res.render('new-user.handlebars');
});

app.post('/create-user', function (req, res) {
	console.log(req.body);
	console.log('create the new user please');
	orm.addUser(req.body);
});

app.get('/order-history', function (req, res) {
	console.log('hi there');
	orm.orderHistory(req.user.id, function(toHandlebars) {
		res.render('order-history.handlebars', toHandlebars);
	});
});

// app.get('/order-confirm', {
// 	successRedirect: '/order-confirm-page',
// 	failureRedirect: '/upload'
// });

app.get('/order-confirm-page', function (req, res) {
	res.render('order-confirm.handlebars');
});

app.get('/checkout-step-1', function (req, res) {
	res.render('checkout-step-1.handlebars');
});

app.get('/checkout-step-2', function (req, res) {
	res.render('checkout-step-2.handlebars');
});

app.get('/checkout-step-3', function (req, res) {
	res.render('checkout-step-3.handlebars');
});

app.get('/checkout-step-4', function (req, res) {
	res.render('checkout-step-4.handlebars');
});

app.get('/checkout-complete', function (req, res) {
	res.render('checkout-complete.handlebars');
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
	console.log('App listening on PORT ' + PORT);
});