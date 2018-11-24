var margin = {
    top: 40,
    right: 40,
    bottom: 40,
    left: 60
};
var colorscale = d3.scale.quantize();
var width = 700;
var height = 580;
var inputValue = null;
var total = {};
var svg = d3.select( "body" )
    .append( "svg" )
    .attr( "width", width )
    .attr( "height", height );

var g = svg.append( "g" );

var albersProjection = d3.geoAlbers()
    .scale( 190000 )
    .rotate( [71.057,0] )
    .center( [0, 42.313] )
    .translate( [width/2,height/2] );

var geoPath = d3.geoPath()
    .projection( albersProjection );
var legendOptions = {
    leftOffset: 120
};

// set up d3 tooltip
var tip = d3.tip()
    .attr('class', 'd3-tip');
svg.call(tip); //maybe this should be SVG/g???



var country_data, ID_data = {};

var rawcountry_data, ID_data = {};


// Use the Queue.js library to read two files
queue()
    .defer(d3.json, "data/boston.geojson")
    .defer(d3.csv, "data/hoods.csv")
    .await(function(error, mapTopJson, rawcountry_data) {


        rawcountry_data.forEach(function(d) {
            d.Heroin= d.Heroin;
            d.Marijuana=d.Marijuana;
            d.Heroin = parseFloat(d.Heroin);
            d.Marijuana = parseFloat(d.Marijuana);
            d.index = parseFloat(d.index);
            //console.log(Heroin)
        });

        country_data = rawcountry_data.filter(function (d) {
            return d.index < 100;});


        country_data.forEach(function(d) {
            ID_data[d.neighborhood] = d;

        });
        var geoJSON_africa = mapTopJson.features;
        //console.log('geoJSON_africa', geoJSON_africa)



        g.selectAll( "path" )
            .data( geoJSON_africa )
            .enter()
            .append( "path" )
            .attr("class", "map")
            .attr( "d", geoPath );
        //console.log(ID_data)
        //console.log(neighborhoods_json.features)


        updateChoropleth();



    });
//console.log(ID_data)


function updateChoropleth() {


    var data_ = d3.select("#selector")
        .node()
        .value;

    var data_Values = country_data.map(function(d) {
        return d[data_];
    });



    //console.log('<3');
    //console.log(data_Values);
    //console.log('<3');

    colorscale
        .domain(d3.extent(data_Values))
        .range([

            '#eff3ff',
            '#c6dbef',
            '#9ecae1',
            '#6baed6',
            '#4292c6',
            '#2171b5',
            "#084594"

        ]);
    //console.log('B4 the map');

    svg.selectAll(".map")
        .attr("fill", function(d) {
            //return '#08306b';
            return retrievevalue(d, data_); })
        .on('mouseover', function(d) {
                // only show tooltip if we have data for this country
                var countryData = getCountryData(d);
                if (countryData) {
                    tip.show(d);
                }
            })
                .on('mouseout', tip.hide);


    var legend = svg.selectAll('g.legry')
        .data(colorscale.range(), function(d) {
            // key it to itself
            return d;
        });


    var legend_ = legend.enter()
        .append('g')
        .attr('class', 'legry');


    // draw colored boxes
    legend_
        .append('rect')
        .attr("x", width - 580)
        .attr("y", function(d, i) {
            return i * 20 +300;
        })
        .attr("width", 20)
        .attr("height", 20)
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("fill", function(d){
            return d;
        });

    // draw legend label text
    legend_
        .append('text')
        .attr("x", width-550 )
        .attr("y", function(d, i) {
            return i * 20 +315;
        })
        .style("stroke", "black")
        .style("stroke-width", 1);
        //.style("fill", function(d){return d;});

    // UPDATE
    // update colors
    legend.selectAll('rect')
        .style("fill", function(d) {
            //the data objects are the fill colors
            return d;
        });


    legend.selectAll('text')
        .text(function(d, i) {
            var extent = colorscale.invertExtent(d);
            format = d3.format(",.2r");
            //format = d3.format(".1f");
            boundary = format(+extent[0]);
            boundary2 = format(+extent[1]);
            var total = boundary+ " - " + boundary2 + grouptext(data_);


            return total
        });

    legend.exit().remove();


}

function grouptext(data_) {
    if (data_ === "Heroin" || data_ === "Marijuana") {
        return " reports"
    } else {
        return "";
    };
}

function retrievevalue(d, data_) {
    console.log('retrieve');
    var country_data2 = getit(d);
    var data_Value = country_data2[data_];
    console.log("colorscale(data_Value))", colorscale(data_Value));
    return colorscale(data_Value);
}

function getit(d) {
    console.log('ID_data[d.properties.name]', ID_data[d.properties.name]);
    return ID_data[d.properties.name] || 0;

}


