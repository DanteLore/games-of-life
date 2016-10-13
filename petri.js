function petri(element, resolution) {
    feedAmount = 500;
    initialHerbivoreCount = 50;
    initialCarnivoreCount = 1;

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
    var lawn = 0;
    var creatures = [];

    function creatureLife() {
        creatures.forEach(function(creature) {
            creature.live(lawn, creatures)
        });

        creatures.forEach(function(creature) {
            creature.giveBirth(lawn).forEach(function(baby){ creatures.push(baby); });
        });

        creatures = creatures.filter(function(creature) { return creature.alive; })
    }

    function redrawCreatures() {
        circle = circle.data(creatures, getKey);
        // Enter
        circle.enter().append("circle")

        // Update
        circle
            .transition()
                .duration(100)
                .attr("cx", function(d) {
                      return xScale(d.x) + radius;
                })
                .attr("cy", function(d) {
                    return yScale(d.y) + radius;
                })
                .style("fill", function(d){
                    return d.getColor();
                })
                .style("stroke", "darkblue")
                .attr("r", radius - 2);

        // Exit
        circle.exit()
            .transition()
                .duration(50)
                .attr("r", 0).remove();
    }

    function redrawLawn() {
        square = square.data(lawn.lawn, getKey);
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

    var populationHistory = [];
    var iterations = 0;
    var chart = new PopChart(element);
    lawn = new Lawn(resolution - 1, resolution - 1);
    (function() {
        ++iterations;
        if(creatures.filter(function(c){ return (c instanceof Herbivore); }).length === 0) {
            creatures = Herbivore.initPopulation(initialHerbivoreCount, lawn, creatures);
        }
        if(creatures.filter(function(c){ return (c instanceof Carnivore); }).length === 0) {
            creatures = Carnivore.initPopulation(initialCarnivoreCount, lawn, creatures);
        }
        lawn.feed(feedAmount);
        creatureLife();
        populationHistory.push({iteration:iterations, population:creatures.length});
        redrawLawn();
        redrawCreatures();
        chart.update(populationHistory);
        setTimeout(arguments.callee,100);
    })();
}
