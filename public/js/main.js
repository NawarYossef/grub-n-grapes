/* global $ */
"use strict";
let script = require('./another-script.js');

function getDataFromApi(cityName) {
	const url = "https://api.foursquare.com/v2/venues/search";
    const id = "CF2LRN214ZC311Z1IHDGZBMA5MHRSH1C2X5UEHU3DOZTRXBM";
    const secret = "NKH0WYKFHDBBONXDQRYCA0GFI3GO45GI1EHPUZGSJN25EJRX";  

	$.ajax({
		method: 'GET',
        url: url,
        dataType: 'jsonp',	
		client_id: "CF2LRN214ZC311Z1IHDGZBMA5MHRSH1C2X5UEHU3DOZTRXBM",
		client_secret: "NKH0WYKFHDBBONXDQRYCA0GFI3GO45GI1EHPUZGSJN25EJRX",
		near: "Chicago, IL",
		radius:	250,
		section: "food",	
		// query: "wine",
		limit:	10,
		time:	"any",
		venuePhotos: 1,
		success: data => {
			// showImages(data);
			// mapAllVideo(data);
			// SearchResulstCount(data);
			console.log(data)
		}
	}) 
}

function showImages(data) {
	const images = data.items.map(item => {
		return (
			`<div class="col-3">
			 	<a href="" rel="modal:open" class="anchor" target="_blank" >
					<img src=${item.snippet.thumbnails.medium.url} class="box"  role="presentation"></img>
				</a>
			</div>`
		)
	})
	$(".row").append(images)
}

function getSearchTerm() {
	$("button").click( e => {
		const searchTerm = $('.navbar-form :input').val();
		e.preventDefault();
		getDataFromApi(searchTerm);
	})
}

function mapAllVideo(data) {
	$(".anchor").each((idx, ele) => {
		const id = data.items[idx].id.videoId;
		const url = 'https://www.youtube.com/watch?v=';
		$(ele).attr("href", `${url}${id}`);	
	})
}

function SearchResulstCount(data) {
	const text = `${data.items.length} Results`
	$("p").text(text);
}

function resultDefaultState() {
	$("span > p").text('');
}



$(getSearchTerm)

