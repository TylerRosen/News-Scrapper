// Dependencies:

var express = require("express");
var bodyParser = require("body-parser");
var expressHandlebars = require("express-handlebars");
var mongoose = require("mongoose");
// Grabs HTML from URLs
var request = require("request");
// Scrapes HTML
var cheerio = require("cheerio");

var articles = require("./models/article.js");
var notes = require("./models/note.js");

// Initialize Express
var app = express();

mongoose.connect("mongodb://localhost/onionscrapper");

// Saves mongoose connection to db
var db = mongoose.connection;

// If there's a mongoose error, log it to console
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once we "open" a connection to mongoose, tell the console we're in
db.once("open", function() {
    console.log("Mongoose connection successful.");
});

// Routes

// Submits to mongodb
app.post("/submit", function(req, res) {});

// Requests HTML from site
app.get("/scrape", function(req, res) {
    request("http://www.theonion.com/", function(error, response, html) {
        // Loads HTML into cheerio and saves into variable
        var $ = cheerio.load(html);

        // Stores results
        var result = [];

        // Selects each instance of HTML body to scrape
        $("h2.headline").each(function(i, element) {
            var link = $(element).children().attr("href");
            var title = $(element).children().text();

            // Saves results in an object and pushes to array
            result.push({
                title: title,
                link: link
            });
        });
        console.log(result);
    });
});

// Listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
});