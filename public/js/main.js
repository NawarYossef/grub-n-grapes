
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
// grub and grapes in the header is a button that takes you to welcome page


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
		this.arrowScrollDown();
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
				console.log(data)
				const responseLength = Object.values(data.response).length;
				this.responseStatus = data.meta.code;	
		
				this.handleInputValidation(responseLength);

				const results = data.response.groups[0].items;
				venues.showResultsMessage();
				venues.renderResult(results);
				venues.initializeMap(results);
			}
		}) 
	}
	
	handleInputValidation(responseLength) {
		if (this.responseStatus !== 200 || responseLength.length === 0) {
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
			
			scrollToResults();
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

			scrollToResults()
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

	arrowScrollDown() {

		$(".arrow").click(() => {
			$('html, body').animate({
					scrollTop: $(".examples").offset().top
			}, 900);
		});

		//  $(".arrow").on('click', function(event) {
		// 	if (this.hash !== "") {
		// 		// Prevent default anchor click behavior
		// 		event.preventDefault();
	
		// 		// Using jQuery's animate() method to add smooth page scroll
		// 		// The number (800) specifies the number of milliseconds it takes to scroll to the specified area
		// 		$('html, body').animate({
		// 			scrollTop: $(this.hash).offset().top
		// 		}, 800, () => {

		// 			window.location.hash = this.hash;
		// 		});
		// 	} 
		// });
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



