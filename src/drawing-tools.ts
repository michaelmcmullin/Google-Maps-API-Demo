/**
 * Class handling the display and function of the drawing tools
 */
class DrawingTools {
  public static map: google.maps.Map;
  public static drawingManager: google.maps.drawing.DrawingManager;
  public static drawingMode: google.maps.drawing.OverlayType;
  public static currentDrawingTool: JQuery = null;
  public static polygon: google.maps.Polygon|google.maps.Rectangle|google.maps.Circle = null;
  public static markers: MarkerWithInfoWindow[];

  /**
   * Initial setup for drawing tools
   * @param map - The map to use for the drawing tools
   * @param markers - A list of markers containing available listings
   */
  public static Initialise(map: google.maps.Map, markers: MarkerWithInfoWindow[]): void {
    DrawingTools.map = map;
    DrawingTools.markers = markers;
    DrawingTools.drawingManager = new google.maps.drawing.DrawingManager({
      drawingControl: false,
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
    });

    $(DrawingTools.handButtonId).on("click", () => {
      DrawingTools.disableDrawing();
    });

    $(DrawingTools.polygonButtonId).on("click", () => {
      DrawingTools.drawingMode = google.maps.drawing.OverlayType.POLYGON;
      DrawingTools.currentDrawingTool = DrawingTools.toggleDrawing($(DrawingTools.polygonButtonId));
    });
    $(DrawingTools.rectangleButtonId).on("click", () => {
      DrawingTools.drawingMode = google.maps.drawing.OverlayType.RECTANGLE;
      DrawingTools.currentDrawingTool = DrawingTools.toggleDrawing($(DrawingTools.rectangleButtonId));
    });
    $(DrawingTools.circleButtonId).on("click", () => {
     DrawingTools.drawingMode = google.maps.drawing.OverlayType.CIRCLE;
     DrawingTools.currentDrawingTool = DrawingTools.toggleDrawing($(DrawingTools.circleButtonId));
    });

    // Add an event listener so that the polygon is captured, call the
    // searchWithinPolygon function. This will show the markers in the polygon,
    // and hide any outside of it.
    DrawingTools.drawingManager.addListener("overlaycomplete", (event) => {
      // First, check if there is an existing polygon.
      // If there is, get rid of it and remove the markers
      if (DrawingTools.polygon) {
        DrawingTools.polygon.setMap(null);
        Utilities.hideMarkers(DrawingTools.markers);
      }

      // Switching the drawing mode to the HAND (i.e., no longer drawing).
      // drawingManager.setDrawingMode(null);

      // Creating a new editable polygon from the overlay.
      DrawingTools.polygon = event.overlay;
      // DrawingTools.polygon.setEditable(true);

      // Searching within the polygon.
      DrawingTools.searchWithinPolygon();

      // Make sure the search is re-done if the poly is changed (only relevant if editable).
      // DrawingTools.polygon.getPath().addListener('set_at', searchWithinPolygon);
      // DrawingTools.polygon.getPath().addListener('insert_at', searchWithinPolygon);
    });

    DrawingTools.disableDrawing();
  }

  /**
   * This shows and hides (respectively) the drawing options.
   * @param caller - The jQuery drawing tool selected which triggers this function.
   */
  public static toggleDrawing(caller: JQuery): JQuery {
    $(DrawingTools.handButtonId).removeClass("selected");
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
      caller.addClass("selected");
      DrawingTools.currentDrawingTool = caller;
    }
    return DrawingTools.currentDrawingTool;
  }

  /**
   * Clear any polygons on screen
   */
  public static clearPolygons(): void {
    if (DrawingTools.drawingManager.getMap()) {
      DrawingTools.drawingManager.setMap(null);
    }
    if (DrawingTools.polygon !== null) {
      DrawingTools.polygon.setMap(null);
    }
  }

  private static readonly handButtonId: string = "#hand-tool";
  private static readonly polygonButtonId: string = "#toggle-drawing-polygon";
  private static readonly rectangleButtonId: string = "#toggle-drawing-rectangle";
  private static readonly circleButtonId: string = "#toggle-drawing-circle";
  private static readonly listingsButtonId: string = "#toggle-listings";

  /**
   * Deselect all drawing tool icons.
   */
  private static deselectDrawingTools(): void {
    $(DrawingTools.listingsButtonId).removeClass("selected");
    $(DrawingTools.polygonButtonId).removeClass("selected");
    $(DrawingTools.rectangleButtonId).removeClass("selected");
    $(DrawingTools.circleButtonId).removeClass("selected");
  }

  /**
   * Disable drawing functions
   */
  private static disableDrawing(): void {
    DrawingTools.deselectDrawingTools();
    $(DrawingTools.handButtonId).addClass("selected");
    DrawingTools.clearPolygons();
  }

  /**
   * This function hides all markers outside the polygon, and shows only the
   * ones within it. This is so that the user can specify an exact area of
   * search.
   */
  private static searchWithinPolygon(): void {
    let markerCount = 0;
    for (const marker of DrawingTools.markers) {
      if (DrawingTools.isWithinCurrentShape(marker.marker.getPosition())) {
        marker.marker.setMap(DrawingTools.map);
        markerCount++;
      } else {
        marker.marker.setMap(null);
      }
    }
    DrawingTools.deselectDrawingTools();
    if (markerCount > 0) {
      $(DrawingTools.listingsButtonId).addClass("selected");
    } else {
      $(DrawingTools.listingsButtonId).removeClass("selected");
    }
    $(DrawingTools.handButtonId).addClass("selected");
    if (DrawingTools.drawingManager.getMap()) {
      DrawingTools.drawingManager.setMap(null);
    }
  }

  /**
   * Determine if a position is within the current drawing tool
   * @param position - The co-ordinates to compare with the current shape.
   */
  private static isWithinCurrentShape(position: google.maps.LatLng): boolean {
    let currentShape = DrawingTools.currentDrawingTool[0].id;
    if (currentShape) {
      currentShape = currentShape.split("-").pop();
      if (currentShape === "polygon") {
        return google.maps.geometry.poly.containsLocation(
          position, DrawingTools.polygon as google.maps.Polygon);
      }
      if (currentShape === "rectangle") {
        const rect = DrawingTools.polygon as google.maps.Rectangle;
        return rect.getBounds().contains(position);
      }
      if (currentShape === "circle") {
        const circle = DrawingTools.polygon as google.maps.Circle;
        return google.maps.geometry.spherical.computeDistanceBetween(
          position, circle.getCenter()) <= circle.getRadius();
      }
    }
    return false;
  }
}
