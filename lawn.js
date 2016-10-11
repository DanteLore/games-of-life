function Lawn(maxX, maxY) {
    this.lawn = [];
    this.maxX = maxX;
    this.maxY = maxY;

    for (var row=0; row <= maxX; row++) {
        for (var col=0; col <= maxY; col++) {
            var grass = 25 + Math.round(Math.random() * 10);
            var cell = { x:col, y:row, grass:grass};
            this.lawn.push(cell);
        }
    }
}

Lawn.prototype.feed = function(feedAmount) {
    // Feed the grass
    for(var i = 0; i < feedAmount; ++i) {
        d = this.lawn[Math.round(Math.random() * (this.lawn.length - 1))]
        if(d.grass < 100){
            d.grass++;
        }
    }
}

Lawn.prototype.tileAt = function(x, y) {
    var index = (y * (this.maxX + 1)) + x;
    return this.lawn[index];
}