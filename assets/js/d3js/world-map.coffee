width = 1400
height = 500

svg = d3.select("#chart").append("svg").attr("width", width).attr("height", height)

d3.json("/data/d3js/world-map/world.json", (error, world)-> 
  projection = d3.geo.albers().center([0, 55.4]).rotate([4.4, 0]).parallels([50, 60]).scale(3000).translate([width / 2, height / 2])
  path = d3.geo.path().projection(projection)
  svg.append("path").datum(topojson.feature(world, world.objects.countries)).attr("d", path)
)