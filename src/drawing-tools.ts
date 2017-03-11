/**
 * Class handling the display and function of the drawing tools
 */
class DrawingTools {
  static map: google.maps.Map;
  static drawingManager: google.maps.drawing.DrawingManager;
  static drawingMode: google.maps.drawing.OverlayType;
  static currentDrawingTool: JQuery = null;
  static polygon: google.maps.Polygon|google.maps.Rectangle|google.maps.Circle = null;
  static markers: MarkerWithInfoWindow[];

  static readonly handButtonId: string = '#hand-tool';
  static readonly polygonButtonId: string = '#toggle-drawing-polygon';
  static readonly rectangleButtonId: string = '#toggle-drawing-rectangle';
  static readonly circleButtonId: string = '#toggle-drawing-circle';
  static readonly listingsButtonId: string = '#toggle-listings';

  /**
   * Initial setup for drawing tools
   * @param map - The map to use for the drawing tools
   * @param markers - A list of markers containing available listings
   */
  static Initialise(map: google.maps.Map, markers: MarkerWithInfoWindow[]) : void
  {
    DrawingTools.map = map;
    DrawingTools.markers = markers;
    DrawingTools.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: false
    });

    $(DrawingTools.handButtonId).on('click', function() {
      DrawingTools.disableDrawing();
    });

    $(DrawingTools.polygonButtonId).on('click', function() {
      DrawingTools.drawingMode = google.maps.drawing.OverlayType.POLYGON;
      DrawingTools.currentDrawingTool = DrawingTools.toggleDrawing($(this));
    });
    $(DrawingTools.rectangleButtonId).on('click', function() {
      DrawingTools.drawingMode = google.maps.drawing.OverlayType.RECTANGLE;
      DrawingTools.currentDrawingTool = DrawingTools.toggleDrawing($(this));
    });
    $(DrawingTools.circleButtonId).on('click', function() {
     DrawingTools.drawingMode = google.maps.drawing.OverlayType.CIRCLE;
     DrawingTools.currentDrawingTool = DrawingTools.toggleDrawing($(this));
    });

    // Add an event listener so that the polygon is captured, call the
    // searchWithinPolygon function. This will show the markers in the polygon,
    // and hide any outside of it.
    DrawingTools.drawingManager.addListener('overlaycomplete', function(event) {
      // First, check if there is an existing polygon.
      // If there is, get rid of it and remove the markers
      if (DrawingTools.polygon) {
        DrawingTools.polygon.setMap(null);
        hideMarkers(DrawingTools.markers);
      }

      // Switching the drawing mode to the HAND (i.e., no longer drawing).
      //drawingManager.setDrawingMode(null);

      // Creating a new editable polygon from the overlay.
      DrawingTools.polygon = event.overlay;
      //DrawingTools.polygon.setEditable(true);

      // Searching within the polygon.
      DrawingTools.searchWithinPolygon();

      // Make sure the search is re-done if the poly is changed (only relevant if editable).
      //DrawingTools.polygon.getPath().addListener('set_at', searchWithinPolygon);
      //DrawingTools.polygon.getPath().addListener('insert_at', searchWithinPolygon);
    });

    DrawingTools.disableDrawing();
  }

  /**
   * This shows and hides (respectively) the drawing options.
   * @param caller - The jQuery drawing tool selected which triggers this function.
   */
  static toggleDrawing(caller: JQuery) : JQuery {
    $(DrawingTools.handButtonId).removeClass('selected');
    DrawingTools.deselectDrawingTools();
    
    if (DrawingTools.drawingManager.getMap() && caller === DrawingTools.currentDrawingTool) {
      DrawingTools.drawingManager.setMap(null);
      // In case the user drew anything, get rid of the polygon
      if (DrawingTools.polygon !== null) {
        DrawingTools.polygon.setMap(null);
      }
    } else {
      DrawingTools.drawingManager.setMap(DrawingTools.map);
      DrawingTools.drawingManager.setDrawingMode(DrawingTools.drawingMode);
      if (DrawingTools.polygon !== null) {
        DrawingTools.polygon.setMap(null);
      }
      caller.addClass('selected');
      DrawingTools.currentDrawingTool = caller;
    }
    return DrawingTools.currentDrawingTool;
  }

  /**
   * Deselect all drawing tool icons.
   */
  static deselectDrawingTools() : void {
    $(DrawingTools.listingsButtonId).removeClass('selected');
    $(DrawingTools.polygonButtonId).removeClass('selected');
    $(DrawingTools.rectangleButtonId).removeClass('selected');
    $(DrawingTools.circleButtonId).removeClass('selected');
  }

  /**
   * Disable drawing functions
   */
  static disableDrawing() : void {
    DrawingTools.deselectDrawingTools();
    $(DrawingTools.handButtonId).addClass('selected');
    DrawingTools.clearPolygons();
  }

  /**
   * Clear any polygons on screen
   */
  static clearPolygons() : void {
    if (DrawingTools.drawingManager.getMap()) {
      DrawingTools.drawingManager.setMap(null);
    }
    if (DrawingTools.polygon !== null) {
      DrawingTools.polygon.setMap(null);
    }
  }

  /**
   * This function hides all markers outside the polygon, and shows only the
   * ones within it. This is so that the user can specify an exact area of
   * search.
   */
  static searchWithinPolygon() : void {
    var markerCount = 0;
    for (var i = 0; i < DrawingTools.markers.length; i++) {
      if (DrawingTools.isWithinCurrentShape(DrawingTools.markers[i].marker.getPosition())) {
        DrawingTools.markers[i].marker.setMap(DrawingTools.map);
        markerCount++;
      } else {
        DrawingTools.markers[i].marker.setMap(null);
      }
    }
    DrawingTools.deselectDrawingTools();
    if (markerCount > 0) {
      $(DrawingTools.listingsButtonId).addClass('selected');
    } else {
      $(DrawingTools.listingsButtonId).removeClass('selected');
    }
    $(DrawingTools.handButtonId).addClass('selected');
    if (DrawingTools.drawingManager.getMap()) {
      DrawingTools.drawingManager.setMap(null);
    }
  }

  /**
   * Determine if a position is within the current drawing tool
   * @param position - The co-ordinates to compare with the current shape.
   */
  static isWithinCurrentShape(position: google.maps.LatLng) : boolean {
    var currentShape = DrawingTools.currentDrawingTool[0].id;
    if (currentShape) {
      currentShape = currentShape.split('-').pop();
      if (currentShape === 'polygon') {
        return google.maps.geometry.poly.containsLocation(position, DrawingTools.polygon as google.maps.Polygon);
      }
      if (currentShape === 'rectangle') {
        var rect = DrawingTools.polygon as google.maps.Rectangle;
        return rect.getBounds().contains(position);
      }
      if (currentShape === 'circle') {
        var circle = DrawingTools.polygon as google.maps.Circle;
        return google.maps.geometry.spherical.computeDistanceBetween(position, circle.getCenter()) <= circle.getRadius();
      }
    }
    return false;
  }
}


