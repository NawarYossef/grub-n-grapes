"use strict";
const venues = {
	render: (data) => {
		const allVenues = data.map((item) => {
			venues.getApiDataForModalBody(item);

				return (
					 `<div class="venue col-12">
							<!-- Link to open the modal -->
							<div data-toggle="modal" data-target="#${item.venue.id}">
								<div class="container-for-data">
									<div class="all-info-container">
										${venues.venueImage(item)}
										<div class="data-container">
											<h4 class="venue-name">${item.venue.name}</h4>
											${venues.venueType(item)}
											${venues.ratingForVenue(item)}
											${venues.getVenuePrice(item)}
											<div class="address">	
												<p class="address-desc">
													${venues.printFormattedAddress(item)}
												</p>
											</div>	
										</div>
									</div>
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
												${venues.venueWebsite(item)}
												${venues.venueHours(item)}
												${venues.venueStats(item)}
												<div class="modal-reviews-header-title col-12">
													<h5 class="modal-reviews-header">Reviews</h5>
												</div>
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
				`<div class="website-wrapper col-12">
					<a href="${item.venue.url}" target="_blank" class="modal-website">Visit Website</a>
				 </div>`
			)
		} 
		return '';
	},

	venueHours: (item) => {
		if (Object.keys(item.venue).includes("hours") && item.venue.hours.length !== 0) {
			return (
				`<div class="hours-wrapper col-12">
					<p class="modal-hours">${item.venue.hours.status}</p>
				 </div>`
			)
		} 
		return '';
	},

	venueStats: (item) => {
		if (Object.keys(item.venue).includes("stats") && item.venue.stats.length !== 0) {
			return (
				`<div class="stats-wrapper col-12">
					<p class="modal-stats">Last month checkins: ${item.venue.stats.checkinsCount} Customers</p>
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
				<h4>Your Results:</h4>
			</div>`
		)
		$(".all-results").append(content);
	},

	venueImage: (item) => {
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

	ratingForVenue: (item) => {
		if (Object.keys(item.venue).includes("rating")) {
			return (
				`<div class="container-for-rating modal-rating-wrapper">
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

