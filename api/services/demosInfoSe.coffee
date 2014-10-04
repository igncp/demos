# Demos info service

_ = require 'lodash'
YAML = require 'yamljs'

info = {}
info.d3js = []
info.raphael = []

d3js = YAML.load 'api/info/d3js.yml'
raphael = YAML.load 'api/info/raphael.yml'

# Transform object into an array
for item of d3js
  DI = d3js[item]
  DI.key = item
  DI.category = 'd3js'
  DI.route = '/d3js/' + item
  info.d3js.push DI

for item of raphael
  RI = raphael[item]
  RI.key = item
  RI.category = 'raphael'
  RI.route = '/raphael/' + item
  info.raphael.push RI

module.exports = {
  getInfo: ((category, key)->
    if key then return _.where(info[category], {key: key})[0]
    else return info[category]
  )
}