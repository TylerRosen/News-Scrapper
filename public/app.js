// Grab the articles as json
$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
        // Display info
        $("#articles").append(
            "<p data-id='" +
            data[i]._id +
            "'>" +
            data[i].title +
            "<br />" +
            data[i].link +
            "</p>"
        );
    }
});

$(document).on("click", "p", function() {
    // Empties note
    $("#notes").empty();
    // Saves id
    var thisId = $(this).attr("data-id");

    // Calls article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    }).done(function(data) {
        // Adds note to page
        console.log(data);
        // Title
        $("#notes").append("<h2>" + data.title + "</h2>");
        // Enter new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // Write note
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // Submit note
        $("#notes").append(
            "<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
        );

        if (data.note) {
            // Adds title of note
            $("#titleinput").val(data.note.title);
            // Inserts text in body
            $("#bodyinput").val(data.note.body);
        }
    });
});

$(document).on("click", "#savenote", function(event) {
    event.preventDefault();
    // Saves note
    var thisId = $(this).attr("data-id");
    console.log("Note Saved!");

    // Change note
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    }).done(function(data) {
        console.log(data);
        // Empty notes
        $("#notes").empty();
    });

    // Removes value of note
    $("#titleinput").val("");
    $("#bodyinput").val("");
});