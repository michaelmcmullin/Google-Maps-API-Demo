
/**
 * Handles the directions panel
 */
class DirectionsPanel {
  public static Display: google.maps.DirectionsRenderer;

  /**
   * This function is in response to the user selecting "show route" on one of
   * the markers within the calculated distance. This will display the route on
   * the map.
   * @param origin - The starting address for directions
   * @param markers - An array of markers representing our listings
   */
  public static displayDirections(
    origin: string,
    markers: MarkerWithInfoWindow[],
  ): void {
    Utilities.hideMarkers(markers);
    const directionsService = new google.maps.DirectionsService();
    // Get the destination address from the user entered value.
    const destinationAddress = $(Mapping.Configuration.SEARCH_TIME_TEXTBOX).val();
    // Get mode again from the user entered value.
    const mode: string = $(Mapping.Configuration.SEARCH_TIME_MODE).val();
    directionsService.route({
        // The destination is user entered address.
        destination: destinationAddress,
        // The origin is the passed in marker's position.
        origin,
        travelMode: Utilities.getTravelMode(mode),
      }, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          if (DirectionsPanel.Display) {
            DirectionsPanel.clearExistingDirections();
          }
          DirectionsPanel.Display = new google.maps.DirectionsRenderer({
              directions: response,
              draggable: true,
              map: MarkerWithInfoWindow.map,
              polylineOptions: {
                strokeColor: "green",
              },
            },
          );
          DirectionsPanel.populateDirectionsPanel(response);
          $(Mapping.Configuration.DIRECTIONS_PANEL).show(200);
          SearchPanel.hide();

          DirectionsPanel.Display.addListener("directions_changed", () => {
            DirectionsPanel.populateDirectionsPanel(DirectionsPanel.Display.getDirections());
          });
        } else {
          window.alert("Directions request failed due to " + status);
        }
      },
    );

    $(Mapping.Configuration.DIRECTIONS_PANEL_CLOSE).on("click", () => {
      DirectionsPanel.removeDirectionsPanel(markers);
    });
  }

  /**
   * Clear the existing directions from the map so that new directions don't
   * get too cluttered.
   * @param directionsDisplay - Helps render the directions on the map
   */
  public static clearExistingDirections(): void {
    if (DirectionsPanel.Display) {
      DirectionsPanel.Display.setMap(null);
    }
  }

  /**
   * Display directions in a separate panel
   * @param directions - The directions response retrieved from the directions
   * server.
   */
  private static populateDirectionsPanel(directions: google.maps.DirectionsResult): void {
    const steps = directions.routes[0].legs[0].steps;
    const distance = directions.routes[0].legs[0].distance;
    const duration = directions.routes[0].legs[0].duration;
    const origin = directions.routes[0].legs[0].start_address;
    const destination = directions.routes[0].legs[0].end_address;

    let text = "<strong>From:</strong> " + origin;
    text += "<br><strong>To:</strong> " + destination;
    text += "<br><strong>Total Journey:</strong> " + distance.text;
    text += " (about " + duration.text + ")";
    text += "<ul class=\"list-group top-row-margin\">";

    for (const step of steps) {
      const stepDistance = step.distance;
      const stepDuration = step.duration;
      // let maneuver = step.maneuver; // maneuver is undocumented and generating warnings in TypeScript

      text += "<li class=\"list-group-item\">" +
        "<div class=\"row\"><div class=\"col-md-2\">" +
        DirectionsPanel.getManeuverIcon(step.instructions) +
        "</div>" +
        "<div class=\"col-md-10\">" +
        step.instructions +
        "<div class=\"text-right\"><small>Travel for " +
        stepDistance.text +
        " (" +
        stepDuration.text +
        ")</small></div></div></div></li>";
    }
    text += "</ul>";

    $(Mapping.Configuration.DIRECTIONS_TEXT).html(text);
  }

  /**
   * Function to retrieve an appropriate icon for a given maneuver
   * @param instructions - The text instructions for a specific directions step.
   */
  private static getManeuverIcon(instructions: string): string {
    let maneuver: string = "";

    // This is a bit of a hack to get around the lack of documented support for
    // DirectionsStep.maneuver. Not very elegant I know.
    if (instructions.indexOf("Turn <b>left</b>") > -1) {
      maneuver = "turn-left";
    } else if (instructions.indexOf("Turn <b>right</b>") > -1) {
      maneuver = "turn-right";
    }

    switch (maneuver) {
      case "turn-left":
        return "<i class=\"material-icons\" aria-hidden=\"true\">arrow_back</i>";
      case "turn-right":
        return "<i class=\"material-icons\" aria-hidden=\"true\">arrow_forward</i>";
      default:
        return "";
    }
  }

  /**
   * Remove the directions panel
   * @param directionsDisplay - Helps render the directions on the map
   * @param markers - An array of markers representing our listings
   */
  private static removeDirectionsPanel(
    markers: MarkerWithInfoWindow[],
  ): void {
    if (DirectionsPanel.Display) {
      DirectionsPanel.clearExistingDirections();
    }
    $(Mapping.Configuration.DIRECTIONS_PANEL).hide(200);
    TimeSearch.searchWithinTime(markers);
  }
}
