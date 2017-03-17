/**
 * A special case of MarkerWithInfoWindow, for dealing with the property
 * listings themselves.
 */
class ListingMarker extends MarkerWithInfoWindow {
  public static defaultIcon;
  public static highlightedIcon;
  public static currentMarker: google.maps.Marker = null;
  public static currentInfoWindow: google.maps.InfoWindow = null;

  /**
   * Initialise static members of the ListingMarker class.
   * @param map - The map to use for displaying the listings
   */
  public static Initialise(map: google.maps.Map) {
    ListingMarker.map = map;

    // Style the markers a bit. This will be our listing marker icon.
    ListingMarker.defaultIcon = ListingMarker.makeMarkerIcon("0091ff");

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    ListingMarker.highlightedIcon = ListingMarker.makeMarkerIcon("ffff24");
  }

  /**
   * Remove the currently active info window.
   */
  public static removeInfoWindow() {
    if (ListingMarker.currentInfoWindow !== null) {
      ListingMarker.currentInfoWindow.close();
    }
    ListingMarker.currentMarker = null;
    ListingMarker.currentInfoWindow = null;
  }

  /**
   * Toggle the display of available listings.
   * @param markers - An array of markers representing the property listings.
   * @param map - The map to use for displaying the listings.
   */
  public static toggleListings(
    markers: MarkerWithInfoWindow[],
    map: google.maps.Map,
  ) {
    const listingButton = $("#toggle-listings");
    if (listingButton.hasClass("selected")) {
      listingButton.removeClass("selected");
      Utilities.hideMarkers(markers);
    } else {
      listingButton.addClass("selected");
      ListingMarker.showListings(markers, map);
    }
  }

  /**
   * Loops through the markers array and display them all.
   * @param markers - An array of markers representing the property listings.
   * @param map - The map to use for displaying the listings.
   */
  public static showListings(
    markers: MarkerWithInfoWindow[],
    map: google.maps.Map,
  ) {
    const bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (const marker of markers) {
      marker.marker.setMap(map);
      bounds.extend(marker.marker.getPosition());
    }
    map.fitBounds(bounds);
  }

  /** Given a color in hex (e.g. "3342ac"), creates a new marker icon of that
   * color. The icon will be 21 px wide by 34 high, have an origin of 0, 0
   * and be anchored at 10, 34).
   * @param markerColor - A hex string of the required marker color.
   */
  private static makeMarkerIcon(markerColor: string) {
    const markerImage = {
      anchor: new google.maps.Point(10, 34),
      origin: new google.maps.Point(0, 0),
      scaledSize: new google.maps.Size(21, 34),
      size: new google.maps.Size(21, 34),
      url: "https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|" + markerColor + "|40|_|%E2%80%A2",
    };
    return markerImage;
  }

  /**
   * Populate the infowindow when the marker is clicked. We'll only allow one
   * infowindow which will open at the marker that is clicked, and populate
   * based on that markers position.
   */
  private static populateInfoWindow() {
    // In case the status is OK, which means the pano was found, compute the
    // position of the streetview image, then calculate the heading, then get a
    // panorama from that and set the options
    function getStreetView(data, status) {
      if (status === google.maps.StreetViewStatus.OK) {
        const nearStreetViewLocation = data.location.latLng;
        const heading = google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, ListingMarker.currentMarker.getPosition());
        ListingMarker.currentInfoWindow.setContent(
          "<div>" + ListingMarker.currentMarker.getTitle() + "</div><div id=\"pano\"></div>");
        const panoramaOptions = {
          position: nearStreetViewLocation,
          pov: {
            heading,
            pitch: 30,
          },
        };
        const panorama = new google.maps.StreetViewPanorama($("#pano")[0], panoramaOptions);
      } else {
        ListingMarker.currentInfoWindow.setContent(
          "<div>" + ListingMarker.currentMarker.getTitle() + "</div><div>No Street View Found</div>");
      }
    }

    ListingMarker.currentInfoWindow.setContent("");

    // Make sure the marker property is cleared if the infowindow is closed.
    ListingMarker.currentInfoWindow.addListener("closeclick", ListingMarker.removeInfoWindow);
    const streetViewService = new google.maps.StreetViewService();
    const radius = 50;

    // Use streetview service to get the closest streetview image within
    // 50 meters of the markers position
    streetViewService.getPanoramaByLocation(ListingMarker.currentMarker.getPosition(), radius, getStreetView);

    // Open the infowindow on the correct marker.
    ListingMarker.currentInfoWindow.open(ListingMarker.map, ListingMarker.currentMarker);
  }

  /**
   * Initialise an instance of a listing marker.
   * @param position - A lat/long location of the marker.
   * @param title - The title associated with this listing marker.
   */
  constructor(position, title: string) {
    super();
    this.marker = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      icon: ListingMarker.defaultIcon,
      position,
      title,
    });
    this.infowindow = new google.maps.InfoWindow();
    this.addMarkerEvents(this.marker, this.infowindow);
  }

  /**
   * Add mouse events to a given marker.
   * @param marker - The marker to add mouse events to.
   * @param infowindow - The infowindow associated with the marker.
   */
  private addMarkerEvents(
    marker: google.maps.Marker,
    infowindow: google.maps.InfoWindow,
  ) {
    // Create an onclick event to open the large infowindow at each marker.
    this.marker.addListener("click", () => {
      ListingMarker.removeInfoWindow();
      ListingMarker.currentMarker = marker;
      ListingMarker.currentInfoWindow = infowindow;
      ListingMarker.populateInfoWindow();
    });

    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    this.marker.addListener("mouseover", () => {
      this.marker.setIcon(ListingMarker.highlightedIcon);
    });
    this.marker.addListener("mouseout", () => {
      this.marker.setIcon(ListingMarker.defaultIcon);
    });
  }
}
