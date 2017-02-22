// This function is in response to the user selecting "show route" on one
// of the markers within the calculated distance. This will display the route
// on the map.
function displayDirections(origin) {
  hideMarkers(markers);
  var directionsService = new google.maps.DirectionsService();
  // Get the destination address from the user entered value.
  var destinationAddress = $('#search-within-time-text').val();
  // Get mode again from the user entered value.
  var mode = $('#mode').val();
  directionsService.route({
      // The origin is the passed in marker's position.
      origin: origin,
      // The destination is user entered address.
      destination: destinationAddress,
      travelMode: google.maps.TravelMode[mode]
    }, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        if (directionsDisplay) clearExistingDirections();
        directionsDisplay = new google.maps.DirectionsRenderer({
            map: map,
            directions: response,
            draggable: true,
            polylineOptions: {
              strokeColor: 'green'
            }
          }
        );
        populateDirectionsPanel(response);
        $('#directions-panel').show(200);
        $('#search-panel').slideUp('fast');

        directionsDisplay.addListener('directions_changed', function(){
          populateDirectionsPanel(directionsDisplay.getDirections());
        });
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    }
  );
}

// Clear the existing directions from the map so that new directions don't
// get too cluttered.
function clearExistingDirections() {
  directionsDisplay.setMap(null);
}

// Display directions in a separate panel
function populateDirectionsPanel(directions) {
  var steps = directions.routes[0].legs[0].steps;
  var distance = directions.routes[0].legs[0].distance;
  var duration = directions.routes[0].legs[0].duration;

  var text = '<strong>From:</strong> ' + directions.request.origin;
  text += '<br><strong>To:</strong> ' + directions.request.destination;
  text += '<br><strong>Total Journey:</strong> ' + distance.text;
  text += ' (about ' + duration.text + ')';
  text += '<ul class="list-group top-row-margin">';

  for (var i=0; i<steps.length; i++) {
    var stepDistance = steps[i].distance;
    var stepDuration = steps[i].duration;
    var maneuver = steps[i].maneuver;

    text += '<li class="list-group-item">' +
      '<div class="row"><div class="col-md-2">' +
      getManeuverIcon(maneuver) +
      '</div>' +
      '<div class="col-md-10">' +
      steps[i].instructions +
      '<div class="text-right"><small>Travel for ' +
      stepDistance.text +
      ' (' +
      stepDuration.text +
      ')</small></div></div></div></li>';
  }
  text += '</ul>';

  $('#directions').html(text);
}

// Function to retrieve an appropriate icon for a given maneuver
function getManeuverIcon(maneuver) {
  switch(maneuver) {
    case 'turn-left':
      return '<i class="material-icons" aria-hidden="true">arrow_back</i>';
    case 'turn-right':
      return '<i class="material-icons" aria-hidden="true">arrow_forward</i>';
    default:
      return '';
  }
}

// Remove the directions panel
function removeDirectionsPanel() {
  if (directionsDisplay) clearExistingDirections();
  $('#directions-panel').hide(200);
  searchWithinTime();
}

