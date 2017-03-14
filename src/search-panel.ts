/**
 * Handles the search panel element
 */
class SearchPanel {
  /**
   * Initialise all the controls in the search panel
   * @param map - The map to use for the letious search functions.
   * @param markers - An array of markers representing the propery listings.
   * @param placeMarkers - An array of places searched for.
   * @param directionsDisplay - Helps render directions on the map
   */
  public static Initialise(
    map: google.maps.Map,
    markers: MarkerWithInfoWindow[],
    placeMarkers: PlaceMarker[],
    directionsDisplay: google.maps.DirectionsRenderer,
  ): void {
    $(SearchPanel.searchButton).on("click", () => {
      $(SearchPanel.searchPanel).slideToggle("fast");
    });

    // This autocomplete is for use in the search within time entry box.
    const timeAutocomplete: google.maps.places.Autocomplete =
      new google.maps.places.Autocomplete($(SearchPanel.searchTimeText)[0] as HTMLInputElement);

    // This autocomplete is for use in the geocoder entry box.
    const zoomAutocomplete: google.maps.places.Autocomplete =
      new google.maps.places.Autocomplete($(SearchPanel.searchZoomText)[0] as HTMLInputElement);

    // Bias the boundaries within the map for the zoom to area text.
    zoomAutocomplete.bindTo("bounds", map);

    // Create a searchbox in order to execute a places search
    const searchBox: google.maps.places.SearchBox =
      new google.maps.places.SearchBox($(SearchPanel.searchPlacesText)[0] as HTMLInputElement);

    // Bias the searchbox to within the bounds of the map.
    searchBox.setBounds(map.getBounds());

    $(SearchPanel.searchZoomButton).on("click", () => {
      ZoomSearch.zoomToArea(map);
      SearchPanel.hide();
    });

    $(SearchPanel.searchTimeButton).on("click", () => {
      TimeSearch.searchWithinTime(markers, directionsDisplay);
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
    $(SearchPanel.searchPlacesButton).on("click", () => {
      PlaceMarker.textSearchPlaces(placeMarkers);
      SearchPanel.hide();
    });
  }

  /**
   * Slide the search panel down so it's visible
   */
  public static show(): void {
    $(SearchPanel.searchPanel).slideDown("fast");
  }

  /**
   * Slide the search panel up so it's hidden
   */
  public static hide(): void {
    $(SearchPanel.searchPanel).slideUp("fast");
  }

  private static readonly searchButton: string = "#toggle-search";
  private static readonly searchPanel: string = "#search-panel";

  private static readonly searchZoomText: string = "#zoom-to-area-text";
  private static readonly searchZoomButton: string = "#zoom-to-area";

  private static readonly searchTimeText: string = "#search-within-time-text";
  private static readonly searchTimeButton: string = "#search-within-time";

  private static readonly searchPlacesText: string = "#places-search";
  private static readonly searchPlacesButton: string = "#go-places";
}
