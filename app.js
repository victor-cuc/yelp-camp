const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	User = require('./models/user'),
	seedDB = require('./seeds');

seedDB();
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

//Passport.js Config
app.use(
	require('express-session')({
		secret: 'Secret String',
		resave: false,
		saveUninitialized: false
	})
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
})

//Landing
app.get('/', (req, res) => {
	res.render('landing');
});

// ==================
// CAMPGROUNDS ROUTES
// ==================

//INDEX - show all campgrounds
app.get('/campgrounds', (req, res) => {
	// res.render('campgrounds', {campgrounds: campgrounds});
	Campground.find({}, (err, storedCampgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/index', { campgrounds: storedCampgrounds});
		}
	});
});

//CREATE - add new campground to db
app.post('/campgrounds', (req, res) => {
	//get data from form and redirect to camgrounds array
	const name = req.body.name;
	const img = req.body.image;
	const desc = req.body.description;
	const newCampground = { name: name, image: img, description: desc };

	Campground.create(newCampground, (err, campground) => {
		if (err) {
			console.log(err);
		} else {
			console.log('Added: ' + campground.name);
			res.redirect('/campgrounds');
		}
	});
});

//NEW - show form to create new campgrounds
app.get('/campgrounds/new', (req, res) => {
	res.render('campgrounds/new');
});

//SHOW - the page shown for each campground
app.get('/campgrounds/:id', (req, res) => {
	Campground.findById(req.params.id).populate('comments').exec((err, campground) => {
		if (err) {
			console.log(err);
		} else {
			console.log(campground);
			res.render('campgrounds/show', { campground: campground });
		}
	});
});

// ===============
// COMMENTS ROUTES
// ===============

app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', { campground: campground });
		}
	});
});

app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
	//look up campground
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

// ===========
// AUTH ROUTES
// ===========

//Show register form
app.get('/register', (req, res) => {
	res.render('register');
});

//handle signup logic
app.post('/register', (req, res) => {
	const newUser = new User({ username: req.body.username });
	User.register(newUser, req.body.password, (err, newUser) => {
		if (err) {
			console.log(err);
			return res.render('register');
		}
		passport.authenticate('local')(req, res, () => {
			res.redirect('/campgrounds');
		});
	});
});

//Show login form
app.get('/login', (req, res) => {
	res.render('login');
});

// handle login
app.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/campgrounds',
		failureRedirect: '/login'
	}),
	(req, res) => {}
);

//logout
app.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();	
	}
	res.redirect("/login");
}

app.listen(3000, () => {
	console.log('Started YelpCamp server');
});
