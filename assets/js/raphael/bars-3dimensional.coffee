ready = ( ->
  $.ajax('/data/raphael/bars-3dimensional/data.json').done((graphData)->
    data = graphData.results
    paper = Raphael('chart', 395, 245)
    speed = 800
    easing = 'bounce'

    for i in [0..3]
      path = 'M5,' + String(25 * i) + ' 345,' + String(122 + i * 25)
      paper.path(path).attr({'stroke-dasharray': '. '})

    paper.path('M0,105 5,100 345,222 340,227Z').attr({stroke:'none', fill:'#999'})
  )
)

$(document).ready(ready)

###


innerPath = ' 15,110 0,105z'
outerPath = ' 20,105 15,110 0,105z'

otherEurope_outer = r.path()
canadaBar = r.set()
usaBar = r.set()
ukBar = r.set()
franceBar = r.set()
germanyBar = r.set()
brazilBar = r.set()
africaBar = r.set()
indiaBar = r.set()
chinaBar = r.set()
japanBar = r.set()
ausBar = r.set()
otherLABar = r.set()
otherEuropeBar = r.set()
otherAsiaBar = r.set()
allBars = r.set()
  

createCountries = ((i)->
canada_inner = r.path('M0,' + ((100 - canadaResults[i]) + 5) + ' 15,' + ((100 - canadaResults[i]) + 10) + innerPath);
canada_outer = r.path('M0,' + ((100 - canadaResults[i]) + 5) +  ' 5,' + (100 - canadaResults[i]) + ' 20,' + ((100 - canadaResults[i]) + 5) + outerPath).attr({opacity:'.5'});

usa_inner = r.path('M0,' + ((100 - usaResults[i]) + 5) + ' 15,' + ((100 - usaResults[i]) + 10) + innerPath);
usa_outer = r.path('M0,' + ((100 - usaResults[i]) + 5) +  ' 5,' + (100 - usaResults[i]) + ' 20,' + ((100 - usaResults[i]) + 5) + outerPath).attr({opacity:'.5'});

uk_inner = r.path('M0,' + ((100 - ukResults[i]) + 5) + ' 15,' + ((100 - ukResults[i]) + 10) + innerPath);
uk_outer = r.path('M0,' + ((100 - ukResults[i]) + 5) +  ' 5,' + (100 - ukResults[i]) + ' 20,' + ((100 - ukResults[i]) + 5) + outerPath).attr({opacity:'.5'});


france_inner = r.path('M0,' + ((100 - franceResults[i]) + 5) + ' 15,' + ((100 - franceResults[i]) + 10) + innerPath);
france_outer = r.path('M0,' + ((100 - franceResults[i]) + 5) +  ' 5,' + (100 - franceResults[i]) + ' 20,' + ((100 - franceResults[i]) + 5) + outerPath).attr({opacity:'.5'});


germany_inner = r.path('M0,' + ((100 - germanyResults[i]) + 5) + ' 15,' + ((100 - germanyResults[i]) + 10) + innerPath);
germany_outer = r.path('M0,' + ((100 - germanyResults[i]) + 5) +  ' 5,' + (100 - germanyResults[i]) + ' 20,' + ((100 - germanyResults[i]) + 5) + outerPath).attr({opacity:'.5'});


brazil_inner = r.path('M0,' + ((100 - brazilResults[i]) + 5) + ' 15,' + ((100 - brazilResults[i]) + 10) + innerPath);
brazil_outer = r.path('M0,' + ((100 - brazilResults[i]) + 5) +  ' 5,' + (100 - brazilResults[i]) + ' 20,' + ((100 - brazilResults[i]) + 5) + outerPath).attr({opacity:'.5'});


africa_inner = r.path('M0,' + ((100 - africaResults[i]) + 5) + ' 15,' + ((100 - africaResults[i]) + 10) + innerPath);
africa_outer = r.path('M0,' + ((100 - africaResults[i]) + 5) +  ' 5,' + (100 - africaResults[i]) + ' 20,' + ((100 - africaResults[i]) + 5) + outerPath).attr({opacity:'.5'});


india_inner = r.path('M0,' + ((100 - indiaResults[i]) + 5) + ' 15,' + ((100 - indiaResults[i]) + 10) + innerPath);
india_outer = r.path('M0,' + ((100 - indiaResults[i]) + 5) +  ' 5,' + (100 - indiaResults[i]) + ' 20,' + ((100 - indiaResults[i]) + 5) + outerPath).attr({opacity:'.5'});

china_inner = r.path('M0,' + ((100 - chinaResults[i]) + 5) + ' 15,' + ((100 - chinaResults[i]) + 10) + innerPath);
china_outer = r.path('M0,' + ((100 - chinaResults[i]) + 5) +  ' 5,' + (100 - chinaResults[i]) + ' 20,' + ((100 - chinaResults[i]) + 5) + outerPath).attr({opacity:'.5'});

japan_inner = r.path('M0,' + ((100 - japanResults[i]) + 5) + ' 15,' + ((100 - japanResults[i]) + 10) + innerPath);
japan_outer = r.path('M0,' + ((100 - japanResults[i]) + 5) +  ' 5,' + (100 - japanResults[i]) + ' 20,' + ((100 - japanResults[i]) + 5) + outerPath).attr({opacity:'.5'});

aus_inner = r.path('M0,' + ((100 - ausResults[i]) + 5) + ' 15,' + ((100 - ausResults[i]) + 10) + innerPath);
aus_outer = r.path('M0,' + ((100 - ausResults[i]) + 5) +  ' 5,' + (100 - ausResults[i]) + ' 20,' + ((100 - ausResults[i]) + 5) + outerPath).attr({opacity:'.5'});

otherLA_inner = r.path('M0,' + ((100 - otherLAResults[i]) + 5) + ' 15,' + ((100 - otherLAResults[i]) + 10) + innerPath);
otherLA_outer = r.path('M0,' + ((100 - otherLAResults[i]) + 5) +  ' 5,' + (100 - otherLAResults[i]) + ' 20,' + ((100 - otherLAResults[i]) + 5) + outerPath).attr({opacity:'.5'});

otherEurope_inner = r.path('M0,' + ((100 - otherEuropeResults[i]) + 5) + ' 15,' + ((100 - otherEuropeResults[i]) + 10) + innerPath);
otherEurope_outer = r.path('M0,' + ((100 - otherEuropeResults[i]) + 5) +  ' 5,' + (100 - otherEuropeResults[i]) + ' 20,' + ((100 - otherEuropeResults[i]) + 5) + outerPath).attr({opacity:'.5'});

otherAsia_inner = r.path('M0,' + ((100 - otherAsiaResults[i]) + 5) + ' 15,' + ((100 - otherAsiaResults[i]) + 10) + innerPath);
otherAsia_outer = r.path('M0,' + ((100 - otherAsiaResults[i]) + 5) +  ' 5,' + (100 - otherAsiaResults[i]) + ' 20,' + ((100 - otherAsiaResults[i]) + 5) + outerPath).attr({opacity:'.5'});

canadaBar.push(canada_inner,canada_outer)
usaBar.push(usa_inner,usa_outer)
ukBar.push(uk_inner,uk_outer)
franceBar.push(france_inner,france_outer)
germanyBar.push(germany_inner,germany_outer)
brazilBar.push(brazil_inner,brazil_outer)
africaBar.push(africa_inner,africa_outer)
indiaBar.push(india_inner,india_outer)
chinaBar.push(china_inner,china_outer)
japanBar.push(japan_inner,japan_outer)
ausBar.push(aus_inner,aus_outer)
otherLABar.push(otherLA_inner,otherLA_outer)
otherEuropeBar.push(otherEurope_inner,otherEurope_outer)
otherAsiaBar.push(otherAsia_inner,otherAsia_outer)

canadaBar.transform('T0,0')
usaBar.transform('T25,9')
ukBar.transform('T50,18')
franceBar.transform('T75,27')
germanyBar.transform('T100,36')
brazilBar.transform('T125,45')
africaBar.transform('T150,54')
indiaBar.transform('T175,63')
chinaBar.transform('T200,72')
japanBar.transform('T225,81')
ausBar.transform('T250,90')
otherLABar.transform('T275,99')
otherEuropeBar.transform('T300,108')
otherAsiaBar.transform('T325,117')

allBars.push(
canadaBar,
usaBar, 
ukBar, 
franceBar, 
germanyBar, 
brazilBar, 
africaBar, 
indiaBar, 
chinaBar, 
japanBar, 
ausBar, 
otherLABar, 
otherAsiaBar, 
otherEuropeBar
)


allBars.attr({fill:'#C1252D', stroke:'none'})
)

