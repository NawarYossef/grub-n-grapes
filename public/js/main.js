
// add bootstrap modal
// refactor api function 



// add modal background color
// add search button hover effect

// create button for map for mobile devices
// hover on selection should change background color

//design issues
///////////////////
// add padding right for venue address
// add photo to map window
// grub and grapes in the header is a button that takes you to welcome page
// card image should have the same size as regular image.


// modal animation


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
		this.hideMap();
		this.handleSearchQuery();
		this.handleSearchForCityFromMainPage();
		this.headerImageSlideShow();
		this.animateHeaderText();
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
			dataType: 'jsonp',	
			data: {	
				client_id: id,
				client_secret: secret,
				v: Date.now(),
				near: cityName,
				radius:	5000,
				section: venueType,	
				query: venueType,		
				limit:	2 ,
				time:	"any",
				tips: 4,
				venuePhotos: true,
			},
			success: data => {
				// console.log(data)
				this.responseLength = Object.values(data.response).length;
				this.responseStatus = data.meta.code;
				
				//dataIsValid()
				// is data.response.groups[0].items !== undefined || null

				// if dataIsValid()
				this.ChangePageState();

				//if dataIsValid()
				this.results = data.response.groups[0].items;
		
				venues.render(this.results);
				venues.initializeMap(this.results);
			}
		}) 
	}
	
	ChangePageState() {
		console.log(this.responseStatus)
		console.log(this.responseLength)
		console.log(this.results)
		if ( this.responseLength === 0 || this.responseStatus !== 200) {
			this.clearResults();
			this.showWelcomPage();
			this.hideMap();
			this.showInavlidInputMessage();
		} else {
			this.hideWelcomePage();
			this.clearResults();
			this.showMap();
			venues.showResultsMessage();
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

			//show map
			this.showMap();
			
			// this.scrollToResults();
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
	
	
	//=============== page behavior =====================
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
	}

	scrollToSearchResults() {
		$('html, body').animate({
			scrollTop: $(".all-results").offset().top
		}, 900);
	}

	scrollToHeader() {
		$(".try-it-btn").click(() => {
			$('html, body').animate({
					scrollTop: $("header").offset().top
			}, 900);
		});
	}

	setupMapFixedPositionOnScroll() {
    let $cache = $('#map');
    if ($(window).scrollTop() > 750)
      $cache.css({
				'position': 'fixed',
				'top': '10px',
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

	animateHeaderText() {
		$('.tlt').textillate({
			inEffects: ['in'],
			in: {
				// set the effect name
				effect: 'fadeInLeftBig',
		
				// set the delay factor applied to each consecutive character
				delayScale: 1.5,
		
				// set the delay between each character
				delay: 70,
		
				// set to true to animate all the characters at the same time
				sync: false,
		
				// randomize the character sequence
				// (note that shuffle doesn't make sense with sync = true)
				shuffle: false,
		
				// reverse the character sequence
				// (note that reverse doesn't make sense with sync = true)
				reverse: false,
			}
		});
	}
}

let app = new GrubGrapes();
app.init();

