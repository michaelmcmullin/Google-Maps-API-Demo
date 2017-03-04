// This function allows the user to input a desired travel time, in
// minutes, and a travel mode, and a location - and only show the listings
// that are within that travel time (via that travel mode) of the location
function searchWithinTime(
  markers: google.maps.Marker[],
  map: google.maps.Map,
  directionsDisplay: google.maps.DirectionsRenderer
) {
  // Initialize the distance matrix service.
  var distanceMatrixService = new google.maps.DistanceMatrixService();
  var address = $('#search-within-time-text').val();

  // Check to make sure the place entered isn't blank.
  if (address === '') {
    window.alert('You must enter an address.');
  } else {
    hideMarkers(markers);
    // Use the distance matrix service to calculate the duration of the
    // routes between all our markers, and the destination address entered
    // by the user. Then put all the origins into an origin matrix.
    var origins = [];
    for (var i = 0; i < markers.length; i++) {
      origins[i] = markers[i].getPosition();
    }
    var destination = address;
    var mode: string = $('#mode').val();

    // Now that both the origins and destination are defined, get all the
    // info for the distances between them.
    distanceMatrixService.getDistanceMatrix({
        origins: origins,
        destinations: [destination],
        travelMode: getTravelMode(mode),
        unitSystem: google.maps.UnitSystem.IMPERIAL,
      }, function(response, status) {
        if (status !== google.maps.DistanceMatrixStatus.OK) {
          window.alert('Error was: ' + status);
        } else {
          displayMarkersWithinTime(response, map, markers, directionsDisplay);
        }
      }
    );
  }
}

// This function will go through each of the results, and,
// if the distance is LESS than the value in the picker, show it on the map.
function displayMarkersWithinTime(
  response: google.maps.DistanceMatrixResponse,
  map: google.maps.Map,
  markers: google.maps.Marker[],
  directionsDisplay: google.maps.DirectionsRenderer
) {
  var maxDuration = $('#max-duration').val();
  var origins = response.originAddresses;
  var destinations = response.destinationAddresses;
  // Parse through the results, and get the distance and duration of each.
  // Because there might be  multiple origins and destinations we have a nested loop
  // Then, make sure at least 1 result was found.
  var atLeastOne = false;
  for (var i = 0; i < origins.length; i++) {
    var results = response.rows[i].elements;
    for (var j = 0; j < results.length; j++) {
      var element = results[j];
      if (element.status === google.maps.DistanceMatrixElementStatus.OK) {
        // The distance is returned in feet, but the TEXT is in miles. If we wanted to switch
        // the function to show markers within a user-entered DISTANCE, we would need the
        // value for distance, but for now we only need the text.
        var distanceText = element.distance.text;

        // Duration value is given in seconds so we make it MINUTES. We need both the value
        // and the text.
        var duration = element.duration.value / 60;
        var durationText = element.duration.text;
        if (duration <= maxDuration) {
          //the origin [i] should = the markers[i]
          markers[i].setMap(map);
          atLeastOne = true;

          // Create a mini infowindow to open immediately and contain the
          // distance and duration
          var infowindow = new google.maps.InfoWindow({
              content: durationText + ' away, ' + distanceText +
                '<div><input type="button" value=\"View Route\" id=\"btn_ViewRoute_' + i + '\"></input></div>'
            }
          );
          var origin = origins[i];
          infowindow.open(map, markers[i]);
          // Put this in so that this small window closes if the user clicks
          // the marker, when the big infowindow opens
          //markers[i].infowindow = infowindow;
          //google.maps.event.addListener(markers[i], 'click', function() { this.infowindow.close(); });
          removeGetRouteInfowindow(markers[i], infowindow);
          attachGetRouteEvent($('#btn_ViewRoute_' + i)[0], map, origin, markers, directionsDisplay);
        }
      }
    }
  }
  if (!atLeastOne) { window.alert('We could not find any locations within that distance!'); }
}

// Attach a 'get route' click event to each button.
function attachGetRouteEvent(
  button,
  map: google.maps.Map,
  origin: string,
  markers: google.maps.Marker[],
  directionsDisplay: google.maps.DirectionsRenderer
) {
  google.maps.event.addDomListener(button, 'click',
      function() { displayDirections(map, origin, markers, directionsDisplay) });
}

// Attach a 'close' event to remove the 'get route' infowindow when the
// associated marker is clicked.
function removeGetRouteInfowindow(
  marker: google.maps.Marker,
  infowindow
) {
  google.maps.event.addListener(marker, 'click', function() { infowindow.close(); });
}