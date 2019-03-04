const express = require('express'),
      app = express(), 
      bodyParser = require('body-parser'), 
      mongoose = require("mongoose"),
      Campground = require("./models/campground"),
      seedDB = require('./seeds');

seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("landing");
});

// var campgrounds = [
//   {
//     name: "Salmon Creek", 
//     image: "https://s3.amazonaws.com/imagescloud/images/medias/reservation/camping/main.jpg"
//   },
//   {
//     name: "La mici", 
//     image: "http://www.hqshuibiao.com/wp-content/uploads/2018/10/general-.jpg"
//   },
//   {
//     name: "La munte la mici", 
//     image:"https://d2ciprw05cjhos.cloudfront.net/files/v3/styles/gs_large/public/images/18/06/gettyimages-649155058.jpg?itok=Lhx5ciAR"
//   },
//   {
//     name: "Salmon Creek", 
//     image: "https://s3.amazonaws.com/imagescloud/images/medias/reservation/camping/main.jpg"
//   },
//   {
//     name: "La mici", 
//     image: "http://www.hqshuibiao.com/wp-content/uploads/2018/10/general-.jpg"
//   },
//   {
//     name: "La munte la mici", 
//     image:"https://d2ciprw05cjhos.cloudfront.net/files/v3/styles/gs_large/public/images/18/06/gettyimages-649155058.jpg?itok=Lhx5ciAR"
//   },
// ];

//INDEX - show all campgrounds
app.get('/campgrounds', (req, res) => {
  // res.render('campgrounds', {campgrounds: campgrounds});
  Campground.find({}, (err, storedCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {campgrounds: storedCampgrounds})
    }
  });
});

//CREATE - add new campground to db
app.post("/campgrounds", (req, res) => {
  //get data from form and redirect to camgrounds array
  const name = req.body.name;
  const img = req.body.image;
  const desc = req.body.description;
  const newCampground = {name: name, image: img, description: desc};

  Campground.create(newCampground, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Added: " + campground.name);
      res.redirect("/campgrounds");
    }
  });
});

//NEW - show form to create new campgrounds
app.get("/campgrounds/new", (req, res) => {
  res.render("new");
});

//SHOW - the page shown for each campground
app.get("/campgrounds/:id", (req, res) => {
  Campground.findById(req.params.id).populate("comments").exec((err, campground) => {
    if (err) {
      console.log(err);
    } else {
      console.log(campground);
      res.render("show", {campground: campground});
    }
  });
});

app.listen(3000, () => {
  console.log("Started YelpCamp server");
});