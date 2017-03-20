/**
 * Handles the search panel element
 */
class SearchPanel {
  /**
   * Initialise all the controls in the search panel
   * @param map - The map to use for the various search functions.
   * @param markers - An array of markers representing the property listings.
   * @param placeMarkers - An array of places searched for.
   * @param directionsDisplay - Helps render directions on the map
   */
  public static Initialise(
    map: google.maps.Map,
    markers: MarkerWithInfoWindow[],
    placeMarkers: PlaceMarker[],
  ): void {
    $(Mapping.Configuration.TOGGLE_SEARCH).on("click", () => {
      $(Mapping.Configuration.SEARCH_PANEL).slideToggle("fast");
    });

    // This autocomplete is for use in the search within time entry box.
    const timeAutocomplete: google.maps.places.Autocomplete =
      new google.maps.places.Autocomplete($(Mapping.Configuration.SEARCH_TIME_TEXTBOX)[0] as HTMLInputElement);

    // This autocomplete is for use in the geocoder entry box.
    const zoomAutocomplete: google.maps.places.Autocomplete =
      new google.maps.places.Autocomplete($(Mapping.Configuration.SEARCH_ZOOM_TEXT)[0] as HTMLInputElement);

    // Bias the boundaries within the map for the zoom to area text.
    zoomAutocomplete.bindTo("bounds", map);

    // Create a searchbox in order to execute a places search
    const searchBox: google.maps.places.SearchBox =
      new google.maps.places.SearchBox($(Mapping.Configuration.SEARCH_PLACES_TEXT)[0] as HTMLInputElement);

    // Bias the searchbox to within the bounds of the map.
    searchBox.setBounds(map.getBounds());

    $(Mapping.Configuration.SEARCH_ZOOM_BUTTON).on("click", () => {
      ZoomSearch.zoomToArea(map);
      SearchPanel.hide();
    });

    $(Mapping.Configuration.SEARCH_TIME_BUTTON).on("click", () => {
      TimeSearch.searchWithinTime(markers);
      SearchPanel.hide();
    });

    // Listen for the event fired when the user selects a prediction from the
    // picklist and retrieve more details for that place.
    searchBox.addListener("places_changed", () => {
      PlaceMarker.searchBoxPlaces(searchBox, placeMarkers);
      SearchPanel.hide();
    });

    // Listen for the event fired when the user selects a prediction and clicks
    // "go" more details for that place.
    $(Mapping.Configuration.SEARCH_PLACES_BUTTON).on("click", () => {
      PlaceMarker.textSearchPlaces(placeMarkers);
      SearchPanel.hide();
    });
  }

  /**
   * Slide the search panel down so it's visible
   */
  public static show(): void {
    $(Mapping.Configuration.SEARCH_PANEL).slideDown("fast");
  }

  /**
   * Slide the search panel up so it's hidden
   */
  public static hide(): void {
    $(Mapping.Configuration.SEARCH_PANEL).slideUp("fast");
  }
}
