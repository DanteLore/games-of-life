function petri(element, resolution) {
    feedAmount = 500;
    initialCreatureCount = 50;
    energyLossPerTurn = 10;
    maxEatAmount = 30;

    // Equality comparison for elements
    var getKey = function(d) { return d.y * resolution + d.x; }

    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 540 - margin.left - margin.right,
        height = 540 - margin.top - margin.bottom;

    var xScale = d3.scale.linear().range([0, width]).domain([0, resolution]);
    var yScale = d3.scale.linear().range([height, 0]).domain([0, resolution]);
    var cScale = d3.scale.linear().range(["#f7fcb9", "#31a354"]).domain([0, 100]);

    var svg = d3.select(element).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    var circle = svg.selectAll("circle");
    var square = svg.selectAll("rect");

    var radius = (width / resolution) / 2;
    var lawn = [];
    var creatures = [];

    function initCreatures(){
        for(var i = 0; i < initialCreatureCount; ++i){
            var col = Math.round(Math.random() * (resolution - 1));
            var row = Math.round(Math.random() * (resolution - 1));
            var creature = {
                x:col,
                y:row,
                energy:100,
                alive:1,
                pregnant:0
            };
            creatures.push(creature);
        }
    }

    function initLawn() {
        lawn = [];
        for (var row=0; row<resolution; row++) {
            for (var col=0; col<resolution; col++) {
                var grass = 20 + Math.round(Math.random() * 10);
                var cell = { x:col, y:row, grass:grass};
                lawn.push(cell);
            }
        }
    }

    function lawnLife() {
        // Feed the grass
        for(var i = 0; i < feedAmount; ++i) {
            d = lawn[Math.round(Math.random() * (lawn.length - 1))]
            if(d.grass < 100){
                d.grass++;
            }
        }
    }

    function lawnTileAt(x, y) {
        index = (y * resolution) + x;
        return lawn[index];
    }

    var moves = [
        {dx: -1, dy: -1}, // NE
        {dx:  0, dy: -1}, // N
        {dx:  1, dy: -1}, // NW
        {dx:  1, dy:  0}, // W
        {dx:  1, dy:  1}, // SW
        {dx:  0, dy:  1}, // S
        {dx: -1, dy:  1}, // SE
        {dx: -1, dy:  0}, // E
    ];

    function moveRandom(creature) {
        move = moves[Math.round(Math.random() * 7)]
        newX = creature.x + move.dx;
        newY = creature.y + move.dy;
        if(newX >= 0 && newX < resolution && newY >= 0 && newY < resolution) {
            creature.x = newX;
            creature.y = newY;
        }
    }

    function creatureLife() {
        creatures.forEach(function(creature) {
            // Eat if possible
            tile = lawnTileAt(creature.x, creature.y);
            var eat = Math.min(maxEatAmount, tile.grass);
            creature.energy += eat;
            tile.grass = Math.max(0, tile.grass - eat);

            // If nothing to eat then try to move
            if(eat <= 0) {
                moveRandom(creature);
            }

            // Multiply
            if(creature.energy >= 200){
                creature.pregnant = 1;
                creature.energy -= 100;
            }

            // Burn energy or die!
            creature.energy -= energyLossPerTurn;
            if(creature.energy <= 0) {
                creature.alive = 0;
            }
        });

        creatures.filter(function(creature) { return creature.pregnant; })
            .forEach(function(parent) {
                parent.pregnant = 0;
                baby = {
                    x: parent.x,
                    y: parent.y,
                    energy: 100,
                    alive: 1,
                    pregnant: 0
                }
                moveRandom(baby);
                creatures.push(baby);
            });

        creatures = creatures.filter(function(creature) { return creature.alive; })
    }

    function redrawCreatures() {
        circle = circle.data(creatures);
        // Enter
        circle.enter().append("circle")

        // Update
        circle.attr("cx", function(d) {
              return xScale(d.x) + radius;
        })
        .attr("cy", function(d) {
            return yScale(d.y) + radius;
        })
        .style("fill", "red")
        .attr("r", radius - 2);

        // Exit
        circle.exit().remove();
    }

    function redrawLawn() {
        square = square.data(lawn, getKey);
        // Enter
        square.enter().append("rect");
        // Update
        square
            .attr("x", function(d) {
                return xScale(d.x);
            })
            .attr("y", function(d) {
                return yScale(d.y);
            })
            .attr("height", (width / resolution))
            .attr("width", (width / resolution))
            .style("fill", function(d) {
                return cScale(d.grass);
            })
            .style("stroke", function(d) {
                return cScale(d.grass);
            });
        // Exit
        square.exit().remove();
    }

    var iterations = 0;
    (function() {
        if(lawn.length === 0 || ++iterations > 6000){
            initLawn();
            initCreatures();
            iterations = 0;
        }
        else {
            lawnLife();
            creatureLife();
        }
        redrawLawn();
        redrawCreatures();
        setTimeout(arguments.callee,100);
    })();
}
