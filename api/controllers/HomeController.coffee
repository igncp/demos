_ = require 'lodash'
util = require 'util'

module.exports = {
    index: ((req,res)->
        data = {demos: demosInfoSe.getInfo('d3js')}
        res.view 'home/index', data
    )
}