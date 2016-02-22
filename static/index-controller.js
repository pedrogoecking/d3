//Width and height
    var w = 800;
    var h = 900;
    var padding = 70;
    var boxheight = 299;
    var strange_y_offset = 40;


//Create SVG elements
    var map = d3.select("#map")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .attr("class","bg");

    var viz = d3.select("#map")
                .append("svg")
                .attr("width",w)
                .attr("height",boxheight)
                .attr("class","bg");


    var viz2 = d3.select("#map")
                .append("svg")
                .attr("width",w)
                .attr("height",boxheight)
                .attr("class","bg");


    var viz3 = d3.select("#map")
                .append("svg")
                .attr("width",w)
                .attr("height",boxheight)
                .attr("class","bg")
                ;



// *** GET THE DATA GOING ***
    var j = JSONstat("http://data.ssb.no/api/v0/dataset/49613.json?lang=no");
    var jtab = j.Dataset(0).toTable( { type : "arrobj", content : "id" } );


// *** HEADLINES *** //
var hl1=["Capital Bruto"];
var text1 = viz.selectAll("text")
                        .data(hl1)
                        .enter()
                        .append("text");

var hl2=["Dívidas"];
var text2 = viz2.selectAll("text")
                        .data(hl2)
                        .enter()
                        .append("text");

var hl3=["Renda Bruta"];
var text3 = viz3.selectAll("text")
                        .data(hl3)
                        .enter()
                        .append("text");

text1
                 .attr("x", function(d) { return 20; })
                 .attr("y", function(d) { return 30; })
                 .attr("width",200)
                 .text( function (d) { return d; })
                 .attr("font-family", "sans-serif")
                 .attr("font-size", "30px")
                 .attr("fill", "black");

text2
                 .attr("x", function(d) { return 20; })
                 .attr("y", function(d) { return 30; })
                 .attr("width",200)
                 .text( function (d) { return d; })
                 .attr("font-family", "sans-serif")
                 .attr("font-size", "30px")
                 .attr("fill", "black");

text3
                 .attr("x", function(d) { return 20; })
                 .attr("y", function(d) { return 30; })
                 .attr("width",200)
                 .text( function (d) { return d; })
                 .attr("font-family", "sans-serif")
                 .attr("font-size", "30px")
                 .attr("fill", "black");


// SELECT SOME SWEET SCALE MAX VALUES //
    var mm = $objeq(jtab,"ContentsCode=='BrFormue'  AND Alder=='999D'");
    var m2 = $objeq(jtab,"ContentsCode=='Gjeld'  AND Alder=='999D'");
    var m3 = $objeq(jtab,"ContentsCode=='Brutto'  AND Alder=='999D'");

vv = [];
for (var v=0; v<mm.length; v++) {
    vv.push(mm[v]["value"]);
}

v2 = [];
for (var v=0; v<m2.length; v++) {
    v2.push(m2[v]["value"]);
}

v3 = [];
for (var v=0; v<m3.length; v++) {
    v3.push(m3[v]["value"]);
}


