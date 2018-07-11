require("dotenv").config();

//variables 
var keys = require(".keys.js");
var twitter = require('twitter');
var spotifiy = require('spoitify');
var request = require('request');
var fs = require ("fs");
var params = process.argv.slice(2);


//switch to filter arg.
switch (params[0]) {
    case "my-tweets":
        myTweets();
        break;
    case "spotify-this-song":
        if (params[1]) {
            spotifySong();
        } else {
            spotifySong(params[1] = "Riding With the King");
        }
        break;
    case "movie-this":
        if (params[1]) {
            movieLookup();
        } else {
            movieLookup(params[1] = "Lord of the Rings")
        }
        break;
    case "do-what-it-says":
        fsFunct([1]);
        break;
}

//tweet function 
    var client = new Twitter ({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_seceret: keys.twitterKeys.consumer_seceret,
        access_token_key: keys.twitterKeys.access_token_key
    });

    client.get('statuses/user_timeline', { screen_name: 'alitakendrick', count: 20 }, function(error, data, responses) {
        if (error) {
            console.log('ERROR: ' + error);
            return;
        }

//loop through 
for (var i = 0; i < data.length; i++) {
    var time = data[i].created_at + "\n";
    var tweetResults = data[i].text + "\n";
    console.log(" " + " " + "PREVIOUS TWEET: " + " " + " ")
        console.log(time + tweetResults);
    fs.appendFile("log.txt", time + tweetResults, function(err) { 
        if (err) {
            console.log("ERROR")
        }
    });
};
});
}



//pulls in song data from spotify
function spotifySong() {
spotify.search({ type: 'track', query: params[1] }, function(err, data) {
if (err) {
    console.log('ERROR: ' + err);
    return; 
} else {
    var songInfo = data.tracks.items[0];
    console.log(" " + " " + "SPOTIFY RESULTS: " + " " + " ")
    console.log("ARTIST:", songInfo.artists[0].name);
    console.log("SONG:", songInfo.name);
    console.log("ALBUM:", songInfo.album.name);
    console.log("PREVIEW:", songInfo.preview_url);
    fs.appendFile("log.txt", songInfo.artists[0].name + songInfo.name + songInfo.album.name + songInfo.preview_url, function(err) { 
        if (err) {
            console.log("ERROR")
        }
    });

};
});
}


//movie function to pull in movie data
function movieLookup() {
request("http://www.omdbapi.com/?t=" + params[1] + "&y=&plot=short&r=json", function(error, response, body){
var movieObject = JSON.parse(body);
console.log(" " + " " + "MOVIE RESULTS: " + " " + " ")
console.log("TITLE:", movieObject.Title);
console.log("RELEASED:", movieObject.Year);
console.log("IMDB RATING:", movieObject.imdbRating);
console.log("COUNTRY PRODUCED:", movieObject.Country);
console.log("LANGUAGE:", movieObject.Language);
console.log("PLOT:", movieObject.Plot);
console.log("ACTORS:", movieObject.Actors);
fs.appendFile("log.txt", movieObject.Title + movieObject.Year + movieObject.Country + movieObject.Language + movieObject.Plot + movieObject.Actors, function(err) { 
if (err) {
    console.log("ERROR")
}
});
});
};



//function to pull in data from file
function fsFunct() {
fs.readFile("random.txt", "utf-8", function(err, data){
data.split(',');
spotifySong(data[1]);
});
};