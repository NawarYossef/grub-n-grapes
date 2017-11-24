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


