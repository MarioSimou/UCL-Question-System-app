// Global Variables
var basemapsGroup,geolocationGroup,geoEnabled,map,infoDepartments, infoCoords, mapObj, formObj,leafletTopLeft,xhr,userCoords;

// get the HTML elements of map and form objects through DOM
mapObj = document.querySelector('.fleft'); // map object
formObj = document.querySelector('#formContent'); // form object - the form is used to store data

// ####################################################################################################################33

// FUNCTIONS
/*
An AJAX request is performed to take the form that a user fills when a question is stored.
*/
function loadForm()
{
	console.log('XMLHttpRequest for form.html...') // message
	xhr = new XMLHttpRequest(); // create an XMLHttpRequest object 
	xhr.open('GET','./form/form.html',true); // a GET request is performed in order to get the form.html file
	xhr.onreadystatechange = processForm; // the processForm function is loaded
	try
	{
		xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	}catch(e)
	{
		// this only works in internet explorer
	}
	xhr.send(); // send the request to the server
}

function processForm()
{
	if(xhr.readyState < 4) // waiting response from server
	{
		document.querySelector('#formContent').innerHTML = 'Loading...';
	}else if(xhr.readyState === 4) // response from server has been completely loaded
	{
		if(xhr.status ==200 && xhr.status <300 ) // http status between 200 and 299
		{ 	
			try{
				mapObj.classList.toggle('fleft'); // disable map display
				formObj.classList.toggle('fleft'); // enable form display
				formObj.classList.remove('noDisplay');	
			}catch(e){}

			document.querySelector('#formContent').innerHTML = xhr.responseText; // the formContent element is updated with the AJAX response
			document.querySelector('#submit').onclick = dbImport; // when the user click on the submit button, the data are directly stored in the database

			// a click event is added to set how the cancel button will work
			document.querySelector('#cancel').onclick = function()
			{
				mapObj.classList.toggle('fleft'); // enable map display
				formObj.classList.toggle('fleft'); // disable form display
				formObj.classList.toggle('noDisplay');		
			}				
			// message
			console.log('form is correctly loaded...');
		}
	}
}

// a function that removes the marker from the map
function cancel(marker){
	userCoords.removeFrom(map);
}

// a function that defines the operations that will be done when the user's location is gained
locationSuccess = function(position)
{
	geolocationGroup.clearLayers(); // clear the geolocation layer if a marker still exists from a previous process
	geoEnabled = true; // the geoEnabled indicates that thge geolocation is enabled 
	var radius = position.accuracy/2; // a the accuracy of the geolocation is gained 
	var coords = position.latlng; // the users coordinates are gained

	// a plain and a circle marker are added to the geolocation group, which is therefore added to the map
	geolocationGroup.addLayer(L.circle(coords, {radius : radius,color: '#E21616', dashArray: '3',fillColor: '#D03E3E'})); // the circular marker indicates the geolocation's accuracy
	geolocationGroup.addLayer(L.marker(coords, {icon : userLocationIcon}));
	map.addLayer(geolocationGroup);
	geoDiv.style.background ='url(./img/geolocation.png) no-repeat 2px 2px #d9edf7'; // change the style of the button when its enabled

}

// a function that is executed when the users location is not gained
locationError = function(err)
{
	alert(err.message) // inform the user for the geolocation problem
	console.log(err.message); // message
}


// gets the coordinates of a mouse event
getCoordsFun = function(e)
{
	infoCoords.update(e.latlng);
}


// ######################################################################################################################3


// create a Leaflet map object
map = L.map('map')
		.setMinZoom(14);  // set the minimum zomm at 14


// github repo: (http://leaflet-extras.github.io/leaflet-providers/preview/)

// create a basemap group that will contain all the basemaps that may be needed
basemapsGroup = L.featureGroup();
// The Esri World basemap is only used - leaflet-providers plugin
basemapsGroup.addLayer( L.tileLayer.provider('Esri.WorldStreetMap'));

