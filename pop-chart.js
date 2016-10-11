function PopChart(element) {
    this.element = element;
    this.margin = {top: 20, right: 20, bottom: 40, left: 40};
    this.width = 540 - this.margin.left - this.margin.right;
    this.height = 250 - this.margin.top - this.margin.bottom;

    this.xScale = d3.scale.linear().range([0, this.width]);
    this.yScale = d3.scale.linear().range([this.height, 0]);

    this.xAxis = d3.svg.axis()
        .scale(this.xScale)
        .orient("bottom")
        .ticks(10);

    this.yAxis = d3.svg.axis()
        .scale(this.yScale)
        .orient("left")
        .ticks(10);

    this.valueLine = d3.svg.line()
        .x(function(d) { return this.xScale(d.iteration); })
        .y(function(d) { return this.yScale(d.population); });

    this.svg = d3.select(element).append("p").append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
}

PopChart.prototype.update = function(data) {

    data.splice(0, data.length - 2000)

    if(data.length == 2){
        this.xScale.domain([0, d3.max(data, function(d) { return d.iteration; })]);
        this.yScale.domain([0, d3.max(data, function(d) { return d.population; })]);

        this.svg.append("path")
            .attr("class", "line")
            .attr("d", this.valueLine(data));

        this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(this.xAxis);

        this.svg.append("g")
            .attr("class", "y axis")
            .call(this.yAxis);
    }
    else if(data.length > 2){
        this.xScale.domain([0, d3.max(data, function(d) { return d.iteration; })]);
        this.yScale.domain([0, d3.max(data, function(d) { return d.population; })]);

        var svg = d3.select(this.element).transition();

        svg.select(".line")
            .duration(100)
            .attr("d", this.valueLine(data));
        svg.select(".x.axis")
            .duration(100)
            .call(this.xAxis);
        svg.select(".y.axis")
            .duration(100)
            .call(this.yAxis);
    }
};