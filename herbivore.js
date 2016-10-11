function Herbivore(xx, yy){
    this.x = xx;
    this.y = yy;
    this.energy = 100;
    this.alive = 1;
    this.pregnant = 0;
}

Herbivore.moves = [
        {dx: -1, dy: -1}, // NE
        {dx:  0, dy: -1}, // N
        {dx:  1, dy: -1}, // NW
        {dx:  1, dy:  0}, // W
        {dx:  1, dy:  1}, // SW
        {dx:  0, dy:  1}, // S
        {dx: -1, dy:  1}, // SE
        {dx: -1, dy:  0}, // E
    ];

Herbivore.initPopulation = function(count, maxX, maxY) {
    var creatures = []
    for(var i = 0; i < count; ++i){
        var col = Math.round(Math.random() * maxX);
        var row = Math.round(Math.random() * maxY);
        var creature = new Herbivore(col, row);
        creatures.push(creature);
    }
    return creatures;
};

Herbivore.prototype.live = function(lawn, maxEatAmount, foodSearchTries, energyLossPerTurn) {
    // Eat if possible
    tile = lawn.tileAt(this.x, this.y);
    var eat = Math.min(maxEatAmount, tile.grass);
    this.energy += eat;
    tile.grass = Math.max(0, tile.grass - eat);

    // If nothing to eat then try to move
    if(eat <= 0) {
        this.moveBestOf(lawn, foodSearchTries);
    }

    // Multiply
    if(this.energy >= 200){
        this.pregnant = 1;
        this.energy -= 100;
    }

    // Burn energy or die!
    this.energy -= energyLossPerTurn;
    if(this.energy <= 0) {
        this.alive = 0;
    }
};

Herbivore.prototype.giveBirth = function(lawn) {
    var babies = new Array();
    if(this.pregnant) {
        baby = new Herbivore(this.x, this.y);
        baby.moveRandom(lawn);
        babies.push(baby);
        this.pregnant = 0;
    }
    return babies;
}

Herbivore.prototype.moveBestOf = function(lawn, count) {
    var maybe = []
    for(var i = 0; i < count; i++) {
        var move = Herbivore.moves[Math.round(Math.random() * 7)]; // Could be the same. Who cares?
        var x = this.x + move.dx;
        var y = this.y + move.dy;

        if(x >= 0 && x <= lawn.maxX && y >= 0 && y <= lawn.maxY) {
            var tile = lawn.tileAt(x, y);
            maybe.push(tile);
        }
    }

    if(maybe.length === 0) {
        return;
    }

    maybe.sort(function(a, b) { return b.grass - a.grass; })
    var location = maybe[0];
    this.x = location.x;
    this.y = location.y;
};

Herbivore.prototype.moveRandom = function(lawn) {
    move = Herbivore.moves[Math.round(Math.random() * 7)]
    newX = this.x + move.dx;
    newY = this.y + move.dy;
    if(newX >= 0 && newX <= lawn.maxX && newY >= 0 && newY <= lawn.maxY) {
        this.x = newX;
        this.y = newY;
    }
};