fs = require('fs')

module.exports = {
  d3js: ((req,res)->
    demo = req.param('demo')
    url = 'd3js/' + demo

    if fs.existsSync('views/' + url + '.ejs')
      files = {}
      files.ejs = fs.readFileSync('views/d3js/' + demo + '.ejs', { encoding: 'utf8' })
      files.coffee = fs.readFileSync('assets/js/d3js/' + demo + \
        '.coffee', { encoding: 'utf8' })
      
      stylePath = 'assets/styles/d3js/' + '_' + demo + '.styl'
      if fs.existsSync(stylePath)
        files.stylus = fs.readFileSync(stylePath, { encoding: 'utf8' })
      else
        files.stylus = false

      if /d3js-utils/.test(files.ejs)
        files.d3utils = fs.readFileSync('assets/js/d3js-utils.coffee', { encoding: 'utf8' })
      else
        files.d3utils = false

      res.view url, {layout: 'layouts/demo-layout', files: files, \
        metas: metasSe.getMetas('d3js',demo)}
    else res.notFound()
  )

  raphael: ((req,res)->
    demo = req.param('demo')
    url = 'raphael/' + demo

    if fs.existsSync('views/' + url + '.ejs')
      files = {}
      files.ejs = fs.readFileSync('views/raphael/' + demo + '.ejs', { encoding: 'utf8' })
      files.coffee = fs.readFileSync('assets/js/raphael/' + demo + \
        '.coffee', { encoding: 'utf8' })
      
      stylePath = 'assets/styles/raphael/' + '_' + demo + '.styl'
      if fs.existsSync(stylePath)
        files.stylus = fs.readFileSync(stylePath, { encoding: 'utf8' })
      else
        files.stylus = false

      res.view url, {layout: 'layouts/demo-layout', files: files, \
        metas: metasSe.getMetas('raphael',demo)}
    
    else res.notFound()
  )
}