function getTravelMode(mode) {
    switch (mode.toUpperCase()) {
        case 'DRIVING':
            return google.maps.TravelMode.DRIVING;
        case 'BICYCLING':
            return google.maps.TravelMode.BICYCLING;
        case 'TRANSIT':
            return google.maps.TravelMode.TRANSIT;
        case 'WALKING':
            return google.maps.TravelMode.WALKING;
    }
}
var map;
var markers = [];
var polygon = null;
var currentDrawingTool = null;
var placeMarkers = [];
var trafficLayer = null;
var transitLayer = null;
var bikeLayer = null;
var directionsDisplay = null;
var currentPlace = null;
var currentPhoto = 0;
var styles = [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#444444"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "lightness": -10
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#5cb85c"
            },
            {
                "visibility": "on"
            },
            {
                "lightness": 50
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#91dcfa"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#337ab7"
            }
        ]
    }
];
function initMap() {
    var styledMapType = new google.maps.StyledMapType(styles, { name: 'Mono' });
    map = new google.maps.Map($('#map')[0], {
        center: { lat: 40.7413549, lng: -73.9980244 },
        zoom: 13,
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT,
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'mono']
        }
    });
    map.mapTypes.set('mono', styledMapType);
    map.setMapTypeId('mono');
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
    $('#toggle-search').on('click', function () {
        $('#search-panel').slideToggle("fast");
    });
    var timeAutocomplete = new google.maps.places.Autocomplete($('#search-within-time-text')[0]);
    var zoomAutocomplete = new google.maps.places.Autocomplete($('#zoom-to-area-text')[0]);
    zoomAutocomplete.bindTo('bounds', map);
    var searchBox = new google.maps.places.SearchBox($('#places-search')[0]);
    searchBox.setBounds(map.getBounds());
    var largeInfowindow = new google.maps.InfoWindow();
    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: false
    });
    var defaultIcon = makeMarkerIcon('0091ff');
    var highlightedIcon = makeMarkerIcon('ffff24');
    for (var i = 0; i < locations.length; i++) {
        var position = locations[i].location;
        var title = locations[i].title;
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon
        });
        markers.push(marker);
        addMarkerEvents(marker, largeInfowindow, defaultIcon, highlightedIcon);
    }
    $('#toggle-listings').on('click', function () {
        toggleListings(markers);
    });
    $('#hand-tool').on('click', function () {
        disableDrawing(drawingManager);
    });
    $('#toggle-drawing-polygon').on('click', function () {
        toggleDrawing(drawingManager, google.maps.drawing.OverlayType.POLYGON, $(this));
    });
    $('#toggle-drawing-rectangle').on('click', function () {
        toggleDrawing(drawingManager, google.maps.drawing.OverlayType.RECTANGLE, $(this));
    });
    $('#toggle-drawing-circle').on('click', function () {
        toggleDrawing(drawingManager, google.maps.drawing.OverlayType.CIRCLE, $(this));
    });
    $('#about-button').on('click', function () {
        $('#about-modal').show();
    });
    $('#about-modal .close').on('click', function () {
        $('#about-modal').fadeOut();
    });
    $('#zoom-to-area').on('click', zoomToArea);
    $('#search-within-time').on('click', searchWithinTime);
    searchBox.addListener('places_changed', function () {
        searchBoxPlaces(this);
    });
    $('#go-places').on('click', textSearchPlaces);
    drawingManager.addListener('overlaycomplete', function (event) {
        if (polygon) {
            polygon.setMap(null);
            hideMarkers(markers);
        }
        polygon = event.overlay;
        searchWithinPolygon(polygon, drawingManager);
    });
}
var locations = [
    { title: 'Park Ave Penthouse', location: { lat: 40.7713024, lng: -73.9632393 } },
    { title: 'Chelsea Loft', location: { lat: 40.7444883, lng: -73.9949465 } },
    { title: 'Union Square Open Floor Plan', location: { lat: 40.7347062, lng: -73.9895759 } },
    { title: 'East Village Hip Studio', location: { lat: 40.7281777, lng: -73.984377 } },
    { title: 'TriBeCa Artsy Bachelor Pad', location: { lat: 40.7195264, lng: -74.0089934 } },
    { title: 'Chinatown Homey Space', location: { lat: 40.7180628, lng: -73.9961237 } }
];
function addMarkerEvents(marker, infoWindow, defaultIcon, highlightedIcon) {
    marker.addListener('click', function () {
        populateInfoWindow(this, infoWindow);
    });
    marker.addListener('mouseover', function () {
        this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function () {
        this.setIcon(defaultIcon);
    });
}
function populateInfoWindow(marker, infowindow) {
    function getStreetView(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
            var nearStreetViewLocation = data.location.latLng;
            var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
            infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
            var panoramaOptions = {
                position: nearStreetViewLocation,
                pov: {
                    heading: heading,
                    pitch: 30
                }
            };
            var panorama = new google.maps.StreetViewPanorama($('#pano')[0], panoramaOptions);
        }
        else {
            infowindow.setContent('<div>' + marker.title + '</div><div>No Street View Found</div>');
        }
    }
    if (infowindow.marker != marker) {
        infowindow.setContent('');
        infowindow.marker = marker;
        infowindow.addListener('closeclick', function () {
            infowindow.marker = null;
        });
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        infowindow.open(map, marker);
    }
}
function toggleListings(markers) {
    var listingButton = $('#toggle-listings');
    if (listingButton.hasClass('selected')) {
        listingButton.removeClass('selected');
        hideMarkers(markers);
    }
    else {
        listingButton.addClass('selected');
        showListings(markers);
    }
}
function showListings(markers) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}
function hideMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}
function makeMarkerIcon(markerColor) {
    var markerImage = {
        url: 'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2',
        size: new google.maps.Size(21, 34),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(10, 34),
        scaledSize: new google.maps.Size(21, 34)
    };
    return markerImage;
}
function zoomToArea() {
    var geocoder = new google.maps.Geocoder();
    var address = $('#zoom-to-area-text').val();
    if (address === '') {
        window.alert('You must enter an area, or address.');
    }
    else {
        geocoder.geocode({
            address: address,
            componentRestrictions: { locality: 'New York' }
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                map.setZoom(15);
            }
            else {
                window.alert('We could not find that location - try entering a more specific place.');
            }
        });
    }
}
function searchWithinTime() {
    var distanceMatrixService = new google.maps.DistanceMatrixService();
    var address = $('#search-within-time-text').val();
    if (address === '') {
        window.alert('You must enter an address.');
    }
    else {
        hideMarkers(markers);
        var origins = [];
        for (var i = 0; i < markers.length; i++) {
            origins[i] = markers[i].position;
        }
        var destination = address;
        var mode = $('#mode').val();
        distanceMatrixService.getDistanceMatrix({
            origins: origins,
            destinations: [destination],
            travelMode: getTravelMode(mode),
            unitSystem: google.maps.UnitSystem.IMPERIAL,
        }, function (response, status) {
            if (status !== google.maps.DistanceMatrixStatus.OK) {
                window.alert('Error was: ' + status);
            }
            else {
                displayMarkersWithinTime(response);
            }
        });
    }
}
function displayMarkersWithinTime(response) {
    var maxDuration = $('#max-duration').val();
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;
    var atLeastOne = false;
    for (var i = 0; i < origins.length; i++) {
        var results = response.rows[i].elements;
        for (var j = 0; j < results.length; j++) {
            var element = results[j];
            if (element.status === "OK") {
                var distanceText = element.distance.text;
                var duration = element.duration.value / 60;
                var durationText = element.duration.text;
                if (duration <= maxDuration) {
                    markers[i].setMap(map);
                    atLeastOne = true;
                    var infowindow = new google.maps.InfoWindow({
                        content: durationText + ' away, ' + distanceText +
                            '<div><input type="button" class="btn btn-default" value=\"View Route\" onclick =' +
                            '"displayDirections(&quot;' + origins[i] + '&quot;);"></input></div>'
                    });
                    infowindow.open(map, markers[i]);
                    markers[i].infowindow = infowindow;
                    google.maps.event.addListener(markers[i], 'click', function () { this.infowindow.close(); });
                }
            }
        }
    }
    if (!atLeastOne) {
        window.alert('We could not find any locations within that distance!');
    }
}
function searchBoxPlaces(searchBox) {
    hideMarkers(placeMarkers);
    var places = searchBox.getPlaces();
    if (places.length === 0) {
        window.alert('We did not find any places matching that search!');
    }
    else {
        createMarkersForPlaces(places);
    }
}
function textSearchPlaces() {
    var bounds = map.getBounds();
    hideMarkers(placeMarkers);
    var placesService = new google.maps.places.PlacesService(map);
    placesService.textSearch({
        query: $('#places-search').val(),
        bounds: bounds
    }, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            createMarkersForPlaces(results);
        }
    });
}
function createMarkersForPlaces(places) {
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
        var marker = new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
        });
        var placeInfoWindow = new google.maps.InfoWindow();
        addPlaceMarkerEvents(marker, place.place_id, placeInfoWindow);
        placeMarkers.push(marker);
        if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
        }
        else {
            bounds.extend(place.geometry.location);
        }
    }
    map.fitBounds(bounds);
}
function addPlaceMarkerEvents(marker, place_id, infowindow) {
    marker.addListener('click', function () {
        if (infowindow.marker == this) {
            console.log("This infowindow already is on this marker!");
        }
        else {
            getPlacesDetails(this, place_id, infowindow);
        }
    });
}
function getPlacesDetails(marker, place_id, infowindow) {
    var service = new google.maps.places.PlacesService(map);
    service.getDetails({
        placeId: place_id
    }, function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            infowindow.marker = marker;
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
                innerHTML += '<br><br><img id="' + place.place_id + '_photo" src="' + place.photos[0].getUrl({ maxHeight: 100, maxWidth: 200 }) + '">';
                if (place.photos.length > 1) {
                    innerHTML += '<br>';
                    innerHTML += place.photos.length + ' photos: ';
                    innerHTML += '<a onclick="previousPhoto()">Prev</a> ';
                    innerHTML += '<a onclick="nextPhoto()">Next</a>';
                }
            }
            innerHTML += '</div>';
            infowindow.setContent(innerHTML);
            currentPlace = place;
            infowindow.open(map, marker);
            infowindow.addListener('closeclick', function () {
                infowindow.marker = null;
                currentPlace = null;
                currentPhoto = 0;
            });
        }
    });
}
function nextPhoto() {
    if (currentPlace) {
        var totalPhotos = currentPlace.photos.length;
        var next = currentPhoto + 1;
        if (next >= totalPhotos)
            next = 0;
        $('#' + currentPlace.id + '_photo').attr('src', currentPlace.photos[next].getUrl({ maxHeight: 100, maxWidth: 200 }));
        currentPhoto = next;
    }
}
function previousPhoto() {
    if (currentPlace) {
        var totalPhotos = currentPlace.photos.length;
        var next = currentPhoto - 1;
        if (next < 0)
            next = totalPhotos - 1;
        $('#' + currentPlace.id + '_photo').attr('src', currentPlace.photos[next].getUrl({ maxHeight: 100, maxWidth: 200 }));
        currentPhoto = next;
    }
}
function toggleDrawing(drawingManager, drawingmode, caller) {
    $('#hand-tool').removeClass('selected');
    deselectDrawingTools();
    if (drawingManager.map && caller === currentDrawingTool) {
        drawingManager.setMap(null);
        if (polygon !== null) {
            polygon.setMap(null);
        }
    }
    else {
        drawingManager.setMap(map);
        drawingManager.setDrawingMode(drawingmode);
        if (polygon !== null) {
            polygon.setMap(null);
        }
        caller.addClass('selected');
        currentDrawingTool = caller;
    }
}
function deselectDrawingTools() {
    $('#toggle-listings').removeClass('selected');
    $('#toggle-drawing-polygon').removeClass('selected');
    $('#toggle-drawing-rectangle').removeClass('selected');
    $('#toggle-drawing-circle').removeClass('selected');
}
function disableDrawing(drawingManager) {
    deselectDrawingTools();
    $('#hand-tool').addClass('selected');
    if (drawingManager.map) {
        drawingManager.setMap(null);
    }
    if (polygon !== null) {
        polygon.setMap(null);
    }
}
function searchWithinPolygon(polygon, drawingManager) {
    var markerCount = 0;
    for (var i = 0; i < markers.length; i++) {
        if (isWithinCurrentShape(markers[i].position, polygon)) {
            markers[i].setMap(map);
            markerCount++;
        }
        else {
            markers[i].setMap(null);
        }
    }
    deselectDrawingTools();
    if (markerCount > 0) {
        $('#toggle-listings').addClass('selected');
    }
    else {
        $('#toggle-listings').removeClass('selected');
    }
    $('#hand-tool').addClass('selected');
    if (drawingManager.map) {
        drawingManager.setMap(null);
    }
}
function isWithinCurrentShape(position, shape) {
    var currentShape = currentDrawingTool[0].id;
    if (currentShape) {
        currentShape = currentShape.split('-').pop();
        if (currentShape === 'polygon') {
            return google.maps.geometry.poly.containsLocation(position, shape);
        }
        if (currentShape === 'rectangle') {
            return shape.getBounds().contains(position);
        }
        if (currentShape === 'circle') {
            return google.maps.geometry.spherical.computeDistanceBetween(position, shape.getCenter()) <= shape.getRadius();
        }
    }
    return false;
}
function displayDirections(origin) {
    hideMarkers(markers);
    var directionsService = new google.maps.DirectionsService();
    var destinationAddress = $('#search-within-time-text').val();
    var mode = $('#mode').val();
    directionsService.route({
        origin: origin,
        destination: destinationAddress,
        travelMode: getTravelMode(mode)
    }, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            if (directionsDisplay)
                clearExistingDirections();
            directionsDisplay = new google.maps.DirectionsRenderer({
                map: map,
                directions: response,
                draggable: true,
                polylineOptions: {
                    strokeColor: 'green'
                }
            });
            populateDirectionsPanel(response);
            $('#directions-panel').show(200);
            $('#search-panel').slideUp('fast');
            directionsDisplay.addListener('directions_changed', function () {
                populateDirectionsPanel(directionsDisplay.getDirections());
            });
        }
        else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}
