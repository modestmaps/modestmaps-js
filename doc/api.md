# modestmaps.js
Modest Maps is a bare-bones geographic map display and interaction library. It was designed and conceived by [Tom Carden], tweaked by [Michal Migurski], and is maintained and hacked on primarily by [Tom MacWright] and [Shawn Allen].

[Tom Carden]: http://www.tom-carden.co.uk/
[Michal Migurski]: http://mike.teczno.com/
[Tom MacWright]: http://macwright.org/
[Shawn Allen]: http://github.com/shawnbot

<a name="source"></a>
## Getting the Source
You can get modestmaps.js by cloning [the github repo](https://github.com/modestmaps/modestmaps-js/) or downloading it:

* [modestmaps.js-v{VERSION}.zip](https://github.com/modestmaps/modestmaps-js/zipball/v{VERSION}) (zip archive)
* [modestmaps.js](../modestmaps.js) (source JavaScript, 100K)
* [modestmaps.min.js](../modestmaps.min.js) (minified JavaScript, 36K)

After you've downloaded it, you can include by putting this `<script>` tag into the `<head>` of your HTML document:

```
<script type="text/javascript" src="modestmaps.js"></script>
```

<a name="quick-start"></a>
## Quick Start

<a name="quick.map"></a>
### Making a Map
Making a map is easy. First, you'll need a place for your map in the HTML:

```
<div id="map"></div>
```

Then, add a script below:

```
<script type="text/javascript">
var tiles = new MM.TemplatedLayer("http://tile.stamen.com/toner/{Z}/{X}/{Y}.png");
var size = new MM.Point(640, 480);
var map = new MM.Map("map", tiles, size);
</script>
```

This will create a map showing [Stamen's toner tiles](http://maps.stamen.com/toner/) in a 640x480-pixel area. See the docs below for more info on [layers](#TemplatedLayer) and [map dimensions](#Map.dimensions).

If you want the size of your map to be determined by CSS, you can style your div like so:

```
#map {
    height: 500px;
}
```

Then, leave off the `size` argument to the constructor:

```
<script type="text/javascript">
var tiles = new MM.TemplatedLayer("http://tile.stamen.com/toner/{Z}/{X}/{Y}.png");
var map = new MM.Map("map", tiles);
</script>
```

For more info on resizing, see the [Map constructor](#Map.constructor) and [autoSize](#Map.autoSize) docs.

<a name="quick.moving"></a>
### Moving Around
Once you've got your map initialized, you can move it around the world. Geographic locations in modestmaps.js are modeled with the [Location](#Location) class, which is called with *latitude* and *longitude* values:

```
var oakland = new MM.Location(37.804, -122.271);
```

Once you've got a location, you can tell the map to center on it by calling [setCenter](#Map.setCenter):

```
// center on Oakland, California
map.setCenter(oakland);
// center on Amsterdam, Netherlands
map.setCenter(new MM.Location(52.3702157, 4.8951679));
```

You can get the current center of the map with [getCenter](#Map.getCenter). You can also modify the visible area by setting its [extent](#Extent), which is defined by two or more locations. [Setting](#Map.setCenter) a map's extent adjusts its center and zoom level so that the rectangular bounding box surrounding the locations is entirely visible:

```
var oakland = new MM.Location(37.804, -122.271),
    amsterdam = new MM.Location(52.3702157, 4.8951679);
var extent = new MM.Extent(oakland, amsterdam);
map.setExtent(extent)
```

You can change the map's zoom level with the [zoomIn](#Map.zoomIn), [zoomOut](#Map.zoomOut) and [zoomTo](#Map.zoomTo) methods:

```
map.zoomIn();   // increase zoom by 1
map.zoomOut();  // decrease zoom by 1
map.zoomTo(12); // zoom to level 12
```

<a name="quick.layers"></a>
### Working with Layers
One popular feature of many online maps is a "hybrid" style, which overlays satellite imagery with graphical labels. You can achieve this effect in modestmaps.js by creating two [tile layers](#TemplatedLayer), and passing them both to the [Map constructor](#Map.constructor) as an array:

```
var baseURL = "http://tile.stamen.com/",
    watercolor = new MM.TemplatedLayer(baseURL + "watercolor/{Z}/{X}/{Y}.jpg"),
    labels = new MM.TemplatedLayer(baseURL + "toner-labels/{Z}/{X}/{Y}.jpg");
var map = new MM.Map("map", [watercolor, labels]);
```

Or you can create the map with one layer, then add the overlay later:

```
var map = new MM.Map("map", watercolor);
map.addLayer(labels);
```

See the [addLayer](#Map.addLayer) docs and the [TemplatedLayer](#TemplatedLayer) class reference for more on working with layers.

<a name="Map"></a>
## MM.Map
The Map class is the core of **modestmaps.js**.

```
new MM.Map(parent [, layerOrLayers [, dimensions [, eventHandlers]]])
```

Creates a new map inside the given **parent** element, containing the specified **layers**, optionally with the specified **dimensions** in pixels and custom **event handlers**. The **Map** constructor arguments are described in detail below:

#### parent
The parent [element](http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-745549614) of the map. This is typically a `String` indicating the ID of the element:

```
var map = new MM.Map("map", []);
```

You can also provide an element reference:

```
var firstDiv = new MM.Map(document.querySelector("div.map"), ...);
```

Here's a pattern for inserting maps into a series of classed elements, using [document.getElementsByClassName](https://developer.mozilla.org/en/DOM/document.getElementsByClassName):

```
var elements = document.getElementsByClassName("map"),
    maps = [];
for (var i = 0; i < elements.length; i++) {
  maps[i] = new MM.Map(elements[i], ...);
}
```

If an element with the provided ID string is not found, an exception is raised.

If **parent** is not an object or a string, an exception is raised.


#### layerOrLayers
Either a single [layer](#Layer) object or an array of layer objects. Layer objects should either be instances of the [Layer](#Layer) class or implement the [Layer interface](#Layer-Interface).

Here's an example of a map with two tile layers, from maps.stamen.com:

```
var baseURL = "http://tile.stamen.com/",
    watercolor = new MM.TemplatedLayer(baseURL + "watercolor/{Z}/{X}/{Y}.png"),
    labels = new MM.TemplatedLayer(baseURL + "toner-labels/{Z}/{X}/{Y}.png");
var map = new MM.Map("map", [watercolor, labels]);
```

NOTE: Before modestmaps.js *v3.1.1*, an exception was raised if **layerOrLayers** was not an object or an array.


#### dimensions
An optional map size in pixels, expressed as a [Point](#Point) object.

```
var size = new MM.Point(512, 512);
var map = new MM.Map("map", [], size);
console.log("map size:", map.dimensions.x, "x", map.dimensions.y);
```

If **dimensions** is `null` or `undefined`, the dimensions are derived from
the width and height of the parent element, and the map's [autoSize](#Map.autoSize)
flag is set to `true`.

Empty `<div>` elements have no intrinsic height, so if you don't provide dimensions you'll need to provide the map's parent height in CSS (either inline or in a stylesheet).

#### eventHandlers
An optional array of interaction event handlers, which should implement the [EventHandler interface](#EventHandler-Interface). If no handlers are provided (`eventHandlers === undefined`), the map is initialized with [mouse](#MouseHandler) and [touch](#TouchHandler) handlers.

For instance, to create a map without scroll wheel zooming (which is enabled by default), you can provide [drag](#DragHandler), and [double-click](#DoubleClickHandler) handlers:

```
var map = new MM.Map("map", [], null, [
  new MM.DragHandler(),
  new MM.DoubleClickHandler()
]);
```

The [touch](#TouchHandler) handler provides panning and zooming in touch-enabled browsers:

```
var map = new MM.Map("map", [], null, [
  new MM.TouchHandler()
]);
```

To initialize the map without any interaction handlers, specify **eventHandlers** as `null` or an empty array (`[]`).


<a name="Map.getCenter"></a>
### getCenter `map.getCenter()`
Get the map's center **location**.

```
var center = map.getCenter();
console.log("center latitude:", center.lat, "+ longitude:", center.lon);
```

<a name="Map.setCenter"></a>
### setCenter `map.setCenter(location)`
Set the map's center **location**.

```
var center = new MM.Location(37.764, -122.419);
map.setCenter(center);
```

<a name="Map.getZoom"></a>
### getZoom `map.getZoom()`<a name="Map.getZoom"></a>
Get the map's **zoom level**.

```
var zoom = map.getZoom();
console.log("zoom level:", zoom);
```

<a name="Map.setZoom"></a>
### setZoom `map.setZoom(zoom)`
Set the map's **zoom level**.

```
map.setZoom(17);
```

<a name="Map.setCenterZoom"></a>
### setCenterZoom `map.setCenterZoom(location, zoom)`
Set the map's center **location** and **zoom level**.

```
map.setCenterZoom(new MM.Location(37.764, -122.419), 17);
```

<a name="Map.getExtent"></a>
### getExtent `map.getExtent()`
Get the visible extent (bounds) of the map as an [Extent](#Extent) object.

```
var extent = map.getExtent();
console.log("northwest location:", extent.northWest());
console.log("southeast location:", extent.southEast());
```

<a name="Map.setExtent"></a>
### setExtent `map.setExtent(extent [, precise])`
Modify the center and zoom of the map so that the provided **extent** is visible. If **precise** is `true`, resulting zoom levels may be fractional. (By default, the map's zoom level is rounded down to keep tile images from blurring.)

```
var extent = new MM.Extent(
  new MM.Location(55.679, 12.584),
  new MM.Location(55.668, 12.607)
);
map.setExtent(extent, true);
```

NOTE: For historical reasons, **setExtent** also accepts an array of [Location](#Location) objects, which are converted using [Extent.fromArray](#Extent.fromArray).

<a name="Map.zoomIn"></a>
### zoomIn `map.zoomIn()`
Increase the map's zoom level by one.

<a name="Map.zoomOut"></a>
### zoomOut `map.zoomOut()`
Decrease the map's zoom level by one.

<a name="Map.zoomBy"></a>
### zoomBy `map.zoomBy(zoomOffset)`
Zoom the map by the provided **offset**. Positive offsets zoom in; negative offsets zoom out.

```
// this is the equivalent of calling map.zoomIn() twice:
map.zoomBy(2);
```

<a name="Map.zoomByAbout"></a>
### zoomByAbout `map.zoomByAbout(zoomOffset, point)`
Zoom the map by the provided **zoom offset** from a **point** on the screen in pixels. Positive offsets zoom in; negative offsets zoom out. This function is used by [DoubleClickHandler](#DoubleClickHandler) to zoom in on the point where the map is double-clicked.

```
// zoom in on the upper left corner
var point = new MM.Point(0, 0);
map.zoomByAbout(1, point);
```

<a name="Map.panBy"></a>
### panBy `map.panBy(x, y)`
Pan the map by the specified **x** and **y** distance in pixels. Positive values move the map right and down, respectively; negative values move the map left and up.

```
// pan 500 pixels to the right
map.panBy(500, 0);
// pan 200 pixels up
map.panBy(0, -200);
```

<a name="Map.panLeft"></a>
### panLeft `map.panLeft()`
<a name="Map.panRight"></a>
### panRight `map.panRight()`
<a name="Map.panUp"></a>
### panUp `map.panUp()`
<a name="Map.panDown"></a>
### panDown `map.panDown()`
Pan the map to the left, right, up or down by 100 pixels. To vary the offset distance, use [panBy](#Map.panBy).

<a name="Map.getLayers"></a>
### getLayers `map.getLayers()`
Get a copy of the map's layers array.

```
var layers = map.getLayers();
var base = layers[0];
```

<a name="Map.getLayerAt"></a>
### getLayerAt `map.getLayerAt(index)`
Get the layer at a specific **index**. The first layer is at index `0`, the second at `1`, etc.

```
var map = new MM.Map(...);
var base = map.getLayerAt(0);
base.parent.id = "base";
```

<a name="Map.addLayer"></a>
### addLayer `map.addLayer(layer)`
Add **layer** to the map's [layer stack](#Map.layers)]. This triggers a [redraw](#Map.redraw).

```
var layer = new MM.TemplatedLayer("http://tile.stamen.com/toner-lines/{Z}/{X}/{Y}.png");
map.addLayer(layer);
```

<a name="Map.removeLayer"></a>
### removeLayer `map.removeLayer(layer)`
Remove **layer** from the map's [layer stack](#Map.layers).

<a name="Map.setLayerAt"></a>
### setLayerAt `map.setLayerAt(index, newLayer)`
Replace the existing layer at **index** with the **new layer**.

```
var layer = new MM.TemplatedLayer("http://tile.stamen.com/toner/{Z}/{X}/{Y}.png");
map.setLayerAt(0, layer);
```

<a name="Map.insertLayerAt"></a>
### insertLayerAt `map.insertLayerAt(index, layer)`
Insert a **layer** at the provided **index**.

```
// let's assume the map has 2 layers already
var layer = new MM.TemplatedLayer("http://tile.stamen.com/toner-lines/{Z}/{X}/{Y}.png");
map.insertLayerAt(1, layer);
// (now it has 3, with our new layer at index 1)
```

<a name="Map.removeLayerAt"></a>
### removeLayerAt `map.removeLayerAt(index)`
Remove the layer at the provided index.

```
// remove the second layer
map.removeLayerAt(1);
```

<a name="Map.swapLayersAt"></a>
### swapLayersAt `map.swapLayersAt(indexA, indexB)`
Swap the z-index (order) or the layers at **indexA** and **indexB**.

```
// swap the bottom and top layers
var bottom = 0,
    top = map.getLayers().length - 1;
map.swapLayersAt(bottom, top);
```

<a name="Map.pointLocation"></a>
### pointLocation `map.pointLocation(screenPoint)`
Convert a **point on the screen** to a [location](#Location) (a point on the Earth).

<a name="Map.pointCoordinate"></a>
### pointCoordinate `map.pointCoordinate(screenPoint)`
Convert a **point on the screen** to a [tile coordinate](#Coordinate).

<a name="Map.locationPoint"></a>
### locationPoint `locationPoint(location)`
Convert a **location** (a point on the Earth) to a [point](#Point) on the screen.

<a name="Map.locationCoordinate"></a>
### locationCoordinate `map.locationCoordinate(location)`
Convert a **location** (a point on the Earth) to a [tile coordinate](#Coordinate).

<a name="Map.coordinateLocation"></a>
### coordinateLocation `map.coordinateLocation(coord)`
Convert a [tile coordinate](#Coordinate) to a [location](#Location) (a point on the Earth).

<a name="Map.coordinatePoint"></a>
### coordinatePoint `map.coordinatePoint(coord)`
Convert a [tile coordinate](#Coordinate) to a [point](#Point) on the screen.

<a name="Map.setZoomRange"></a>
### setZoomRange `map.setZoomRange(minZoom, maxZoom)`
Set the map's **minimum** and **maximum** zoom levels. This function modifies the zoom levels of the map's [coordLimits](#Map.coordLimits).

<a name="Map.setSize"></a>
### setSize `map.setSize(dimensions)`
Set the map's **dimensions** in pixels. If the map's [autoSize](#Map.autoSize) flag is `true`, setting the size manually sets **autoSize** to `false` and prevents further automatic resizing.

```
map.setSize(new MM.Point(640, 480));
```

NOTE: The map's current size is available in its [dimensions](#Map.dimensions) property.

<a name="Map.addCallback"></a>
### addCallback `map.addCallback(eventType, callback)`
Add a **callback function** (listener) to the map for a specific **event type**. Callback functions always receive the map instance as their first argument; additional arguments differ by event type. See the [events list](#Map-events) for supported types.

```
function onPanned(map, offset) {
  console.log("panned by", offset[0], offset[1]);
}

map.addCallback("panned", onPanned);
```

You can remove callbacks with [removeCallback](#Map.removeCallback).

<a name="Map.removeCallback"></a>
### removeCallback `map.removeCallback(eventType, callback)`
Remove a **callback function** (listener) for the given **event type**. You can add callbacks with [addCallback](#Map.addCallback).

```
map.removeCallback("panned", onPanned);
```

<a name="Map.draw"></a>
### draw `map.draw()`
Redraw the map and its layers. First, the map enforces its [coordLimits](#Map.coordLimits) on its center and zoom. If [autoSize](#Map.autoSize) is `true`, the map's dimensions are recalculated from its [parent](#Map.parent). Lastly, each of the map's layers is [drawn](#Layer.draw).

<a name="Map.requestRedraw"></a>
### requestRedraw `map.requestRedraw()`
Request a "lazy" call to [draw](#Map.draw) in 1 second. This is useful if you're responding to lots of user input and know that you'll need to redraw the map *eventually*, but not immediately.

Multiple calls to **requestRedraw** within 1 second of one another will be ignored, so this is a perfectly reasonable thing to do:

```
setInterval(function() {
  map.requestRedraw();
}, 100);
```


## Hybrid Methods
Hybrid methods behave differently depending on whether they receive arguments: The "getter" form (with no arguments) returns the current value, and the "setter" form sets it to the value provided then returns `this`, which makes function chaining possible (a la [jQuery](http://jquery.com), [d3](http://d3js.com), and [Polymaps](http://polymaps.org)).

<a name="Map.center"></a>
### center `map.center([location])`
[Get](#Map.getCenter) or [set](#Map.setCenter) the map's center **location**.

```
var center = map.center();
center.lat += .1;
map.center(center);
```

<a name="Map.zoom"></a>
### zoom `map.zoom([level])`
[Get](#Map.getZoom) or [set](#Map.setZoom) the map's **zoom level**.

```
var zoom = map.zoom();
zoom -= 3;
map.zoom(zoom);
```

<a name="Map.extent"></a>
### extent `map.extent([locationsOrExtent [, precise]])`
[Get](#Map.getZoom) or [set](#Map.setZoom) the map's extent. If **precise** is `true`, resulting zoom levels may be fractional.

```
// get the extent, check if it contains a location…
var extent = map.extent(),
    loc = new MM.Location(37.764, -122.419);
if (!extent.containsLocation(loc)) {
  // then enclose the location and set the map's new extent
  extent.encloseLocation(loc);
  map.extent(extent);
}
```

## Map Properties

<a name="Map.autoSize"></a>
### autoSize `map.autoSize`
The **autoSize** property is set to `true` if no dimensions are provided in the [constructor](#Map). When **autoSize** is `true`, the map's dimensions are recalculated (and the map is [redrawn](#Map.draw)) [on window resize](https://developer.mozilla.org/en/DOM/window.onresize).

<a name="Map.coordinate"></a>
### coordinate `map.coordinate`
The map's current center [coordinate](#Coordinate).

<a name="Map.coordLimits"></a>
### coordLimits `map.coordLimits`
An array specifying the map's coordinate bounds, in which the first element defines the top left (northwest) and outermost zoom level, and the second defines the bottom right (southwest) and innermost zoom.

You can adjust the minimum and maximum zoom levels of the map without affecting the bounds with [setZoomRange](#Map.setZoomRange).

<a name="Map.dimensions"></a>
### dimensions `map.dimensions`
The map's current dimensions, expressed as a [Point](#Point).

```
// the bottom right screen coordinate is also its southeast point
var southEast = map.pointLocation(map.dimensions);
```

<a name="Map.parent"></a>
### parent `map.parent`
The map's parent (container) DOM element.

```
map.parent.style.backgroundColor = "green";
```

<a name="Map.projection"></a>
### projection `map.projection`
The map's projection, also known as Coordinate Reference System (CRS) or Spatial Reference System (SRS).

<a name="Map.tileSize"></a>
### tileSize `map.tileSize`
The pixel dimensions of the map's individual image tiles, expressed as a [Point](#Point). By default, tiles are **256** pixels square.

```
// you can use the tile size to estimate the number of tiles visible
// at any given moment:
var maxRows = Math.ceil(map.dimensions.x / map.tileSize.x);
var maxCols = Math.ceil(map.dimensions.y / map.tileSize.y);
var maxTiles = maxRows * maxCols;
console.log("max tiles:", maxTiles);
```

<a name="Map-events"></a>
## Map Events
Map events are triggered when the map moves (either in response to a direct function call or indirectly, through user interaction with an event handlers) or is [drawn](#Map.draw). You can start and stop listening for map events with [addCallback](#Map.addCallback) and [removeCallback](#Map.removeCallback):

```
function onDrawn(map) {
  console.log("map drawn!");
}

// After this, the onDrawn will be called whenever the map changes.
map.addCallback("drawn", onZoomed);
// Later, remove the callback.
map.removeCallback("drawn", onZoomed);
```

<a name="Map-zoomed"></a>
### "zoomed" `function(map, zoomOffset) { ... }`
Fires when the **map's** zoom level changes, usually in response to [zoomBy](#Map.zoomBy) or [zoomByAbout](#Map.zoomByAbout). Note that the **zoom offset** is the *difference* between the last zoom level and the new zoom level. You can query the map's current zoom level (rather than the offset) with [getZoom](#Map.getZoom).

```
map.addCallback("zoomed", function(map, zoomOffset) {
  console.log("map zoomed by:", zoomOffset);
});
```

<a name="Map-panned"></a>
### "panned" `function(map, panOffset) { ... }`
Fires when the **map** is panned, and receives the **pan offset** (delta) in pixels as a two-element array (`[dx, dy]`).

```
map.addCallback("panned", function(map, panOffset) {
  var dx = panOffset[0],
      dy = panOffset[1];
  console.log("map panned by x:", dx, "y:", dy);
});
```

<a name="Map-resized"></a>
### "resized" `function(map, dimensions) { ... }`
Fires when the **map** is resized, and receives the map's new **dimensions** as a [Point](#Point) object.

```
map.addCallback("panned", function(map, dimensions) {
  console.log("map dimensions:", dimensions.x, "y:", dimensions.y);
});
```

<a name="Map-extentset"></a>
### "extentset" `function(map, locationsOrExtent) { ... }`
Fires whenever the **map's** full extent is set, and receives the [Extent](#Extent) or array of [Location](#Location) objects provided to [setExtent](#Map.setExtent) or [extent](#Map.extent).

```
map.addCallback("extentset", function(map, extent) {
  // convert to an Extent instance if it's a Location array
  if (extent instanceof Array) {
    extent = MM.Extent.fromArray(extent);
  }
  console.log("map extent:", extent);
});
```

<a name="Map-drawn"></a>
### "drawn" `function(map) { ... }`
Fires whenever the **map** is [redrawn](#Map.draw).

```
map.addCallback("drawn", function(map) {
  console.log("map drawn!");
});
```

<a name="Location"></a>
## MM.Location
Location objects represent [geographic coordinates](http://en.wikipedia.org/wiki/Geographic_coordinate_system) on the Earth's surface, expressed as degrees *latitude* and *longitude*. The constructor takes these two values as its arguments:

```
new MM.Location(latitude, longitude)
```

Locations are most often used when [getting](#Map.getCenter) and [setting](#Map.setCenter) the center of a [map](#Map). You can read the latitude and longitude of a Location by accessing its `lat` and `lon` properties, respectively:

```
var center = map.getCenter(),
    latitude = center.lat,
    longitude = center.lon;
```

Note that the [Map](#Map) class doesn't store any references to Location objects internally. Both the [getCenter](#Map.getCenter) and [setCenter](#Map.setCenter) methods convert between geographic and [tile coordinate](#Coordinate) systems, and return copies of objects rather than references. This means that changing the `lat` and `lon` properties of a Location object returned from **getCenter** won't change the map's center; you have to call **setCenter** with the modified Location object.

<a name="Location.lat"></a>
### lat `location.lat`
The location's **latitude**, or distance from the Earth's [equator](http://en.wikipedia.org/wiki/Prime_meridian) in degrees. `-90` is at the bottom of the globe (the south pole in Antarctica), `0` is at the equator, and `90` is at the top (the north pole in the Arctic Ocean).

**NOTE:** Because ModestMaps uses a [spherical Mercator projection](http://en.wikipedia.org/wiki/Mercator_projection), points at Earth's extreme north and south poles become infinitely large and impossible to model. This limits the effective range of web maps to `±85º`, depending on zoom level. Setting a map's center to a Location with a latitude outside of this range will most likely have undesired consequences.

<a name="Location.lon"></a>
### lon `location.lon`
The location's **longitude**, or distance from the [prime meridian](http://en.wikipedia.org/wiki/Prime_meridian) in degrees. Positive values are east of the prime meridian (towards Asia); negative values are west (towards North America). `±180` degrees is near the [international date line](http://en.wikipedia.org/wiki/International_Date_Line). Longitude values outside of the `[-180, 180]` range "wrap", so a longitude of `190` degrees may be converted to `-170` in certain calculations.

<a name="Location.fromString"></a>
### Location.fromString `MM.Location.fromString(str)`
Parse a string in the format `"lat,lon"` into a new Location object.

<a name="Location.distance"></a>
### Location.distance `MM.Location.distance(a, b, earthRadius)`
Get the physical distance (along a [great circle](http://en.wikipedia.org/wiki/Great_circle)) between locations **a** and **b**, assuming an optional **Earth radius**:

* `6378000` meters (the default)
* `3963.1` "statute" miles
* `3443.9` nautical miles
* `6378` kilometers

<a name="Location.interpolate"></a>
### Location.interpolate `MM.Location.interpolate(a, b, t)`
Interpolate along a [great circle](http://en.wikipedia.org/wiki/Great_circle) between locations **a** and **b** at bias point **t** (a number between 0 and 1).

<a name="Location.bearing"></a>
### Location.bearing `MM.Location.bearing(a, b)`
Determine the direction in degrees between locations **a** and **b**. Note that bearing direction is not constant along significant [great cirlce](http://en.wikipedia.org/wiki/Great_circle) arcs.

<a name="Location-location"></a>
### A warning about the `location` variable name
Because browsers reserve the `window.location` variable for [information](https://developer.mozilla.org/en/DOM/window.location) about the current page location, we suggest using variable names other than `location` to avoid namespace conflicts. `center` and `loc` are good alternatives.


<a name="Extent"></a>
## MM.Extent
Extent objects represent rectangular geographic bounding boxes, and are identified by their `north`, `south`, `east` and `west` bounds. North and south bounds are expressed as degrees [latitude](#Location.lat); east and west bounds are degrees [longitude](#Location.lon). The constructor takes two forms:

```
new MM.Extent(north, west, south, east)
```
Create an extent bounded by **north**, **west**, **south** and **east** edges.

```
new MM.Extent(northWest, southEast)
```
Create an extent containing both **northWest** and **southEast** [locations](#Location).

<a name="Extent.north"></a>
### north `extent.north`
The northern edge of the extent. The [constructor](#Extent) compares northern and southern values and selects the higher of the two as its `north`.
<a name="Extent.south"></a>
### south `extent.south`
The southern edge of the extent. The [constructor](#Extent) compares northern and southern values and selects the lower of the two as its `south`.
<a name="Extent.east"></a>
### east `extent.east`
The eastern edge of the extent. The [constructor](#Extent) compares eastern and western values and selects the higher of the two as its `east`.
<a name="Extent.west"></a>
### west `extent.west`
The western edge of the extent. The [constructor](#Extent) compares eastern and western bounds and selects the lower of the two values as its `west`.

<a name="Extent.northWest"></a>
### northWest `extent.northWest()`
Get the extent's northwest corner as a [Location](#Location).
<a name="Extent.northEast"></a>
### northEast `extent.northEast()`
Get the extent's northeast corner as a [Location](#Location).
<a name="Extent.southEast"></a>
### southEast `extent.southEast()`
Get the extent's southeast corner as a [Location](#Location).
<a name="Extent.southWest"></a>
### southWest `extent.southWest()`
Get the extent's southwest corner as a [Location](#Location).
<a name="Extent.center"></a>
### center `extent.center()`
Get the extent's center as a [Location](#Location).

<a name="Extent.containsLocation"></a>
### containsLocation `extent.containsLocation(lcoation)`
Returns `true` if the **location** falls within the **extent**, otherwise `false`.

```
var extent = new MM.Extent(37.8, -122.5, 37.6, -122.3);
var sf = new MM.Location(37.764, -122.419);
var oakland = new MM.Location(37.804, -122.271);
extent.containsLocation(sf); // true
extent.containsLocation(oakland); // false
```

<a name="Extent.encloseLocation"></a>
### encloseLocation `extent.encloseLocation(location)`
Update the bounds of **extent** to include the provided **location**.

```
var extent = new MM.Extent(37.8, -122.5, 37.6, -122.3);
var oakland = new MM.Location(37.804, -122.271);
extent.encloseLocation(oakland);
extent.containsLocation(oakland); // true
```

<a name="Extent.encloseLocations"></a>
### encloseLocations `extent.encloseLocations(locations)`
Update the bounds of **extent** to include the provided **locations** (an array of [Location](#Location) objects).

<a name="Extent.encloseExtent"></a>
### encloseExtent `extent.encloseExtent(otherExtent)`
Update the bounds of **extent** to include the bounds of the **other extent**.

<a name="Extent.setFromLocations"></a>
### setFromLocations `extent.setFromLocations(locations)`
Reset the bounds of the **extent** and enclose the provided **locations**.

<a name="Extent.copy"></a>
### copy `extent.copy()`
Copy the **extent** and its `north`, `south`, `east` and `west` values.

<a name="Extent.toArray"></a>
### toArray `extent.toArray()`
Returns a two-element array containing the **extent**'s [northwest](#Extent.northWest) and [southeast](#Extent.southEast) locations.

<a name="Extent.fromString"></a>
### Extent.fromString `MM.Extent.fromString(str)`
Parse a string in the format `"north,west,south,east"` into a new Extent object.

<a name="Extent.fromArray"></a>
### Extent.fromArray `MM.Extent.fromArray(locations)`
Create a new Extent object from an array of [Location](#Location) objects.


<a name="Point"></a>
## MM.Point
Point objects represent *x* and *y* coordinates on the screen, such as a [map's dimensions](#Map.dimensions) and the position of mouse or touch interactions.

```
new MM.Point(x, y)
```
Create a new Point object with **x** and **y** coordinates. `parseFloat()` is used to convert string values to numbers. The resulting object has `x` and `y` properties.

Point objects can be used with [pointLocation](#Map.pointLocation) to determine the [geographic coordinates](#Location) of a point on the  screen inside a map. For instance:

```
// define the map's dimensions
var size = new MM.Point(640, 480);
// create a map without any layers or event handlers
var map = new MM.Map("map", [], size, []);
// zoom to San Francisco
map.setCenterZoom(new MM.Location(37.764, -122.419), 8);
// get the geographic coordinates of the bottom right corner
var southEast = map.pointLocation(size);
```

And vice-versa, you can use [locationPoint](#Map.locationPoint) to get the screen position of a geographic coordinate:

```
var oakland = new MM.Location(37.804, -122.271);
var point = map.locationPoint(oakland);
// do something with point.x and point.y
```

### Point.distance `MM.Point.distance(a, b)`
Compute the [Euclidian distance](http://en.wikipedia.org/wiki/Euclidean_distance) between two Point objects.

### Point.interpolate `MM.Point.interpolate(a, b, t)`
Compute the point on a straight line between points **a** and **b** at normal distance **t**, a number between `0` and `1`. (If `t == .5` the point will be halfway between **a** and **b**.)

<a name="Coordinate"></a>
## MM.Coordinate
Coordinate objects are used internally by ModestMaps to model the surface of the Earth in  [Google's spherical Mercator projection](http://en.wikipedia.org/wiki/Google_Maps#Map_projection), which flattens the globe into a square, or *tile*. Coordinate objects represent points within that tile at different `zoom` levels, with `column` and `row` properties indicating their *x* and *y* positions, respectively. Each round number column and row within a zoom level represents a 256-pixel square image displayed in a ModestMaps [tile layer](#Layer).

```
new Coordinate(row, column, zoom)
```

<a name="Coordinate.zoom"></a>
### zoom `coordinate.zoom`
Coordinates are always expressed relative to a specific **zoom** level. At zoom `0`, the Earth fits into a single square tile, `Coordinate(0, 0, 0)`. With each increase in zoom, every tile is divided into 4 parts, so at zoom level `1` the Earth becomes 4 tiles; at zoom level `2` it becomes 16. Coordinates can be converted to different zoom levels with [zoomTo](#Coordinate.zoomTo).

<a name="Coordinate.column"></a>
### column `coordinate.column`
A Coordinate's `column` represents a tile's relative *x* position at its zoom level. At zoom `0` there is one column. With each increase in zoom, the number of columns doubles, so at zoom `1` there are two (`0 >= column < 2`), at zoom `2` there are four (`0 >= column < 4`), and so on.

<a name="Coordinate.row"></a>
### row `coordinate.row`
A Coordinate's `row` represents a tile's relative *y* position at its zoom level. At zoom `0` there is only one tile. With each increase in zoom, the number of rows doubles, so at zoom `1` there are two (`0 >= row < 2`), at zoom `2` there are four (`0 >= row < 4`), and so on.

<a name="Coordinate.copy"></a>
### copy `coordinate.copy()`
Copy the **coordinate**'s `zoom`, `row` and `column` properties into a new **Coordinate** object.

<a name="Coordinate.container"></a>
### container `coordinate.container()`
Create a Coordinate object that contains **coordinate** by flooring its `zoom`, `column` and `row` properties. This is the actual "tile" coordinate.

<a name="Coordinate.zoomTo"></a>
### zoomTo `coordinate.zoomTo(zoom)`
Copy **coordinate** and adjust its `row` and `column` properties to match the new **zoom** level.

<a name="Coordinate.zoomBy"></a>
### zoomBy `coordinate.zoomBy(zoomOffset)`
Zoom **coordinate** by the the specified **zoom offset** and return a new Coordinate object.

<a name="Coordinate.up"></a>
### up `coordinate.up()`
Get the Coordinate above **coordinate**.

<a name="Coordinate.right"></a>
### right `coordinate.right()`
Get the Coordinate to the right of **coordinate**.

<a name="Coordinate.down"></a>
### down `coordinate.down()`
Get the Coordinate below **coordinate**.

<a name="Coordinate.left"></a>
### left `coordinate.left()`
Get the Coordinate to the left of **coordinate**.

<a name="Coordinate.toKey"></a>
### toKey `coordinate.toKey()`
Generate a string key for the **coordinate**, e.g. `"(1,1,5)"` (`"zoom,row,column"`).

<a name="Coordinate.toString"></a>
### toString `coordinate.toString()`
Format the **coordinate** as a human-readable string, e.g. `"(5,4 @ 1)"` (`("row,column @ zoom")`)


<a name="Coordinate-pre-projecting"></a>
### Pre-projecting
Coordinate are also useful for "pre-projecting" [locations](#Location). Because conversions between screen and geographic coordinates are more computationally expensive than conversions between screen and tile coordinates, you may wish to do the [Location to Coordinate](#Map.locationCoordinate) conversion once then do [Coordinate to Point](#Map.coordinatePoint) conversions subsequently. For example:

```
var map = new MM.Map("map", …);
var sfLocation = new MM.Location(37.764, -122.419);
var sfCoordinate = map.locationCoordinate(sfLocation);
// assuming there is an "sf" element, with CSS positon: absolute
var marker = map.parent.appendChild(document.getElementById("sf"));
map.addCallback("drawn", function() {
    var point = map.coordinatePoint(sfCoordinate);
    marker.style.left = point.x + "px";
    marker.style.top = point.y + "px";
});
```

In this example, `map.coordinatePoint(sfCoordinate)` will be much faster than calling `map.locationPoint(sfLocation)` each time the map is redrawn. You probably won't notice the performance gain with one marker, but you certainly will with hundreds.



<a name="TemplatedLayer"></a>
## MM.TemplatedLayer
The **TemplatedLayer** class provides a simple interface for making layers with templated tile URLs.

```
new MM.TemplatedLayer(templateURL [, subdomains])
```
Create a layer in which each tile image's URL is a variation of the **URL template** and optional list of **subdomains**.

You can learn more about templated tile URLs in the [Template](#Template) reference. Here are some examples:

```
var toner = new MM.TemplatedLayer("http://tile.stamen.com/toner/{Z}/{X}/{Y}.png");
var bing = new MM.TemplatedLayer("http://ecn.t0.tiles.virtualearth.net/tiles/r{Q}?" +
    "g=689&mkt=en-us&lbl=l1&stl=h");
var osm = new MM.TemplatedLayer("http://tile.openstreetmap.org/{Z}/{X}/{Y}.png");
```


<a name="Layer"></a>
## MM.Layer
Map layers are where map imagery (including but not limited to tiles) gets rendered. The **Layer** class does all of the heavy lifting to determine which tiles are visible at any given moment, loads them if necessary, then adds them to the DOM and positions them on screen.

```
new MM.Layer(provider [, parent])
```
Create a new map layer that uses a **provider**, optionally specifying a custom **parent** element (or container). A layer's **provider** is an instance of the [MapProvider](#MapProvider) class, which converts [tile coordinates](#Coordinate) into image URLs. This example provides [Placehold.it](http://placehold.it/) URLs that list the tile coordinates:

```
var provider = new MM.MapProvider(function(coord) {
    return "http://placehold.it/256x256&text=" +
        [coord.zoom, coord.column, coord.row].join("/");
});
var layer = new MM.Layer(provider);
map.addLayer(layer);
```

The [Template](#Template) class simplifies generating image URLs for tile servers with popular template formats.

<a name="Layer.getProvider"></a>
### getProvider `layer.getProvider()`
Get the layer's current provider.

<a name="Layer.setProvider"></a>
### setProvider `layer.setProvider()`
Set the layer's current provider.

<a name="Layer.destroy"></a>
### destroy `layer.destroy()`
Destroy the layer, removing all of its tiles from memory and removing its **parent** element from the map.

<a name="Layer.draw"></a>
### draw `layer.draw()`
Redraw the layer by loading, unloading, adding, removing, and repositioning tile images as appropriate. Changing the provider triggers a **draw**.

<a name="Layer.requestRedraw"></a>
### requestRedraw `layer.requestRedraw()`
Request a layer redraw in 1 second. This works just like [Map.redraw](#Map.redraw).


<a name="MapProvider"></a>
## MM.MapProvider
Map providers convert [tile coordinates](#Coordinate) to image URLs. If your image tiles come in either [XYZ](#TemplateProvider-XYZ) or [quadkey](#TemplateProvider-Quadkey) formats, you should use the [TemplateProvider](#TemplateProvider) class.

```
new MM.MapProvider(getTileUrl)
```

**MapProvider** is an abstract class, meaning that it is meant to be [extended](#MM.extend). The constructor takes a function as its only argument, which is expected to return an image URL (or `null`) for a given [tile coordinate](#Coordinate). This example emulates the behavior of [Template](#Template) using a static URL template:

```
var provider = new MM.MapProvider(function(coord) {
    return "http://tile.stamen.com/toner/{Z}/{X}/{Y}.png"
        .replace("{Z}", coord.zoom)
        .replace("{X}", coord.column)
        .replace("{Y}", coord.row);
});
// Coordinate(row, col, zoom)
provider.getTile(new MM.Coordinate(1, 2, 3));
// returns: "http://tile.stamen.com/toner/3/2/1.png"
```

Map providers expose the following interface to [Layer](#Layer) objects:

<a name="MapProvider.getTile"></a>
### getTile `provider.getTile(tileCoord)`
Generates a tile URL or DOM element for the given **tile coordinate**. If the returned value is a string, an `<img>` element is created. Otherwise, if truthy, the return value is assumed to be a DOM element.

For instance, you could create a map provider that generates `<canvas>` elements for each tile by customizing **getTile** like so (note that in this case, your tiles will need to either reside on the same server or be served with the appropriate [CORS headers](http://enable-cors.org/)):

```
var myProvider = new MM.MapProvider(function(coord) {
    return "path/to/tiles/" +
        [coord.zoom, coord.column, coord.row].join("/") +
        ".png";
});
myProvider.getTile = function(coord) {
    var url = this.getTileUrl(coord);
    if (url) {
        var canvas = document.createElement("canvas");
        canvas.width = canvas.height = 256;
        var ctx = canvas.getContext("2d"),
            img = new Image();
        img.onload = function() {
            canvas.drawImage(img);
        };
        img.src = url;
        return canvas;
    }
};
```

NOTE: Because layers cache elements returned by this function, there is no guarantee that **getTile** will be called subsequently after a call to **releaseTile** with the same tile coordinate. If your provider needs to be notified of "re-added" tiles (ones that are generated once, released, then added again from the cache), it should implement [reAddTile](#MapProvider.reAddTile).

<a name="MapProvider.getTileUrl"></a>
### getTileUrl `provider.getTileUrl(tileCoord)`
Get the URL of the tile with the provided **coordinate**. In the abstract **MapProvider** class, **getTile** and **getTileUrl**

<a name="MapProvider.releaseTile"></a>
### releaseTile `provider.releaseTile(tileCoord)`
Clean up any resources required to display the **tile coordinate's** corresponding tile image or element. This is probably only necessary if your provider maintains references (such as a list or numeric reference count) to tiles generated by **getTile**.

<a name="MapProvider.reAddTile"></a>
### reAddTile `provider.reAddTile(tileCoord)`
If a provider implements the **reAddTile** method, cached tiles will be passed to this function so that the provider can know about the re-addition of tiles revived from the layer cache.


<a name="Template"></a>
## MM.Template
ModestMap's Template class extends [MapProvider](#MapProvider), and converts [tile coordinates](#Coordinate) to image URLs using a standard template format. These are the same constructor arguments as in [TemplatedLayer](#TemplatedLayer):

```
new MM.Template(urlTemplate [, subdomains])
```
Create a new templated provider based on the specified **URL template**, and an optional array of **subdomain** replacements. URL templates may contain the following placeholders:

<a name="Template.XYZ"></a>
### X, Y, Z `http://example.com/tiles/{Z}/{X}/{Y}.ext`
In an **XYZ** template, the `{X}`, `{Y}` and `{Z}` placeholders are replaced with each [tile's](#Coordinate) `column`, `row` and `zoom` properties, respectively.

```
var toner = new MM.Template("http://tile.stamen.com/toner/{Z}/{X}/{Y}.png");
```

<a name="Template.quadkey"></a>
### Quadkey `http://example.com/tiles/{Q}.ext`
In a **quadkey** template, the `{Q}` placeholder is replaced with each [tile's](#Coordinate) [quadkey string](http://msdn.microsoft.com/en-us/library/bb259689.aspx). These are found on Microsoft's [Bing Maps](http://www.bing.com/maps/) (previously VirtualEarth) tile servers:

```
var bingBase = "http://ecn.t0.tiles.virtualearth.net/tiles/r{Q}?";
var bing = new MM.Template(bingBase + "g=689&mkt=en-us&lbl=l1&stl=h");
```

<a name="Template.subdomains"></a>
### Subdomains `http://{S}.example.com/...`
If an array of **subdomains** is passed to the Template constructor, tile URLs will substitute a predictable selection from the array for any `{S}` placeholder (e.g., the first one gets `subdomains[0]`, the second gets `subdomains[1]`, etc.). Many tile servers support loading via multiple subdomains, e.g.:

```
var osm = new MM.Template("http://{S}.tile.openstreetmap.org/{Z}/{X}/{Y}.png",
    ["a", "b", "c", "d"]);
var bing = new MM.Template("http://ecn.t{S}.tiles.virtualearth.net/tiles/r{Q}" +
    "?g=689&mkt=en-us&lbl=l1&stl=h",
    [1, 2, 3, 4]);
var terrain = new MM.Template("http://{S}.tile.stamen.com/terrain/{Z}/{X}/{Y}.png",
    "a b c d".split(" "));
```

**Multiple subdomains may drastically speed up your maps!** Most browsers place limits on the number of URLs that can be loaded simultaneously from each domain. Using two subdomains in effect doubles the number of image tiles that can load at the same time.

NOTE: `{S}` placeholders need not *necessarily* refer to subdomains. You could, for instance, vary the entire hostname of each tile, like so:

```
var template = new MM.TemplateProvider("http://{S}/tiles/{Z}/{X}/{Y}.png",
    ["example.com", "example.org", "example.net"]);
```


## Package Utilities
These are provided as useful shortcuts, often used to provide cross-browser compatibility.

### MM.extend `MM.extend(childClass, parentClass)`
Extend the `prototype` of **child class** with previously unspecified methods from the **parent class**'s `prototype`. This is how you extend classes in ModestMaps:

```
var MyLayer = function(provider) {
    // do something MyLayer-specific
    // then call the Layer constructor
    MM.Layer.call(this, provider);
};

MyLayer.prototype = {
    getTile: function(coord) {
        // do something cool here
    }
};

MM.extend(MyLayer, MM.Layer);
```

### MM.coerceLayer `MM.coerceLayer(layerish)`
Coerce the provided **layerish** string or object into a [Layer](#Layer), according to the following rules:

1. If **layerish** is a string, return a new [TemplatedLayer](#TemplatedLayer) with **layerish** as the URL template.
2. If **layerish** has a `draw` function, assume that it's a [Layer](#Layer) instance and return it.
3. Otherwise, assume that it's a [MapProvider](#MapProvider) and return a new [Layer](#Layer) with it as the constructor argument: `new MM.Layer(layerish)`.

### MM.addEvent `MM.addEvent(element, eventType, listener)`
Adds the **listener** to the provided **DOM element** for the given **event type**. In browsers that support [DOM Level 2 events](http://www.w3.org/TR/DOM-Level-2-Events/), this calls `element.addEventListener(eventType, listener, false)`. In older versions of Internet Explorer, this uses `element.attachEvent()`.

```
var link = document.getElementById("null-island"),
    nullIsland = new MM.Location(0, 0);
MM.addEvent(link, "click", function(e) {
    map.setCenterZoom(nullIsland, 12);
    return MM.cancelEvent(e);
});
```

You can remove event listeners with [MM.removeEvent](#MM.removeEvent).

### MM.removeEvent `MM.removeEvent(element, eventType, listener)`
Removes the **listener** from **element** for the given **event type**.

```
MM.removeEvent(link, "click", onClick);
```

### MM.cancelEvent `MM.cancelEvent(event)`
Does whatever is necessary to cancel the provided DOM event and returns `false`. This is useful for preventing the default behavior or `click` events, e.g.:

```
var zoomIn = document.getElementById("zoom-in");
MM.addEvent(zoomIn, "click", function(e) {
    map.zoomIn();
    return MM.cancelEvent(e);
});
```

### MM.getStyle `MM.getStyle(element, property)`
Get the **element**'s [computed style](https://developer.mozilla.org/en/DOM/window.getComputedStyle) of the named **CSS property**.

```
var bgcolor = MM.getStyle(map.parent, "background-color");
```

### MM.moveElement `MM.moveElement(element, point)`
Updates the CSS properties of **element** so that it appears at the absolute position **point**. If available, this function uses [CSS transforms](http://www.w3.org/TR/css3-transforms/) (which are often hardware accelerated, and thus faster than traditional `top` and `left` properties).


```
var marker = document.getElementById("marker"),
    sf = new MM.Location(37.764, -122.419);
map.addCallback("drawn", function() {
    var point = map.locationPoint(sf);
    MM.moveElement(marker, point);
});
```

(See the section on [pre-projecting](#Coordinate-pre-projecting) for a slightly better way of doing this.)

### MM.getFrame `MM.getFrame(frameCallback)`
This is a stand-in for [requestAnimationFrame](https://developer.mozilla.org/en/DOM/window.requestAnimationFrame), a feature of modern browsers that calls the **frame callback** function as often as possible without affecting page repainting.

### MM.transformProperty `MM.transformProperty`
The name of the property used by the running browser to provide [CSS transforms](http://www.w3.org/TR/css3-transforms/).

### MM.matrixString `MM.matrixString(point)`
Convert **point** into a CSS transform-compatible matrix string.