// github repo: (https://github.com/Leaflet/Leaflet.markercluster)
// instantiate a markerCLusterGroup object
clusters = L.markerClusterGroup(
{
		showCoverageOnHover : false, // When you mouse over a cluster it shows the bounds of its markers
		zoomToBoundsOnClick : true, // When you click a cluster we zoom to its bounds
		spiderfyOnMaxZoom: true, // When you click a cluster at the bottom zoom level we spiderfy it so you can see all of its markers
		removeOutsideVisibleBounds : true, // Clusters and markers too far from the viewport are removed from the map for performance
		disableClusteringAtZoom: 20, // If set, at this zoom level and below, markers will not be clustered
		maxCLusterRadius : 80,  // The maximum radius that a cluster will cover from the central marker (in pixels)
		spiderLegPolylineOptions : {color : '#DE3B30', opacity : 0.9, weight : 1.5}, // polyline style options
		polygonOptions : {color : '#DE3B30',opacity: 0.2,fillColor : '#DE3B30', fillopacity : 0.2, } // polygone style options
});

// Define Awesome Markers Icons
departmentIcon = L.AwesomeMarkers.icon(			 // department icon
	{
		icon : 'glyphicon glyphicon-education',
		markerColor: 'green'	
	});
userLocationIcon = L.AwesomeMarkers.icon(		// user location icon
	{
		icon : 'glyphicon glyphicon-user',
		markerColor: 'red'
	});
clickIcon = L.AwesomeMarkers.icon(				// user-click icon
{
	icon : 'glyphicon glyphicon-save',
	markerColor: '#8B8BFF'
});


// Custom Control Button
infoDepartments = L.control({position : 'topright'}); // label that will give information about the departments when the
// mouse is moved

// when the infoDeprtment button is added to the map, the following operations are performed
infoDepartments.onAdd = function(map){
	this._div = L.DomUtil.create('div', 'info') // create a div with a class info
	this.update(); // update the div
	return this._div; // return the div
};

// method that updates the control based on feature's properties that are given
infoDepartments.update = function(props,layer){	
	// if the mouse is over a POI, then its coordinates are gained	`	
	try
	{
		var lat = layer._latlng.lat; // latitude
		var lng = layer._latlng.lng; // longitude
	}catch(e){} // exceptions are not shown

	// the div's content is updated with the below information
	this._div.innerHTML = '<h4>UCL Departments</h4>' + 
	(props ? '<b>Name: </b>' + props.depname+ '<br><b>Founded: </b>' + props.correct + '<br><b>Latitude: </b>' + lat.toFixed(4)+ '\t<b>Longitude: </b>' + lng.toFixed(4) : 'Hover over the POI');

};

// Custom control Button
infoCoords = L.control({position : 'topright'});

infoCoords.onAdd = function(map){
	this._div = L.DomUtil.create('div', 'info') // create a div with a class info
	this.update();
	return this._div;
};
// method that will use to update the control based on feature properties passed
infoCoords.update = function(coords){	
	// if the mouse is over a POI, then its coordinates are gained	`	
	this._div.innerHTML = '<h4>Coordinates</h4>' + 
	(coords ? '<b>Latitude: </b>' + coords.lat.toFixed(4)+ '\t<b>Longitude: </b>' + coords.lng.toFixed(4) : 'Hover over the map');

};

map.addLayer(basemapsGroup); // the basemapsGroup is added on the map
infoCoords.addTo(map); // the infoCoords Button is added to the map
infoDepartments.addTo(map); // the infoDepartments button is added to the map
L.control.scale({maxWidth: 300, position: 'bottomright'}).addTo(map); // a control scale is added to the map - position : bottom right


// More buttons are created
// Full Zoom button - when the user clicks on the button, the map's extent is changed to cover the whole POI's bounding box 
leafletTopLeft = document.querySelector('.leaflet-top'); // get the .leaflet-top HTML element
var div = document.createElement('div'); // create a div element
div.classList.add('custom'); // set a custom class 
div.id = 'full-zoom';	// set an id
var a = document.createElement('a') // create a link
div.appendChild(a); // the link is added in the div
leafletTopLeft.appendChild(div); // the div is added as a last the last element of leafletTopLeft element

