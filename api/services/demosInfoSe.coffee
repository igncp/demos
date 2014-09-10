# Demos info service

_ = require 'lodash'
util = require 'util'

info = {
  # NAME, CATEGORY, KEY, SOURCES, NOTES, DATA

  'd3js': [
    ['Area', 'd3js', 'area', ['http://codepen.io/notno/pen/ilvsd'], ['Changed style', 'Added point and voronoi functionality'], ['data.csv']]
    
    ['Bars', 'd3js', 'bars', ['http://codepen.io/basemoz/pen/mBoiL'], ['Added axis', 'Changed direction and added color transition for wave effect', 'Added transition in axis and the add item possibility', 'The interval stops when you place the mouse over a bar'], ['data.json']]
    
    ['Bubbles', 'd3js', 'bubbles', ['http://codepen.io/linghzang3/pen/GFdzh'], ['Using the <a href="https://github.com/novus/nvd3">NV3D</a> extension for D3JS', 'Data taken from the Nike API (via the Codepen)'], ['data.json']]

    ['Chord', 'd3js', 'chord', ['http://bl.ocks.org/mbostock/1308257'], ['Added filters with drop shadow and low opacity', 'Changed scheme and match each color with a country'], ['data.csv']]
    
    ['Collapsible Tree', 'd3js', 'collapsible-tree', ['http://bl.ocks.org/mbostock/4339083'], [], ['data.json']]
    
    ['Concentric Circles', 'd3js', 'concentric-circles', ['http://codepen.io/notno/pen/wgyAz', 'http://bl.ocks.org/cpbotha/5200394', 'http://stackoverflow.com/questions/17671252/d3-create-a-continous-color-scale-with-many-strings-inputs-for-the-range-and-dy'], ['Data of baby names in New York 2012', 'Custom color scale', 'Added box shadow filter'], []]

    ['Force', 'd3js', 'force', ['http://codepen.io/MidnightLightning/pen/dclbA'], [], ['links.json', 'nodes.json']]
    
    ['Icosahedron', 'd3js', 'icosahedron', ['https://gist.github.com/mbostock/7782500'], ['No data bound to it, it could be to the speed, size, colors', 'Added color scale and the sinusoidal x velocity', 'Added the stop and move when clicked'], []]
    
    ['Multi-Line Voronoi', 'd3js', 'multiline-voronoi', ['http://bl.ocks.org/mbostock/8033015'], ['Click one time to just show a line, click again to sho all', 'Added color and dropshadow for 3D effect', 'Added label data and clicked function'], ['data.tsv']]
    
    ['Partition', 'd3js', 'partition', ['http://bl.ocks.org/mbostock/4063423'], ['Added title attributes, labels and change colors with events'], ['flare.json']]

    ['Pie', 'd3js', 'pie', ['http://codepen.io/nishidh41/pen/Frzhq'], ['Added the animation (transition) by changing a random slice data by a random integer between range'], ['data.json']]
    
    ['Spanish Map', 'd3js', 'spain-map', ['http://www.diva-gis.org/datadown'], ['For this chart I reused the code from the World Map chart and other demos', 'Added drop shadow for 3D effect'], ['data.json']]
    
    ['Trend line', 'd3js', 'trend-line', ['http://codepen.io/arundhaj/pen/ouyjd', 'http://big-elephants.com/2014-06/unrolling-line-charts-d3js/'], ['Added both line animations', 'Changed y scale domain'], ['data.tsv']]

    ['Vectors', 'd3js', 'vectors', ['http://codepen.io/zarazum/pen/fjoqF'], ['Use the <strong>Ctrl</strong> key to move nodes instead of creating vectors'], []]

    ['Weekly Heatmap', 'd3js', 'weekly-heatmap', ['http://bl.ocks.org/tjdecke/5558084'], [], ['data.tsv']]
    
    ['World Map', 'd3js', 'world-map', ['http://bost.ocks.org/mike/map/', 'http://bl.ocks.org/mbostock/raw/4090846/world-50m.json', 'http://bl.ocks.org/mbostock/2206590'], ['Added the mouse over stroke and the zooming-unzooming when clicking in countries (from third source)', 'Click a country to zoom, click in the water to set zoom back to normal'], ['world.json']]
  ]
}



info.d3js = _.map(info.d3js, (item)->
  {name: item[0], category: item[1], key: item[2], route: util.format('/%s/%s', item[1], item[2]), sources: item[3], notes: item[4], data: item[5] }
)


module.exports = {
  getInfo: ((category, key)->
    if key then return _.where(info[category], {key: key})[0]
    else return info[category]
  )
}