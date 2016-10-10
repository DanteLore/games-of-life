
function petri(element, resolution) {
    // Equality comparison for elements
    var getKey = function(d) { return d.y * resolution + d.x; }

    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 540 - margin.left - margin.right,
        height = 540 - margin.top - margin.bottom;

    var xScale = d3.scale.linear().range([0, width]).domain([0, resolution]);
    var yScale = d3.scale.linear().range([height, 0]).domain([0, resolution]);
    var cScale = d3.scale.linear().range(["#ffffff", "#2ca25f"]).domain([0, 100]);

    var svg = d3.select(element).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    var circle = svg.selectAll("circle");
    var square = svg.selectAll("rect");

    var data = [];

    function init() {
        data = [];
        for (var row=0; row<resolution; row++) {
            for (var col=0; col<resolution; col++) {
                grass = 30 + Math.round(Math.random() * 10);
                var cell = { x:col, y:row, grass:grass};
                data.push(cell);
            }
        }
    }

    function life() {
        // Feed the grass
        for(var i = 0; i < 1000; ++i) {
            d = data[Math.round(Math.random() * (data.length - 1))]
            if(d.grass < 100){
                d.grass++
            }
        }
    }

    function redraw(drawData) {
        square = square.data(drawData, getKey);
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
        if(data.length === 0 || ++iterations > 6000){
            init();
            iterations = 0;
        }
        else {
            life();
        }
        redraw(data);
        setTimeout(arguments.callee,100);
    })();
}