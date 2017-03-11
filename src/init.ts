/**
 * Initialises the map and other elements
 */
class Init {
  /**
   * Initial setup of the main map, setting its style, position, zoom level,
   * and other controls.
   */
  static Map() {
    var styledMapType = new google.maps.StyledMapType(
      Init.styles,
      {name: 'Mono'}
    );

    // Constructor creates a new map - only center and zoom are required.
    var map:google.maps.Map = new google.maps.Map($('#map')[0], {
        center: {lat: 40.7413549, lng: -73.9980244},
        zoom: 13,
        mapTypeControlOptions: {
          //style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          position: google.maps.ControlPosition.TOP_RIGHT,
          mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'mono']
        }
    });
    map.mapTypes.set('mono', styledMapType);
    map.setMapTypeId('mono');

    return map;
  }

  /**
   * Custom styles for the main map.
   */
  static styles = [
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

}