// Main entry point
function initMap() {
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

  // Set up traffic layers
  trafficLayer = new google.maps.TrafficLayer();
  transitLayer = new google.maps.TransitLayer();
  bikeLayer = new google.maps.BicyclingLayer();

  trafficLayer.setMap(null);
  transitLayer.setMap(null);
  bikeLayer.setMap(null);
  $('#toggle-traffic').on('click', toggleTraffic);
  $('#toggle-transit').on('click', toggleTransit);
  $('#toggle-bicycling').on('click', toggleBicycling);

  $('#directions-panel .close').on('click', removeDirectionsPanel);
  
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

  var largeInfowindow = new google.maps.InfoWindow();

  // Initialize the drawing manager.
  var drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: false
  });

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
    markers.push(marker);

    // Create an onclick, mouseover and mouseout events to open the large
    // infowindow at each marker.
    addMarkerEvents(marker, largeInfowindow, defaultIcon, highlightedIcon);
  }

  $('#toggle-listings').on('click', function() {
    toggleListings(markers);
  });

  $('#hand-tool').on('click', function() {
    disableDrawing(drawingManager);
  });

  $('#toggle-drawing-polygon').on('click', function() {
    toggleDrawing(drawingManager, google.maps.drawing.OverlayType.POLYGON, $(this));
  });
  $('#toggle-drawing-rectangle').on('click', function() {
    toggleDrawing(drawingManager, google.maps.drawing.OverlayType.RECTANGLE, $(this));
  });
  $('#toggle-drawing-circle').on('click', function() {
    toggleDrawing(drawingManager, google.maps.drawing.OverlayType.CIRCLE, $(this));
  });
  
  $('#about-button').on('click', function() {
    $('#about-modal').show();
  });
  $('#about-modal .close').on('click', function() {
    $('#about-modal').fadeOut();
  });
 

  $('#zoom-to-area').on('click', zoomToArea);
  $('#search-within-time').on('click', searchWithinTime);

  // Listen for the event fired when the user selects a prediction from the
  // picklist and retrieve more details for that place.
  searchBox.addListener('places_changed', function() {
    searchBoxPlaces(this);
  });

  // Listen for the event fired when the user selects a prediction and clicks
  // "go" more details for that place.
  $('#go-places').on('click', textSearchPlaces);

  // Add an event listener so that the polygon is captured,  call the
  // searchWithinPolygon function. This will show the markers in the polygon,
  // and hide any outside of it.
  drawingManager.addListener('overlaycomplete', function(event) {
    // First, check if there is an existing polygon.
    // If there is, get rid of it and remove the markers
    if (polygon) {
      polygon.setMap(null);
      hideMarkers(markers);
    }

    // Switching the drawing mode to the HAND (i.e., no longer drawing).
    //drawingManager.setDrawingMode(null);

    // Creating a new editable polygon from the overlay.
    polygon = event.overlay;
    //polygon.setEditable(true);

    // Searching within the polygon.
    searchWithinPolygon(polygon, drawingManager);

    // Make sure the search is re-done if the poly is changed (only relevant if editable).
    //polygon.getPath().addListener('set_at', searchWithinPolygon);
    //polygon.getPath().addListener('insert_at', searchWithinPolygon);
  });
}