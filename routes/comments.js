const express = require("express"),
      router = express.Router({mergeParams: true}),
      Campground = require("../models/campground"),
      Comment = require("../models/comment");

// comments new
router.get('/new', isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', { campground: campground });
		}
	});
});

//comments create
router.post('/', isLoggedIn, (req, res) => {
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
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					console.log(comment);
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

// EDIT
router.get("/:comment_id/edit", checkCommentOwnership, (req, res) => {
/*  We have access to req.params.id because the full path (including the first bit from app.js)
		Full path:
		/campgrounds/:id/comments/:comment_id/edit */
	const campgroundId = req.params.id;
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		if (err) {
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: campgroundId, comment: foundComment});
		}
 	});
});

// UPDATE
router.put("/:comment_id", checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if (err) {
			res.redirect("back");
		} else {
			// Again, we have the id param in the full path
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY
router.delete("/:comment_id", checkCommentOwnership, (req, res) => {
	Comment.findOneAndDelete(req.params.comment_id, (err) => {
		if (err) {
			res.redirect("back");
		} else {
			res.redirect("back");
		}
	});
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();	
	}
	res.redirect("/login");
}

function checkCommentOwnership(req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if (err) {
				res.redirect('back');
			} else {
				// we need '.equals()' because if we use '===' they won't show as equal
				if (foundComment.author.id.equals(req.user._id)) {
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