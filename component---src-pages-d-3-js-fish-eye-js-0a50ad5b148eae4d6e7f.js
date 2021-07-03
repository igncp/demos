(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[118],{3389:function(t,e,a){"use strict";a.r(e),a.d(e,{default:function(){return s}});var n=a(7294),i=a(7538),r={ready:function(){return r.setCg(),r.setDom(),r.setVars(),r.getData(r.render)},render:function(){r.setChartTitle(),r.setBackground(),r.setPointer(),r.setFilter(),r.setAxis(),r.setLabels(),r.setDots(),r.setTitles(),r.bindMousemove(),r.bindClick()},setCg:function(){r.cg={margin:{bottom:70,left:70,right:50,top:80}},r.cg.height=700-r.cg.margin.top-r.cg.margin.bottom,r.cg.width=$("#chart").innerWidth()-r.cg.margin.left-r.cg.margin.right},setDom:function(){r.dom={svg:d3.select("#chart").append("svg").attr("width",r.cg.width+r.cg.margin.left+r.cg.margin.right).attr("height",r.cg.height+r.cg.margin.top+r.cg.margin.bottom).append("g").attr("transform","translate("+r.cg.margin.left+","+r.cg.margin.top+")")}},getData:function(t){d3.json("/data/d3js/fish-eye/data.json",(function(e){return r.data=e,t()}))},setChartTitle:function(){return d3utils.middleTitle(r.dom.svg,r.cg.width,"Income Per Capita vs Life Expectancy vs Population vs Region - 180 Countries",-40)},setVars:function(){r.vars={colorScale:d3.scale.category10().domain(["Sub-Saharan Africa","South Asia","Middle East & North Africa","America","Europe & Central Asia","East Asia & Pacific"]),focused:!1,radiusScale:d3.scale.sqrt().domain([0,5e8]).range([5,60]),xScale:d3.fisheye.scale(d3.scale.log).domain([300,1e5]).range([0,r.cg.width]),yScale:d3.fisheye.scale(d3.scale.linear).domain([20,90]).range([r.cg.height,0])}},setAxis:function(){r.dom.xAxis=d3.svg.axis().orient("bottom").scale(r.vars.xScale).tickFormat(d3.format(",d")).tickSize(-r.cg.height),r.dom.yAxis=d3.svg.axis().scale(r.vars.yScale).orient("left").tickSize(-r.cg.width),r.dom.svg.append("g").attr("class","x axis").attr("transform","translate(0,"+r.cg.height+")").call(r.dom.xAxis),r.dom.svg.append("g").attr("class","y axis").call(r.dom.yAxis)},setBackground:function(){return r.dom.svg.append("rect").attr("class","background").attr("width",r.cg.width).attr("height",r.cg.height)},setLabels:function(){r.dom.svg.append("text").attr("class","x label").attr("text-anchor","end").attr("x",r.cg.width-26).attr("y",r.cg.height+26).text("income per capita, inflation-adjusted (dollars)"),r.dom.svg.append("text").attr("class","y label").attr("text-anchor","end").attr("x",-26).attr("y",-40).attr("dy",".75em").attr("transform","rotate(-90)").text("life expectancy (years)")},setFilter:function(){return d3utils.filterColor("circles",r.dom.svg,1.5,.6,!0)},position:function(t){t.attr("cx",(function(t){return r.vars.xScale(t.income)})).attr("cy",(function(t){return r.vars.yScale(t.lifeExpectancy)})).attr("r",(function(t){return r.vars.radiusScale(t.population)}))},setDots:function(){r.dom.dot=r.dom.svg.append("g").attr("class","dots").selectAll(".dot").data(r.data).enter().append("circle").attr("class","dot").style({fill:function(t){return r.vars.colorScale(t.region)},filter:"url(#drop-shadow-circles)",stroke:"black","stroke-width":"1px"}).call(r.position).sort((function(t,e){return e.population-t.population}))},setTitles:function(){r.dom.dot.append("title").text((function(t){return t.name+":\n- Income: "+r.humanizeNumber(t.income)+" $/P.C.\n- Population: "+r.humanizeNumber(t.population)+"\n- Life expectancy: "+t.lifeExpectancy+" years"}))},zoom:function(){var t=d3.mouse(this);return r.vars.xScale.distortion(2.5).focus(t[0]),r.vars.yScale.distortion(2.5).focus(t[1]),r.dom.dot.call(r.position),r.dom.svg.select(".x.axis").call(r.dom.xAxis),r.dom.svg.select(".y.axis").call(r.dom.yAxis)},setPointer:function(){r.dom.pointer=r.dom.svg.append("text").text("+").attr("class","pointer")},bindMousemove:function(){return r.dom.svg.on("mousemove",(function(){r.vars.focused||r.zoom.call(this)}))},bindClick:function(){return r.dom.svg.on("click",(function(){if(r.vars.focused=!r.vars.focused,r.vars.focused){var t=d3.mouse(this);return r.dom.pointer.attr({x:t[0],y:t[1]}).style({opacity:1})}return r.dom.pointer.style({opacity:0}),r.zoom.call(this)}))},humanizeNumber:function(t){for(t=t.toString();;){var e=t.replace(/(\d)(\d{3})($|,|\.)/g,"$1,$2$3");if(t===e)break;t=e}return t}},o=function(){r.ready()},s=function(t){var e=t.pageContext.demoInfo;return n.createElement(i.Z,{demoInfo:e,main:o,scripts:["/vendors/d3/d3.min.js","/vendors/d3-plugins/fisheye/fisheye.js","/js/d3js-utils.js"]},n.createElement("div",{className:"fish-eye-chart",id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-fish-eye-js-0a50ad5b148eae4d6e7f.js.map