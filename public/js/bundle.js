(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// modal
//images for phones 
//get directions
// hover on selection for map
"use strict";
const venues = require("./venues.js")	

class GrubGrapes {
	constructor() {
		this.searchQuery = '';
		this.cityName = '';
		this.responseStatus = 0;
		this.responseLength = 0;
		this.results = '';
	}

	init() {
		this.animateHeaderText();
		this.hideMap();
		this.handleSearchQuery();
		this.handleSearchForCityFromMainPage();
		this.headerImageSlideShow();
		this.changeHeaderDimensionsOnResize();
		this.changeImageForFoodSelect();
		this.changeImageForWineSelect();
		this.addNeonColorForFoodWord();
		this.addNeonColorForWineWord();
		this.defaultFoodOptionColor();
		this.bounceHeaderArrow();
		this.arrowScrollDown();
		this.runFixedMapOnScroll();
		this.scrollToHeader();
	}

	getDataFromApi(cityName, venueType) {
		const url = "https://api.foursquare.com/v2/venues/explore";
		const id = "CF2LRN214ZC311Z1IHDGZBMA5MHRSH1C2X5UEHU3DOZTRXBM";
		const secret = "NKH0WYKFHDBBONXDQRYCA0GFI3GO45GI1EHPUZGSJN25EJRX";  
	
		$.ajax({
			method: 'GET',
			url: url,
			data: {	
				client_id: id,
				client_secret: secret,
				v: Date.now(),
				near: cityName,
				radius:	5000,
				section: venueType,	
				query: venueType,		
				limit:	2,
				time:	"any",
				tips: 4,
				venuePhotos: true,
			}

		}).done((data) => {

			this.responseLength = Object.values(data.response).length;
			this.responseStatus = data.meta.code;
			this.results = data.response.groups[0].items;
	
			this.StateChange();

		}).fail(() => {
			this.clearResults();
			this.showWelcomPage();
			this.hideMap();
			this.showInavlidInputMessage();
		})
		
	}
	
	StateChange() {
		// console.log(this.responseStatus)
		// console.log(this.responseLength)
		console.log(this.results)
		if (this.responseLength === 0  || this.results.length === 0 || this.responseStatus !== 200) {
			this.clearResults();
			this.showWelcomPage();
			this.hideMap();
			this.showInavlidInputMessage();
		} else {
			this.hideWelcomePage();
			this.clearResults();
			this.handleMapDisplay();
			this.mapOnScreenResizeHandler();
			venues.showResultsMessage();
			venues.render(this.results);
			venues.initializeMap(this.results);
			this.scrollToSearchResults();	
		}
	}

	showInavlidInputMessage() {
		const text = `Invalid Input. Please type a city name`
		alert(text);
	}

	handleSearchQuery() {
		$(".search-btn").click( (e) =>  {
			//prevent form default action
			e.preventDefault();
	
			// store search query
			this.searchQuery = this.parseQuery();

			// get API response based on venue type choosed (wine of food)
			this.whichVenueTypeToSearch(this.searchQuery);
			
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

	handleMapDisplay() {
		// if viewport is for ipad and larger screens
		if ($(window).width() >= 767) {
			this.showMap();
		} else {
			this.hideMap();
		}
	}

	mapOnScreenResizeHandler() {
		$(window).resize(() => {
			if ($(window).width() >= 767) {
				this.showMap();
			} else {
				this.hideMap();
			}
		})
	}

	clearResults() {
		$(".all-results").empty();
	}

	clearInputVal() {
		$("form :input").val("");
	}
	
	
	// * * * * * * * * * * * * * * * * * * * * * *
	// 	Welcome Page Animation and behavior
	// * * * * * * * * * * * * * * * * * * * * * *
	headerImageSlideShow() {
		$('header').vegas({
			slides: [
				{src: 'images/background1.jpg'},
				{src: 'images/background3.jpg'},
				{src: 'images/background2.jpg'},
				{src: 'images/background4.jpg'}
			],
			delay: 6000,
			transition: 'fade',
			timer: false,
			cover:	true
		});
	}
	
	changeHeaderDimensionsOnResize() {
		$(window).resize(() => {
			if ($(window).width() <= 320) {
				$("body header").css("height", "320")
		
			} else if ($(window).width() >= 321 && $(window).width() <= 375) {
				$("body header").css({"height": "315"});
				
			}	else if ($(window).width() >= 376 && $(window).width() <= 425) {
				$("body header").css("height", "322");

			}	else if ($(window).width() >= 426 && $(window).width() <= 600) {
				$("body header").css("height", "322");	

			}	else if ($(window).width() >= 601 && $(window).width() <= 767) {
				$("body header").css("height", "520");	

			}	else if ($(window).width() >= 768 && $(window).width() <= 1024) {
				$("body header").css("height", "700");

			}	else if ($(window).width() >= 1025 && $(window).width() <= 1440) {
				$("body header").css("height", "700");

			}	else if ($(window).width() >= 1441) {
				$("body header").css("height", "700");
			}
		})
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

	arrowScrollDown() {
		$(".arrow").click(() => {
			$('html, body').animate({
					scrollTop: $(".how-it-works").offset().top
			}, 900);
		});
	}

	scrollToSearchResults() {
		$('html, body').animate({
			scrollTop: $(".all-results").offset().top
		}, 900);
	}

	scrollToHeader() {
		$(".back-to-search-bar-btn").click(() => {
			$('html, body').animate({
					scrollTop: $("header").offset().top
			}, 900);
		});
	}

	setupMapFixedPositionOnScroll() {
    let $cache = $('.map-wrapper');
    if ($(window).scrollTop() > 750)
      $cache.css({
				'position': 'fixed',
				'top': '10px',
				"width": "calc(50% - 27px)"
      });
    else
    	$cache.css({
				'position': 'relative',
				"width": "100%",
				'top': 'auto',
    });
	}
	
	runFixedMapOnScroll() {
		// if viewport is for ipad and larger screens
		if ($(window).width() >= 767) {
			$(window).scroll(app.setupMapFixedPositionOnScroll);
		} else {
			this.hideMap();
		}
	}

	animateHeaderText() {
		$(".cont-for-h1").hide();
		setTimeout(() => {
			$(".cont-for-h1").show();

			$('.tlt').textillate({
				inEffects: ['in'],
				in: {
					// set the effect name
					effect: 'fadeInLeftBig',
			
					// sets the initial delay before starting the animation
					// initialDelay: 6,
	
					// set the delay factor applied to each consecutive character
					delayScale: 1.5,
			
					// set the delay between each character
					delay: 70,
			
					// set to true to animate all the characters at the same time
					sync: false,
			
					// randomize the character sequence
					shuffle: false,
			
					// reverse the character sequence
					reverse: false,
				}
			});
		}, 1000)	
	}
}

let app = new GrubGrapes();
app.init();


},{"./venues.js":2}],2:[function(require,module,exports){
"use strict";
const venues = {
	render: (data) => {
		const allVenues = data.map((item) => {
			venues.getApiDataForModalBody(item);

				return (
					 `<div class="venue col-12">
							<!-- Link to open the modal -->
							<div class="container-for-data">
								<div class="all-info-container">
									${venues.venueImage(item)}
									<div class="data-container">
										<h4 class="venue-name">${item.venue.name}</h4>
										${venues.venueType(item)}
										${venues.ratingForVenue(item)}
										<div class="map-link col-6">
											<a src="" class="get-map-link">
											<p><i class="fa fa-map-o" aria-hidden="true"></i>Directions</p>
											</a>
											<div data-toggle="modal" data-target="#${item.venue.id}" class="modal-link">
												<a src="" class="get-details-link">
													<p><i class="fa fa-comment" aria-hidden="true"></i>Reviews</p>
												</a>
											</div>
										</div>
										${venues.venueHours(item)}
									
									</div>
								</div>
								${venues.getVenuePrice(item)}
								${venues.venueWebsite(item)}
								<div class="address">	
									<p class="address-desc">
										<i class="fa fa-car" aria-hidden="true"></i>
										${venues.printFormattedAddress(item)}
									</p>
								</div>
							</div>
							

							<!-- modal -->
							<div class="modal  fade" id="${item.venue.id}"  tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
								<div class="modal-dialog " role="document">
									<div class="modal-content">

										<div class="modal-header">
											<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
										</div>
									
										<div id="${item.venue.id}" class="modal-wrapper">
											<div class="modal-venue-info-wrapper ">
												<h4 class="venue-name modal-venue-title">${item.venue.name}</h4>
												${venues.ratingForModal(item)}
												
											</div>	
										</div>

									</div>
								</div>
							</div>
						</div>`
				)	
		})
		$(".all-results").append(allVenues);
	},

	getApiDataForModalBody: (item) => {
		let results;
		const venueId = item.venue.id;
		const id = "CF2LRN214ZC311Z1IHDGZBMA5MHRSH1C2X5UEHU3DOZTRXBM";
		const secret = "NKH0WYKFHDBBONXDQRYCA0GFI3GO45GI1EHPUZGSJN25EJRX";  
		const date = Date.now();
		const url = `https://api.foursquare.com/v2/venues/${venueId}/tips?limit=5&sort=popular&client_id=${id}&client_secret=${secret}&v=${date}`;

		$.get(url , function(data, status) {
			results = data.response.tips.items
			console.log(data.response.tips)
			venues.renderModalBody(results, venueId, item);
		});
	},

	// * * * * * * * * * * * *
	// 	Modal
	// * * * * * * * * * * * *
	renderModalBody: (results, venueId, item) => {
		// use range variable to limit data being rendered 
		let range = Array.from(new Array(30).keys());
		range.forEach((idx) => {
			$(`#${venueId} .modal-content`).append(
				`<section class=" modal-venue-review">
					${venues.reviewPhoto(results[idx])}
					${venues.userPhoto(results[idx])}
					${venues.userText(results[idx])}
				</section>`
			)
		})
	},

	reviewPhoto: (item) => {
			if (item !== undefined && Object.keys(item).includes("photo") && Object.keys(item.photo).length !== 0) {
				 return (
					`<div class="modal-photo-wrapper col-12">
						<img src="${item.photo.prefix}200x120${item.photo.suffix}" class="modal-photo"/>
					</div>`
				 )
			} 
		return '';
	},

	userPhoto: (item) => {
		if (item !== undefined && Object.keys(item).includes("photo") && Object.keys(item.photo).length !== 0) {
			 return (
				`<div class="modal-user-photo-wrapper">
					<img src="${item.user.photo.prefix}50x50${item.user.photo.suffix}" class="modal-user-photo"/>
				</div>`
			 )
		} 
	return '';
},

	userText: (item) => {
		if (item !== undefined && Object.keys(item).includes("text") && item.text.length !== 0) {
			return (
				`<div class="modal-text-wrapper col-12">
					<p class="mdl-text">"${item.text}"</p>
				 </div>`
			)
		} 
		return '';
	},


	venueWebsite: (item) => {
		if (Object.keys(item.venue).includes("url") && item.venue.url.length !== 0) {
			return (
				`<div class="website-wrapper">
					<a href="${item.venue.url}" target="_blank" class="modal-website">
						<i class="fa fa-external-link" aria-hidden="true"></i>
						Visit Website
					</a>
				 </div>`
			)
		} 
		return '';
	},

	venueHours: (item) => {
		if (Object.keys(item.venue).includes("hours") && 
				Object.keys(item.venue.hours).includes("status") && 
				item.venue.hours.length !== 0) {
			return (
				`<div class="hours-wrapper col-12">	
					<p class="modal-hours">
						<i class="fa fa-clock-o" aria-hidden="true"></i>
						${item.venue.hours.status}
					</p>
				 </div>`
			)
		} 
		return '';
	},

	ratingForModal: (item) => {
		if (Object.keys(item.venue).includes("rating")) {
			return (
				`<div class="container-for-rating modal-rating-wrapper">
					<p class=" modal-rating" style="background-color: #${item.venue.ratingColor};">${item.venue.rating}</p>
				</div>`
			)
		} 
		return '';
	},


	// * * * * * * * * * * * *
	// 	Venues
	// * * * * * * * * * * * *
	showResultsMessage: () => {
		const content = (
			`<div class="search-results-wrapper ">
		  	<i class="fa fa-list-alt" aria-hidden="true"></i>
				<h4>Your Results</h4>
			</div>`
		)
		$(".all-results").append(content);
	},

	venueImage: (item) => {
		if(item.venue.photos.groups.length !== 0) {
			 return (
				`<div class="container-for-image">
					<img src="${item.venue.photos.groups[0].items[0].prefix}300x300${item.venue.photos.groups[0].items[0].suffix}" class="venue-img"/>
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

	ratingForVenue: (item) => {
		if (Object.keys(item.venue).includes("rating")) {
			return (
				`<div class="cont-for-rating">
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
					<i class="fa fa-usd" aria-hidden="true"></i><p class="price">Price: <span class="price-description">${item.venue.price.message}</span></p>
				</div>`
			)
		} 
		return '';
	},
	
	printFormattedAddress: (item) => {
		return item.venue.location.formattedAddress.join(". ");
	},

	
	// * * * * * * * * * * * *
	// 	Map rendering
	// * * * * * * * * * * * *
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
