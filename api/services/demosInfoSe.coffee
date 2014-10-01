# Demos info service

_ = require 'lodash'
YAML = require 'yamljs'

info = {}
info.d3js = []

d3js = YAML.load 'api/info/d3js.yml'

# Transform object into an array
for item of d3js
  DI = d3js[item]
  DI.key = item
  DI.route = '/d3js/' + item
  info.d3js.push DI

module.exports = {
  getInfo: ((category, key)->
    if key then return _.where(info[category], {key: key})[0]
    else return info[category]
  )
}