// *** DO THE SCALE THING ***
    function getDate(d) {
    var year = d.substring(0,4);
    var month=d.substring(5,6)*3;
    var thing = month + '\/01\/' + year;
    //console.log(thing);
    return new Date(year);
}
    function leadO(f) {
        f=f.toString();
        if(f.length==1) {
            f='0' + f;
        }
        return f;
    }

    var x = d3.time.scale()
            .range([padding, (w - padding)])
            .domain([getDate(d3.min(j.Dataset(0).Dimension("Tid").id)), getDate(d3.max(j.Dataset(0).Dimension("Tid").id))])
            ;


    var y = d3.scale.linear()
            .range([(boxheight - padding),0])
            .domain([0,d3.max(vv)*1.05])
            ;

    var y2 = d3.scale.linear()
            .range([(boxheight - padding),0])
            .domain([0,d3.max(v2)*1.05])
            ;

    var y3 = d3.scale.linear()
            .range([(boxheight - padding),0])
            .domain([0,d3.max(v3)*1.05])
            ;

    // *** DO THE MAP THING ***
    //Define map projection
    var projection = d3.geo.mercator()
                           .translate([w/2, h/2])
                           .scale([1500]);

    //Define path generators
    var path = d3.geo.path()
                     .projection(projection);

    var start = $objeq(jtab,"Region=='03' AND ContentsCode=='BrFormue' AND Alder=='999D'");
    var start2 = $objeq(jtab,"Region=='03' AND ContentsCode=='Gjeld' AND Alder=='999D'");
    var start3 = $objeq(jtab,"Region=='03' AND ContentsCode=='Brutto' AND Alder=='999D'");

    var lfunc = d3.svg.line()
                  .x(function(d,i) { return x(getDate(d["Tid"])) })
                  .y(function(d) { return y(d["value"])})
                  .interpolate("cardinal");

    var lfunc2 = d3.svg.line()
                  .x(function(d,i) { return x(getDate(d["Tid"])) })
                  .y(function(d) { return y2(d["value"])})
                  .interpolate("cardinal");

    var lfunc3 = d3.svg.line()
                  .x(function(d,i) { return x(getDate(d["Tid"])) })
                  .y(function(d) { return y3(d["value"])})
                  .interpolate("cardinal");

    viz.selectAll("path.line")
            .data([start])
            .enter()
            .append("svg:path")
            .attr("d",lfunc)
            .attr("transform", "translate(0," + strange_y_offset + ")")
            .attr("stroke","blue")
            .attr("stroke-width", 2)
            .attr("fill","none")
            ;

    viz2.selectAll("path.line")
            .data([start2])
            .enter()
            .append("svg:path")
            .attr("d",lfunc2)
            .attr("transform", "translate(0," + strange_y_offset + ")")
            .attr("stroke","blue")
            .attr("stroke-width", 2)
            .attr("fill","none")
            ;

    viz3.selectAll("path.line")
            .data([start3])
            .enter()
            .append("svg:path")
            .attr("d",lfunc3)
            .attr("transform", "translate(0," + strange_y_offset + ")")
            .attr("stroke","blue")
            .attr("stroke-width", 2)
            .attr("fill","none")
            ;

// *** Load in GeoJSON data
    d3.json("../static/fylker.json", function(json) {
        //console.log(json.features);

        //Bind data and create one path per GeoJSON feature
        map.selectAll("path")
           .data(json.features)
           .enter()
           .append("path")
           .attr("d", path)
           .attr("transform", "translate(-480,2280)")
           .attr("class", "fylke")
           .on("click", function (d) {

                //console.log(d.properties.fylkesnr);
                d3.select(".selected").classed("selected", false);
                d3.select(this).classed("selected", true)

                    viz.selectAll("path")
                        .attr("stroke","#aaa");

                    viz2.selectAll("path")
                        .attr("stroke","#aaa");

                    viz3.selectAll("path")
                        .attr("stroke","#aaa");

                    viz.selectAll("path")
                    .data([$objeq(jtab,"Region=='" + leadO(d.properties.fylkesnr) + "' AND ContentsCode=='BrFormue' AND Alder=='999D'")])
                    .transition()
                    .delay(200)
                    .duration(500)
                    .attr("d",lfunc)
                    .attr("transform", "translate(0," + strange_y_offset + ")")
                    .attr("stroke","blue")
                    .attr("stroke-width", 2)
                    .attr("fill","none");

                    viz2.selectAll("path")
                    .data([$objeq(jtab,"Region=='" + leadO(d.properties.fylkesnr) + "' AND ContentsCode=='Gjeld' AND Alder=='999D'")])
                    .transition()
                    .delay(700)
                    .duration(500)
                    .attr("d",lfunc2)
                    .attr("transform", "translate(0," + strange_y_offset + ")")
                    .attr("stroke","blue")
                    .attr("stroke-width", 2)
                    .attr("fill","none");

                    viz3.selectAll("path")
                    .data([$objeq(jtab,"Region=='" + leadO(d.properties.fylkesnr) + "' AND ContentsCode=='Brutto' AND Alder=='999D'")])
                    .transition()
                    .delay(1200)
                    .duration(500)
                    .attr("d",lfunc3)
                    .attr("transform", "translate(0," + strange_y_offset + ")")
                    .attr("stroke","blue")
                    .attr("stroke-width", 2)
                    .attr("fill","none");

                    console.log($objeq(jtab,"Region=='" + leadO(d.properties.fylkesnr) + "' AND ContentsCode=='BrFormue' AND Alder=='999D'"));
            });

        map.selectAll("path")
        .data(json.features)
        .append("svg:title")
        .attr("class", function(d) { return "path " + d.properties.fylkesnr; })
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.properties.navn; })
        ;
    });


    var xAxis = d3.svg.axis()
        .scale(x)
        .ticks(d3.time.year, 1)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var y2Axis = d3.svg.axis()
        .scale(y2)
        .orient("left");

    var y3Axis = d3.svg.axis()
        .scale(y3)
        .orient("left");

    function makeYAxis() {
        return d3.svg.axis()
            .scale(y)
            .orient("left");
    }

    function makeY2Axis() {
        return d3.svg.axis()
            .scale(y2)
            .orient("left");
    }

    function makeY3Axis() {
        return d3.svg.axis()
            .scale(y3)
            .orient("left");
    }

    function makeXAxis() {
        return d3.svg.axis()
        .scale(x)
        .ticks(d3.time.year, 1)
        .orient("bottom");
    }

