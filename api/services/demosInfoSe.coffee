# Demos info service

_ = require 'lodash'
util = require 'util'

info = {
  'd3js': [
    ['Collapsible Tree', 'd3js', 'collapsible-tree', ['http://bl.ocks.org/mbostock/4339083'];]
    ['Force', 'd3js', 'force', ['http://codepen.io/MidnightLightning/pen/dclbA'];]
    ['Partition', 'd3js', 'partition', ['http://bl.ocks.org/mbostock/4063423'];]
    ['Pie', 'd3js', 'pie', ['http://codepen.io/nishidh41/pen/Frzhq']]
    ['Vectors', 'd3js', 'vectors', ['http://codepen.io/zarazum/pen/fjoqF']]
  ]
}


info.d3js = _.map(info.d3js, (item)->
    {name: item[0], category: item[1], key: item[2], route: util.format('/%s/%s', item[1], item[2]), sources: item[3] }
)


module.exports = {
  getInfo: ((category, key)->
    if key then return _.where(info[category], {key: key})[0]
    else return info[category]
  )
}