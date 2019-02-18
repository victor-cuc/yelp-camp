const express = require('express');
const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("landing")
});

app.get('/campgrounds', (req, res) => {
  
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

  res.render('campgrounds', {campgrounds: campgrounds});

});

app.listen('3000', () => {
  console.log("Started YelpCamp server");
});