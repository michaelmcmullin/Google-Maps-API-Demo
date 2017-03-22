/**
 * Initialises the map and other elements
 */
class Init {
  /**
   * Initial setup of the main map, setting its style, position, zoom level,
   * and other controls.
   */
  public static Map(): google.maps.Map {
    const styledMapType = new google.maps.StyledMapType(
      Init.styles,
      {name: "Mono"},
    );

    // Constructor creates a new map - only center and zoom are required.
    const map: google.maps.Map = new google.maps.Map($(Mapping.Configuration.MAP)[0], {
        center: {lat: Mapping.Configuration.INITIAL_LATITUDE, lng: Mapping.Configuration.INITIAL_LONGITUDE},
         mapTypeControlOptions: {
          mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain", "mono"],
          position: google.maps.ControlPosition.TOP_RIGHT,
        },
        zoom: Mapping.Configuration.INITIAL_ZOOM,
    });
    map.mapTypes.set("mono", styledMapType);
    map.setMapTypeId("mono");

    return map;
  }

  /**
   * Custom styles for the main map.
   */
  private static styles = [
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
}
