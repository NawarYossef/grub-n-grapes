"use strict";
const venues = {
	render: (data) => {
		const allVenues = data.map((item) => {
				return (
					`<div class="venue col-12">
					
						<a class="modal-btn" href="#ex1" rel="modal:open">
							<div class="container-for-data">
								<div class="all-info-container">
									${venues.venueImage(item)}
								
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

							<div id="ex1" class="modal">
							
								<a href="#" rel="modal:close">Close</a>
							</div>
						</a>
					</div>`
				)	
		})
		$(".all-results").append(allVenues);
	},

	getApiDataForModalBody: (venueId) => {
		let results;
		const id = "CF2LRN214ZC311Z1IHDGZBMA5MHRSH1C2X5UEHU3DOZTRXBM";
		const secret = "NKH0WYKFHDBBONXDQRYCA0GFI3GO45GI1EHPUZGSJN25EJRX";  
		const date = Date.now();
		const url = `https://api.foursquare.com/v2/venues/${venueId}/tips?limit=10&sort=popular&client_id=${id}&client_secret=${secret}&v=${date}`;
	
		$.get(url, (data, status) => {
			results = data.response.tips.items;
			console.log(results)
			venues.renderModalBody(results);
		});
	},

	renderModalBody: (results) => {
		let range = Array.from(new Array(2).keys());
		range.forEach((idx) => {
			results.map((item) => {
				$(".modal").append(
					`<section>
						${venues.userPhoto(item)}
						${venues.userText(item)}
					</section>`
				)
			})
		})
	},

	userPhoto: (item) => {
		if(Object.keys(item.user.photo).length !== 0) {
			 return (
				`<div class="photo-wrapper">
					<img src="${item.user.photo.prefix}120x120${item.user.photo.suffix}" class="venue-img"/>
				</div>`
			 )
		} 
		return (
			`<div class="container-for-image" >
				<img src="./images/cards/wine.png" class="venue-img"/>
			</div>`
		)
	},

	userText: (item) => {
		if (Object.keys(item).includes("text")) {
			return (
				`<div>
					<p>${item.text}</p>
				 </div>`
			)
		} 
		return '';
	},

	showResultsMessage: () => {
		const content = (
			`<div class="search-results-wrapper col-6">
				<h4>Your Results</h4>
			</div>`
		)
		$(".all-results").append(content);
	},

	venueImage: (item) => {
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

	initializeModal: () => {

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


