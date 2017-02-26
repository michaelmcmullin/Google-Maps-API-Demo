// These are the real estate listings that will be shown to the user.
// Normally we'd have these in a database instead.
var locations = [
  {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
  {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
  {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
  {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
  {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
  {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];


// Function to add events to a given marker.
function addMarkerEvents(marker, infoWindow, defaultIcon, highlightedIcon) {
  // Create an onclick event to open the large infowindow at each marker.
  marker.addListener('click', function() {
    populateInfoWindow(this, infoWindow);
  });

  // Two event listeners - one for mouseover, one for mouseout,
  // to change the colors back and forth.
  marker.addListener('mouseover', function() {
    this.setIcon(highlightedIcon);
  });
  marker.addListener('mouseout', function() {
    this.setIcon(defaultIcon);
  });
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {

  // In case the status is OK, which means the pano was found, compute the
  // position of the streetview image, then calculate the heading, then get a
  // panorama from that and set the options
  function getStreetView(data, status) {
    if (status == google.maps.StreetViewStatus.OK) {
      var nearStreetViewLocation = data.location.latLng;
      var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
      infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
      var panoramaOptions = {
        position: nearStreetViewLocation,
        pov: {
          heading: heading,
          pitch: 30
        }
      };
      var panorama = new google.maps.StreetViewPanorama($('#pano')[0], panoramaOptions);
    } else {
      infowindow.setContent('<div>' + marker.title + '</div><div>No Street View Found</div>');
    }
  }

// Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    // Clear the infowindow content to give the streetview time to load.
    infowindow.setContent('');
    infowindow.marker = marker;

    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;

    // Use streetview service to get the closest streetview image within
    // 50 meters of the markers position
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);

    // Open the infowindow on the correct marker.
    infowindow.open(map, marker);
  }
}

// Toggle the display of available listings.
function toggleListings(markers) {
  var listingButton = $('#toggle-listings');
  if (listingButton.hasClass('selected')) {
    listingButton.removeClass('selected');
    hideMarkers(markers);
  } else {
    listingButton.addClass('selected');
    showListings(markers);
  }
}

// This function will loop through the markers array and display them all.
function showListings(markers) {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}

// This function will loop through the listings and hide them all.
function hideMarkers(markers) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
  var markerImage = {
    url: 'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor + '|40|_|%E2%80%A2',
    size: new google.maps.Size(21, 34),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(10, 34),
    scaledSize: new google.maps.Size(21,34)
  };
  return markerImage;
}