function clearExistingDirections() {
    directionsDisplay.setMap(null);
}
function populateDirectionsPanel(directions) {
    var steps = directions.routes[0].legs[0].steps;
    var distance = directions.routes[0].legs[0].distance;
    var duration = directions.routes[0].legs[0].duration;
    var text = '<strong>From:</strong> ' + directions.request.origin;
    text += '<br><strong>To:</strong> ' + directions.request.destination;
    text += '<br><strong>Total Journey:</strong> ' + distance.text;
    text += ' (about ' + duration.text + ')';
    text += '<ul class="list-group top-row-margin">';
    for (var i = 0; i < steps.length; i++) {
        var stepDistance = steps[i].distance;
        var stepDuration = steps[i].duration;
        var maneuver = steps[i].maneuver;
        text += '<li class="list-group-item">' +
            '<div class="row"><div class="col-md-2">' +
            getManeuverIcon(maneuver) +
            '</div>' +
            '<div class="col-md-10">' +
            steps[i].instructions +
            '<div class="text-right"><small>Travel for ' +
            stepDistance.text +
            ' (' +
            stepDuration.text +
            ')</small></div></div></div></li>';
    }
    text += '</ul>';
    $('#directions').html(text);
}
function getManeuverIcon(maneuver) {
    switch (maneuver) {
        case 'turn-left':
            return '<i class="material-icons" aria-hidden="true">arrow_back</i>';
        case 'turn-right':
            return '<i class="material-icons" aria-hidden="true">arrow_forward</i>';
        default:
            return '';
    }
}
function removeDirectionsPanel() {
    if (directionsDisplay)
        clearExistingDirections();
    $('#directions-panel').hide(200);
    searchWithinTime();
}
function hideLayers() {
    trafficLayer.setMap(null);
    transitLayer.setMap(null);
    bikeLayer.setMap(null);
    $('#toggle-traffic').removeClass('selected');
    $('#toggle-transit').removeClass('selected');
    $('#toggle-bicycling').removeClass('selected');
}
function toggleTraffic() {
    if (trafficLayer.getMap() === null) {
        hideLayers();
        trafficLayer.setMap(map);
        $('#toggle-traffic').addClass('selected');
    }
    else {
        trafficLayer.setMap(null);
        $('#toggle-traffic').removeClass('selected');
    }
}
function toggleTransit() {
    if (transitLayer.getMap() === null) {
        hideLayers();
        transitLayer.setMap(map);
        $('#toggle-transit').addClass('selected');
    }
    else {
        transitLayer.setMap(null);
        $('#toggle-transit').removeClass('selected');
    }
}
function toggleBicycling() {
    if (bikeLayer.getMap() === null) {
        hideLayers();
        bikeLayer.setMap(map);
        $('#toggle-bicycling').addClass('selected');
    }
    else {
        bikeLayer.setMap(null);
        $('#toggle-bicycling').removeClass('selected');
    }
}
//# sourceMappingURL=maps.js.map