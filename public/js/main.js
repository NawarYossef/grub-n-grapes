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
				limit:	15 ,
				time:	"any",
				venuePhotos: true,
			},
			success: data => {
				const results = data.response.groups[0].items;
				console.log(results)
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

// $(document).ready(function(){
// 	$(".sticker").sticky({topSpacing:0});
// });


// $('.sticker').on('sticky-start', function() { console.log("Ended"); });


