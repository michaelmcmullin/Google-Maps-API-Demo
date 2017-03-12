class ZoomSearch {
  // This function takes the input value in the find nearby area text input
  // locates it, and then zooms into that area. This is so that the user can
  // show all listings, then decide to focus on one area of the map.
  static zoomToArea(map: google.maps.Map) {
    // Initialize the geocoder.
    var geocoder = new google.maps.Geocoder();

    // Get the address or place that the user entered.
    var address = $('#zoom-to-area-text').val();

    // Make sure the address isn't blank.
    if (address === '') {
      window.alert('You must enter an area, or address.');
    } else {
      // Geocode the address/area entered to get the center. Then, center the map
      // on it and zoom in
      geocoder.geocode({
          address: address,
          componentRestrictions: {locality: 'New York'}
        }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            map.setZoom(15);
          } else {
            window.alert('We could not find that location - try entering a more specific place.');
          }
        }
      );
    }
  }
}