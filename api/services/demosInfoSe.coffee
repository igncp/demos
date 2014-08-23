# Demos info service

_ = require 'lodash'
util = require 'util'

info = {
  # NAME, CATEGORY, KEY, SOURCES, NOTES

  'd3js': [
    ['Bars', 'd3js', 'bars', ['http://codepen.io/basemoz/pen/mBoiL'], ['Added axis', 'Changed direction and added color transition for wave effect'], ['data.json']]

    ['Collapsible Tree', 'd3js', 'collapsible-tree', ['http://bl.ocks.org/mbostock/4339083'], [], ['data.json']]

    ['Force', 'd3js', 'force', ['http://codepen.io/MidnightLightning/pen/dclbA'], [], ['links.json', 'nodes.json']]
    
    ['Partition', 'd3js', 'partition', ['http://bl.ocks.org/mbostock/4063423'], ['Added title attributes, labels and change colors with events'], ['flare.json']]

    ['Pie', 'd3js', 'pie', ['http://codepen.io/nishidh41/pen/Frzhq'], ['Added the animation (transition) by changing a random slice data by a random integer between range'], ['data.json']]

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