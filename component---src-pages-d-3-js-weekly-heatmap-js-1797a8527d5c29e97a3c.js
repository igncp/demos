(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[5],{7897:function(t,e,a){"use strict";a.r(e),a.d(e,{default:function(){return u}});var n=a(7294),r=a(7538),o=function(){var t=100,e=50,a=50,n=50,r=$("#chart").innerWidth()-e-a,o=Math.ceil(10*r/24)-n-t+60,u=Math.floor(r/24),l=2*u,i=["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"],d=["Mo","Tu","We","Th","Fr","Sa","Su"],s=["1 am","2 am","3 am","4 am","5 am","6 am","7 am","8 am","9 am","10 am","11 am","12 am","1 pm","2 pm","3 pm","4 pm","5 pm","6 pm","7 pm","8 pm","9 pm","10 pm","11 pm","12 pm"];d3.tsv("/data/d3js/weekly-heatmap/data.tsv",(function(t){return{day:+t.day,hour:+t.hour,value:+t.value}}),(function(c,m){var f=d3.scale.quantile().domain([0,8,d3.max(m,(function(t){return t.value}))]).range(i),p=d3.select("#chart").append("svg").attr({height:o+n+t,width:r+e+a}).append("g").attr("transform","translate("+e+","+n+")");p.selectAll(".dayLabel").data(d).enter().append("text").text((function(t){return t})).attr({class:function(t,e){return e>=0&&e<=4?"dayLabel mono axis axis-workweek":"dayLabel mono axis"},transform:"translate(-6,"+u/1.5+")",x:0,y:function(t,e){return e*u}}).style("text-anchor","end"),p.selectAll(".timeLabel").data(s).enter().append("text").text((function(t){return t})).attr({class:function(t,e){return e>=7&&e<=16?"timeLabel mono axis axis-worktime":"timeLabel mono axis"},transform:"translate("+u/2+", -6)",x:function(t,e){return e*u},y:0}).style("text-anchor","middle");var h=p.selectAll(".hour").data(m).enter().append("rect").attr({class:"hour bordered",height:u,rx:4,ry:4,width:u,x:function(t){return(t.hour-1)*u},y:function(t){return(t.day-1)*u}}).style("fill",i[0]);h.transition().duration(6e3).style("fill",(function(t){return f(t.value)})),h.attr("data-title",(function(t){return"Value: "+t.value})),d3utils.tooltip(".hour",{tOpts:{delay:{hide:0,show:500}}});var x=p.selectAll(".legend").data([0].concat(f.quantiles()),(function(t){return t})).enter().append("g").attr("class","legend");x.append("rect").attr("x",(function(t,e){return l*e})).attr("y",o).attr("width",l).attr("height",u/2).style({fill:function(t,e){return i[e]},stroke:"#CCC"}),x.append("text").attr("class","mono").text((function(t){return"≥ "+Math.round(t)})).attr("x",(function(t,e){return l*e})).attr("y",o+u)}))},u=function(t){var e=t.pageContext.demoInfo;return n.createElement(r.Z,{demoInfo:e,main:o,scripts:["/vendors/d3/d3.min.js","/js/d3js-utils.js"]},n.createElement("div",{className:"weekly-heatmap-chart",id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-weekly-heatmap-js-1797a8527d5c29e97a3c.js.map