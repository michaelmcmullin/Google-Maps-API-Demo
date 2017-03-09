// Main entry point
function initMap() {
  // From globals:
  var map: google.maps.Map;

  // Create a new blank array for all the listing markers.
  var markers: MarkerWithInfoWindow[] = [];

  // Create placemarkers array to use in multiple functions to have control
  // over the number of places that show.
  var placeMarkers: PlaceMarker[] = [];

  // Route layers
  var directionsDisplay: google.maps.DirectionsRenderer = null;
  
  // End Globals


  var styledMapType = new google.maps.StyledMapType(
    styles,
    {name: 'Mono'}
  );

  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map($('#map')[0], {
      center: {lat: 40.7413549, lng: -73.9980244},
      zoom: 13,
      mapTypeControlOptions: {
        //style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        position: google.maps.ControlPosition.TOP_RIGHT,
        mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'mono']
      }
  });
  map.mapTypes.set('mono', styledMapType);
  map.setMapTypeId('mono');
  MarkerWithInfoWindow.map = map;
  TransportLayers.Initialise(map);
  DrawingTools.Initialise(map, markers);

  //$('#directions-panel .close').on('click', function() { removeDirectionsPanel(directionsDisplay, markers, map); });
  
  $('#toggle-search').on('click', function() {
    $('#search-panel').slideToggle("fast");
  });

  // This autocomplete is for use in the search within time entry box.
  var timeAutocomplete = new google.maps.places.Autocomplete(<HTMLInputElement> $('#search-within-time-text')[0]);

  // This autocomplete is for use in the geocoder entry box.
  var zoomAutocomplete = new google.maps.places.Autocomplete(<HTMLInputElement> $('#zoom-to-area-text')[0]);

  // Bias the boundaries within the map for the zoom to area text.
  zoomAutocomplete.bindTo('bounds', map);

  // Create a searchbox in order to execute a places search
  var searchBox = new google.maps.places.SearchBox(<HTMLInputElement> $('#places-search')[0]);

  // Bias the searchbox to within the bounds of the map.
  searchBox.setBounds(map.getBounds());

  var largeInfowindow: google.maps.InfoWindow = new google.maps.InfoWindow();
  var largeInfowindowMarker: google.maps.Marker = null;

  // Initialize the drawing manager.
  //var drawingManager: google.maps.drawing.DrawingManager = new google.maps.drawing.DrawingManager({
  //    drawingMode: google.maps.drawing.OverlayType.POLYGON,
  //    drawingControl: false
  //});

  // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = makeMarkerIcon('0091ff');

  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = makeMarkerIcon('ffff24');

  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;

    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon
      // id: i
    });

    // Push the marker to our array of markers.
    var mwinfowin: MarkerWithInfoWindow = new MarkerWithInfoWindow();
    mwinfowin.marker = marker;
    markers.push(mwinfowin);

    // Create an onclick, mouseover and mouseout events to open the large
    // infowindow at each marker.
    addMarkerEvents(map, marker, largeInfowindow, largeInfowindowMarker, defaultIcon, highlightedIcon);
  }

  $('#toggle-listings').on('click', function() {
    toggleListings(markers, map);
  });
 
  $('#about-button').on('click', function() {
    $('#about-modal').show();
  });
  $('#about-modal .close').on('click', function() {
    $('#about-modal').fadeOut();
  });
 

  $('#zoom-to-area').on('click', function(){ zoomToArea(map); });
  $('#search-within-time').on('click', function(){ searchWithinTime(markers, directionsDisplay); });

  // Listen for the event fired when the user selects a prediction from the
  // picklist and retrieve more details for that place.
  searchBox.addListener('places_changed', function() {
    searchBoxPlaces(this, placeMarkers);
  });

  // Listen for the event fired when the user selects a prediction and clicks
  // "go" more details for that place.
  $('#go-places').on('click', function(){ textSearchPlaces(placeMarkers); });

}
