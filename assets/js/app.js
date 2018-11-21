$(document).ready(function () {
var topics = ["dog", "cat", "bird", "lizard", "dragon", "snake"];

renderButtons();
function renderButtons() {
    $("#animals-view").empty();
    // Looping through the array of topics
    for (var i = 0; i < topics.length; i++) {
        // Then dynamically generating buttons for each animal in the array.
        // This code $("<button>") is all jQuery needs to create the start and end tag. (<button></button>)
        var a = $("<button>");
        // Adding a class
        a.addClass("animal");
        // Adding a data-attribute with a value of the animal at index i
        a.attr("data-name", topics[i]);
        // Providing the button's text with a value of the animal at index i
        a.text(topics[i]);
        // Adding the button to the HTML
        $("#animals-view").append(a);
    }
}

// This function handles events where one button is clicked
$("#add-animal").on("click", function(event) {
    // event.preventDefault() prevents the form from trying to submit itself.
    // We're using a form so that the user can hit enter instead of clicking the button if they want
    event.preventDefault();
    // This line will grab the text from the input box
    var animal = $("#animal-input").val().trim();
    // The animal from the textbox is then added to our array
    topics.push(animal);
    // calling renderButtons which handles the processing of our movie array
    renderButtons();
});

// Function to display buttons

// ajax call
$("button").on("click", function() {
    // In this case, the "this" keyword refers to the button that was clicked
    var animal = $(this).attr("data-name");
    var apiKey = "e8wC3drKNreARrNT1wSIpVLBfqS6BTcL";
    // Constructing a URL to search Giphy for the name of the person who said the quote
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
    animal + "&api_key=" + apiKey + "&limit=10";
    console.log(animal);
    console.log("Button clicked");
    // Performing our AJAX GET request
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    // After the data comes back from the API
    .then(function(response) {
        // Storing an array of results in the results variable
        var results = response.data;
        console.log(results);
        // Looping over every result item
        for (var i = 0; i < results.length; i++) {
            
            // Only taking action if the photo has an appropriate rating
            if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
                // Creating a div for the gif
                var gifDiv = $("<div>");
                
                // Storing the result item's rating
                var rating = results[i].rating;
                
                // Creating a paragraph tag with the result item's rating
                var p = $("<p>").text("Rating: " + rating);
                
                // Creating an image tag
                var animalImage = $("<img>");
                
                // Giving the image tag an src attribute of a proprty pulled off the
                // result item
                animalImage.attr("src", results[i].images.fixed_height.url);
                
                // Appending the paragraph and personImage we created to the "gifDiv" div we created
                gifDiv.append(p);
                gifDiv.append(animalImage);
                
                // Prepending the gifDiv to the "#gifs-appear-here" div in the HTML
                $("#gifs-show-here").prepend(gifDiv);
            }
        }
    });
});


// code to change still to animated gif's
// $(".gif").on("click", function() {
//     var state = $(this).attr("data-state");
//     if (state === "still") {
//       $(this).attr("src", $(this).attr("data-animate"));
//       $(this).attr("data-state", "animate");
//     } else {
//       $(this).attr("src", $(this).attr("data-still"));
//       $(this).attr("data-state", "still");
//     }
//   });
});