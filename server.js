// Dependencies:

var express = require("express");
var bodyParser = require("body-parser");
var expressHandlebars = require("express-handlebars");
var mongoose = require("mongoose");
// Grabs HTML from URLs
var request = require('request');
// Scrapes HTML
var cheerio = require('cheerio');


// Routes

// Requests HTML from site
request('http://www.theonion.com/', function(error, response, html) {

    // Loads HTML into cheerio and saves into variable
    var $ = cheerio.load(html);

    // Stores results
    var result = [];

    // Selects each instance of HTML body to scrape
    $('h2.headline').each(function(i, element) {

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