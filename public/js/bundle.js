(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

//  validate input when search button clicked without a selection
// validate when search is done with one letter
// scroll to results 
// add button to naviagate from buttom to header 
// write results for screen readers

// add get directions
// add modal
// create button for map for mobile devices
// progressive rendering for search
// animated text for header
// hover on selection should change background color



// hover on selection should show map window
///////////////////

// add padding right for venue address
// add photo to map window


"use strict";
const venues = require("./venues.js")	

class Main {
	constructor() {
		this.searchQuery = ''
		this.cityName = '';
		this.responseStatus = 0;
	}

	init() {
		this.hideMap();
		this.handleSearchQuery();
		this.handleSearchForCityFromMainPage();
		this.headerImageSlideShow();
		this.changeImageForFoodSelect();
		this.changeImageForWineSelect();
		this.addNeonColorForFoodWord();
		this.addNeonColorForWineWord();
		this.defaultFoodOptionColor();
		this.bounceHeaderArrow();
		this.smoothScrollEffect();
		this.runFixedMapOnScroll();
	}

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
				radius:	5000,
				section: venueType,	
				query: venueType,		
				limit:	25 ,
				time:	"any",
				tips: 4,
				venuePhotos: true,
			},
			success: data => {
				const results = data.response.groups[0].items;
				this.responseStatus = data.meta.code;	
				// console.log(data.response.groups[0].items)
				this.handleInputValidation(results);
				// console.log(results)
				venues.renderResult(results);
				venues.initializeMap(results)
			}
		}) 
	}
	
	handleInputValidation(results) {
		console.log(this.responseStatus)
		if(this.responseStatus !== 200) {
			this.clearResults();
			this.showWelcomPage();
			this.hideMap();
			this.showInavlidInputMessage();
		} else {
			this.hideWelcomePage();
			this.clearResults();
			this.showMap();
		}
	
	}

	showInavlidInputMessage() {
		const text = `Invalid Input. Please Type a City Name`
		alert(text);
	}

	hideInvalidInputMessage() {

	}

	handleSearchQuery() {
		$("button").click( (e) =>  {
			//prevent form default action
			e.preventDefault();
			
			// store search query
			this.searchQuery = this.parseQuery();

			// get API response based on venue type choosed (wine of food)
			this.whichVenueTypeToSearch(this.searchQuery);

			//show map
			this.showMap();
			
			// clear input value for new search
			this.clearInputVal();
		})
	}

	// store the city name and state/country into a variable and return it
	parseQuery() {
		let searchVal = $('form :input').val().split(', ');
		let query = searchVal[0] + ', ' + searchVal[searchVal.length - 1];
		return query;
	}

	whichVenueTypeToSearch(searchTerm) {
		if ($(".food").hasClass("neon-effect")) {
			this.getDataFromApi(searchTerm, "food")
		} else if ($(".wine").hasClass("neon-effect")) {
			this.getDataFromApi(searchTerm, "wine")
		}
	}

	handleSearchForCityFromMainPage() {
		$(".city").on('click', (e) => {
			let $this = $(e.currentTarget);
			this.cityName = $this.children().text();

			// get API response based on venue type choosed (wine of food)
			this.whichVenueTypeToSearch(this.cityName);

			//show map
			this.showMap();
		})
	}

	hideWelcomePage() {
		$(".welcome-page-info").fadeOut(300).hide();
	}

	showWelcomPage() {
		$(".welcome-page-info").show();
	}

	hideMap() {
		$(".map-container").hide();	
	}

	showMap() {
		$(".map-container").show();
	}
	
	clearResults() {
		$(".all-results").empty();
	}
	clearInputVal() {
		$("form :input").val("");
	}
	
	
	//=============== Handle page behavior =====================
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

	smoothScrollEffect() {
		 $(".arrow").on('click', function(event) {
			if (this.hash !== "") {
				// Prevent default anchor click behavior
				event.preventDefault();
	
				// Using jQuery's animate() method to add smooth page scroll
				// The number (800) specifies the number of milliseconds it takes to scroll to the specified area
				$('html, body').animate({
					scrollTop: $(this.hash).offset().top
				}, 800, () => {

					window.location.hash = this.hash;
				});
			} 
		});
	}

	setupMapFixedPositionOnScroll() {
    let $cache = $('#map');
    if ($(window).scrollTop() > 750)
      $cache.css({
        'position': 'fixed',
        'top': '10px'
      });
    else
    	$cache.css({
				'position': 'relative',
				'top': 'auto'
    });
	}
	
	runFixedMapOnScroll() {
		$(window).scroll(app.setupMapFixedPositionOnScroll);
	}
}

