$(document).ready(function () {
    // Array of starting animals
    var topics = ["dog", "cat", "bird", "lizard", "dragon", "snake"];

    // Button Functions //

    // Function to display buttons
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

    // This function handles events where a button is clicked
    $("#add-animal").on("click", function (event) {
        event.preventDefault();
        displayGifs();
        renderButtons();
        $("#animal-input").val("");
    });

    // Function to reset page
    $("#reset-page").on("click", function () {
        location.reload();
    })

    // Function to add new row to favorites
    function createRow(title, url, thumbnail, rating) {
        var tRow = $("<tr>");
        var gifTitle = $("<td>").text(title);
        var gifUrl = $("<td>").text(url); // link should not be clickable
        var gifThumb = $("<td>").text(thumbnail); // thumbnail needs to be pretty small
        var gifRating = $("<td>").text(rating);
        // var gifLink = $("<td>").attr("").text(url); // add link in [link] so it looks like that and the link is clickable

        tRow.append(gifTitle, gifUrl, gifThumb, gifRating);

        $("tbody").append(tRow);
    }

    // Function to add gif information to favorites
    function favoriteBtn() {
        console.log("Favorite Button Pressed");
        console.log("Thumbnail Href: " + $(this).attr("thumbnail-href"));
        console.log("Title: " + $(this).attr("title"));
        console.log("Rating: " + $(this).attr("rating"));
        console.log("Gif Href: " + $(this).attr("animated-href"));
        var title = $(this).attr("title");
        var url = $(this).attr("animated-href");
        var thumbnail = $(this).attr("thumbnail-href");
        var rating = $(this).attr("rating");
        createRow(title, url, thumbnail, rating);
        textInfo = $("<p>").text("Gif information added to favorites!");
        $(".favorites").append(textInfo);
        setTimeout(function(){
            $(".favorites").text(" ")
        }, 5000);
    }

    function downloadBtn() {
        console.log("Download button pressed");
    }

    // API Call Function //

    // Function to make ajax call and append gifs to div
    function displayGifs() {
        var animal;
        if (topics.indexOf($("#animal-input").val()) === -1 && $("#animal-input").val() !== "") {
            animal = $("#animal-input").val();
            topics.push(animal);
        } else if (topics.indexOf($("#animal-input").val()) > -1) {
            var index = topics.indexOf($("#animal-input").val());
            animal = topics[index]
        } else {
            animal = $(this).attr("data-name");
        }
        var apiKey = "e8wC3drKNreARrNT1wSIpVLBfqS6BTcL";
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            animal + "&api_key=" + apiKey + "&limit=10";
        $.ajax({
                url: queryURL,
                method: "GET"
            })
            .then(function (response) {
                var results = response.data;
                console.log(results);
                for (var i = 0; i < results.length; i++) {
                    if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
                        var gifDiv = $("<div>").addClass("gifInfo");
                        var title = results[i].title;
                        var t = $("<p>").text("Title: " + title).addClass("title");
                        var trending = results[i].trending_datetime;
                        var tr = $("<p>").text("Trending Date: " + trending).addClass("trending");
                        var animalImage = $("<img>");
                        var rating = results[i].rating;
                        var r = $("<p>").text("Rating: " + rating).addClass("rating");
                        var dB = $("<a>").attr("id", "dlBtn").attr("download", " ")
                        .addClass("btn dload")
                        .html("<button><i class='fas fa-download'>Download</i></button>")
                        dB.attr("href", results[i].images.fixed_height.url);
                        $("<a>").html("<button>")
                        var aF = $("<button>").attr("id", "favBtn")
                        .addClass("btn fav")
                        .text("Favorite?")
                        .prepend('<i class="far fa-star"></i>');
                        aF.attr("thumbnail-href", results[i].images.preview_gif.url)
                        aF.attr("animated-href", results[i].images.fixed_height.url)
                        aF.attr("title", results[i].title);
                        aF.attr("rating", results[i].rating)
                        animalImage.attr("src", results[i].images.fixed_height_still.url)
                            .attr("data-state", "still")
                            .attr("data-still", results[i].images.fixed_height_still.url)
                            .attr("data-animate", results[i].images.fixed_height.url)
                            .addClass("gif");
                        gifDiv.append("<br>");
                        gifDiv.append(aF);
                        gifDiv.append(t);
                        gifDiv.append(animalImage);
                        gifDiv.append(tr);
                        gifDiv.append(r);
                        gifDiv.append(dB);
                        $("#gifs-show-here").prepend(gifDiv);
                    }
                }
            });
    };

    // Animation Function //

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

    // Extras
    // Show weather info
    $.getJSON("https://ipinfo.io/", function (json) {
        $(".location").html(json.city + " , " + json.region);
        getData(json.loc);
    });

    function getData(loc) {
        var lat = loc.split(",")[0];
        var lon = loc.split(",")[1];
        var apiKey = "c38f38fafa15b4cc5eb95f4dab2c7dc1";
        var corsURL = "https://cors-anywhere.herokuapp.com/";
        var weatherURL = corsURL + "https://api.darksky.net/forecast/" + apiKey + "/" + lat + "," + lon;

        $.getJSON(weatherURL, function (data) {
            var summary = data.currently.summary;
            $(".summary").html(summary);

            var tempF = Math.round(data.currently.temperature);
            $(".tempF").html("Current Temperature: <br/>" + tempF + "\xB0F");

            var icon = data.currently.icon;

            var skycons = new Skycons({
                "color": "blue"
            });

            function weatherIcon() {
                if (icon === "clear-day") {
                    skycons.add("icon1", Skycons.CLEAR_DAY);
                } else if (icon === "clear-night") {
                    skycons.add("icon1", Skycons.CLEAR_NIGHT);
                } else if (icon === "rain") {
                    skycons.add("icon1", Skycons.RAIN);
                } else if (icon === "snow") {
                    skycons.add("icon1", Skycons.SNOW);
                } else if (icon === "sleet") {
                    skycons.add("icon1", Skycons.SLEET);
                } else if (icon === "wind") {
                    skycons.add("icon1", Skycons.WIND);
                } else if (icon === "fog") {
                    skycons.add("icon1", Skycons.FOG);
                } else if (icon === "cloudy") {
                    skycons.add("icon1", Skycons.CLOUDY);
                } else if (icon === "clear-night") {
                    skycons.add("icon1", Skycons.CLEAR_NIGHT);
                } else if (icon === "partly-cloudy-day") {
                    skycons.add("icon1", Skycons.PARTLY_CLOUDY_DAY);
                } else if (icon === "partly-cloudy-night") {
                    skycons.add("icon1", Skycons.PARTLY_CLOUDY_NIGHT);
                } else {
                    console.log("Dark Sky icon did not return a matching case");
                }
                skycons.play();
            }
            weatherIcon();
        })
    }

    renderButtons();
    $(document).on("click", ".animal", displayGifs); // Click function to allow new buttons to be used
    $(document).on("click", ".gif", animateGifs); // Click function to allow gifs to change state from still to animated
    $(document).on("click", ".fav", favoriteBtn)
    $(document).on("click", ".dload", downloadBtn)

});