fs = require('fs')

module.exports = {
  d3js: ((req,res)->
    url = 'd3js/' + req.param('demo')

    if fs.existsSync('views/' + url + '.ejs')
      files = {}
      files.ejs = fs.readFileSync('views/d3js/' + req.param('demo') + '.ejs', { encoding: 'utf8' })
      files.coffee = fs.readFileSync('assets/js/d3js/' + req.param('demo') + '.coffee', { encoding: 'utf8' })
      res.view url, {layout: 'layouts/demo-layout', files: files}
    
    else res.notFound()
  )
}