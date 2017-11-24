(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//handle invalid inputs 
// animated text for header 
// finish welcome page section
// city auto complete

// add get directions
// add modal
// progressive rendering for search
// scroll to results 
// create button for map for mobile devices


// hover on selection should show map window
// hover on selection should change background color
// hover on selection should change mouse to cursor

///////////////////

// add padding right for venue address
// add photo to map window


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
				radius:	5000,
				section: venueType,	
				query: venueType,		
				limit:	25 ,
				time:	"any",
				tips: 4,
				venuePhotos: true,
			},
			success: data => {
				// console.log(data.response.groups[0].items)
				const results = data.response.groups[0].items;	
				// console.log(results)
				venues.renderResult(results);
				venues.GeocodeForAllAddresses(results)
				// particles.init()
			}
		}) 
	}
	
	handleSearchQuery() {
		$("button").click( (e) =>  {
			// store search query
			let searchQuery = this.parseQuery();
			e.preventDefault();

			// this.validateInput(searchQuery);

			// delete last rendered results
			this.clearBody();

			// hide elements from welcome page
			this.hideWelcomePageInfo()

			// get API response based on venue type choosed (wine of food)
			this.whichVenueTypeToSearch(searchQuery);

			//show map
			this.showMap();
			
			// clear input value for new search
			this.clearInputVal()
		})
	}

	parseQuery() {
		let searchQuery = $('form :input').val();
		searchQuery = searchQuery.split(', ');
		let query = searchQuery[0] + ', ' + searchQuery[searchQuery.length - 1];
		return query;
	}

	validateInput(searchQuery) {
		// if()
		const text = `<p>Sorry! No results for: ${searchQuery}</p>`
		$("form").append(text);
	}

	whichVenueTypeToSearch(searchQuery) {
		if ($(".food").hasClass("neon-effect")) {
			this.getDataFromApi(searchQuery, "food")
		} else if ($(".wine").hasClass("neon-effect")) {
			this.getDataFromApi(searchQuery, "wine")
		}
	}

	handleSearchForCityFromMainPage() {
		$(".city").on('click', (e) => {
			let $this = $(e.currentTarget);
			const cityName = $this.children().text();

			this.validateInput();
			
			// delete last rendered results
			this.clearBody();

			// hide elements from welcome page
			this.hideWelcomePageInfo()

			this.whichVenueTypeToSearch(cityName);

			//show map
			this.showMap();
		})
	}

	hideWelcomePageInfo() {
		$(".welcome-page-info").fadeOut(300).hide()
	}

	hideMap() {
		$(".map-container").hide();	
	}

	showMap() {
		$(".map-container").show();
	}
	
	clearBody() {
		$(".row").empty();
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
    if ($(window).scrollTop() > 700)
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

let app = new Main()
app.hideMap();
app.handleSearchQuery();
app.handleSearchForCityFromMainPage();
app.headerImageSlideShow();
app.changeImageForFoodSelect();
app.changeImageForWineSelect();
app.addNeonColorForFoodWord();
app.addNeonColorForWineWord();
app.defaultFoodOptionColor();
app.bounceHeaderArrow();
app.smoothScrollEffect();
app.runFixedMapOnScroll();



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
										<h4 class="venue-name">${item.venue.name}</h4>
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
		return '';
	},
	
	printFormattedAddress: (item) => {
		return item.venue.location.formattedAddress.join("").split(",").join(" ");
	},

	// store all venue coordinates from API response. 
	GeocodeForAllAddresses: (results) => {
		// let latLangArray = results.map((item) =>  [
		// 	item.venue.location.lat, 
		// 	item.venue.location.lng
		// ])

		// call function to initialize google maps API
		venues.initializeMap(results)
	},

	initializeMap: (results) => {
		let mapOptions = {
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}

		let map = new google.maps.Map(document.getElementById('map'), mapOptions);
		venues.setMarkers(map, results)
	},

	setMarkers: (map, results) => {
		let marker, latlngset, content, infoWindow;

		results.forEach((item, idx) => {
			latlngset = new google.maps.LatLng(item.venue.location.lat, item.venue.location.lng);

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
			infoWindow = new google.maps.InfoWindow()

			// $(".venue").hover(() => {
			// 	alert(item.venue.name)
			// })

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
