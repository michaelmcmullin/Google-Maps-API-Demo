/**
 * Add some place-specific information to the MarkerWithInfoWindow class
 */
class PlaceMarker extends MarkerWithInfoWindow {
  static activeInfoWindow: google.maps.InfoWindow;
  static currentPlace: google.maps.places.PlaceResult = null;
  static currentPhoto: number = 0;

  /**
   * Sets the infowindow associated with this PlaceMarker as the currently
   * active infowindow.
   */
  setAsActiveInfoWindow() : void {
    if (PlaceMarker.activeInfoWindow) {
      PlaceMarker.activeInfoWindow.close();
    }
    PlaceMarker.currentPhoto = 0;
    PlaceMarker.activeInfoWindow = this.infowindow;
  }

  /**
   * Fires when the user selects a searchbox picklist item. It will do a nearby
   * search using the selected query string or place.
   * @param searchBox - A service to provide query predictions based on a user's
   * text input.
   * @param placeMarkers - An array of places searched for.
   */
  static searchBoxPlaces(
    searchBox: google.maps.places.SearchBox,
    placeMarkers: PlaceMarker[]
  ) : void {
    hideMarkers(placeMarkers);
    var places = searchBox.getPlaces();
    if (places.length === 0) {
      window.alert('We did not find any places matching that search!');
    } else {
      // For each place, get the icon, name and location.
      PlaceMarker.createMarkersForPlaces(places, placeMarkers);
    }
  }

  /**
   * This function fires when the user select "go" on the places search. It will
   * do a nearby search using the entered query string or place.
   * @param placeMarkers - An array of place result markers.
   */
  static textSearchPlaces(
    placeMarkers: PlaceMarker[]
  ) : void {
    var bounds = MarkerWithInfoWindow.map.getBounds();
    hideMarkers(placeMarkers);
    var placesService = new google.maps.places.PlacesService(MarkerWithInfoWindow.map);
    placesService.textSearch({
        query: $('#places-search').val(),
        bounds: bounds
      }, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          PlaceMarker.createMarkersForPlaces(results, placeMarkers);
        }
      }
    );
  }

  /**
   * This function creates markers for each place found in either places search.
   * @param places - An array of information about place results.
   * @param placeMarkers - An array of place result markers.
   */
  static createMarkersForPlaces(
    places: google.maps.places.PlaceResult[],
    placeMarkers: PlaceMarker[]
  ) : void {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < places.length; i++) {
      var place = places[i];
      var icon = {
        url: place.icon,
        size: new google.maps.Size(35, 35),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(15, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
      // Create a marker for each place.
      var marker = new google.maps.Marker({
          map: MarkerWithInfoWindow.map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }
      );

      // Create a single infowindow to be used with the place details information
      // so that only one is open at once.
      var placeInfoWindow = new google.maps.InfoWindow();

      var placeMarker: PlaceMarker = new PlaceMarker();
      placeMarker.marker = marker;
      placeMarker.infowindow = placeInfoWindow;

      PlaceMarker.addPlaceMarkerEvents(placeMarker, place.place_id);
      placeMarkers.push(placeMarker);
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    }
    MarkerWithInfoWindow.map.fitBounds(bounds);
  }

  /**
   * Function to add an event to a place marker.
   * @param placeMarker - The place marker to add a click event to.
   * @param place_id - Unique ID of the place to add a click event to.
   */
  static addPlaceMarkerEvents(
    placeMarker: PlaceMarker,
    place_id: string
  ) : void {
    // If a marker is clicked, do a place details search on it in the next function.
    placeMarker.marker.addListener('click', function() {
        PlaceMarker.getPlacesDetails(placeMarker, place_id);
      }
    );
  }

  /**
   * This is the PLACE DETAILS search - it's the most detailed so it's only
   * executed when a marker is selected, indicating the user wants more
   * details about that place.
   * @param placeMarker - The place marker the user has clicked.
   * @param place_id - Unique ID of the place get details for.
   */
  static getPlacesDetails(
    placeMarker: PlaceMarker,
    place_id: string
  ) : void {
    var service = new google.maps.places.PlacesService(MarkerWithInfoWindow.map);
    service.getDetails({
        placeId: place_id
      }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          placeMarker.setAsActiveInfoWindow();

          // Set the marker property on this infowindow so it isn't created again.
          //infowindow.marker = marker;
          var innerHTML = '<div>';
          if (place.name) {
            innerHTML += '<strong>' + place.name + '</strong>';
          }
          if (place.formatted_address) {
            innerHTML += '<br>' + place.formatted_address;
          }
          if (place.formatted_phone_number) {
            innerHTML += '<br>' + place.formatted_phone_number;
          }
          if (place.opening_hours) {
            innerHTML += '<br><br><strong>Hours:</strong><br>' +
              place.opening_hours.weekday_text[0] + '<br>' +
              place.opening_hours.weekday_text[1] + '<br>' +
              place.opening_hours.weekday_text[2] + '<br>' +
              place.opening_hours.weekday_text[3] + '<br>' +
              place.opening_hours.weekday_text[4] + '<br>' +
              place.opening_hours.weekday_text[5] + '<br>' +
              place.opening_hours.weekday_text[6];
          }
          if (place.photos) {
            innerHTML += '<br><br><img id="' + place.place_id + '_photo" src="' + place.photos[0].getUrl(
              {maxHeight: 100, maxWidth: 200}) + '">';
            if (place.photos.length > 1)
            {
              innerHTML += '<br>';
              innerHTML += place.photos.length + ' photos: ';
              innerHTML += '<a onclick="PlaceMarker.previousPhoto()">Prev</a> ';
              innerHTML += '<a onclick="PlaceMarker.nextPhoto()">Next</a>';           
            }
          }
          innerHTML += '</div>';
          PlaceMarker.activeInfoWindow.setContent(innerHTML);
          PlaceMarker.currentPlace = place;
          PlaceMarker.activeInfoWindow.open(MarkerWithInfoWindow.map, placeMarker.marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          PlaceMarker.activeInfoWindow.addListener('closeclick', function() {
            placeMarker.marker = null;
            PlaceMarker.activeInfoWindow = null;
            PlaceMarker.currentPlace = null;
            PlaceMarker.currentPhoto = 0;
          });
        }
      }
    );
  }

  /**
   * If a place infowindow has photos available, this method fetches the next
   * one if there are multiple photos.
   */
  static nextPhoto() : void {
    if (PlaceMarker.currentPlace) {
      var totalPhotos = PlaceMarker.currentPlace.photos.length;
      var next = PlaceMarker.currentPhoto + 1;
      if (next >= totalPhotos) next = 0;
      
      $('#' + PlaceMarker.currentPlace.place_id + '_photo').attr(
        'src',
        PlaceMarker.currentPlace.photos[next].getUrl({maxHeight: 100, maxWidth: 200})
      );
          
      PlaceMarker.currentPhoto = next;
    }
  }

  /**
   * If a place infowindow has photos available, this method fetches the
   * previous one if there are multiple photos.
   */
  static previousPhoto() : void {
    if (PlaceMarker.currentPlace) {
      var totalPhotos = PlaceMarker.currentPlace.photos.length;
      var next = PlaceMarker.currentPhoto - 1;
      if (next < 0) next = totalPhotos - 1;
      
      $('#' + PlaceMarker.currentPlace.place_id + '_photo').attr(
        'src',
        PlaceMarker.currentPlace.photos[next].getUrl({maxHeight: 100, maxWidth: 200})
      );
          
      PlaceMarker.currentPhoto = next;
    }
  }
}