var margin = {
    top: 40,
    right: 40,
    bottom: 40,
    left: 60
};

var width = 700;
var height = 580;
var inputValue = null;

var svg = d3.select( "body" )
    .append( "svg" )
    .attr( "width", width )
    .attr( "height", height );
var country_data, ID_data = {};
var g = svg.append( "g" );

var albersProjection = d3.geoAlbers()
    .scale( 190000 )
    .rotate( [71.057,0] )
    .center( [0, 42.313] )
    .translate( [width/2,height/2] );

var geoPath = d3.geoPath()
    .projection( albersProjection );

g.selectAll( "path" )
    .data( neighborhoods_json.features )
    .enter()
    .append( "path" )
    .attr( "fill", "#ccc" )
    .attr( "stroke", "#333")
    .attr( "d", geoPath );





// Use the Queue.js library to read two files
queue()
    .defer(d3.csv, "data/hoods.csv")
    .await(function(error, rawcountry_data) {


        rawcountry_data.forEach(function(d) {
            d.Heroin= d.Heroin;
            d.Marijuana=d.Marijuana;
            Heroin = parseFloat(d.Heroin);
            Marijuana = parseFloat(d.Marijuana);

        });



        rawcountry_data.forEach(function(d) {
            ID_data[d.neighborhood] = d;
        });

        g.selectAll( "path" )
            .data( neighborhoods_json.features )
            .enter()
            .append( "path" )
            .attr( "fill", "#ccc" )
            .attr( "stroke", "#333")
            .attr( "d", geoPath );

        //updateChoropleth();
    });


/*
function updateChoropleth() {
    // grab data_ from page
    var data_ = d3.select("#selector")
        .node()
        .value;

    // grab data points for data_ so we can calculate domain
    var data_Values = rawcountry_data.map(function(d) {
        return d[data_];
    });


    colorscale
        .domain(d3.extent(data_Values))
        .range([


            '#c6dbef',
            '#6baed6',
            '#2171b5',
            '#08306b',

        ]);


    svg.selectAll(".map")
        .attr("fill", function(d) {
            return retrievevalue(d, data_);
        })




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
        .style("stroke-width", 1)
        .style("fill", function(d){return d;});



    legend.selectAll('text')
        .text(function(d, i) {
            var extent = colorscale.invertExtent(d);
            format = d3.format(".1s");
            boundary = format(+extent[0]);
            boundary2 = format(+extent[1]);
            var total = boundary+grouptext(data_)+ " to " + boundary2 + grouptext(data_);

            return total
        });
    legend.exit().remove();

}

function grouptext(data_) {
    if (data_ === "Heroin" || data_ === "Marijuana") {
        return "????????????????"
    } else {
        return "";
    };
}

function retrievevalue(d, data_) {
    var countryData = getit(d);
    var data_Value = countryData[data_];
    return colorscale(data_Value);
}

function getit(d) {
    return ID_data[d.properties.adm0_a3_is] || 0;
}

 */

