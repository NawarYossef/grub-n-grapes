(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
// let script = require('./another-script.js');

function FoodDataFromApi(cityName) {
	const url = "https://api.foursquare.com/v2/venues/explore";
    const id = "CF2LRN214ZC311Z1IHDGZBMA5MHRSH1C2X5UEHU3DOZTRXBM";
    const secret = "NKH0WYKFHDBBONXDQRYCA0GFI3GO45GI1EHPUZGSJN25EJRX";  

	$.ajax({
		method: 'GET',
		url: url,
		dataType: 'jsonp',	
		data: {	client_id: id,
			client_secret: secret,
			v: Date.now(),
			near: "new york",
			radius:	250,
			section: "wine",	
			query: "wine",		
			limit:	8,
			time:	"any",
			venuePhotos: true,
		},
		success: data => {
			const results = data.response.groups[0].items;
			console.log(results);

			renderResult(results);
			// mapAllVideo(data);
			// SearchResulstCount(data);
		}
	}) 
}

function renderResult(data) {

	const venues = data.map((item) => {
			return (
				`<div class="venue col-3">
					<div class="container-for-image">
						<img src="${item.venue.photos.groups[0].items[0].prefix}200x200${item.venue.photos.groups[0].items[0].suffix}"/>
					</div>
					<h3 class="venue-name">${item.venue.name}</h3>
					<h5 class="venue-type">${item.venue.categories[0].name}</h5>
					<div class="container-for-rating">
						<p class="rating" style="background-color: #${item.venue.ratingColor};">${item.venue.rating}</p>
					</div>

					<div class="container-for-price">
					<p class="price">Price: <span class="price-description">${getVenuePrice(item)}</span></p>
				</div>

				<div class="address">
					<p class="address-desc">
						${printFormattedAddress(item)}
					</p>
				</div>
				</div>`
			)	
	})
	$(".row").append(venues)
}

function getVenuePrice(item) {
	if (Object.keys(item.venue).includes("price")) {
		return item.venue.price.message;
	} 
		$(".price").hide();
	
}

function printFormattedAddress(item) {
	return item.venue.location.formattedAddress.join("").split(",").join(" ")
}

function getSearchTerm() {
	$("button").click( e => {
		let searchTerm = $('form :input').val();
		e.preventDefault();
		FoodDataFromApi(searchTerm);
		
		// clear input value for new search
		clearInputVal()
	})
}

function clearInputVal() {
	$('form').trigger("reset");
}


$(getSearchTerm)


// display address
// if data is an empty array then display other info
},{}]},{},[1]);
