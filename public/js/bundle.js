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
				radius:	500,
				section: venueType,	
				query: venueType,		
				limit:	16,
				time:	"any",
				venuePhotos: true,
			},
			success: data => {
				const results = data.response.groups[0].items;
	
				venues.renderResult(results);
			}
		}) 
	}
	
	getSearchQuery() {
		$("button").click( (e) =>  {
			// check for toggle button value
			let getSearchQuery = $('form :input').val();
			e.preventDefault();

			// delete last rendered results
			this.clearBody()	
			this.wineOptionChosen()
			// 
			if(this.wineOptionChosen()) {
				this.getDataFromApi(getSearchQuery, "wine")
			} else {
				this.getDataFromApi(getSearchQuery, "wine")
			}
			// clear input value for new search
			// clearInputVal()
		})
	}
	
	clearBody() {
		$(".row").empty();
	}
	clearInputVal() {
		$('form').trigger("reset");
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
	
	changeImageForWineSelect() {
		$(".wine").click(() => {
			$(this).data('clicked', true);
			if (($(this).data('clicked'))) {
				$(".wine-option").attr("src", "images/option-selected.png");
				$(".food-option").attr("src", "images/option-unselected.png");
			}
		})
	}
	
	wineOptionChosen() {
		let funReturnVal = false;
		$(".wine").click(() => {
			$(this).data('clicked', true);
			if (($(this).data('clicked'))) {
				funReturnVal = true;
			}
		})
		return funReturnVal;
	}

	foodOptionChosen() {
		let funReturnVal = false;
		$(".food").click(() => {
			$(this).data('clicked', true);
			if (($(this).data('clicked'))) {
				funReturnVal = true;
			}
		})
		return funReturnVal;
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
}

let app = new Main()
app.getSearchQuery()
app.headerImageSlideShow();
app.changeImageForFoodSelect();
app.changeImageForWineSelect();
app.addNeonColorForFoodWord();
app.addNeonColorForWineWord();
app.defaultFoodOptionColor();


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
										<div class="container-for-price">
											<p class="price">Price: <span class="price-description">${venues.getVenuePrice(item)}</span></p>
										</div>
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
			return item.venue.price.message;
		} 
		// $(".price-description").hide();
	},
	
	printFormattedAddress: (item) => {
		return item.venue.location.formattedAddress.join("").split(",").join(" ");
	}
}

module.exports = venues;

},{}]},{},[1]);
