
/**
 * Handles the directions panel 
 */
class DirectionsPanel {
  /**
   * This function is in response to the user selecting "show route" on one of
   * the markers within the calculated distance. This will display the route on
   * the map.
   * @param origin - The starting address for directions
   * @param markers - An array of markers representing our listings 
   * @param directionsDisplay - Helps render the directions on the map 
   */
  static displayDirections(
    origin: string,
    markers: MarkerWithInfoWindow[],
    directionsDisplay: google.maps.DirectionsRenderer
  ): void {
    Utilities.hideMarkers(markers);
    var directionsService = new google.maps.DirectionsService();
    // Get the destination address from the user entered value.
    var destinationAddress = $("#search-within-time-text").val();
    // Get mode again from the user entered value.
    var mode: string = $("#mode").val();
    directionsService.route({
        // The origin is the passed in marker's position.
        origin: origin,
        // The destination is user entered address.
        destination: destinationAddress,
        travelMode: Utilities.getTravelMode(mode)
      }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          if (directionsDisplay) DirectionsPanel.clearExistingDirections(directionsDisplay);
          directionsDisplay = new google.maps.DirectionsRenderer({
              map: MarkerWithInfoWindow.map,
              directions: response,
              draggable: true,
              polylineOptions: {
                strokeColor: "green"
              }
            }
          );
          DirectionsPanel.populateDirectionsPanel(response);
          $("#directions-panel").show(200);
          SearchPanel.hide();

          directionsDisplay.addListener("directions_changed", function(){
            DirectionsPanel.populateDirectionsPanel(directionsDisplay.getDirections());
          });
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
    
    $("#directions-panel .close").on("click", function() { DirectionsPanel.removeDirectionsPanel(directionsDisplay, markers); });
  }

  /**
   * Clear the existing directions from the map so that new directions don't
   * get too cluttered.
   * @param directionsDisplay - Helps render the directions on the map
   */
  static clearExistingDirections(
    directionsDisplay: google.maps.DirectionsRenderer
  ): void {
    directionsDisplay.setMap(null);
  }

  /**
   * Display directions in a separate panel
   * @param directions - The directions response retrieved from the directions
   * server.
   */
  static populateDirectionsPanel(
    directions: google.maps.DirectionsResult
  ): void {
    var steps = directions.routes[0].legs[0].steps;
    var distance = directions.routes[0].legs[0].distance;
    var duration = directions.routes[0].legs[0].duration;
    var origin = directions.routes[0].legs[0].start_address;
    var destination = directions.routes[0].legs[0].end_address;

    var text = "<strong>From:</strong> " + origin;
    text += "<br><strong>To:</strong> " + destination;
    text += "<br><strong>Total Journey:</strong> " + distance.text;
    text += " (about " + duration.text + ")";
    text += "<ul class=\"list-group top-row-margin\">";

    for (let i=0; i<steps.length; i++) {
      var stepDistance = steps[i].distance;
      var stepDuration = steps[i].duration;
      //var maneuver = steps[i].maneuver; // maneuver is undocumented and generating warnings in TypeScript

      text += "<li class=\"list-group-item\">" +
        "<div class=\"row\"><div class=\"col-md-2\">" +
        DirectionsPanel.getManeuverIcon(steps[i].instructions) +
        "</div>" +
        "<div class=\"col-md-10\">" +
        steps[i].instructions +
        "<div class=\"text-right\"><small>Travel for " +
        stepDistance.text +
        " (" +
        stepDuration.text +
        ")</small></div></div></div></li>";
    }
    text += "</ul>";

    $("#directions").html(text);
  }

  /**
   * Function to retrieve an appropriate icon for a given maneuver
   * @param instructions - The text instructions for a specific directions step.
   */
  static getManeuverIcon(
    instructions: string
  ) : string {
    var maneuver: string = "";

    // This is a bit of a hack to get around the lack of documented support for
    // DirectionsStep.maneuver. Not very elegant I know.
    if (instructions.indexOf("Turn <b>left</b>") > -1) maneuver = "turn-left";
    else if (instructions.indexOf("Turn <b>right</b>") > -1) maneuver = "turn-right";

    switch(maneuver) {
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
  static removeDirectionsPanel(
    directionsDisplay: google.maps.DirectionsRenderer,
    markers: MarkerWithInfoWindow[]
  ): void {
    if (directionsDisplay)
      DirectionsPanel.clearExistingDirections(directionsDisplay);
    $("#directions-panel").hide(200);
    TimeSearch.searchWithinTime(markers, directionsDisplay);
  }

}