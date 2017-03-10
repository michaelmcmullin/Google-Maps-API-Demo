// Class to handle the search panel element
class SearchPanel {
  static readonly searchButton: string = '#toggle-search';
  static readonly searchPanel: string = '#search-panel';

  static readonly searchZoomText: string = '#zoom-to-area-text';
  static readonly searchZoomButton: string = '#zoom-to-area';

  static readonly searchTimeText: string = '#search-within-time-text';
  static readonly searchTimeButton: string = '#search-within-time';

  static readonly searchPlacesText: string = '#places-search';
  static readonly searchPlacesButton: string = '#go-places';

  static Initialise(
    map: google.maps.Map,
    markers,
    placeMarkers,
    directionsDisplay
  ) {
    $(SearchPanel.searchButton).on('click', function() {
      $(SearchPanel.searchPanel).slideToggle("fast");
    });

    // This autocomplete is for use in the search within time entry box.
    var timeAutocomplete: google.maps.places.Autocomplete =
      new google.maps.places.Autocomplete(<HTMLInputElement> $(SearchPanel.searchTimeText)[0]);

    // This autocomplete is for use in the geocoder entry box.
    var zoomAutocomplete: google.maps.places.Autocomplete =
      new google.maps.places.Autocomplete(<HTMLInputElement> $(SearchPanel.searchZoomText)[0]);

    // Bias the boundaries within the map for the zoom to area text.
    zoomAutocomplete.bindTo('bounds', map);

    // Create a searchbox in order to execute a places search
    var searchBox: google.maps.places.SearchBox =
      new google.maps.places.SearchBox(<HTMLInputElement> $(SearchPanel.searchPlacesText)[0]);

    // Bias the searchbox to within the bounds of the map.
    searchBox.setBounds(map.getBounds());

    $(SearchPanel.searchZoomButton).on('click', function() {
      zoomToArea(map);
      SearchPanel.hide();
    });

    $(SearchPanel.searchTimeButton).on('click', function() {
      searchWithinTime(markers, directionsDisplay);
      SearchPanel.hide();
    });

    // Listen for the event fired when the user selects a prediction from the
    // picklist and retrieve more details for that place.
    searchBox.addListener('places_changed', function() {
      searchBoxPlaces(this, placeMarkers);
      SearchPanel.hide();
    });

    // Listen for the event fired when the user selects a prediction and clicks
    // "go" more details for that place.
    $(SearchPanel.searchPlacesButton).on('click', function() {
      textSearchPlaces(placeMarkers);
      SearchPanel.hide();
    });
  }

  // Slide the search panel down so it's visible
  static show() {
    $(SearchPanel.searchPanel).slideDown("fast")
  }

  // Slide the search panel up so it's hidden
  static hide() {
    $(SearchPanel.searchPanel).slideUp("fast")
  }
}