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

class ListingMarker extends MarkerWithInfoWindow {
  static defaultIcon;
  static highlightedIcon;
  static currentMarker: google.maps.Marker = null;
  static currentInfoWindow: google.maps.InfoWindow = null;

  constructor(position, title: string) {
    super();
    this.marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: ListingMarker.defaultIcon
    });
    this.infowindow = new google.maps.InfoWindow();
    this.addMarkerEvents(this.marker, this.infowindow);
  }

  static Initialise(map: google.maps.Map) {
    ListingMarker.map = map;

    // Style the markers a bit. This will be our listing marker icon.
    ListingMarker.defaultIcon = ListingMarker.makeMarkerIcon('0091ff');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    ListingMarker.highlightedIcon = ListingMarker.makeMarkerIcon('ffff24');
  }

  // This function takes in a COLOR, and then creates a new marker
  // icon of that color. The icon will be 21 px wide by 34 high, have an origin
  // of 0, 0 and be anchored at 10, 34).
  static makeMarkerIcon(markerColor: string) {
    var markerImage = {
      url: 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor + '|40|_|%E2%80%A2',
      size: new google.maps.Size(21, 34),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(10, 34),
      scaledSize: new google.maps.Size(21,34)
    };
    return markerImage;
  }

  // Function to add events to a given marker.
  addMarkerEvents(
    marker: google.maps.Marker,
    infowindow: google.maps.InfoWindow
  ) {
    // Create an onclick event to open the large infowindow at each marker.
    this.marker.addListener('click', function() {
      removeInfoWindow();
      ListingMarker.currentMarker = marker;
      ListingMarker.currentInfoWindow = infowindow;
      ListingMarker.populateInfoWindow();
    });

    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    this.marker.addListener('mouseover', function() {
      this.setIcon(ListingMarker.highlightedIcon);
    });
    this.marker.addListener('mouseout', function() {
      this.setIcon(ListingMarker.defaultIcon);
    });
  }

  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
  static populateInfoWindow() {
    // In case the status is OK, which means the pano was found, compute the
    // position of the streetview image, then calculate the heading, then get a
    // panorama from that and set the options
    function getStreetView(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, ListingMarker.currentMarker.getPosition());
        ListingMarker.currentInfoWindow.setContent('<div>' + ListingMarker.currentMarker.getTitle() + '</div><div id="pano"></div>');
        var panoramaOptions = {
          position: nearStreetViewLocation,
          pov: {
            heading: heading,
            pitch: 30
          }
        };
        var panorama = new google.maps.StreetViewPanorama($('#pano')[0], panoramaOptions);
      } else {
        ListingMarker.currentInfoWindow.setContent('<div>' + ListingMarker.currentMarker.getTitle() + '</div><div>No Street View Found</div>');
      }
    }

    ListingMarker.currentInfoWindow.setContent('');

    // Make sure the marker property is cleared if the infowindow is closed.
    ListingMarker.currentInfoWindow.addListener('closeclick', removeInfoWindow);
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;

    // Use streetview service to get the closest streetview image within
    // 50 meters of the markers position
    streetViewService.getPanoramaByLocation(ListingMarker.currentMarker.getPosition(), radius, getStreetView);

    // Open the infowindow on the correct marker.
    ListingMarker.currentInfoWindow.open(ListingMarker.map, ListingMarker.currentMarker);
  }
}

// Remove the currently active info window.
function removeInfoWindow() {
  if (ListingMarker.currentInfoWindow !== null)
    ListingMarker.currentInfoWindow.close();
  ListingMarker.currentMarker = null;
  ListingMarker.currentInfoWindow = null;
}

// Toggle the display of available listings.
function toggleListings(
  markers: MarkerWithInfoWindow[],
  map: google.maps.Map
) {
  var listingButton = $('#toggle-listings');
  if (listingButton.hasClass('selected')) {
    listingButton.removeClass('selected');
    Utilities.hideMarkers(markers);
  } else {
    listingButton.addClass('selected');
    showListings(markers, map);
  }
}

// This function will loop through the markers array and display them all.
function showListings(
  markers: MarkerWithInfoWindow[],
  map: google.maps.Map
) {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].marker.setMap(map);
    bounds.extend(markers[i].marker.getPosition());
  }
  map.fitBounds(bounds);
}




