var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
function hideMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].marker.setMap(null);
    }
}
var MarkerWithInfoWindow = (function () {
    function MarkerWithInfoWindow() {
    }
    MarkerWithInfoWindow.prototype.setMarker = function (newMarker) {
        this.marker = newMarker;
    };
    MarkerWithInfoWindow.prototype.clearMarkers = function () {
        this.marker = null;
        this.infowindow = null;
    };
    return MarkerWithInfoWindow;
}());
var Init = (function () {
    function Init() {
    }
    Init.Map = function () {
        var styledMapType = new google.maps.StyledMapType(Init.styles, { name: 'Mono' });
        var map = new google.maps.Map($('#map')[0], {
            center: { lat: 40.7413549, lng: -73.9980244 },
            zoom: 13,
            mapTypeControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT,
                mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'mono']
            }
        });
        map.mapTypes.set('mono', styledMapType);
        map.setMapTypeId('mono');
        return map;
    };
    return Init;
}());
Init.styles = [
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
var DrawingTools = (function () {
    function DrawingTools() {
    }
    DrawingTools.Initialise = function (map, markers) {
        DrawingTools.map = map;
        DrawingTools.markers = markers;
        DrawingTools.drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: false
        });
        $(DrawingTools.handButtonId).on('click', function () {
            DrawingTools.disableDrawing();
        });
        $(DrawingTools.polygonButtonId).on('click', function () {
            DrawingTools.drawingMode = google.maps.drawing.OverlayType.POLYGON;
            DrawingTools.currentDrawingTool = DrawingTools.toggleDrawing($(this));
        });
        $(DrawingTools.rectangleButtonId).on('click', function () {
            DrawingTools.drawingMode = google.maps.drawing.OverlayType.RECTANGLE;
            DrawingTools.currentDrawingTool = DrawingTools.toggleDrawing($(this));
        });
        $(DrawingTools.circleButtonId).on('click', function () {
            DrawingTools.drawingMode = google.maps.drawing.OverlayType.CIRCLE;
            DrawingTools.currentDrawingTool = DrawingTools.toggleDrawing($(this));
        });
        DrawingTools.drawingManager.addListener('overlaycomplete', function (event) {
            if (DrawingTools.polygon) {
                DrawingTools.polygon.setMap(null);
                hideMarkers(DrawingTools.markers);
            }
            DrawingTools.polygon = event.overlay;
            DrawingTools.searchWithinPolygon();
        });
        DrawingTools.disableDrawing();
    };
    DrawingTools.toggleDrawing = function (caller) {
        $(DrawingTools.handButtonId).removeClass('selected');
        DrawingTools.deselectDrawingTools();
        if (DrawingTools.drawingManager.getMap() && caller === DrawingTools.currentDrawingTool) {
            DrawingTools.drawingManager.setMap(null);
            if (DrawingTools.polygon !== null) {
                DrawingTools.polygon.setMap(null);
            }
        }
        else {
            DrawingTools.drawingManager.setMap(DrawingTools.map);
            DrawingTools.drawingManager.setDrawingMode(DrawingTools.drawingMode);
            if (DrawingTools.polygon !== null) {
                DrawingTools.polygon.setMap(null);
            }
            caller.addClass('selected');
            DrawingTools.currentDrawingTool = caller;
        }
        return DrawingTools.currentDrawingTool;
    };
    DrawingTools.deselectDrawingTools = function () {
        $(DrawingTools.listingsButtonId).removeClass('selected');
        $(DrawingTools.polygonButtonId).removeClass('selected');
        $(DrawingTools.rectangleButtonId).removeClass('selected');
        $(DrawingTools.circleButtonId).removeClass('selected');
    };
    DrawingTools.disableDrawing = function () {
        DrawingTools.deselectDrawingTools();
        $(DrawingTools.handButtonId).addClass('selected');
        if (DrawingTools.drawingManager.getMap()) {
            DrawingTools.drawingManager.setMap(null);
        }
        if (DrawingTools.polygon !== null) {
            DrawingTools.polygon.setMap(null);
        }
    };
    DrawingTools.searchWithinPolygon = function () {
        var markerCount = 0;
        for (var i = 0; i < DrawingTools.markers.length; i++) {
            if (DrawingTools.isWithinCurrentShape(DrawingTools.markers[i].marker.getPosition())) {
                DrawingTools.markers[i].marker.setMap(DrawingTools.map);
                markerCount++;
            }
            else {
                DrawingTools.markers[i].marker.setMap(null);
            }
        }
        DrawingTools.deselectDrawingTools();
        if (markerCount > 0) {
            $(DrawingTools.listingsButtonId).addClass('selected');
        }
        else {
            $(DrawingTools.listingsButtonId).removeClass('selected');
        }
        $(DrawingTools.handButtonId).addClass('selected');
        if (DrawingTools.drawingManager.getMap()) {
            DrawingTools.drawingManager.setMap(null);
        }
    };
    DrawingTools.isWithinCurrentShape = function (position) {
        var currentShape = DrawingTools.currentDrawingTool[0].id;
        if (currentShape) {
            currentShape = currentShape.split('-').pop();
            if (currentShape === 'polygon') {
                return google.maps.geometry.poly.containsLocation(position, DrawingTools.polygon);
            }
            if (currentShape === 'rectangle') {
                var rect = DrawingTools.polygon;
                return rect.getBounds().contains(position);
            }
            if (currentShape === 'circle') {
                var circle = DrawingTools.polygon;
                return google.maps.geometry.spherical.computeDistanceBetween(position, circle.getCenter()) <= circle.getRadius();
            }
        }
        return false;
    };
    return DrawingTools;
}());
DrawingTools.currentDrawingTool = null;
DrawingTools.polygon = null;
DrawingTools.handButtonId = '#hand-tool';
DrawingTools.polygonButtonId = '#toggle-drawing-polygon';
DrawingTools.rectangleButtonId = '#toggle-drawing-rectangle';
DrawingTools.circleButtonId = '#toggle-drawing-circle';
DrawingTools.listingsButtonId = '#toggle-listings';
var PlaceMarker = (function (_super) {
    __extends(PlaceMarker, _super);
    function PlaceMarker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlaceMarker.prototype.setAsActiveInfoWindow = function () {
        if (PlaceMarker.activeInfoWindow) {
            PlaceMarker.activeInfoWindow.close();
        }
        PlaceMarker.currentPhoto = 0;
        PlaceMarker.activeInfoWindow = this.infowindow;
    };
    return PlaceMarker;
}(MarkerWithInfoWindow));
PlaceMarker.currentPlace = null;
PlaceMarker.currentPhoto = 0;
function searchBoxPlaces(searchBox, placeMarkers) {
    hideMarkers(placeMarkers);
    var places = searchBox.getPlaces();
    if (places.length === 0) {
        window.alert('We did not find any places matching that search!');
    }
    else {
        createMarkersForPlaces(places, placeMarkers);
    }
}
function textSearchPlaces(placeMarkers) {
    var bounds = MarkerWithInfoWindow.map.getBounds();
    hideMarkers(placeMarkers);
    var placesService = new google.maps.places.PlacesService(MarkerWithInfoWindow.map);
    placesService.textSearch({
        query: $('#places-search').val(),
        bounds: bounds
    }, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            createMarkersForPlaces(results, placeMarkers);
        }
    });
}
function createMarkersForPlaces(places, placeMarkers) {
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
            map: MarkerWithInfoWindow.map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
        });
        var placeInfoWindow = new google.maps.InfoWindow();
        var placeMarker = new PlaceMarker();
        placeMarker.marker = marker;
        placeMarker.infowindow = placeInfoWindow;
        addPlaceMarkerEvents(placeMarker, place.place_id);
        placeMarkers.push(placeMarker);
        if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
        }
        else {
            bounds.extend(place.geometry.location);
        }
    }
    MarkerWithInfoWindow.map.fitBounds(bounds);
}
function addPlaceMarkerEvents(placeMarker, place_id) {
    placeMarker.marker.addListener('click', function () {
        getPlacesDetails(placeMarker, place_id);
    });
}
function getPlacesDetails(placeMarker, place_id) {
    var service = new google.maps.places.PlacesService(MarkerWithInfoWindow.map);
    service.getDetails({
        placeId: place_id
    }, function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            placeMarker.setAsActiveInfoWindow();
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
            PlaceMarker.activeInfoWindow.setContent(innerHTML);
            PlaceMarker.currentPlace = place;
            PlaceMarker.activeInfoWindow.open(MarkerWithInfoWindow.map, placeMarker.marker);
            PlaceMarker.activeInfoWindow.addListener('closeclick', function () {
                placeMarker.marker = null;
                PlaceMarker.activeInfoWindow = null;
                PlaceMarker.currentPlace = null;
                PlaceMarker.currentPhoto = 0;
            });
        }
    });
}
function nextPhoto() {
    if (PlaceMarker.currentPlace) {
        var totalPhotos = PlaceMarker.currentPlace.photos.length;
        var next = PlaceMarker.currentPhoto + 1;
        if (next >= totalPhotos)
            next = 0;
        $('#' + PlaceMarker.currentPlace.place_id + '_photo').attr('src', PlaceMarker.currentPlace.photos[next].getUrl({ maxHeight: 100, maxWidth: 200 }));
        PlaceMarker.currentPhoto = next;
    }
}
function previousPhoto() {
    if (PlaceMarker.currentPlace) {
        var totalPhotos = PlaceMarker.currentPlace.photos.length;
        var next = PlaceMarker.currentPhoto - 1;
        if (next < 0)
            next = totalPhotos - 1;
        $('#' + PlaceMarker.currentPlace.place_id + '_photo').attr('src', PlaceMarker.currentPlace.photos[next].getUrl({ maxHeight: 100, maxWidth: 200 }));
        PlaceMarker.currentPhoto = next;
    }
}
function searchWithinTime(markers, directionsDisplay) {
    var distanceMatrixService = new google.maps.DistanceMatrixService();
    var address = $('#search-within-time-text').val();
    if (address === '') {
        window.alert('You must enter an address.');
    }
    else {
        hideMarkers(markers);
        var origins = [];
        for (var i = 0; i < markers.length; i++) {
            origins[i] = markers[i].marker.getPosition();
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
                displayMarkersWithinTime(response, markers, directionsDisplay);
            }
        });
    }
}
function displayMarkersWithinTime(response, markers, directionsDisplay) {
    var maxDuration = $('#max-duration').val();
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;
    var atLeastOne = false;
    for (var i = 0; i < origins.length; i++) {
        var results = response.rows[i].elements;
        for (var j = 0; j < results.length; j++) {
            var element = results[j];
            if (element.status === google.maps.DistanceMatrixElementStatus.OK) {
                var distanceText = element.distance.text;
                var duration = element.duration.value / 60;
                var durationText = element.duration.text;
                if (duration <= maxDuration) {
                    markers[i].marker.setMap(MarkerWithInfoWindow.map);
                    atLeastOne = true;
                    var infowindow = new google.maps.InfoWindow({
                        content: durationText + ' away, ' + distanceText +
                            '<div><input type="button" value=\"View Route\" id=\"btn_ViewRoute_' + i + '\"></input></div>'
                    });
                    var origin = origins[i];
                    infowindow.open(MarkerWithInfoWindow.map, markers[i].marker);
                    removeGetRouteInfowindow(markers[i], infowindow);
                    attachGetRouteEvent($('#btn_ViewRoute_' + i)[0], origin, markers, directionsDisplay);
                }
            }
        }
    }
    if (!atLeastOne) {
        window.alert('We could not find any locations within that distance!');
    }
}
function attachGetRouteEvent(button, origin, markers, directionsDisplay) {
    google.maps.event.addDomListener(button, 'click', function () { displayDirections(origin, markers, directionsDisplay); });
}
function removeGetRouteInfowindow(marker, infowindow) {
    google.maps.event.addListener(marker.marker, 'click', function () { infowindow.close(); });
}
function zoomToArea(map) {
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
var TransportLayers = (function () {
    function TransportLayers() {
    }
    TransportLayers.Initialise = function (map) {
        TransportLayers.map = map;
        TransportLayers.trafficLayer = new google.maps.TrafficLayer();
        TransportLayers.transitLayer = new google.maps.TransitLayer();
        TransportLayers.bikeLayer = new google.maps.BicyclingLayer();
        TransportLayers.hideLayers();
        $(TransportLayers.trafficButtonId).on('click', function () {
            TransportLayers.toggleLayer(TransportLayers.trafficLayer, TransportLayers.trafficButtonId);
        });
        $(TransportLayers.transitButtonId).on('click', function () {
            TransportLayers.toggleLayer(TransportLayers.transitLayer, TransportLayers.transitButtonId);
        });
        $(TransportLayers.bicycleButtonId).on('click', function () {
            TransportLayers.toggleLayer(TransportLayers.bikeLayer, TransportLayers.bicycleButtonId);
        });
    };
    TransportLayers.hideLayers = function () {
        TransportLayers.trafficLayer.setMap(null);
        TransportLayers.transitLayer.setMap(null);
        TransportLayers.bikeLayer.setMap(null);
        $(TransportLayers.trafficButtonId).removeClass('selected');
        $(TransportLayers.transitButtonId).removeClass('selected');
        $(TransportLayers.bicycleButtonId).removeClass('selected');
    };
    TransportLayers.toggleLayer = function (layer, buttonId) {
        if (layer.getMap() === null) {
            TransportLayers.hideLayers();
            layer.setMap(TransportLayers.map);
            $(buttonId).addClass('selected');
        }
        else {
            layer.setMap(null);
            $(buttonId).removeClass('selected');
        }
    };
    return TransportLayers;
}());
TransportLayers.trafficButtonId = '#toggle-traffic';
TransportLayers.transitButtonId = '#toggle-transit';
TransportLayers.bicycleButtonId = '#toggle-bicycling';
var locations = [
    { title: 'Park Ave Penthouse', location: { lat: 40.7713024, lng: -73.9632393 } },
    { title: 'Chelsea Loft', location: { lat: 40.7444883, lng: -73.9949465 } },
    { title: 'Union Square Open Floor Plan', location: { lat: 40.7347062, lng: -73.9895759 } },
    { title: 'East Village Hip Studio', location: { lat: 40.7281777, lng: -73.984377 } },
    { title: 'TriBeCa Artsy Bachelor Pad', location: { lat: 40.7195264, lng: -74.0089934 } },
    { title: 'Chinatown Homey Space', location: { lat: 40.7180628, lng: -73.9961237 } }
];
var ListingMarker = (function (_super) {
    __extends(ListingMarker, _super);
    function ListingMarker(position, title) {
        var _this = _super.call(this) || this;
        _this.marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: ListingMarker.defaultIcon
        });
        _this.infowindow = new google.maps.InfoWindow();
        _this.addMarkerEvents(_this.marker, _this.infowindow);
        return _this;
    }
    ListingMarker.Initialise = function (map) {
        ListingMarker.map = map;
        ListingMarker.defaultIcon = ListingMarker.makeMarkerIcon('0091ff');
        ListingMarker.highlightedIcon = ListingMarker.makeMarkerIcon('ffff24');
    };
    ListingMarker.makeMarkerIcon = function (markerColor) {
        var markerImage = {
            url: 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2',
            size: new google.maps.Size(21, 34),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(10, 34),
            scaledSize: new google.maps.Size(21, 34)
        };
        return markerImage;
    };
    ListingMarker.prototype.addMarkerEvents = function (marker, infowindow) {
        this.marker.addListener('click', function () {
            removeInfoWindow();
            ListingMarker.currentMarker = marker;
            ListingMarker.currentInfoWindow = infowindow;
            ListingMarker.populateInfoWindow();
        });
        this.marker.addListener('mouseover', function () {
            this.setIcon(ListingMarker.highlightedIcon);
        });
        this.marker.addListener('mouseout', function () {
            this.setIcon(ListingMarker.defaultIcon);
        });
    };
    ListingMarker.populateInfoWindow = function () {
        function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, ListingMarker.currentMarker.getPosition());
                ListingMarker.currentInfoWindow.setContent('<div>' + ListingMarker.currentMarker.getTitle() + '</div><div id="pano"></div>');
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
                ListingMarker.currentInfoWindow.setContent('<div>' + ListingMarker.currentMarker.getTitle() + '</div><div>No Street View Found</div>');
            }
        }
        ListingMarker.currentInfoWindow.setContent('');
        ListingMarker.currentInfoWindow.addListener('closeclick', removeInfoWindow);
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        streetViewService.getPanoramaByLocation(ListingMarker.currentMarker.getPosition(), radius, getStreetView);
        ListingMarker.currentInfoWindow.open(ListingMarker.map, ListingMarker.currentMarker);
    };
    return ListingMarker;
}(MarkerWithInfoWindow));
ListingMarker.currentMarker = null;
ListingMarker.currentInfoWindow = null;
function removeInfoWindow() {
    if (ListingMarker.currentInfoWindow !== null)
        ListingMarker.currentInfoWindow.close();
    ListingMarker.currentMarker = null;
    ListingMarker.currentInfoWindow = null;
}
function toggleListings(markers, map) {
    var listingButton = $('#toggle-listings');
    if (listingButton.hasClass('selected')) {
        listingButton.removeClass('selected');
        hideMarkers(markers);
    }
    else {
        listingButton.addClass('selected');
        showListings(markers, map);
    }
}
function showListings(markers, map) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        markers[i].marker.setMap(map);
        bounds.extend(markers[i].marker.getPosition());
    }
    map.fitBounds(bounds);
}
var SearchPanel = (function () {
    function SearchPanel() {
    }
    SearchPanel.Initialise = function (map, markers, placeMarkers, directionsDisplay) {
        $(SearchPanel.searchButton).on('click', function () {
            $(SearchPanel.searchPanel).slideToggle("fast");
        });
        var timeAutocomplete = new google.maps.places.Autocomplete($(SearchPanel.searchTimeText)[0]);
        var zoomAutocomplete = new google.maps.places.Autocomplete($(SearchPanel.searchZoomText)[0]);
        zoomAutocomplete.bindTo('bounds', map);
        var searchBox = new google.maps.places.SearchBox($(SearchPanel.searchPlacesText)[0]);
        searchBox.setBounds(map.getBounds());
        $(SearchPanel.searchZoomButton).on('click', function () {
            zoomToArea(map);
            SearchPanel.hide();
        });
        $(SearchPanel.searchTimeButton).on('click', function () {
            searchWithinTime(markers, directionsDisplay);
            SearchPanel.hide();
        });
        searchBox.addListener('places_changed', function () {
            searchBoxPlaces(this, placeMarkers);
            SearchPanel.hide();
        });
        $(SearchPanel.searchPlacesButton).on('click', function () {
            textSearchPlaces(placeMarkers);
            SearchPanel.hide();
        });
    };
    SearchPanel.show = function () {
        $(SearchPanel.searchPanel).slideDown("fast");
    };
    SearchPanel.hide = function () {
        $(SearchPanel.searchPanel).slideUp("fast");
    };
    return SearchPanel;
}());
SearchPanel.searchButton = '#toggle-search';
SearchPanel.searchPanel = '#search-panel';
SearchPanel.searchZoomText = '#zoom-to-area-text';
SearchPanel.searchZoomButton = '#zoom-to-area';
SearchPanel.searchTimeText = '#search-within-time-text';
SearchPanel.searchTimeButton = '#search-within-time';
SearchPanel.searchPlacesText = '#places-search';
SearchPanel.searchPlacesButton = '#go-places';
function initMap() {
    var map;
    var markers = [];
    var placeMarkers = [];
    var directionsDisplay = null;
    map = Init.Map();
    MarkerWithInfoWindow.map = map;
    ListingMarker.Initialise(map);
    TransportLayers.Initialise(map);
    DrawingTools.Initialise(map, markers);
    SearchPanel.Initialise(map, markers, placeMarkers, directionsDisplay);
    for (var i = 0; i < locations.length; i++) {
        var position = locations[i].location;
        var title = locations[i].title;
        var listingMarker = new ListingMarker(position, title);
        markers.push(listingMarker);
    }
    $('#toggle-listings').on('click', function () {
        toggleListings(markers, map);
    });
    $('#about-button').on('click', function () {
        $('#about-modal').show();
    });
    $('#about-modal .close').on('click', function () {
        $('#about-modal').fadeOut();
    });
}
function displayDirections(origin, markers, directionsDisplay) {
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
                clearExistingDirections(directionsDisplay);
            directionsDisplay = new google.maps.DirectionsRenderer({
                map: MarkerWithInfoWindow.map,
                directions: response,
                draggable: true,
                polylineOptions: {
                    strokeColor: 'green'
                }
            });
            populateDirectionsPanel(response);
            $('#directions-panel').show(200);
            SearchPanel.hide();
            directionsDisplay.addListener('directions_changed', function () {
                populateDirectionsPanel(directionsDisplay.getDirections());
            });
        }
        else {
            window.alert('Directions request failed due to ' + status);
        }
    });
    $('#directions-panel .close').on('click', function () { removeDirectionsPanel(directionsDisplay, markers); });
}
function clearExistingDirections(directionsDisplay) {
    directionsDisplay.setMap(null);
}
function populateDirectionsPanel(directions) {
    var steps = directions.routes[0].legs[0].steps;
    var distance = directions.routes[0].legs[0].distance;
    var duration = directions.routes[0].legs[0].duration;
    var origin = directions.routes[0].legs[0].start_address;
    var destination = directions.routes[0].legs[0].end_address;
    var text = '<strong>From:</strong> ' + origin;
    text += '<br><strong>To:</strong> ' + destination;
    text += '<br><strong>Total Journey:</strong> ' + distance.text;
    text += ' (about ' + duration.text + ')';
    text += '<ul class="list-group top-row-margin">';
    for (var i = 0; i < steps.length; i++) {
        var stepDistance = steps[i].distance;
        var stepDuration = steps[i].duration;
        text += '<li class="list-group-item">' +
            '<div class="row"><div class="col-md-2">' +
            getManeuverIcon(steps[i].instructions) +
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
function getManeuverIcon(instructions) {
    var maneuver = '';
    if (instructions.indexOf('Turn <b>left</b>') > -1)
        maneuver = 'turn-left';
    else if (instructions.indexOf('Turn <b>right</b>') > -1)
        maneuver = 'turn-right';
    switch (maneuver) {
        case 'turn-left':
            return '<i class="material-icons" aria-hidden="true">arrow_back</i>';
        case 'turn-right':
            return '<i class="material-icons" aria-hidden="true">arrow_forward</i>';
        default:
            return '';
    }
}
function removeDirectionsPanel(directionsDisplay, markers) {
    if (directionsDisplay)
        clearExistingDirections(directionsDisplay);
    $('#directions-panel').hide(200);
    searchWithinTime(markers, directionsDisplay);
}
//# sourceMappingURL=maps.js.map