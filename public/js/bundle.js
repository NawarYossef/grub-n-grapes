(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
const venues = require("./venues.js")	

class Main {
	getDataFromApi(cityName, venueType) {
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
				near: cityName,
				radius:	1000,
				section: venueType,	
				query: venueType,		
				limit:	15 ,
				time:	"any",
				tips: 4,
				venuePhotos: true,
			},
			success: data => {
				const results = data.response.groups[0].items;
				console.log(results)
				venues.renderResult(results);
				venues.GeocodeForAllAddresses(results)
				// particles.init()
			}
		}) 
	}
	
	getSearchQuery() {
		$("button").click( (e) =>  {
			// check for toggle button value
			let searchQuery = $('form :input').val();
			e.preventDefault();
			// delete last rendered results
			this.clearBody();
			// this.validateInput();
			// get API response based on venue type choosed (wine of food)
			this.whichVenueTypeToSearch(searchQuery);
			
			// clear input value for new search
			this.clearInputVal()
		})
	}

	validateInput() {
		// if()
	}
	whichVenueTypeToSearch(searchQuery) {
		if ($(".food").hasClass("neon-effect")) {
			this.getDataFromApi(searchQuery, "food")
		} else if ($(".wine").hasClass("neon-effect")) {
			this.getDataFromApi(searchQuery, "wine")
		}
	}
	
	clearBody() {
		$(".row").empty();
	}
	clearInputVal() {
		$("form :input").val("");
	}
	
	
	// page behavior
	headerImageSlideShow() {
		$('header').vegas({
			slides: [
				{src: 'images/background1.jpg'},
				{src: 'images/background2.jpg'},
				{src: 'images/background3.jpg'},
				{src: 'images/background4.jpg'}
			],
			delay: 3000,
			transition: 'blur',
			timer: false
		});
	}
	
	// display image for radio button when option is selected 
	changeImageForWineSelect() {
		$(".wine").click(() => {
			$(this).data('clicked', true);
			if (($(this).data('clicked'))) {
				$(".wine-option").attr("src", "images/option-selected.png");
				$(".food-option").attr("src", "images/option-unselected.png");
			}
		})
	}

	changeImageForFoodSelect() {
		$(".food").click(() => {
			$(this).data('clicked', true);
			if (($(this).data('clicked'))) {
				$(".food-option").attr("src", "images/option-selected.png");
				$(".wine-option").attr("src", "images/option-unselected.png");
			} 
		})
	}
	
	addNeonColorForWineWord() {
		$(".wine").click(function() {
			$(".food").removeClass("neon-effect");
			$(this).addClass("neon-effect");
		})
	}
	
	addNeonColorForFoodWord() {
		$(".food").click(function() {
			$(".wine").removeClass("neon-effect");
			$(this).addClass("neon-effect");
		})
	}
	
	defaultFoodOptionColor() {
		$(".food").addClass("neon-effect");
	}

	bounceHeaderArrow() {
		$('.arrow-wrapper').addClass('animated bounce');
	}
}

let app = new Main()
app.getSearchQuery()
app.headerImageSlideShow();
app.changeImageForFoodSelect();
app.changeImageForWineSelect();
app.addNeonColorForFoodWord();
app.addNeonColorForWineWord();
app.defaultFoodOptionColor();
app.bounceHeaderArrow();


},{"./venues.js":2}],2:[function(require,module,exports){
"use strict";

const venues = {
	renderResult: (data) => {
		const allVenues = data.map((item) => {
				return (
					 `<div class="venue col-12">
							<div class="container-for-data">
								<div class="all-info-container">
									<div class="container-for-image">
										<img src="${item.venue.photos.groups[0].items[0].prefix}120x120${item.venue.photos.groups[0].items[0].suffix}" class="venue-img"/>
									</div>
									<div class="data-container">
										<h3 class="venue-name">${item.venue.name}</h3>
										<h5 class="venue-type">${item.venue.categories[0].name}</h5>
										<div class="container-for-rating">
											<p class="rating" style="background-color: #${item.venue.ratingColor};">${item.venue.rating}</p>
										</div>
										${venues.getVenuePrice(item)}
										<div class="address">
											<p class="address-desc">
												${venues.printFormattedAddress(item)}
											</p>
										</div>	
									</div>
								</div>
							</div>
						</div>`
				)	
				
		})
		$(".row").append(allVenues);
	},

	getVenuePrice: (item) => {
		if (Object.keys(item.venue).includes("price")) {
			return `<div class="container-for-price">
			<p class="price">Price: <span class="price-description">${item.venue.price.message}</span></p>
		</div>`
		} 
		return ''
	},
	
	printFormattedAddress: (item) => {
		return item.venue.location.formattedAddress.join("").split(",").join(" ");
	},

	// store all venue coordinates from API response. 
	GeocodeForAllAddresses: (results) => {
		let latLangArray = results.map((item) =>  [
			item.venue.location.lat, 
			item.venue.location.lng
		])

		// call function to initialize google maps API
		venues.initializeMap(latLangArray)
	},

	initializeMap: (latLangArray) => {
		let marker

		let mapOptions = {
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}

		let map = new google.maps.Map(document.getElementById('map'), mapOptions);
		
		latLangArray.forEach((VenueLatLang, idx) => {
			let myLatlng = new google.maps.LatLng(VenueLatLang[0],VenueLatLang[1]);
			// set the view port on coordinates for the last venue 
			map.setCenter(myLatlng);

				marker = new google.maps.Marker({
					position: new google.maps.LatLng(VenueLatLang[0],VenueLatLang[1]),
					draggable: false,
					animation: google.maps.Animation.DROP,
					map: map,
					title: 'Hello World!'
			});
		})
	}
	
}

module.exports = venues;



},{}]},{},[1]);
