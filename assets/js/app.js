$(document).ready(function () {
    var favoritesArr = [];

    if (localStorage.getItem("storeInfo") !== null){
        favoritesArr = JSON.parse(localStorage.getItem("storeInfo"))
        for (var i = 0; i < favoritesArr.length; i++) {
               createRow(favoritesArr[i].title, favoritesArr[i].url, favoritesArr[i].thumbnail, favoritesArr[i].rating);
        }
    }
    // Array of starting animals
    var topics = ["dog", "cat", "bird", "lizard", "dragon", "snake"];


    var gifCounter = 0;

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
        localStorage.clear();
        location.reload();
    })

    // Function to add new row to favorites
    function createRow(title, url, thumbnail, rating) {
        var tRow = $("<tr>");
        var gifTitle = $("<td>").text(title);
        var gifUrl = $("<td>").text(url);
        var gifThumb = $("<img>");
        gifThumb.attr("src", thumbnail).attr("class", "preview");
        var gifRating = $("<td>").text(rating);
        var gifLink = $("<a>");
        gifLink.html("[Link]");
        gifLink.attr("href", url).attr('target', '_blank').addClass("external");
        tRow.append(gifTitle, gifUrl, gifThumb, gifRating, gifLink);
        $("tbody").append(tRow);
    }

    // Function to add gif information to favorites
    function favoriteBtn() {
        var title = $(this).attr("title");
        var url = $(this).attr("animated-href");
        var thumbnail = $(this).attr("thumbnail-href");
        var rating = $(this).attr("rating");
        var isThere = false;
        //write some variable to keep track of which
        // conditional it should go into

        // write forloop to go through the favArr and return a number 
        // depending on the output. And set that to the variable
        // and that variable will replace all previous conditionals

        /**
         * for(...) {
         *  // isThere = true 
         *  // else isThere = false
         * }
         */
        for (var i = 0; i < favoritesArr.length; i++) {

            // search through favArr to see if url exist;
            // [{url:"something"},{url:"something"},{url:"something"}]
            if (favoritesArr[i].url == url) {
                isThere = true;
            }
        }

        // console.log("Is there", isThere)
        if (isThere === false && gifCounter < 10) {
            console.log(title, url, thumbnail);
            // Push object {} into favArr;
            var gifInfo = {
                title,
                url,
                thumbnail,
                rating
            }
            favoritesArr.push(gifInfo);
            $("tbody").empty();
            for (var i = 0; i < favoritesArr.length; i++) {

                createRow(favoritesArr[i].title, favoritesArr[i].url, favoritesArr[i].thumbnail, favoritesArr[i].rating);
            }
            var textInfo = $("<p>").text("Gif added to favorites!");
            $(".favorites").append(textInfo);
            setTimeout(function () {
                $(".favorites").text(" ")
            }, 5000);
            gifCounter++;
            localStore(title, url, thumbnail, rating);
            console.log(favoritesArr);
        } else if (isThere === true && gifCounter < 10) {
            var textInfo = $("<p>").text("Gif removed from favorites.");
            $(".favorites").append(textInfo);

            // Use for loop to find unique specifier and splice() out
            // from the favArr
            for (var i = 0; i < favoritesArr.length; i++) {

                if (favoritesArr[i].url === url) {
                    favoritesArr.splice(i, 1);

                }
            }

            $("tbody").empty();
            for (var i = 0; i < favoritesArr.length; i++) {

                createRow(favoritesArr[i].title, favoritesArr[i].url, favoritesArr[i].thumbnail, favoritesArr[i].rating);
            }
            setTimeout(function () {
                $(".favorites").text(" ")
            }, 5000);
            console.log(favoritesArr);
        } else if (gifCounter === 10) {
            var textInfo = $("<p>").text("Favorites limit reached.");
            $(".favorites").append(textInfo);
            setTimeout(function () {
                $(".favorites").text(" ")
            }, 5000);
        }

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
                        var animalImage = $("<img>");
                        var rating = results[i].rating;
                        var r = $("<p>").text("Rating: " + rating).addClass("rating");
                        var dB = $("<a>").attr("id", "dlBtn").attr("download", "")
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
                        aF.attr("data-fave", "unfavored");
                        animalImage.attr("src", results[i].images.fixed_height_still.url)
                            .attr("data-state", "still")
                            .attr("data-still", results[i].images.fixed_height_still.url)
                            .attr("data-animate", results[i].images.fixed_height.url)
                            .addClass("gif");
                        gifDiv.append("<br>");
                        gifDiv.append(aF);
                        gifDiv.append(t);
                        gifDiv.append(animalImage);
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

    // Function to change star on favorite button
    function changeStar() {
        var state = $(this).attr("data-fave");
        if (state === "unfavored") {
            $(this).html("<i class='fas fa-star'></i>")
            $(this).attr("data-fave", "favorite");
        } else {
            $(this).text("Favorite?").prepend("<i class='far fa-star'></i>");
            $(this).attr("data-fave", "unfavored");
        }
    }


    // Extras

    // Function for localstorage
    function localStore(title, url, thumbnail, rating) {
        // localStorage.setItem("title", title);
        // localStorage.setItem("url", url);
        // localStorage.setItem("thumbnail", thumbnail);
        // localStorage.setItem("rating", rating);

        localStorage.setItem("storeInfo", JSON.stringify(favoritesArr));
    }


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
    $(document).on("click", ".fav", changeStar)
    // $("#favorites").text(localStorage.getItem("title"));
    // console.log(localStorage.getItem("title"));
    // $("#favorites").text(localStorage.getItem("url"));
    // $("#favorites").text(localStorage.getItem("thumbnail"));
    // $("#favorites").text(localStorage.getItem("rating"));

});