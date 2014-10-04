_ = require 'lodash'
util = require 'util'


module.exports = {
  index: ((req,res)->
    # TODO: Cache demos variable
    demosD3 = demosInfoSe.getInfo('d3js')
    demosRaphael = demosInfoSe.getInfo('raphael')
    demos = demosD3.concat(demosRaphael)
    demos = _.sortBy(demos, 'name')
    data = {demos: demos, metas: metasSe.getMetas('','',true)}
    res.view 'home/index', data
  )
}