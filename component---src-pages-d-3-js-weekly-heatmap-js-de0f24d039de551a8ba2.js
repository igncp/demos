(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[5],{1887:function(t,e,a){"use strict";a.r(e),a.d(e,{default:function(){return b}});var r=a(7294),n=a(7538),u=a(2137),o=a(7757),c=a.n(o),i=a(8649),s=a(1616),l=["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"],d=["Mo","Tu","We","Th","Fr","Sa","Su"],m=["1 am","2 am","3 am","4 am","5 am","6 am","7 am","8 am","9 am","10 am","11 am","12 am","1 pm","2 pm","3 pm","4 pm","5 pm","6 pm","7 pm","8 pm","9 pm","10 pm","11 pm","12 pm"],p=function(){var t=(0,u.Z)(c().mark((function t(){var e,a;return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=function(t){return{day:+t.day,hour:+t.hour,value:+t.value}},t.next=3,i.pvA("/demos/data/d3js/weekly-heatmap/data.tsv");case 3:return a=t.sent,t.abrupt("return",a.map(e));case 5:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),f=100,h=50,x=50,y=50,v=function(){var t=(0,u.Z)(c().mark((function t(e){var a,r,n,u,o,p,v,w,b,g,k;return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:a=e.data,r=e.rootElId,n=document.getElementById(r).getBoundingClientRect().width-h-x,u=Math.ceil(10*n/24)-y-f+60,o=Math.floor(n/24),p=2*o,v=i.Fp7(a,(function(t){return t.value})),w=i.FTZ().domain([0,8,v]).range(l),(b=i.Ys("#"+r).append("svg").attr("height",u+y+f).attr("width",n+h+x).append("g").attr("transform","translate("+h+","+y+")")).selectAll(".dayLabel").data(d).enter().append("text").text((function(t){return t})).attr("class",(function(t,e){return e>=0&&e<=4?"dayLabel mono axis axis-workweek":"dayLabel mono axis"})).attr("transform","translate(-6,"+o/1.5+")").attr("x",0).attr("y",(function(t,e){return e*o})).style("text-anchor","end"),b.selectAll(".timeLabel").data(m).enter().append("text").text((function(t){return t})).attr("class",(function(t,e){return e>=7&&e<=16?"timeLabel mono axis axis-worktime":"timeLabel mono axis"})).attr("transform","translate("+o/2+", -6)").attr("x",(function(t,e){return e*o})).attr("y",0).style("text-anchor","middle"),(g=b.selectAll(".hour").data(a).enter().append("rect").attr("class","hour bordered").attr("height",o).attr("rx",4).attr("ry",4).attr("width",o).attr("x",(function(t){return(t.hour-1)*o})).attr("y",(function(t){return(t.day-1)*o})).style("fill",l[0])).transition().duration(6e3).style("fill",(function(t){return w(t.value)})),g.attr("data-title",(function(t){return"Value: "+t.value})),s.Z.tooltip(".hour",{tOpts:{delay:{hide:0,show:500}}}),(k=b.selectAll(".legend").data([0].concat(w.quantiles()),(function(t){return t})).enter().append("g").attr("class","legend")).append("rect").attr("x",(function(t,e){return p*e})).attr("y",u).attr("width",p).attr("height",o/2).style("fill",(function(t,e){return l[e]})).style("stroke","#CCC"),k.append("text").attr("class","mono").text((function(t){return"≥ "+t.toFixed(2)})).attr("x",(function(t,e){return p*e})).attr("y",u+o);case 17:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),w=function(){var t=(0,u.Z)(c().mark((function t(){var e;return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,p();case 2:e=t.sent,v({data:e,rootElId:"chart"});case 4:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),b=function(t){var e=t.pageContext.demoInfo;return r.createElement(n.Z,{demoInfo:e,main:w},r.createElement("div",{className:"weekly-heatmap-chart",id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-weekly-heatmap-js-de0f24d039de551a8ba2.js.map