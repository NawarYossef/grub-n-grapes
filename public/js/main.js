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
				limit:	30,
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
				$("body header").css("height", "382")
			} else if ($(window).width() >= 321 && $(window).width() <= 375) {
				$("body header").css({"height": "440px"});
				
			}	else if ($(window).width() >= 376 && $(window).width() <= 425) {
				$("body header").css("height", "469px");

			}	else if ($(window).width() >= 426 && $(window).width() <= 600) {
				$("body header").css("height", "588px");	

			}	else if ($(window).width() >= 601 && $(window).width() <= 767) {
				$("body header").css("height", "609px");	

			}	else if ($(window).width() >= 768 && $(window).width() <= 1024) {
				$("body header").css("height", "796px");

			}	else if ($(window).width() >= 1025 && $(window).width() <= 1440) {
				$("body header").css("height", "796px");

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
		if ($(window).width() >= 767 && $(window).width() < 1441) {
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

