var client,geojsonLayer,json,layerGroup,clusters,departmentIcon,controlSearch,dbRequest; 

// create the code to get the departments POIs using an XMLHttpRequest 
getData = function() 
{
	// AJAX request
	client = new XMLHttpRequest();

	client.open('GET','http://developer.cege.ucl.ac.uk:30277/postgis');
	client.onreadystatechange = dataResponse; 
	client.send();  // send a request
}

// create the code to wait for the response from the data server, and process the response once it is
dataResponse = function()
{
	 // this function listens out for the server to say that the data is ready - i.e. has state 4
	 if (client.readyState == 4) 
	 {
		 // once the data is ready, process the data
		 var data = client.responseText;
		 loadDataLayer(data);
	 }
}


// convert the received data - which is text - to JSON format and add it to the map
loadDataLayer = function(data) 
{
 	// convert the text to JSON
	json = JSON.parse(data);

		/*
	This function defines how GEOJSON points spawn leaflet layers
	Output:
	marker: returns how the geojson layer will be shown
	*/
	pointToLayerFun = function(geoJsonLayer,latlng)
	{
			// returns a marker that has the specified icon that was created above
			return L.marker(latlng, {icon : departmentIcon});
	}
	/*
	Based on a user mouse movements (mouse over), this function update the information that is shown in the 
	bottom left corner of the up
	Inputs:
	e: the mouse event

	Output:
	none
	*/
	showInfo = function(e)
	{
		var layer  = e.target;
		infoDepartments.update(layer.feature.properties, layer);
	}
	/*
	Based on a user mouse movements (mouse out), this function update the informationrmation that is shown in the 
	bottom left corner of the up
	Inputs:
	e: the mouse event

	Output:
	none
	*/
	removeInfo = function(e)
	{
		infoDepartments.update();
	}
	/*
	A function that will be called once for each created Feature, after it has been created and styled
	Input:
	feature: by default is loaded in leaflet
	layer: by default is loaded in leaflet

	Output:
	none
	*/
	onEachFeatureFun = function(feature,layer){
			// bind pop up on the ucl poi
			var coords = layer.getLatLng();
			layer.bindPopup('<h4 style="border-bottom:solid black 1px">Information</h4><i><b>Name:</b> </i>' + feature.properties.depname + '<br><i><b>Founded: </b></i>' + feature.properties.correct + '<br><b>Latitude: </b>' + coords.lat + '&#176'+ '<br><b>Longitude: </b>' + coords.lng+ '&#176');
			layer.on(
			{	
				// events
				mouseover : showInfo,
				mouseout : removeInfo
			});
	}

	// create the geojson file
	geojsonLayer = L.geoJson(json ,
		{
			pointToLayer : pointToLayerFun,
			onEachFeature : onEachFeatureFun
		});

	// create a layerGroup that will contain all the layers
	layerGroup = L.featureGroup();
	// add the markers to the layerGroup
	layerGroup.addLayer(clusters.addLayer(geojsonLayer))

	var searchLayers=L.layerGroup();
	searchLayers.addLayer(geojsonLayer);
	controlSearch = new L.Control.Search(
	{
		layer: searchLayers,
		propertyName: 'depname',
		position: 'topleft',
		marker: {								//custom L.Marker or false for hide
					icon: departmentIcon,		//custom L.Icon for maker location or false for hide
					animate: true,				//animate a circle over location found
					circle: {					//draw a circle in location found
						radius: 10,
						color: '#E21616', 
						dashArray: '3',
						fillColor: '#D03E3E'
					}
				}
	});
	map.addControl(controlSearch); // the control search is added on the map	
	map.removeLayer(searchLayers); // the searchLayers is removed from the map



	 // change the map zoom so that all the data is show
	 map.addLayer(layerGroup);
	 map.fitBounds(layerGroup.getBounds());
}


// Data is loaded to the Db
console.log('questionPost script is called....');

/*
This function gets the values of a form and through an XMLHttp request (POST) that is called, posts these values in the database
The database is then updated with this information
*/
function dbImport()
{	
	// Form's variables
	var depname = document.querySelector('#depname').value;
	var question = document.querySelector('#question').value;
	var firstAns = document.querySelector('#firstanswer').value;
	var secondAns = document.querySelector('#secondanswer').value;
	var thirdAns = document.querySelector('#thirdanswer').value;
	var forthAns = document.querySelector('#forthanswer').value;
	var correct = document.querySelector('#correctanswer').value;
	var lat = userCoords.getLatLng().lat; // latitude
	var lng = userCoords.getLatLng().lng; // longitude
	// some checks are done between the given values
	try
	{
		// each value is checked if its empty or not specidied
		[depname,question,firstAns,secondAns,thirdAns,forthAns,correct].forEach(function(item)
		{
	 		if(item == null || item =='') 
			{
				throw 'Parameter(s) is/are  null.. Fill all the values'
			}
		});	
		// the correct variable must be identical with one of the given answers
		if(correct != firstAns && correct != secondAns && thirdAns != correct && correct !=forthAns)
		throw 'Correct answer does not match with the inserted answers.'

	// the postString request is constructed
	var postString = "depname=" + depname +"&question=" + question + "&firstAns=" + firstAns + "&secondAns=" + secondAns + "&thirdAns=" + thirdAns + "&forthAns=" + forthAns + "&correct=" + correct + "&lat=" + lat + "&lng="+lng;
	// the request is made
	makeRequest(postString); 
	
	}catch(e)
	{
		// whenever an error is gained, a div element changes and shows the error
		document.querySelector('#response').innerHTML = e;	
	}

}
/*
THe XMLHttp request is made by this function
*/
function makeRequest(postString)
{
 	console.log('XMLHttp request -- questionPost.js - line 20'); // message
	dbRequest = new XMLHttpRequest(); // create an http object
	// defines the method of the request and at which server the request will be done
	dbRequest.open('POST', "http://developer.cege.ucl.ac.uk:30277/insertDb",true); 
	dbRequest.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	// the data Submit function is called
	dbRequest.onreadystatechange = dataSubmit;
	dbRequest.send(postString); // make the request and a server-side code is executed at the back-end.
}

function dataSubmit()
{
	if(dbRequest.readyState == 4)
	{
		mapObj.classList.toggle('fleft'); // enable map display
		formObj.classList.toggle('fleft'); // disable form display
		formObj.classList.toggle('noDisplay');
		console.log('data are uploaded - questionsPost.js - line 32');
		
	}
}


