namespace Mapping {
  /**
   * Configuration settings for all mapping functionality in this app.
   */
  export class Configuration {
      // IDs of the various HTML elements that interact with mapping code.
      public static readonly MAP: string = "#map";
      public static readonly PANORAMA: string = "#pano";

      // Search Panel:
      public static readonly TOGGLE_SEARCH: string = "#toggle-search";
      public static readonly SEARCH_PANEL: string = "#search-panel";

      public static readonly SEARCH_ZOOM_TEXT: string = "#zoom-to-area-text";
      public static readonly SEARCH_ZOOM_BUTTON: string = "#zoom-to-area";

      public static readonly SEARCH_TIME_TEXTBOX: string = "#search-within-time-text";
      public static readonly SEARCH_TIME_DURATION: string = "#max-duration";
      public static readonly SEARCH_TIME_MODE: string = "#mode";
      public static readonly SEARCH_TIME_BUTTON: string = "#search-within-time";

      public static readonly SEARCH_PLACES_TEXT: string = "#places-search";
      public static readonly SEARCH_PLACES_BUTTON: string = "#go-places";

      // Toolbar:
      public static readonly TOGGLE_LISTINGS: string = "#toggle-listings";
      public static readonly LAYER_TRAFFIC: string = "#toggle-traffic";
      public static readonly LAYER_TRANSIT: string = "#toggle-transit";
      public static readonly LAYER_BICYCLE: string = "#toggle-bicycling";
      public static readonly HAND_BUTTON: string = "#hand-tool";
      public static readonly POLYGON_BUTTON: string = "#toggle-drawing-polygon";
      public static readonly RECTANGLE_BUTTON: string = "#toggle-drawing-rectangle";
      public static readonly CIRCLE_BUTTON: string = "#toggle-drawing-circle";
      public static readonly ABOUT_BUTTON: string = "#about-button";

      // Directions Panel
      public static readonly DIRECTIONS_PANEL: string = "#directions-panel";
      public static readonly DIRECTIONS_PANEL_CLOSE: string = "#directions-panel .close";
      public static readonly DIRECTIONS_TEXT: string = "#directions";

      // About Modal
      public static readonly ABOUT: string = "#about-modal";
      public static readonly ABOUT_CLOSE: string = "#about-modal .close";
  }
}
