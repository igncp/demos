_ = require 'lodash'
util = require 'util'

demos = [
    ['Force Chart', 'd3js', 'force']
    ['Partition Chart', 'd3js', 'partition']
    ['Pie Chart', 'd3js', 'pie-chart']
]

demos = _.map(demos, (item)->
    {name: item[0], category: item[1], slug: item[2], route: util.format('/%s/%s', item[1], item[2]) }
)

module.exports = {
    index: ((req,res)->
        data = {demos: demos}
        res.view 'home/index', data
    )
}