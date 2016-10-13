function Carnivore(x, y, lawn){

    this.energyLossPerTurn = 5;
    this.preySearchRadius = 4;
    this.pregnancyThreshold = 400;

    this.x = x;
    this.y = y;
    this.lawn;
    this.energy = 200;
    this.alive = 1;
    this.pregnant = 0;

    this.colorScale = d3.scale.linear().range(["#ffeda0", "#f03b20"]).domain([0, this.pregnancyThreshold]);
}

Carnivore.moves = [
        {dx: -1, dy: -1}, // NE
        {dx:  0, dy: -1}, // N
        {dx:  1, dy: -1}, // NW
        {dx:  1, dy:  0}, // W
        {dx:  1, dy:  1}, // SW
        {dx:  0, dy:  1}, // S
        {dx: -1, dy:  1}, // SE
        {dx: -1, dy:  0}, // E
    ];

Carnivore.initPopulation = function(count, lawn, creatures) {
    for(var i = 0; i < count; ++i){
        var col = Math.round(Math.random() * lawn.maxX);
        var row = Math.round(Math.random() * lawn.maxY);
        var creature = new Carnivore(col, row, lawn);
        creatures.push(creature);
    }
    return creatures;
};

Carnivore.prototype.live = function(lawn, creatures) {
    // Eat if possible
    eat = 0;
    var x = this.x;
    var y = this.y;
    var prey = creatures.filter(function(c){
        return ((c instanceof Herbivore) && c.alive && c.x == x && c.y == y);
    });
    if(prey.length > 0) {
        prey = prey[0];
        prey.alive = 0;
        eat = prey.energy;
        this.energy += eat;
    }

    // If nothing to eat then try to move
    if(eat <= 0) {
        this.moveBestOf(creatures, lawn);
    }

    // Multiply
    if(this.energy >= this.pregnancyThreshold){
        this.pregnant = 1;
        this.energy -= 200;
    }

    // Burn energy or die!
    this.energy -= this.energyLossPerTurn;
    if(this.energy <= 0) {
        this.alive = 0;
    }
};

Carnivore.prototype.giveBirth = function(lawn) {
    var babies = new Array();
    if(this.pregnant) {
        baby = new Carnivore(this.x, this.y);
        baby.moveRandom(lawn);
        babies.push(baby);
        this.pregnant = 0;
    }
    return babies;
}

Carnivore.prototype.moveBestOf = function(creatures, lawn) {
    var x = this.x;
    var y = this.y;
    var r = this.preySearchRadius;
    closePrey = creatures.filter(function(c) { return (c instanceof Herbivore) && Math.abs(c.x - x) <= r && Math.abs(c.y - y) <= r });
    var sumX = 0, sumY = 0;
    var count = 0;
    closePrey.forEach(function (p) { sumX += p.x; sumY += p.y; ++count; });

    if(count === 0) {
        if(this.energy > 50) {
            this.moveRandom(lawn);
        }
        else {
            this.energy += Math.round(this.energyLossPerTurn * 0.75); // Sleep!
        }
    }
    else {
        var avgX = sumX / count;
        var avgY = sumY / count;
        var newX = x;
        var newY = y;

        if(avgX < x){
            newX = x - 1;
        }
        else if(avgX > x){
            newX = x + 1;
        }

        if(avgY < y){
            newY = y - 1;
        }
        else if(avgY > y){
            newY = y + 1;
        }

        if(newX >= 0 && newX <= lawn.maxX){
            this.x = newX;
        }
        if(newY >= 0 && newY <= lawn.maxX){
            this.y = newY;
        }
    }
};

Carnivore.prototype.moveRandom = function(lawn) {
    move = Carnivore.moves[Math.round(Math.random() * 7)]
    newX = this.x + move.dx;
    newY = this.y + move.dy;
    if(newX >= 0 && newX <= lawn.maxX && newY >= 0 && newY <= lawn.maxY) {
        this.x = newX;
        this.y = newY;
    }
};

Carnivore.prototype.getColor = function() {
    return this.colorScale(this.energy);
};