animateCountries = ((i)->
canada_inner.animate({path:'M0,' + ((100 - canadaResults[i]) + 5) + ' 15,' + ((100 - canadaResults[i]) + 10) + innerPath}, speed, easing);
canada_outer.animate({path:'M0,' + ((100 - canadaResults[i]) + 5) +  ' 5,' + (100 - canadaResults[i]) + ' 20,' + ((100 - canadaResults[i]) + 5) + outerPath}, speed, easing);

usa_inner.animate({path:'M0,' + ((100 - usaResults[i]) + 5) + ' 15,' + ((100 - usaResults[i]) + 10) + innerPath}, speed, easing);
usa_outer.animate({path:'M0,' + ((100 - usaResults[i]) + 5) +  ' 5,' + (100 - usaResults[i]) + ' 20,' + ((100 - usaResults[i]) + 5) + outerPath}, speed, easing);

uk_inner.animate({path:'M0,' + ((100 - ukResults[i]) + 5) + ' 15,' + ((100 - ukResults[i]) + 10) + innerPath}, speed, easing);
uk_outer.animate({path:'M0,' + ((100 - ukResults[i]) + 5) +  ' 5,' + (100 - ukResults[i]) + ' 20,' + ((100 - ukResults[i]) + 5) + outerPath}, speed, easing);

france_inner.animate({path:'M0,' + ((100 - franceResults[i]) + 5) + ' 15,' + ((100 - franceResults[i]) + 10) + innerPath}, speed, easing);
france_outer.animate({path:'M0,' + ((100 - franceResults[i]) + 5) +  ' 5,' + (100 - franceResults[i]) + ' 20,' + ((100 - franceResults[i]) + 5) + outerPath}, speed, easing);

germany_inner.animate({path:'M0,' + ((100 - germanyResults[i]) + 5) + ' 15,' + ((100 - germanyResults[i]) + 10) + innerPath}, speed, easing);
germany_outer.animate({path:'M0,' + ((100 - germanyResults[i]) + 5) +  ' 5,' + (100 - germanyResults[i]) + ' 20,' + ((100 - germanyResults[i]) + 5) + outerPath}, speed, easing);

brazil_inner.animate({path:'M0,' + ((100 - brazilResults[i]) + 5) + ' 15,' + ((100 - brazilResults[i]) + 10) + innerPath}, speed, easing);
brazil_outer.animate({path:'M0,' + ((100 - brazilResults[i]) + 5) +  ' 5,' + (100 - brazilResults[i]) + ' 20,' + ((100 - brazilResults[i]) + 5) + outerPath}, speed, easing);

africa_inner.animate({path:'M0,' + ((100 - africaResults[i]) + 5) + ' 15,' + ((100 - africaResults[i]) + 10) + innerPath}, speed, easing);
africa_outer.animate({path:'M0,' + ((100 - africaResults[i]) + 5) +  ' 5,' + (100 - africaResults[i]) + ' 20,' + ((100 - africaResults[i]) + 5) + outerPath}, speed, easing);

india_inner.animate({path:'M0,' + ((100 - indiaResults[i]) + 5) + ' 15,' + ((100 - indiaResults[i]) + 10) + innerPath}, speed, easing);;
india_outer.animate({path:'M0,' + ((100 - indiaResults[i]) + 5) +  ' 5,' + (100 - indiaResults[i]) + ' 20,' + ((100 - indiaResults[i]) + 5) + outerPath}, speed, easing);

china_inner.animate({path:'M0,' + ((100 - chinaResults[i]) + 5) + ' 15,' + ((100 - chinaResults[i]) + 10) + innerPath}, speed, easing);
china_outer.animate({path:'M0,' + ((100 - chinaResults[i]) + 5) +  ' 5,' + (100 - chinaResults[i]) + ' 20,' + ((100 - chinaResults[i]) + 5) + outerPath}, speed, easing);

japan_inner.animate({path:'M0,' + ((100 - japanResults[i]) + 5) + ' 15,' + ((100 - japanResults[i]) + 10) + innerPath}, speed, easing);
japan_outer.animate({path:'M0,' + ((100 - japanResults[i]) + 5) +  ' 5,' + (100 - japanResults[i]) + ' 20,' + ((100 - japanResults[i]) + 5) + outerPath}, speed, easing);

aus_inner.animate({path:'M0,' + ((100 - ausResults[i]) + 5) + ' 15,' + ((100 - ausResults[i]) + 10) + innerPath}, speed, easing);
aus_outer.animate({path:'M0,' + ((100 - ausResults[i]) + 5) +  ' 5,' + (100 - ausResults[i]) + ' 20,' + ((100 - ausResults[i]) + 5) + outerPath}, speed, easing);

otherLA_inner.animate({path:'M0,' + ((100 - otherLAResults[i]) + 5) + ' 15,' + ((100 - otherLAResults[i]) + 10) + innerPath}, speed, easing);
otherLA_outer.animate({path:'M0,' + ((100 - otherLAResults[i]) + 5) +  ' 5,' + (100 - otherLAResults[i]) + ' 20,' + ((100 - otherLAResults[i]) + 5) + outerPath}, speed, easing);

otherEurope_inner.animate({path:'M0,' + ((100 - otherEuropeResults[i]) + 5) + ' 15,' + ((100 - otherEuropeResults[i]) + 10) + innerPath}, speed, easing);
otherEurope_outer.animate({path:'M0,' + ((100 - otherEuropeResults[i]) + 5) +  ' 5,' + (100 - otherEuropeResults[i]) + ' 20,' + ((100 - otherEuropeResults[i]) + 5) + outerPath}, speed, easing);

otherAsia_inner.animate({path:'M0,' + ((100 - otherAsiaResults[i]) + 5) + ' 15,' + ((100 - otherAsiaResults[i]) + 10) + innerPath}, speed, easing);
otherAsia_outer.animate({path:'M0,' + ((100 - otherAsiaResults[i]) + 5) +  ' 5,' + (100 - otherAsiaResults[i]) + ' 20,' + ((100 - otherAsiaResults[i]) + 5) + outerPath}, speed, easing);
)


$('.prediction_1').bind('click', (e)->
animateCountries(0)
allBars.animate({fill:'#C1252D'}, speed)
e.preventDefault()
false
)

$('.prediction_2').bind('click', ((e)->
animateCountries(1)
allBars.animate({fill:'#5F3A5F'}, speed)
e.preventDefault()
false
))

$('.prediction_3').bind('click', ((e)->
animateCountries(2)
allBars.animate({fill:'#51A8D0'}, speed)
e.preventDefault()
false
))

createCountries(0)
###