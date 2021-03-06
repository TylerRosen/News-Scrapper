// Dependencies;
var express = require("express");
var bodyParser = require("body-parser");
var expressHandlebars = require("express-handlebars");
var mongoose = require("mongoose");
// Grabs HTML from URLs
var request = require("request");
// Scrapes HTML
var cheerio = require("cheerio");

mongoose.Promise = Promise;

var Note = require("./models/Note");
var Article = require("./models/Article");

// Initialize Express
var app = express();
var PORT = process.env.PORT || 3000;

//Creates static directory
app.use(express.static("public"));

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// Saves mongoose connection to db
var db = process.env.MONGODB_URL || "mongodb://localhost/onionscrapper";

mongoose.connect(db, function(error){
  if(error){
    console.log(error)
  } else {
    console.log('connection successful')
  }
});

// heroku_r2rm8vs7:enjakc84et11hd1pluuidoh7mv@ds149800.mlab.com:49800/heroku_r2rm8vs7

// If there's a mongoose error, log it to console
// db.on("error", function(error) {
//   console.log("Mongoose Error: ", error);
// });

// Once we "open" a connection to mongoose, tell the console we're in
// db.once("open", function() {
//   console.log("Mongoose connection successful.");
// });

// Routes

// Scrapes HTML from site
app.get("/scrape", function(req, res) {
  request("http://www.theonion.com/", function(error, response, html) {
    // Loads HTML into cheerio and saves into variable
    var $ = cheerio.load(html);

    $("h2.headline").each(function(i, element) {
      // Stores results
      var result = {};

      // Saves links and titles into db
      result.title = $(element).children().text();
      result.link = $(element).children().attr("href");

      // Create new entry in db
      var entry = new Article(result);

      // Saves entries in db
      entry.save(function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          console.log(doc);
        }
      });
    });
  });

  res.send("Scrape Complete");
});

// Gets articles from db
app.get("/articles", function(req, res) {
  // Finds articles in array
  Article.find({}, function(error, doc) {
    if (error) {
      console.log(error);
    } else {
      res.json(doc);
    }
  });
});

// Grabs articles from ID
app.get("/articles/:id", function(req, res) {
  Article.findOne({ _id: req.params.id })
    //   Populates note
    .populate("note")
    .exec(function(error, doc) {
      if (error) {
        console.log(error);
      } else {
        res.json(doc);
      }
    });
});

// Creates or replace note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Note(req.body);

  // Saves note to db
  newNote.save(function(error, doc) {
    if (error) {
      console.log(error);
    } else {
      // Takes article id and updates note
      Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: doc._id }
      ).exec(function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          res.send(doc);
        }
      });
    }
  });
});

// Listen on port 3000
app.listen(PORT, function() {
  console.log("App running on port 3000!");
});
