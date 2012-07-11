# Introduction

Welcome to 

# Class Reference

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
Convert a **point on the screen** to a [location](#Location) (a point on the earth).

<a name="Map.pointCoordinate"></a>
### pointCoordinate `map.pointCoordinate(screenPoint)`
Convert a **point on the screen** to a [tile coordinate](#Coordinate).

<a name="Map.locationPoint"></a>
### locationPoint `locationPoint(location)`
Convert a **location** (a point on the earth) to a [point](#Point) on the screen.

<a name="Map.locationCoordinate"></a>
### locationCoordinate `map.locationCoordinate(location)`
Convert a **location** (a point on the earth) to a [tile coordinate](#Coordinate).

<a name="Map.coordinateLocation"></a>
### coordinateLocation `map.coordinateLocation(coord)`
Convert a [tile coordinate](#Coordinate) to a [location](#Location) (a point on the earth).

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



# Table of Contents

## [Step by Step](#StepByStep)
* [Making a map](#Making-a-map)
* [Adding layers](#Adding-layers)
* ???

## [Map](#Map)
* [getCenter](#Map.getCenter)
* [setCenter](#Map.setCenter)
* [getZoom](#Map.getZoom)
* [setZoom](#Map.setZoom)
* [setCenterZoom](#Map.setCenterZoom)
* [getExtent](#Map.getExtent)
* [setExtent](#Map.setExtent)
* [zoomIn](#Map.zoomIn)
* [zoomOut](#Map.zoomOut)
* [zoomBy](#Map.zoomBy)
* [zoomByAbout](#Map.zoomByAbout)
* [panBy](#Map.panBy)
* [panLeft](#Map.panLeft)
* [panRight](#Map.panRight)
* [panUp](#Map.panUp)
* [panDown](#Map.panDown)
* [center](#Map.center)
* [zoom](#Map.zoom)
* [extent](#Map.extent)
* [addLayer](#Map.addLayer)
* [removeLayer](#Map.removeLayer)
* [getLayers](#Map.getLayers)
* [getLayerAt](#Map.getLayerAt)
* [setLayerAt](#Map.setLayerAt)
* [insertLayerAt](#Map.insertLayerAt)
* [removeLayerAt](#Map.removeLayerAt)
* [swapLayersAt](#Map.swapLayersAt)
* [addCallback](#Map.addCallback)
* [removeCallback](#Map.removeCallback)
* [pointLocation](#Map.pointLocation)
* [pointCoordinate](#Map.pointCoordinate)
* [locationPoint](#Map.locationPoint)
* [locationCoordinate](#Map.locationCoordinate)
* [coordinateLocation](#Map.coordinateLocation)
* [coordinatePoint](#Map.coordinatePoint)
* [setZoomRange](#Map.setZoomRange)
* [setSize](#Map.setSize)
* [autoSize](#Map.autoSize)
* [dimensions](#Map.dimensions)
* [draw](#Map.draw)
* [requestRedraw](#Map.requestRedraw)
* [parent](#Map.parent)
* [coordinate](#Map.coordinate)
* [coordLimits](#Map.coordLimits)
* [tileSize](#Map.tileSize)

## [TemplatedLayer](#TemplatedLayer)

## [Location](#Location)

## [Extent](#Extent)

## [Point](#Point)

## [Coordinate](#Coordinate)


## [Layer](#Layer)
* [getProvider](#Layer.getProvider)
* [setProvider](#Layer.setProvider)
* [draw](#Layer.draw)
* [requestRedraw](#Layer.requestRedraw)

## [Template](#Template)

## [MapProvider](#MapProvider)
* [getTile](#MapProvider.getTile)
* [getTileUrl](#MapProvider.getTileUrl)
* [releaseTile](#MapProvider.releaseTile)
* [reAddTile](#MapProvider.reAddTile)