let app = new Main();
app.init();




},{"./venues.js":2}],2:[function(require,module,exports){
"use strict";

const venues = {
	renderResult: (data) => {
		const allVenues = data.map((item) => {
				return (
					`<div class="venue col-12">
						<div class="container-for-data">
							<div class="all-info-container">
								${venues.showImage(item)}
							
								<div class="data-container">
									<h4 class="venue-name">${item.venue.name}</h4>
									${venues.venueType(item)}
									${venues.rating(item)}
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
		$(".all-results").append(allVenues);
	},

	showImage: (item) => {
		// console.log(item.venue.photos.groups.length === 0);	
		if(item.venue.photos.groups.length !== 0) {
			 return (
				`<div class="container-for-image">
					<img src="${item.venue.photos.groups[0].items[0].prefix}120x120${item.venue.photos.groups[0].items[0].suffix}" class="venue-img"/>
				</div>`
			 )
		} 
		return (
			`<div class="container-for-image" >
				<img src="./images/cards/wine.png" class="venue-img"/>
			</div>`
		)
	},

	venueType: (item) => {
		if (Object.keys(item.venue).includes("rating")) {
			return (
				`<h5 class="venue-type">${item.venue.categories[0].name}</h5>`
			)
		} 
		return '';
	},

	rating: (item) => {
		if (Object.keys(item.venue).includes("rating")) {
			return (
				`<div class="container-for-rating">
					<p class="rating" style="background-color: #${item.venue.ratingColor};">${item.venue.rating}</p>
				</div>`
			)
		} 
		return '';
	},

	getVenuePrice: (item) => {
		if (Object.keys(item.venue).includes("price")) {
			return (
				`<div class="container-for-price">
					<p class="price">Price: <span class="price-description">${item.venue.price.message}</span></p>
				</div>`
			)
		} 
		return '';
	},
	
	printFormattedAddress: (item) => {
		return item.venue.location.formattedAddress.join("").split(",").join(" ");
	},

	initializeMap: (results) => {
		let mapOptions = {
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			zoomControl: true
		}

		let map = new google.maps.Map(document.getElementById('map'), mapOptions);
		venues.setMarkers(map, results)
	},

	setMarkers: (map, results) => {
		let marker, latlngset, content, infoWindow;

		// loop through coordinates
		results.forEach((item, idx) => {
			latlngset = new google.maps.LatLng(item.venue.location.lat, item.venue.location.lng);

			// set markers on map
			marker = new google.maps.Marker({  
				map: map, 
				title: item.venue.name, 
				position: latlngset,
				draggable: false,
				animation: google.maps.Animation.DROP  
			});

			map.setCenter(marker.getPosition())

			content = `<div class="data-container">
									<h4 class="venue-name">${item.venue.name}</h4>
									<h5 class="venue-type">${item.venue.categories[0].name}</h5>
								</div>`

			// declare info window for each venue
			infoWindow = new google.maps.InfoWindow()

			// show info window on click event
			google.maps.event.addListener(marker, 'click', (function(marker, content, infoWindow){ 
        return function() {
           infoWindow.setContent(content);
           infoWindow.open(map,marker);
        };
    	})(marker, content, infoWindow)); 
		})
	}
	
}

module.exports = venues;



},{}]},{},[1]);
