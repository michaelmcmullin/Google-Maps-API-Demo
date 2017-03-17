/**
 * Handles searches of listings within a certain time distance of a given place.
 */
class TimeSearch {
  /**
   * This function allows the user to input a desired travel time, in
   * minutes, and a travel mode, and a location - and only show the listings
   * that are within that travel time (via that travel mode) of the location
   * @param markers - An array of markers for all listings.
   * @param directionsDisplay - Helps render directions on the map.
   */
  public static searchWithinTime(
    markers: MarkerWithInfoWindow[],
   ): void {
    // Initialize the distance matrix service.
    const distanceMatrixService = new google.maps.DistanceMatrixService();
    const address = $("#search-within-time-text").val();

    // Check to make sure the place entered isn't blank.
    if (address === "") {
      window.alert("You must enter an address.");
    } else {
      Utilities.hideMarkers(markers);
      DirectionsPanel.clearExistingDirections();

      // Use the distance matrix service to calculate the duration of the
      // routes between all our markers, and the destination address entered
      // by the user. Then put all the origins into an origin matrix.
      const origins = [];
      for (let i = 0; i < markers.length; i++) {
        origins[i] = markers[i].marker.getPosition();
      }
      const destination = address;
      const mode: string = $("#mode").val();

      // Now that both the origins and destination are defined, get all the
      // info for the distances between them.
      distanceMatrixService.getDistanceMatrix({
          destinations: [destination],
          origins,
          travelMode: Utilities.getTravelMode(mode),
          unitSystem: google.maps.UnitSystem.IMPERIAL,
        }, (response, status) => {
          if (status !== google.maps.DistanceMatrixStatus.OK) {
            window.alert("Error was: " + status);
          } else {
            TimeSearch.displayMarkersWithinTime(response, markers);
          }
        },
      );
    }
  }

  /**
   * This function will go through each of the results, and, if the distance is
   * LESS than the value in the picker, show it on the map.
   * @param response - The response to a DistanceMatrixService request,
   * consisting of the formatted origin and destination addresses, and a
   * sequence of DistanceMatrixResponseRows, one for each corresponding origin
   * address.
   * @param markers - An array of markers for all listings.
   * @param directionsDisplay - Helps render directions on the map.
   */
  public static displayMarkersWithinTime(
    response: google.maps.DistanceMatrixResponse,
    markers: MarkerWithInfoWindow[],
  ): void {
    const maxDuration = $("#max-duration").val();
    const origins = response.originAddresses;
    const destinations = response.destinationAddresses;
    // Parse through the results, and get the distance and duration of each.
    // Because there might be  multiple origins and destinations we have a nested loop
    // Then, make sure at least 1 result was found.
    let atLeastOne = false;
    for (let i = 0; i < origins.length; i++) {
      const results = response.rows[i].elements;
      // for (let j = 0; j < results.length; j++) {
      for (const result of results) {
        if (result.status === google.maps.DistanceMatrixElementStatus.OK) {
          // The distance is returned in feet, but the TEXT is in miles. If we wanted to switch
          // the function to show markers within a user-entered DISTANCE, we would need the
          // value for distance, but for now we only need the text.
          const distanceText = result.distance.text;

          // Duration value is given in seconds so we make it MINUTES. We need both the value
          // and the text.
          const duration = result.duration.value / 60;
          const durationText = result.duration.text;
          if (duration <= maxDuration) {
            // the origin [i] should = the markers[i]
            markers[i].marker.setMap(MarkerWithInfoWindow.map);
            atLeastOne = true;

            // Create a mini infowindow to open immediately and contain the
            // distance and duration
            if (markers[i].infowindow === null) {
              markers[i].infowindow = new google.maps.InfoWindow({
                  content: durationText + " away, " + distanceText +
                    "<div><input type=\"button\" value=\"View Route\" id=\"btn_ViewRoute_" + i + "\"></input></div>",
                },
              );
            }
            const origin = origins[i];
            markers[i].infowindow.open(MarkerWithInfoWindow.map, markers[i].marker);
            // Put this in so that this small window closes if the user clicks
            // the marker, when the big infowindow opens
            TimeSearch.removeGetRouteInfowindow(markers[i]);
            TimeSearch.attachGetRouteEvent($("#btn_ViewRoute_" + i)[0], origin, markers);
          }
        }
      }
    }
    if (!atLeastOne) { window.alert("We could not find any locations within that distance!"); }
  }

  /**
   * Attach a 'get route' click event to each button.
   * @param button - The button that triggers the 'get route' click event.
   * @param origin - The start address to calculate route from (the destination
   * is calculated from the search box value)
   * @param markers - An array of markers for all listings.
   * @param directionsDisplay - Helps render directions on the map.
   */
  public static attachGetRouteEvent(
    button: HTMLElement,
    origin: string,
    markers: MarkerWithInfoWindow[],
  ): void {
    google.maps.event.addDomListener(button, "click",
        () => { DirectionsPanel.displayDirections(origin, markers); },
    );
  }

  /**
   * Attach a 'close' event to remove the 'get route' infowindow when the
   * associated marker is clicked.
   * @param marker : The marker whose infowindow should be closed.
   */
  public static removeGetRouteInfowindow(
    marker: MarkerWithInfoWindow,
  ): void {
    google.maps.event.addListener(marker.marker, "click", () => { marker.infowindow.close(); });
  }
}
