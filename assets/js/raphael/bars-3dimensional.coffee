window.Charts = window.Charts || {}
window.Charts.raphael = window.Charts.raphael || {}
window.Charts.raphael['bars-3dimensional'] = window.Charts.raphael['bars-3dimensional'] || {}

ch = window.Charts.raphael['bars-3dimensional']

ch.getData = (cb)->
  $.ajax('/data/raphael/bars-3dimensional/data.json').done((data)->
    ch.data = data.results
    ch.setData()
    cb()
  )

ch.setData = ->
  data = ch.data
  data.keys = Object.keys(data)
  data.seriesDisplayed = 0
  data.seriesLength = data[data.keys[0]].length
  data.keysLength = data.keys.length
  data.keys.forEach((item)-> ch.dom.els[item] = {})

ch.setCg = (config = {})->
  ch.cg = _.extend({
    colorScheme: ['#C1252D', '#5F3A5F', '#51A8D0']
    deep: 5
    easing: 'bounce'
    heightOffset: 100
    ratio: .6
    speed: 800
    width: $('#chart').width()
  }, config)


ch.setDom = -> ch.dom =
  paper: Raphael('chart', ch.cg.width, 245)
  els: {}

ch.drawAxis = ->
  paper = ch.dom.paper
  deep = ch.cg.deep

  # Set back lines
  for i in [0..3]
    path = "M5,#{String(25 * i)} #{ch.cg.width},#{String(ch.cg.heightOffset + i * 25)}"
    paper.path(path).attr({'stroke-dasharray': '. '})

  # Set chart floor
  paper.path("M0,#{deep + 100} #{deep},100 #{ch.cg.width},#{100 + ch.cg.heightOffset}" + \
    " #{ch.cg.width - deep},#{100 + ch.cg.heightOffset + deep}Z")
    .attr({stroke:'none', fill:'#999'})

ch.calcH0 = (it, se)-> 100 - ch.data[it][se]
ch.calcH5 = (it, se)-> 100 - ch.data[it][se] + 5 * ch.cg.ratio
ch.calcH10 = (it, se)-> 100 - ch.data[it][se] + 10 * ch.cg.ratio

ch.calcInnerPath = ((it, se)->
  "M0,#{ch.calcH5(it, se)} 15,#{ch.calcH10(it, se)} " + \
    "15,#{100 + 10 * ch.cg.ratio} 0,#{100 + 5 * ch.cg.ratio}Z"
)

ch.calcOuterPath = ((it, se)->
  "M0,#{ch.calcH5(it, se)} 5,#{ch.calcH0(it, se)} 20,#{ch.calcH5(it, se)}" + \
  " 20,#{100 + 5 * ch.cg.ratio} 15,#{100 + 10 * ch.cg.ratio} 0,#{100 + 5 * ch.cg.ratio}Z"
)

ch.createCountries = ((i)->
  data = ch.data
  paper = ch.dom.paper
  data.keys.forEach((item, index)->
    ch.dom.els[item].inner = paper.path(ch.calcInnerPath(item, i))
    ch.dom.els[item].outer = paper.path(ch.calcOuterPath(item, i))
      .attr({opacity:'.5'})

    ch.dom.els[item].el.push ch.dom.els[item].inner, ch.dom.els[item].outer

    # Separate bars
    ch.dom.els[item].el.transform("T #{String(ch.cg.width / (data.keysLength) * index)}," + \
      "#{String(ch.cg.heightOffset / (data.keysLength) * index)}")
    
    ch.dom.els[item].el.attr({fill:'#C1252D', stroke:'none', title: item + ': ' + data[item][i]})
  )
)

ch.animateCountries = ((i)->
  data = ch.data
  data.keys.forEach((item, index)->
    ch.dom.els[item].inner.animate({path: ch.calcInnerPath(item, i)}, ch.cg.speed, ch.cg.easing)
    ch.dom.els[item].outer.animate({path: ch.calcOuterPath(item, i)}, ch.cg.speed, ch.cg.easing)
    ch.dom.els[item].el.animate({fill: ch.cg.colorScheme[i]}, ch.cg.speed)
  )
)

ch.bindClickEvent = ->
  data = ch.data
  $('.animate-bars').bind('click', (e)->
    e.preventDefault()
    
    if data.seriesDisplayed + 1 is data.seriesLength then data.seriesDisplayed = 0
    else data.seriesDisplayed = data.seriesDisplayed + 1

    ch.animateCountries data.seriesDisplayed
  )

ch.render = ->
  ch.drawAxis()
  ch.data.keys.forEach((item)-> ch.dom.els[item].el = ch.dom.paper.set())
  ch.bindClickEvent()
  ch.createCountries(ch.data.seriesDisplayed)

ch.ready = ->
  ch.setCg()
  ch.setDom()
  ch.getData(ch.render)

# Necessary for testing
window.Charts.raphael['bars-3dimensional'].refreshAlias = ->
  ch = window.Charts.raphael['bars-3dimensional']