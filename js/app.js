// this function takes the question object returned by the StackOverflow request
// and returns new result to be appended to DOM

$(function() {
	$("input[name='city']").val("");
	$("select[name='state']").val("AK");

	var availableCities = [
      "Warren",
      "Chicago",
      "New York",
      "Los Angeles",
      "Boca Raton",
      "Houston",
      "Dallas",
      "Detroit"
    ];

	$("input[name='city']").autocomplete({
      source: availableCities
    });


	var showCurrent = function(item) {

	var template = $('.templates .current-weather').clone();

	var userElem = template.find(".user");

	if (Object.keys(item).length === 1) {
	 $(".results-container").append(item.response.error.description)
	}

	userElem.text(parseInt(item.current_observation.feelslike_f) + " degrees")



	var repElem = template.find(".reputation");
	repElem.text(item.current_observation.wind_dir + " @ " + item.current_observation.wind_mph + " mph")

	var scoreElem = template.find(".score")
	scoreElem.text(item.current_observation.relative_humidity)

	var postsElem = template.find(".posts")
	// time zone will have to be put back in when adjusted for other zones
	var custom_time = item.current_observation.observation_time.substring(16, 34)
	postsElem.text(custom_time)

	return template;
}


var showForecast = function(item) {

	var template = $('.templates .forecast').clone();

	var userElem = template.find(".one_day");
	userElem.text(item.forecast.txt_forecast.forecastday[2].title + ": " + item.forecast.txt_forecast.forecastday[2].fcttext)

	var repElem = template.find(".two_day");
	repElem.text(item.forecast.txt_forecast.forecastday[4].title + ": " + item.forecast.txt_forecast.forecastday[4].fcttext)

	return template;
}

// this function takes the results object from StackOverflow
// and returns the number of results and tags to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query + '</strong>';
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getCurrent = function(city, state) {

	$.ajax({
		url: "https://api.wunderground.com/api/be93c4c3fa5780ba/geolookup/conditions/q/" + state + "/" + city  + ".json",
		dataType: "jsonp",//use jsonp to avoid cross origin issues
		type: "GET"
	})
	.done(function(result){ //this waits for the ajax to return with a succesful promise object
		console.log(result);
		// var searchResults = showSearchResults(request.tagged, result.items.length);
		// $('.search-results').html(searchResults);
		// //$.each is a higher order function. It takes an array and a function as an argument.
		// //The function is executed once for each item in the array.
		// $.each(result.items, function(i, item) {
		// 	var question = showQuestion(item);
		// 	$('.results').append(question);

		var answer = showCurrent(result)
		$(".results-container").prepend(answer)


	})
	.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		// console.log('ay');
		// $(".results-container").append("<p>" + error.response.error.description + "</p>")
	});
};

var getForecast = function(city, state) {

	$.ajax({
		url: "https://api.wunderground.com/api/be93c4c3fa5780ba/forecast/q/" + state + "/" + city + ".json",
		dataType: "jsonp",//use jsonp to avoid cross origin issues
		type: "GET"
	})
	.done(function(result){ //this waits for the ajax to return with a succesful promise object
		// console.log(result);
		// var searchResults = showSearchResults(request.tagged, result.items.length);
		// $('.search-results').html(searchResults);
		// //$.each is a higher order function. It takes an array and a function as an argument.
		// //The function is executed once for each item in the array.
		// $.each(result.items, function(i, item) {
		// 	var question = showQuestion(item);
		// 	$('.results').append(question);

		var answer = showForecast(result)
		$(".results-container").append(answer)


	})
	.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		console.log(error);
	});
};

	$('form').submit(function(e){
		e.preventDefault();

		$('.results-container').html('');
		// zero out results if previous search has run
		// get the value of info user is submitting
		var city = $(this).find("input[name='city']").val();
		var state = $(this).find("select[name='state']").val();

		getCurrent(city, state);
		getForecast(city, state)
	});

});

