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
			// this.whichVenueTypeToSearch(searchQuery);
			if ($(".food").hasClass("neon-effect")) {
				this.getDataFromApi(searchQuery, "food")
			} else if ($(".wine").hasClass("neon-effect")) {
				this.getDataFromApi(searchQuery, "wine")
			}
			
			// clear input value for new search
			this.clearInputVal()
		})
	}

	validateInput() {
		// if()
	}
	whichVenueTypeToSearch(searchQuery) {
		
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

