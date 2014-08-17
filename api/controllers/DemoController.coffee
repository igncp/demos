fs = require('fs')

module.exports = {
  d3js: ((req,res)->
    url = 'd3js/' + req.param('demo')

    if fs.existsSync('views/' + url + '.ejs')
      res.view url, {layout: 'layouts/demo-layout'}
    
    else res.notFound()
  )
}