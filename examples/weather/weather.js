(function() {

    var NOW = +new Date(),
        TIME_STEP = 600000;
    // quantize
    NOW -= NOW % TIME_STEP;

    MM.WeatherProvider = function(layer, time) {
        this.urlTemplate = "http://g{S}.imwx.com/TileServer/imgs/" + layer + "/u{T}/{Q}.png";
        if (time) this.time = time;
    };

    MM.WeatherProvider.prototype = {
        time: NOW,
        urlTemplate: null,
        getTile: function(c) {
            var quadKey = this.quadKey(c.row, c.column, c.zoom),
                lastChar = quadKey.charAt(quadKey.length - 1);
            return this.urlTemplate
                .replace("{Q}", quadKey)
                .replace("{S}", lastChar)
                .replace("{T}", this.time);
        }
    };

    MM.extend(MM.WeatherProvider, MM.TemplatedMapProvider);

})();
