// Require mongoose
var mongoose = require("mongoose");

// Create the Schema class
var Schema = mongoose.Schema;

// Requests HTML body of site
request('https://theonion.com/', function(error, response, html) {

    // Loads HTML and saves to variable
    var url = cheerio.load(html);

});