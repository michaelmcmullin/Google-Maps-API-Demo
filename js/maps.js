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
var Utilities = (function () {
    function Utilities() {
    }
    Utilities.getTravelMode = function (mode) {
        switch (mode.toUpperCase()) {
            case "DRIVING":
                return google.maps.TravelMode.DRIVING;
            case "BICYCLING":
                return google.maps.TravelMode.BICYCLING;
            case "TRANSIT":
                return google.maps.TravelMode.TRANSIT;
            case "WALKING":
                return google.maps.TravelMode.WALKING;
            default:
                return null;
        }
    };
    Utilities.hideMarkers = function (markers) {
        for (var _i = 0, markers_1 = markers; _i < markers_1.length; _i++) {
            var marker = markers_1[_i];
            if (marker.infowindow !== null) {
                marker.infowindow.close();
            }
            removeInfoWindow();
            marker.infowindow = null;
            marker.marker.setMap(null);
        }
    };
    return Utilities;
}());
var MarkerWithInfoWindow = (function () {
    function MarkerWithInfoWindow() {
    }
    return MarkerWithInfoWindow;
}());
var Init = (function () {
    function Init() {
    }
    Init.Map = function () {
        var styledMapType = new google.maps.StyledMapType(Init.styles, { name: "Mono" });
        var map = new google.maps.Map($("#map")[0], {
            center: { lat: 40.7413549, lng: -73.9980244 },
            mapTypeControlOptions: {
                mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain", "mono"],
                position: google.maps.ControlPosition.TOP_RIGHT,
            },
            zoom: 13,
        });
        map.mapTypes.set("mono", styledMapType);
        map.setMapTypeId("mono");
        return map;
    };
    return Init;
}());
Init.styles = [
    {
        elementType: "labels.text.fill",
        featureType: "administrative",
        stylers: [
            {
                color: "#444444",
            },
        ],
    },
    {
        elementType: "all",
        featureType: "landscape",
        stylers: [
            {
                color: "#f2f2f2",
            },
        ],
    },
    {
        elementType: "geometry.fill",
        featureType: "landscape.man_made",
        stylers: [
            {
                lightness: -10,
            },
        ],
    },
    {
        elementType: "all",
        featureType: "poi",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        elementType: "geometry.fill",
        featureType: "poi.park",
        stylers: [
            {
                color: "#5cb85c",
            },
            {
                visibility: "on",
            },
            {
                lightness: 50,
            },
        ],
    },
    {
        elementType: "all",
        featureType: "road",
        stylers: [
            {
                saturation: -100,
            },
            {
                lightness: 45,
            },
        ],
    },
    {
        elementType: "all",
        featureType: "road.highway",
        stylers: [
            {
                visibility: "simplified",
            },
        ],
    },
    {
        elementType: "labels.icon",
        featureType: "road.highway",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        elementType: "labels.icon",
        featureType: "road.arterial",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        elementType: "all",
        featureType: "water",
        stylers: [
            {
                color: "#91dcfa",
            },
            {
                visibility: "on",
            },
        ],
    },
    {
        elementType: "geometry.fill",
        featureType: "water",
        stylers: [
            {
                color: "#337ab7",
            },
        ],
    },
];
var DrawingTools = (function () {
    function DrawingTools() {
    }
    DrawingTools.Initialise = function (map, markers) {
        DrawingTools.map = map;
        DrawingTools.markers = markers;
        DrawingTools.drawingManager = new google.maps.drawing.DrawingManager({
            drawingControl: false,
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
        });
        $(DrawingTools.handButtonId).on("click", function () {
            DrawingTools.disableDrawing();
        });
        $(DrawingTools.polygonButtonId).on("click", function () {
            DrawingTools.drawingMode = google.maps.drawing.OverlayType.POLYGON;
            DrawingTools.currentDrawingTool = DrawingTools.toggleDrawing($(DrawingTools.polygonButtonId));
        });
        $(DrawingTools.rectangleButtonId).on("click", function () {
            DrawingTools.drawingMode = google.maps.drawing.OverlayType.RECTANGLE;
            DrawingTools.currentDrawingTool = DrawingTools.toggleDrawing($(DrawingTools.rectangleButtonId));
        });
        $(DrawingTools.circleButtonId).on("click", function () {
            DrawingTools.drawingMode = google.maps.drawing.OverlayType.CIRCLE;
            DrawingTools.currentDrawingTool = DrawingTools.toggleDrawing($(DrawingTools.circleButtonId));
        });
        DrawingTools.drawingManager.addListener("overlaycomplete", function (event) {
            if (DrawingTools.polygon) {
                DrawingTools.polygon.setMap(null);
                Utilities.hideMarkers(DrawingTools.markers);
            }
            DrawingTools.polygon = event.overlay;
            DrawingTools.searchWithinPolygon();
        });
        DrawingTools.disableDrawing();
    };
    DrawingTools.toggleDrawing = function (caller) {
        $(DrawingTools.handButtonId).removeClass("selected");
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
            caller.addClass("selected");
            DrawingTools.currentDrawingTool = caller;
        }
        return DrawingTools.currentDrawingTool;
    };
    DrawingTools.clearPolygons = function () {
        if (DrawingTools.drawingManager.getMap()) {
            DrawingTools.drawingManager.setMap(null);
        }
        if (DrawingTools.polygon !== null) {
            DrawingTools.polygon.setMap(null);
        }
    };
    DrawingTools.deselectDrawingTools = function () {
        $(DrawingTools.listingsButtonId).removeClass("selected");
        $(DrawingTools.polygonButtonId).removeClass("selected");
        $(DrawingTools.rectangleButtonId).removeClass("selected");
        $(DrawingTools.circleButtonId).removeClass("selected");
    };
    DrawingTools.disableDrawing = function () {
        DrawingTools.deselectDrawingTools();
        $(DrawingTools.handButtonId).addClass("selected");
        DrawingTools.clearPolygons();
    };
    DrawingTools.searchWithinPolygon = function () {
        var markerCount = 0;
        for (var _i = 0, _a = DrawingTools.markers; _i < _a.length; _i++) {
            var marker = _a[_i];
            if (DrawingTools.isWithinCurrentShape(marker.marker.getPosition())) {
                marker.marker.setMap(DrawingTools.map);
                markerCount++;
            }
            else {
                marker.marker.setMap(null);
            }
        }
        DrawingTools.deselectDrawingTools();
        if (markerCount > 0) {
            $(DrawingTools.listingsButtonId).addClass("selected");
        }
        else {
            $(DrawingTools.listingsButtonId).removeClass("selected");
        }
        $(DrawingTools.handButtonId).addClass("selected");
        if (DrawingTools.drawingManager.getMap()) {
            DrawingTools.drawingManager.setMap(null);
        }
    };
    DrawingTools.isWithinCurrentShape = function (position) {
        var currentShape = DrawingTools.currentDrawingTool[0].id;
        if (currentShape) {
            currentShape = currentShape.split("-").pop();
            if (currentShape === "polygon") {
                return google.maps.geometry.poly.containsLocation(position, DrawingTools.polygon);
            }
            if (currentShape === "rectangle") {
                var rect = DrawingTools.polygon;
                return rect.getBounds().contains(position);
            }
            if (currentShape === "circle") {
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
DrawingTools.handButtonId = "#hand-tool";
DrawingTools.polygonButtonId = "#toggle-drawing-polygon";
DrawingTools.rectangleButtonId = "#toggle-drawing-rectangle";
DrawingTools.circleButtonId = "#toggle-drawing-circle";
DrawingTools.listingsButtonId = "#toggle-listings";
var PlaceMarker = (function (_super) {
    __extends(PlaceMarker, _super);
    function PlaceMarker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlaceMarker.searchBoxPlaces = function (searchBox, placeMarkers) {
        Utilities.hideMarkers(placeMarkers);
        var places = searchBox.getPlaces();
        if (places.length === 0) {
            window.alert("We did not find any places matching that search!");
        }
        else {
            PlaceMarker.createMarkersForPlaces(places, placeMarkers);
        }
    };
    PlaceMarker.textSearchPlaces = function (placeMarkers) {
        var bounds = MarkerWithInfoWindow.map.getBounds();
        Utilities.hideMarkers(placeMarkers);
        var placesService = new google.maps.places.PlacesService(MarkerWithInfoWindow.map);
        placesService.textSearch({
            bounds: bounds,
            query: $("#places-search").val(),
        }, function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                PlaceMarker.createMarkersForPlaces(results, placeMarkers);
            }
        });
    };
    PlaceMarker.createMarkersForPlaces = function (places, placeMarkers) {
        var bounds = new google.maps.LatLngBounds();
        for (var _i = 0, places_1 = places; _i < places_1.length; _i++) {
            var place = places_1[_i];
            var icon = {
                anchor: new google.maps.Point(15, 34),
                origin: new google.maps.Point(0, 0),
                scaledSize: new google.maps.Size(25, 25),
                size: new google.maps.Size(35, 35),
                url: place.icon,
            };
            var marker = new google.maps.Marker({
                icon: icon,
                map: MarkerWithInfoWindow.map,
                position: place.geometry.location,
                title: place.name,
            });
            var placeInfoWindow = new google.maps.InfoWindow();
            var placeMarker = new PlaceMarker();
            placeMarker.marker = marker;
            placeMarker.infowindow = placeInfoWindow;
            PlaceMarker.addPlaceMarkerEvents(placeMarker, place.place_id);
            placeMarkers.push(placeMarker);
            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            }
            else {
                bounds.extend(place.geometry.location);
            }
        }
        MarkerWithInfoWindow.map.fitBounds(bounds);
    };
    PlaceMarker.addPlaceMarkerEvents = function (placeMarker, placeId) {
        placeMarker.marker.addListener("click", function () {
            PlaceMarker.getPlacesDetails(placeMarker, placeId);
        });
    };
    PlaceMarker.getPlacesDetails = function (placeMarker, placeId) {
        var service = new google.maps.places.PlacesService(MarkerWithInfoWindow.map);
        service.getDetails({
            placeId: placeId,
        }, function (place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                placeMarker.setAsActiveInfoWindow();
                var innerHTML = "<div>";
                if (place.name) {
                    innerHTML += "<strong>" + place.name + "</strong>";
                }
                if (place.formatted_address) {
                    innerHTML += "<br>" + place.formatted_address;
                }
                if (place.formatted_phone_number) {
                    innerHTML += "<br>" + place.formatted_phone_number;
                }
                if (place.opening_hours) {
                    innerHTML += "<br><br><strong>Hours:</strong><br>" +
                        place.opening_hours.weekday_text[0] + "<br>" +
                        place.opening_hours.weekday_text[1] + "<br>" +
                        place.opening_hours.weekday_text[2] + "<br>" +
                        place.opening_hours.weekday_text[3] + "<br>" +
                        place.opening_hours.weekday_text[4] + "<br>" +
                        place.opening_hours.weekday_text[5] + "<br>" +
                        place.opening_hours.weekday_text[6];
                }
                if (place.photos) {
                    innerHTML += "<br><br><img id=\"" + place.place_id + "_photo\" src=\"" + place.photos[0].getUrl({ maxHeight: 100, maxWidth: 200 }) + "\">";
                    if (place.photos.length > 1) {
                        innerHTML += "<br>";
                        innerHTML += place.photos.length + " photos: ";
                        innerHTML += "<a onclick=\"PlaceMarker.previousPhoto()\">Prev</a> ";
                        innerHTML += "<a onclick=\"PlaceMarker.nextPhoto()\">Next</a>";
                    }
                }
                innerHTML += "</div>";
                PlaceMarker.activeInfoWindow.setContent(innerHTML);
                PlaceMarker.currentPlace = place;
                PlaceMarker.activeInfoWindow.open(MarkerWithInfoWindow.map, placeMarker.marker);
                PlaceMarker.activeInfoWindow.addListener("closeclick", function () {
                    placeMarker.marker = null;
                    PlaceMarker.activeInfoWindow = null;
                    PlaceMarker.currentPlace = null;
                    PlaceMarker.currentPhoto = 0;
                });
            }
        });
    };
    PlaceMarker.nextPhoto = function () {
        if (PlaceMarker.currentPlace) {
            var totalPhotos = PlaceMarker.currentPlace.photos.length;
            var next = PlaceMarker.currentPhoto + 1;
            if (next >= totalPhotos) {
                next = 0;
            }
            $("#" + PlaceMarker.currentPlace.place_id + "_photo").attr("src", PlaceMarker.currentPlace.photos[next].getUrl({ maxHeight: 100, maxWidth: 200 }));
            PlaceMarker.currentPhoto = next;
        }
    };
    PlaceMarker.previousPhoto = function () {
        if (PlaceMarker.currentPlace) {
            var totalPhotos = PlaceMarker.currentPlace.photos.length;
            var next = PlaceMarker.currentPhoto - 1;
            if (next < 0) {
                next = totalPhotos - 1;
            }
            $("#" + PlaceMarker.currentPlace.place_id + "_photo").attr("src", PlaceMarker.currentPlace.photos[next].getUrl({ maxHeight: 100, maxWidth: 200 }));
            PlaceMarker.currentPhoto = next;
        }
    };
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
var TimeSearch = (function () {
    function TimeSearch() {
    }
    TimeSearch.searchWithinTime = function (markers, directionsDisplay) {
        var distanceMatrixService = new google.maps.DistanceMatrixService();
        var address = $("#search-within-time-text").val();
        if (address === "") {
            window.alert("You must enter an address.");
        }
        else {
            Utilities.hideMarkers(markers);
            var origins = [];
            for (var i = 0; i < markers.length; i++) {
                origins[i] = markers[i].marker.getPosition();
            }
            var destination = address;
            var mode = $("#mode").val();
            distanceMatrixService.getDistanceMatrix({
                destinations: [destination],
                origins: origins,
                travelMode: Utilities.getTravelMode(mode),
                unitSystem: google.maps.UnitSystem.IMPERIAL,
            }, function (response, status) {
                if (status !== google.maps.DistanceMatrixStatus.OK) {
                    window.alert("Error was: " + status);
                }
                else {
                    TimeSearch.displayMarkersWithinTime(response, markers, directionsDisplay);
                }
            });
        }
    };
    TimeSearch.displayMarkersWithinTime = function (response, markers, directionsDisplay) {
        var maxDuration = $("#max-duration").val();
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;
        var atLeastOne = false;
        for (var i = 0; i < origins.length; i++) {
            var results = response.rows[i].elements;
            for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
                var result = results_1[_i];
                if (result.status === google.maps.DistanceMatrixElementStatus.OK) {
                    var distanceText = result.distance.text;
                    var duration = result.duration.value / 60;
                    var durationText = result.duration.text;
                    if (duration <= maxDuration) {
                        markers[i].marker.setMap(MarkerWithInfoWindow.map);
                        atLeastOne = true;
                        if (markers[i].infowindow === null) {
                            markers[i].infowindow = new google.maps.InfoWindow({
                                content: durationText + " away, " + distanceText +
                                    "<div><input type=\"button\" value=\"View Route\" id=\"btn_ViewRoute_" + i + "\"></input></div>",
                            });
                        }
                        var origin = origins[i];
                        markers[i].infowindow.open(MarkerWithInfoWindow.map, markers[i].marker);
                        TimeSearch.removeGetRouteInfowindow(markers[i]);
                        TimeSearch.attachGetRouteEvent($("#btn_ViewRoute_" + i)[0], origin, markers, directionsDisplay);
                    }
                }
            }
        }
        if (!atLeastOne) {
            window.alert("We could not find any locations within that distance!");
        }
    };
    TimeSearch.attachGetRouteEvent = function (button, origin, markers, directionsDisplay) {
        google.maps.event.addDomListener(button, "click", function () { DirectionsPanel.displayDirections(origin, markers, directionsDisplay); });
    };
    TimeSearch.removeGetRouteInfowindow = function (marker) {
        google.maps.event.addListener(marker.marker, "click", function () { marker.infowindow.close(); });
    };
    return TimeSearch;
}());
var ZoomSearch = (function () {
    function ZoomSearch() {
    }
    ZoomSearch.zoomToArea = function (map) {
        var geocoder = new google.maps.Geocoder();
        var address = $("#zoom-to-area-text").val();
        if (address === "") {
            window.alert("You must enter an area, or address.");
        }
        else {
            geocoder.geocode({
                address: address,
                componentRestrictions: { locality: "New York" },
            }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    map.setCenter(results[0].geometry.location);
                    map.setZoom(15);
                }
                else {
                    window.alert("We could not find that location - try entering a more specific place.");
                }
            });
        }
    };
    return ZoomSearch;
}());
var TransportLayers = (function () {
    function TransportLayers() {
    }
    TransportLayers.Initialise = function (map) {
        TransportLayers.map = map;
        TransportLayers.trafficLayer = new google.maps.TrafficLayer();
        TransportLayers.transitLayer = new google.maps.TransitLayer();
        TransportLayers.bikeLayer = new google.maps.BicyclingLayer();
        TransportLayers.hideLayers();
        $(TransportLayers.trafficButtonId).on("click", function () {
            TransportLayers.toggleLayer(TransportLayers.trafficLayer, TransportLayers.trafficButtonId);
        });
        $(TransportLayers.transitButtonId).on("click", function () {
            TransportLayers.toggleLayer(TransportLayers.transitLayer, TransportLayers.transitButtonId);
        });
        $(TransportLayers.bicycleButtonId).on("click", function () {
            TransportLayers.toggleLayer(TransportLayers.bikeLayer, TransportLayers.bicycleButtonId);
        });
    };
    TransportLayers.hideLayers = function () {
        TransportLayers.trafficLayer.setMap(null);
        TransportLayers.transitLayer.setMap(null);
        TransportLayers.bikeLayer.setMap(null);
        $(TransportLayers.trafficButtonId).removeClass("selected");
        $(TransportLayers.transitButtonId).removeClass("selected");
        $(TransportLayers.bicycleButtonId).removeClass("selected");
    };
    TransportLayers.toggleLayer = function (layer, buttonId) {
        if (layer.getMap() === null) {
            TransportLayers.hideLayers();
            layer.setMap(TransportLayers.map);
            $(buttonId).addClass("selected");
        }
        else {
            layer.setMap(null);
            $(buttonId).removeClass("selected");
        }
    };
    return TransportLayers;
}());
TransportLayers.trafficButtonId = "#toggle-traffic";
TransportLayers.transitButtonId = "#toggle-transit";
TransportLayers.bicycleButtonId = "#toggle-bicycling";
var locations = [
    { title: "Park Ave Penthouse", location: { lat: 40.7713024, lng: -73.9632393 } },
    { title: "Chelsea Loft", location: { lat: 40.7444883, lng: -73.9949465 } },
    { title: "Union Square Open Floor Plan", location: { lat: 40.7347062, lng: -73.9895759 } },
    { title: "East Village Hip Studio", location: { lat: 40.7281777, lng: -73.984377 } },
    { title: "TriBeCa Artsy Bachelor Pad", location: { lat: 40.7195264, lng: -74.0089934 } },
    { title: "Chinatown Homey Space", location: { lat: 40.7180628, lng: -73.9961237 } },
];
var ListingMarker = (function (_super) {
    __extends(ListingMarker, _super);
    function ListingMarker(position, title) {
        var _this = _super.call(this) || this;
        _this.marker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            icon: ListingMarker.defaultIcon,
            position: position,
            title: title,
        });
        _this.infowindow = new google.maps.InfoWindow();
        _this.addMarkerEvents(_this.marker, _this.infowindow);
        return _this;
    }
    ListingMarker.Initialise = function (map) {
        ListingMarker.map = map;
        ListingMarker.defaultIcon = ListingMarker.makeMarkerIcon("0091ff");
        ListingMarker.highlightedIcon = ListingMarker.makeMarkerIcon("ffff24");
    };
    ListingMarker.makeMarkerIcon = function (markerColor) {
        var markerImage = {
            anchor: new google.maps.Point(10, 34),
            origin: new google.maps.Point(0, 0),
            scaledSize: new google.maps.Size(21, 34),
            size: new google.maps.Size(21, 34),
            url: "https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|" + markerColor + "|40|_|%E2%80%A2",
        };
        return markerImage;
    };
    ListingMarker.populateInfoWindow = function () {
        function getStreetView(data, status) {
            if (status === google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, ListingMarker.currentMarker.getPosition());
                ListingMarker.currentInfoWindow.setContent("<div>" + ListingMarker.currentMarker.getTitle() + "</div><div id=\"pano\"></div>");
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 30,
                    },
                };
                var panorama = new google.maps.StreetViewPanorama($("#pano")[0], panoramaOptions);
            }
            else {
                ListingMarker.currentInfoWindow.setContent("<div>" + ListingMarker.currentMarker.getTitle() + "</div><div>No Street View Found</div>");
            }
        }
        ListingMarker.currentInfoWindow.setContent("");
        ListingMarker.currentInfoWindow.addListener("closeclick", removeInfoWindow);
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        streetViewService.getPanoramaByLocation(ListingMarker.currentMarker.getPosition(), radius, getStreetView);
        ListingMarker.currentInfoWindow.open(ListingMarker.map, ListingMarker.currentMarker);
    };
    ListingMarker.prototype.addMarkerEvents = function (marker, infowindow) {
        var _this = this;
        this.marker.addListener("click", function () {
            removeInfoWindow();
            ListingMarker.currentMarker = marker;
            ListingMarker.currentInfoWindow = infowindow;
            ListingMarker.populateInfoWindow();
        });
        this.marker.addListener("mouseover", function () {
            _this.marker.setIcon(ListingMarker.highlightedIcon);
        });
        this.marker.addListener("mouseout", function () {
            _this.marker.setIcon(ListingMarker.defaultIcon);
        });
    };
    return ListingMarker;
}(MarkerWithInfoWindow));
ListingMarker.currentMarker = null;
ListingMarker.currentInfoWindow = null;
function removeInfoWindow() {
    if (ListingMarker.currentInfoWindow !== null) {
        ListingMarker.currentInfoWindow.close();
    }
    ListingMarker.currentMarker = null;
    ListingMarker.currentInfoWindow = null;
}
function toggleListings(markers, map) {
    var listingButton = $("#toggle-listings");
    if (listingButton.hasClass("selected")) {
        listingButton.removeClass("selected");
        Utilities.hideMarkers(markers);
    }
    else {
        listingButton.addClass("selected");
        showListings(markers, map);
    }
}
function showListings(markers, map) {
    var bounds = new google.maps.LatLngBounds();
    for (var _i = 0, markers_2 = markers; _i < markers_2.length; _i++) {
        var marker = markers_2[_i];
        marker.marker.setMap(map);
        bounds.extend(marker.marker.getPosition());
    }
    map.fitBounds(bounds);
}
var SearchPanel = (function () {
    function SearchPanel() {
    }
    SearchPanel.Initialise = function (map, markers, placeMarkers, directionsDisplay) {
        $(SearchPanel.searchButton).on("click", function () {
            $(SearchPanel.searchPanel).slideToggle("fast");
        });
        var timeAutocomplete = new google.maps.places.Autocomplete($(SearchPanel.searchTimeText)[0]);
        var zoomAutocomplete = new google.maps.places.Autocomplete($(SearchPanel.searchZoomText)[0]);
        zoomAutocomplete.bindTo("bounds", map);
        var searchBox = new google.maps.places.SearchBox($(SearchPanel.searchPlacesText)[0]);
        searchBox.setBounds(map.getBounds());
        $(SearchPanel.searchZoomButton).on("click", function () {
            ZoomSearch.zoomToArea(map);
            SearchPanel.hide();
        });
        $(SearchPanel.searchTimeButton).on("click", function () {
            TimeSearch.searchWithinTime(markers, directionsDisplay);
            SearchPanel.hide();
        });
        searchBox.addListener("places_changed", function () {
            PlaceMarker.searchBoxPlaces(searchBox, placeMarkers);
            SearchPanel.hide();
        });
        $(SearchPanel.searchPlacesButton).on("click", function () {
            PlaceMarker.textSearchPlaces(placeMarkers);
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
SearchPanel.searchButton = "#toggle-search";
SearchPanel.searchPanel = "#search-panel";
SearchPanel.searchZoomText = "#zoom-to-area-text";
SearchPanel.searchZoomButton = "#zoom-to-area";
SearchPanel.searchTimeText = "#search-within-time-text";
SearchPanel.searchTimeButton = "#search-within-time";
SearchPanel.searchPlacesText = "#places-search";
SearchPanel.searchPlacesButton = "#go-places";
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
    for (var _i = 0, locations_1 = locations; _i < locations_1.length; _i++) {
        var location_1 = locations_1[_i];
        var position = location_1.location;
        var title = location_1.title;
        var listingMarker = new ListingMarker(position, title);
        markers.push(listingMarker);
    }
    $("#toggle-listings").on("click", function () {
        DrawingTools.clearPolygons();
        toggleListings(markers, map);
    });
    $("#about-button").on("click", function () {
        $("#about-modal").show();
    });
    $("#about-modal .close").on("click", function () {
        $("#about-modal").fadeOut();
    });
}
var DirectionsPanel = (function () {
    function DirectionsPanel() {
    }
    DirectionsPanel.displayDirections = function (origin, markers, directionsDisplay) {
        Utilities.hideMarkers(markers);
        var directionsService = new google.maps.DirectionsService();
        var destinationAddress = $("#search-within-time-text").val();
        var mode = $("#mode").val();
        directionsService.route({
            destination: destinationAddress,
            origin: origin,
            travelMode: Utilities.getTravelMode(mode),
        }, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                if (directionsDisplay) {
                    DirectionsPanel.clearExistingDirections(directionsDisplay);
                }
                directionsDisplay = new google.maps.DirectionsRenderer({
                    directions: response,
                    draggable: true,
                    map: MarkerWithInfoWindow.map,
                    polylineOptions: {
                        strokeColor: "green",
                    },
                });
                DirectionsPanel.populateDirectionsPanel(response);
                $("#directions-panel").show(200);
                SearchPanel.hide();
                directionsDisplay.addListener("directions_changed", function () {
                    DirectionsPanel.populateDirectionsPanel(directionsDisplay.getDirections());
                });
            }
            else {
                window.alert("Directions request failed due to " + status);
            }
        });
        $("#directions-panel .close").on("click", function () {
            DirectionsPanel.removeDirectionsPanel(directionsDisplay, markers);
        });
    };
    DirectionsPanel.clearExistingDirections = function (directionsDisplay) {
        directionsDisplay.setMap(null);
    };
    DirectionsPanel.populateDirectionsPanel = function (directions) {
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
        for (var _i = 0, steps_1 = steps; _i < steps_1.length; _i++) {
            var step = steps_1[_i];
            var stepDistance = step.distance;
            var stepDuration = step.duration;
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
        $("#directions").html(text);
    };
    DirectionsPanel.getManeuverIcon = function (instructions) {
        var maneuver = "";
        if (instructions.indexOf("Turn <b>left</b>") > -1) {
            maneuver = "turn-left";
        }
        else if (instructions.indexOf("Turn <b>right</b>") > -1) {
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
    };
    DirectionsPanel.removeDirectionsPanel = function (directionsDisplay, markers) {
        if (directionsDisplay) {
            DirectionsPanel.clearExistingDirections(directionsDisplay);
        }
        $("#directions-panel").hide(200);
        TimeSearch.searchWithinTime(markers, directionsDisplay);
    };
    return DirectionsPanel;
}());
//# sourceMappingURL=maps.js.map