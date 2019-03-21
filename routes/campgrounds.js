const express = require("express"),
      router = express.Router(),
      Campground = require("../models/campground");


//INDEX - show all campgrounds
router.get('', (req, res) => {
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
router.post('', isLoggedIn, (req, res) => {
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
router.get('/new', isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
});

//SHOW - the page shown for each campground
router.get('/:id', (req, res) => {
	Campground.findById(req.params.id).populate('comments').exec((err, campground) => {
		if (err) {
			console.log(err);
		} else {
			console.log(campground);
			res.render('campgrounds/show', { campground: campground });
		}
	});
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();	
	}
	res.redirect("/login");
}

module.exports = router;