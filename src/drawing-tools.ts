
// This shows and hides (respectively) the drawing options.
function toggleDrawing(
  map: google.maps.Map,
  drawingManager: google.maps.drawing.DrawingManager,
  drawingmode: google.maps.drawing.OverlayType,
  caller: JQuery,
  currentDrawingTool: JQuery,
  polygon: google.maps.Polygon|google.maps.Rectangle|google.maps.Circle
) {
  $('#hand-tool').removeClass('selected');
  deselectDrawingTools();
  
  if (drawingManager.getMap() && caller === currentDrawingTool) {
    drawingManager.setMap(null);
    // In case the user drew anything, get rid of the polygon
    if (polygon !== null) {
      polygon.setMap(null);
    }
  } else {
    drawingManager.setMap(map);
    drawingManager.setDrawingMode(drawingmode);
    if (polygon !== null) {
      polygon.setMap(null);
    }
    caller.addClass('selected');
    currentDrawingTool = caller;
  }
  return currentDrawingTool;
}

// Deselect all drawing tool icons.
function deselectDrawingTools() {
  $('#toggle-listings').removeClass('selected');
  $('#toggle-drawing-polygon').removeClass('selected');
  $('#toggle-drawing-rectangle').removeClass('selected');
  $('#toggle-drawing-circle').removeClass('selected');
}

// Disable drawing functions
function disableDrawing(
  drawingManager: google.maps.drawing.DrawingManager,
  polygon: google.maps.Polygon|google.maps.Rectangle|google.maps.Circle
) {
  deselectDrawingTools();
  $('#hand-tool').addClass('selected');
  if (drawingManager.getMap()) {
    drawingManager.setMap(null);
  }
  if (polygon !== null) {
    polygon.setMap(null);
  }
}

// This function hides all markers outside the polygon,
// and shows only the ones within it. This is so that the
// user can specify an exact area of search.
function searchWithinPolygon(
  polygon: google.maps.Polygon|google.maps.Rectangle|google.maps.Circle,
  drawingManager: google.maps.drawing.DrawingManager,
  markers: google.maps.Marker[],
  map: google.maps.Map,
  currentDrawingTool: JQuery
) {
  var markerCount = 0;
  for (var i = 0; i < markers.length; i++) {
    if (isWithinCurrentShape(markers[i].getPosition(), polygon, currentDrawingTool)) {
      markers[i].setMap(map);
      markerCount++;
    } else {
      markers[i].setMap(null);
    }
  }
  deselectDrawingTools();
  if (markerCount > 0) {
    $('#toggle-listings').addClass('selected');
  } else {
    $('#toggle-listings').removeClass('selected');
  }
  $('#hand-tool').addClass('selected');
  if (drawingManager.getMap()) {
    drawingManager.setMap(null);
  }
}

// Determine if a position is within the current drawing tool
function isWithinCurrentShape(
  position,
  shape,
  currentDrawingTool: JQuery
) {
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
