const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("landing")
});

var campgrounds = [
  {
    name: "Salmon Creek", 
    image: "https://s3.amazonaws.com/imagescloud/images/medias/reservation/camping/main.jpg"
  },
  {
    name: "La mici", 
    image: "http://www.hqshuibiao.com/wp-content/uploads/2018/10/general-.jpg"
  },
  {
    name: "La munte la mici", 
    image:"https://d2ciprw05cjhos.cloudfront.net/files/v3/styles/gs_large/public/images/18/06/gettyimages-649155058.jpg?itok=Lhx5ciAR"
  },
];

app.get('/campgrounds', (req, res) => {
  res.render('campgrounds', {campgrounds: campgrounds});
});

app.post("/campgrounds", (req, res) => {
  res.send("You hit the post route");
  
  //get data from form and redirect to camgrounds array
  const name = req.body.name;
  const img = req.body.image;
  const newCampground = {name: name, image: img};

  //redirect back to /campgrounds
  campgrounds.push(newCampground);

});

app.get("/campgrounds/new", (req, res) => {
  res.render("new");
});

app.listen('3000', () => {
  console.log("Started YelpCamp server");
});