// Clean Map button - this button removes any redundant POIs that may remain, either when an name 
//of a department is searched or the user's position is taken 
var div = document.createElement('div'); // create a div element
div.classList.add('custom'); // add the custom class on it
div.id = 'clean-map'; // set its name as clean-map
var a = document.createElement('a') // create a link
div.appendChild(a); // the link is added to the div
leafletTopLeft.appendChild(div);  // the div is added as a last the last element of leafletTopLeft element


// Geolocation Button
var geoDiv = document.createElement('div'); // create a div element
geoDiv.classList.add('custom'); // add the custom class on it
geoDiv.id = 'geolocation-button';// set its name as geolocation-button
var a = document.createElement('a') // create a link
geoDiv.appendChild(a); // the link is added to the geoDiv
leafletTopLeft.appendChild(geoDiv); 
//var geoBtn= document.querySelector('#geolocation-button');

geoEnabled = false; // shows whether the geolocation button is turned on 
geolocationGroup = L.featureGroup(); // empty feature group

// GEOLOCATION service options
var second = 1000; // 1000 miliseconds = 1 seconds
// an object with the geolocation options is created
var locationOptions = {
	watch : 	true, // continuous wathcing of location changes
	setView : true, // automatically sets the map view to the user location
	maxZoom: Infinity,
	timeout: 60*second,
	maximumAge: 60 * second, // a maximum age of one minute is taken
 	enableHighAccuracy: true // the geolocation is done with a high accuracy
}



// ##########################################################################################################################
// ADD EVENTS

// a double click event is set, which enables to a user to click on it and chooses if he/she wants to store a
// POI with its corresponding question
map.on('dblclick', function(e)
{	
	(userCoords == null ? null : userCoords.removeFrom(map)); // if a marker remained from a previous dbclick event, now it removes
	var store = L.DomUtil.create('button', 'store-point');	 // a store button is created
	var cancel = L.DomUtil.create('button', 'cancel-store'); // a cancel button is created
	// a marker is created, which represents the location that the user has clicked, and a pop up message is added to it.
	// the popup message contains an UPLOAD and CANCEL button that permit a question to be stored or cancel the process, respectively
	userCoords =  new L.marker(e.latlng, {icon : clickIcon})  
			.bindPopup("<button class ='store' style=\"width: 5em;height:2em\" onclick=\"loadForm()\">Upload</button><br><button style=\"width: 5em;height:2em\" onclick=\"cancel(userCoords)\">Cancel</button>")
			.addTo(map);
})


// when the full zoom button is clicked the zoom scale is changed to that of POI's extent
document.querySelector('#full-zoom').onclick = function()
{	
	// fit the display on UCL's POI buildings
	map.fitBounds(geojsonLayer.getBounds());
}

// when the clean map button is clicked, markers that may remain when a user searches for a department or
// the user's location is taken are removed
document.querySelector('#clean-map').onclick = function()
{
	controlSearch._markerSearch.removeFrom(map); // search markers are removed
	try
	{
		userCoords.removeFrom(map); // geolocation markers are removed
	}catch(e){console.log('No point on the map');}
}


// when the cluster is clicked the layer's bounds set to its bounding box
clusters.on('clusterclick', function (a) 
{
	a.layer.zoomToBounds();
});


// when the mouse moves, its coordinates are gained and shown in the infoCoords label
map.on('mousemove', getCoordsFun);


// when the geoDiv button is clicked
geoDiv.onclick = function()
{
	// if the geolocation is disabled
	if (!geoEnabled)
	{
		map.locate(locationOptions) // enables it
	}else
	{	
		console.log('geolocation is already enabled..');
		map.stopLocate(); // stop the geolocation
		geolocationGroup.clearLayers(); // clear the geolocationGroup
		geoEnabled = false; // change the status of the geolocation 
		geoDiv.style.background ='url(./img/geolocation.png) no-repeat 2px 2px #FFFFFF';
	}	
}

// the geojson (POI UCL) layer is gained througn AJAX request
window.addEventListener('DOMContentLoaded', function() {
	getData();
	}, false);
// the locationSuccess function is called when the user's location is gained
map.on('locationfound', locationSuccess);
// the locationError function is called when the user's location is not gained
map.on('locationerror', locationError);
