const express = require('express'),
	router = express.Router(),
	Comment = require('../models/comment'),
	Campground = require('../models/campground');

//INDEX - show all campgrounds
router.get('/', (req, res) => {
	// res.render('campgrounds', {campgrounds: campgrounds});
	Campground.find({}, (err, storedCampgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/index', { campgrounds: storedCampgrounds });
		}
	});
});

//CREATE - add new campground to db
router.post('/', isLoggedIn, (req, res) => {
	//get data from form and redirect to camgrounds array
	const name = req.body.name;
	const img = req.body.image;
	const desc = req.body.description;
	const author = {
		id: req.user._id,
		username: req.user.username
	};
	const newCampground = { name: name, image: img, description: desc, author: author };

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
			res.render('campgrounds/show', { campground: campground });
		}
	});
});

//EDIT - form allowing to edit
router.get('/:id/edit', checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		res.render('campgrounds/edit', { campground: foundCampground });
	});
});

//UPDATE - handling the edit
router.put('/:id', (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

//DESTROY - delete campground
router.delete('/:id', (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err, deletedCampground) => {
		if (err) {
			res.redirect('/campgrounds');
		} else {
			Comment.deleteMany({ _id: { $in: deletedCampground.comments } }, (err) => {
				if (err) {
					console.log(err);
				}
				res.redirect('/campgrounds');
			});
		}
	});
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

function checkCampgroundOwnership(req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCampground) => {
			if (err) {
				res.redirect('back');
			} else {
				if (foundCampground.author.id.equals(req.user.id)) {
					next();
				} else {
					res.redirect('back');
				}
			}
		});
	} else {
		// Redirect to previous page
		res.redirect('back');
	}
}

module.exports = router;
