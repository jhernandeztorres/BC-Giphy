$(document).ready(function () {
// Array of starting animals
var topics = ["dog", "cat", "bird", "lizard", "dragon", "snake"];


// Function to display buttons
function renderButtons() {
    $("#animals-view").empty();
    // Looping through the array of topics
    console.log("Render Topics", topics)
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

// This function handles events where a button is clicked
$("#add-animal").on("click", function(event) {
    // event.preventDefault() prevents the form from trying to submit itself.
    // We're using a form so that the user can hit enter instead of clicking the button if they want
    event.preventDefault();
    // This line will grab the text from the input box
    var animal = $("#animal-input").val().trim();
    
    // calling renderButtons which handles the processing of our topics array
    displayGifs();
    renderButtons();
    $("#animal-input").val("");
});

// Function to make ajax call and append gifs to div
function displayGifs() {
    var animal ;
    //[] == whale
    if (topics.indexOf($("#animal-input").val()) === -1 && $("#animal-input").val() !== ""){
    // In this case, the "this" keyword refers to the button that was clicked
     animal = $("#animal-input").val();
     topics.push(animal);
    } else if(topics.indexOf($("#animal-input").val()) > -1) {
        var index = topics.indexOf($("#animal-input").val());
        animal = topics[index]
    } else {
        animal = $(this).attr("data-name");
    }
    var apiKey = "e8wC3drKNreARrNT1wSIpVLBfqS6BTcL";
    // Constructing a URL to search Giphy for the name of the person who said the quote
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
    animal + "&api_key=" + apiKey + "&limit=10";
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
                var gifDiv = $("<div>").addClass("gifInfo");
                
                // Storing the result item's title
                var title = results[i].title;
                
                // Creating a paragraph tag with the result item's title
                var t = $("<p>").text("Title: " + title);

                // Storing the result item's trending date
                var trending = results[i].trending_datetime;

                // Creating a paragraph tag with the result items trending date
                var tr = $("<p>").text("Trending Date: " + trending);

                // Creating an image tag
                var animalImage = $("<img>");

                // Storing the result item's rating
                var rating = results[i].rating;
                
                // Creating a paragraph tag with the result item's rating
                var r = $("<p>").text("Rating: " + rating);

                // Creating a button for download and add to favorite
                var dB = $("<button>").addClass("btn dload").text("Download").prepend('<i class="fas fa-download"></i>');
                var aF = $("<button>").addClass("btn fav").text("Favorite?").prepend('<i class="far fa-star"></i>');
                // var dGif = $("<a href=" + results[i].url);

                // Giving the image tag an src attribute of a property pulled off the
                // result item
                animalImage.attr("src", results[i].images.fixed_height_still.url)
                .attr("data-state", "still")
                .attr("data-still", results[i].images.fixed_height_still.url)
                .attr("data-animate", results[i].images.fixed_height.url)
                .addClass("gif");
                
                // Appending the variables I created to the "gifDiv" div I created
                gifDiv.append("<br>");
                gifDiv.append(aF);
                gifDiv.append(t);
                gifDiv.append(animalImage);
                gifDiv.append(tr);
                gifDiv.append(r);
                gifDiv.append(dB);
                
                // Prepending the gifDiv to the "#gifs-appear-here" div in the HTML
                $("#gifs-show-here").prepend(gifDiv);
            }
        }
    });
};

// Function to start and stop animations
function animateGifs() {
    var state = $(this).attr("data-state");
    if (state === "still") {
      $(this).attr("src", $(this).attr("data-animate"));
      $(this).attr("data-state", "animate");
    } else {
      $(this).attr("src", $(this).attr("data-still"));
      $(this).attr("data-state", "still");
    }
  };
  
  // Function to reset page
  $("#reset-page").on("click", function() {
      location.reload();
  })

    
    renderButtons();
    $(document).on("click", ".animal", displayGifs);
    $(document).on("click", ".gif", animateGifs);

});