// BOX1
    viz.append("g")
        .call(xAxis)
        .attr("class", "x axis")
        .attr("transform", "translate(" + 0 + " , " + (boxheight - padding + strange_y_offset) + ")");

    viz.append("g")
        .call(yAxis)
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + "," + strange_y_offset + ")");

    viz.append("g")
        .call(makeYAxis()
                .tickSize(- (w - 2*padding) , 0, 0)
                .tickFormat(""))
        .attr("class", "grid")
        .attr("transform", "translate(" + padding + "," + strange_y_offset + ")");

    viz.append("g")
        .call(makeXAxis()
                .tickSize( -(boxheight - padding) , 0, 0)
                .tickFormat(""))
        .attr("class", "grid")
        .attr("transform", "translate(" + 0 + " , " + (boxheight - padding + strange_y_offset) + ")");

// BOX2
    viz2.append("g")
        .call(xAxis)
        .attr("class", "x axis")
        .attr("transform", "translate(" + 0 + " , " + (boxheight - padding + strange_y_offset) + ")");


    viz2.append("g")
        .call(y2Axis)
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + "," + strange_y_offset + ")");

    viz2.append("g")
        .call(makeY2Axis()
                .tickSize(- (w - 2*padding) , 0, 0)
                .tickFormat(""))
        .attr("class", "grid")
        .attr("transform", "translate(" + padding + "," + strange_y_offset + ")");

    viz2.append("g")
        .call(makeXAxis()
                .tickSize( -(boxheight - padding) , 0, 0)
                .tickFormat(""))
        .attr("class", "grid")
        .attr("transform", "translate(" + 0 + " , " + (boxheight - padding + strange_y_offset) + ")");


// BOX3
    viz3.append("g")
        .call(xAxis)
        .attr("class", "x axis")
        .attr("transform", "translate(" + 0 + " , " + (boxheight - padding + strange_y_offset) + ")");


    viz3.append("g")
        .call(y3Axis)
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + "," + strange_y_offset + ")");

    viz3.append("g")
        .call(makeY3Axis()
                .tickSize(- (w - 2*padding) , 0, 0)
                .tickFormat(""))
        .attr("class", "grid")
        .attr("transform", "translate(" + padding + "," + strange_y_offset + ")");

    viz3.append("g")
        .call(makeXAxis()
                .tickSize( -(boxheight - padding) , 0, 0)
                .tickFormat(""))
        .attr("class", "grid")
        .attr("transform", "translate(" + 0 + " , " + (boxheight - padding + strange_y_offset) + ")");