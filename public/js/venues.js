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
		let latLangArray = results.map((item) =>  [
			item.venue.location.lat, 
			item.venue.location.lng
		])

		// call function to initialize google maps API
		venues.initializeMap(latLangArray)
	},

	initializeMap: (latLangArray) => {
		let marker;

		let mapOptions = {
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}

		let map = new google.maps.Map(document.getElementById('map'), mapOptions);
		
		latLangArray.forEach((VenueLatLang, idx) => {
			let myLatlng = new google.maps.LatLng(VenueLatLang[0],VenueLatLang[1]);
			// set the view port on coordinates for the last venue 
			map.setCenter(myLatlng);

				marker = new google.maps.Marker({
					position: new google.maps.LatLng(VenueLatLang[0],VenueLatLang[1]),
					draggable: false,
					animation: google.maps.Animation.DROP,
					map: map,
					title: 'Hello World!'
			});
		})
	}
	
}

module.exports = venues;


