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
										<h3 class="venue-name">${item.venue.name}</h3>
										<h5 class="venue-type">${item.venue.categories[0].name}</h5>
										<div class="container-for-rating">
											<p class="rating" style="background-color: #${item.venue.ratingColor};">${item.venue.rating}</p>
										</div>
										<div class="container-for-price">
											<p class="price">Price: <span class="price-description">${venues.getVenuePrice(item)}</span></p>
										</div>
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
		console.log(Object.keys(item.venue).includes("price"))
		if (Object.keys(item.venue).includes("price")) {
			return item.venue.price.message;
		} 
		$(".price").hide();
	},
	
	printFormattedAddress: (item) => {
		return item.venue.location.formattedAddress.join("").split(",").join(" ");
	}

	
}

module.exports = venues;
