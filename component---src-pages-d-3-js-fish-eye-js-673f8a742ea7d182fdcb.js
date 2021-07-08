(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[118],{3389:function(t,e,a){"use strict";a.r(e),a.d(e,{default:function(){return c}});var n=a(7294),r=a(7538),o=a(7440),i={ready:function(){return i.setCg(),i.setDom(),i.setVars(),i.getData(i.render)},render:function(){i.setChartTitle(),i.setBackground(),i.setPointer(),i.setFilter(),i.setAxis(),i.setLabels(),i.setDots(),i.setTitles(),i.bindMousemove(),i.bindClick()},setCg:function(){i.cg={margin:{bottom:70,left:70,right:50,top:80}},i.cg.height=700-i.cg.margin.top-i.cg.margin.bottom,i.cg.width=$("#chart").innerWidth()-i.cg.margin.left-i.cg.margin.right},setDom:function(){i.dom={svg:d3.select("#chart").append("svg").attr("width",i.cg.width+i.cg.margin.left+i.cg.margin.right).attr("height",i.cg.height+i.cg.margin.top+i.cg.margin.bottom).append("g").attr("transform","translate("+i.cg.margin.left+","+i.cg.margin.top+")")}},getData:function(t){d3.json("/demos/data/d3js/fish-eye/data.json",(function(e){return i.data=e,t()}))},setChartTitle:function(){return o.Z.middleTitle(i.dom.svg,i.cg.width,"Income Per Capita vs Life Expectancy vs Population vs Region - 180 Countries",-40)},setVars:function(){i.vars={colorScale:d3.scale.category10().domain(["Sub-Saharan Africa","South Asia","Middle East & North Africa","America","Europe & Central Asia","East Asia & Pacific"]),focused:!1,radiusScale:d3.scale.sqrt().domain([0,5e8]).range([5,60]),xScale:d3.fisheye.scale(d3.scale.log).domain([300,1e5]).range([0,i.cg.width]),yScale:d3.fisheye.scale(d3.scale.linear).domain([20,90]).range([i.cg.height,0])}},setAxis:function(){i.dom.xAxis=d3.svg.axis().orient("bottom").scale(i.vars.xScale).tickFormat(d3.format(",d")).tickSize(-i.cg.height),i.dom.yAxis=d3.svg.axis().scale(i.vars.yScale).orient("left").tickSize(-i.cg.width),i.dom.svg.append("g").attr("class","x axis").attr("transform","translate(0,"+i.cg.height+")").call(i.dom.xAxis),i.dom.svg.append("g").attr("class","y axis").call(i.dom.yAxis)},setBackground:function(){return i.dom.svg.append("rect").attr("class","background").attr("width",i.cg.width).attr("height",i.cg.height)},setLabels:function(){i.dom.svg.append("text").attr("class","x label").attr("text-anchor","end").attr("x",i.cg.width-26).attr("y",i.cg.height+26).text("income per capita, inflation-adjusted (dollars)"),i.dom.svg.append("text").attr("class","y label").attr("text-anchor","end").attr("x",-26).attr("y",-40).attr("dy",".75em").attr("transform","rotate(-90)").text("life expectancy (years)")},setFilter:function(){return o.Z.filterColor("circles",i.dom.svg,1.5,.6,!0)},position:function(t){t.attr("cx",(function(t){return i.vars.xScale(t.income)})).attr("cy",(function(t){return i.vars.yScale(t.lifeExpectancy)})).attr("r",(function(t){return i.vars.radiusScale(t.population)}))},setDots:function(){i.dom.dot=i.dom.svg.append("g").attr("class","dots").selectAll(".dot").data(i.data).enter().append("circle").attr("class","dot").style("fill",(function(t){return i.vars.colorScale(t.region)})).style("filter","url(#drop-shadow-circles)").style("stroke","black").style('"stroke-width"',"1px").call(i.position).sort((function(t,e){return e.population-t.population}))},setTitles:function(){i.dom.dot.append("title").text((function(t){return t.name+":\n- Income: "+i.humanizeNumber(t.income)+" $/P.C.\n- Population: "+i.humanizeNumber(t.population)+"\n- Life expectancy: "+t.lifeExpectancy+" years"}))},zoom:function(){var t=d3.mouse(this);return i.vars.xScale.distortion(2.5).focus(t[0]),i.vars.yScale.distortion(2.5).focus(t[1]),i.dom.dot.call(i.position),i.dom.svg.select(".x.axis").call(i.dom.xAxis),i.dom.svg.select(".y.axis").call(i.dom.yAxis)},setPointer:function(){i.dom.pointer=i.dom.svg.append("text").text("+").attr("class","pointer")},bindMousemove:function(){return i.dom.svg.on("mousemove",(function(){i.vars.focused||i.zoom.call(this)}))},bindClick:function(){return i.dom.svg.on("click",(function(){if(i.vars.focused=!i.vars.focused,i.vars.focused){var t=d3.mouse(this);return i.dom.pointer.attr("x",t[0]).attr("y",t[1]).style("opacity",1)}return i.dom.pointer.style("opacity",0),i.zoom.call(this)}))},humanizeNumber:function(t){for(t=t.toString();;){var e=t.replace(/(\d)(\d{3})($|,|\.)/g,"$1,$2$3");if(t===e)break;t=e}return t}},s=function(){i.ready()},c=function(t){var e=t.pageContext.demoInfo;return n.createElement(r.Z,{demoInfo:e,main:s,scripts:["/vendors/d3/d3.min.js","/vendors/d3-plugins/fisheye/fisheye.js","/js/d3js-utils.js"]},n.createElement("div",{className:"fish-eye-chart",id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-fish-eye-js-673f8a742ea7d182fdcb.js.map