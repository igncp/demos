(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[730],{2137:function(t,e,r){"use strict";function n(t,e,r,n,a,u,o){try{var i=t[u](o),c=i.value}catch(s){return void r(s)}i.done?e(c):Promise.resolve(c).then(n,a)}function a(t){return function(){var e=this,r=arguments;return new Promise((function(a,u){var o=t.apply(e,r);function i(t){n(o,a,u,i,c,"next",t)}function c(t){n(o,a,u,i,c,"throw",t)}i(void 0)}))}}r.d(e,{Z:function(){return a}})},7573:function(t,e,r){"use strict";r.r(e),r.d(e,{default:function(){return q}});var n=r(7294),a=r(4275),u=r(2137),o=r(7757),i=r.n(o),c=r(2245),s="weekly-heatmap-module--mono--1FY_w",l="weekly-heatmap-module--axisWorkweek--3eDms",d=["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"],f=d.length,p=["Mo","Tu","We","Th","Fr","Sa","Su"],h=Array.from({length:24}).map((function(t,e){return e%12+1+" "+(e>=11&&23!==e?"pm":"am")})),m=function(){var t=(0,u.Z)(i().mark((function t(){var e;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,c.pvA)("/demos/data/d3js/weekly-heatmap/data.tsv");case 2:return e=t.sent,t.abrupt("return",e.map((function(t){return{day:+t.day,hour:+t.hour,value:+t.value}})));case 4:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),y=100,v=50,x=50,w=50,k=function(t){return"Value: "+t.value},g=function(t){return"≥ "+t.toFixed(2)},b=function(t){var e=t.data,r=t.rootElId,n=document.getElementById(r);n.classList.add("weekly-heatmap-module--weeklyHeatmapChart--3k92Q");var a=n.getBoundingClientRect().width-v-x,u=Math.ceil(10*a/24)-w-y+60,o=Math.floor(a/24),i=2*o,m=(0,c.Fp7)(e,(function(t){return t.value})),b=(0,c.FTZ)().domain([0,f-1,m]).range(d),j=(0,c.Ys)("#"+r).append("svg").attr("height",u+w+y).attr("width",a+v+x).append("g").attr("transform","translate("+v+","+w+")");j.selectAll(".dayLabel").data(p).enter().append("text").text((function(t){return t})).attr("class",(function(t,e){var r="dayLabel "+s+" axis";return e>=0&&e<=4?r+" "+l:r})).attr("transform","translate(-6,"+o/1.5+")").attr("x",0).attr("y",(function(t,e){return e*o})).style("text-anchor","end"),j.selectAll(".timeLabel").data(h).enter().append("text").text((function(t){return t})).attr("class",(function(t,e){var r="timeLabel "+s+" axis";return e>=7&&e<=16?r+" "+l:r})).attr("transform","translate("+o/2+", "+"-6)").attr("x",(function(t,e){return e*o})).attr("y",0).style("text-anchor","middle"),j.selectAll(".hour").data(e).enter().append("rect").attr("class","hour weekly-heatmap-module--bordered--2Vfqv").attr("height",o).attr("rx",100).attr("ry",100).attr("width",o).attr("x",(function(t){return(t.hour-1)*o})).attr("y",(function(t){return(t.day-1)*o})).attr("title",k).style("fill",d[0]).transition().duration(6e3).style("fill",(function(t){return b(t.value)})),$(".hour").tooltip();var q=j.selectAll(".legend").data([0].concat(b.quantiles()),(function(t){return t})).enter().append("g").attr("class","legend");q.append("rect").attr("x",(function(t,e){return i*e})).attr("y",u).attr("width",i).attr("height",o/2).style("fill",(function(t,e){return d[e]})).style("stroke","#ccc"),q.append("text").attr("class",s).text(g).style("text-anchor","middle").attr("x",(function(t,e){return i*e+i/2})).attr("y",u+o)},j=function(){var t=(0,u.Z)(i().mark((function t(){var e;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,m();case 2:e=t.sent,b({data:e,rootElId:"chart"});case 4:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),q=function(t){var e=t.pageContext;return n.createElement(a.Z,{links:["/vendors/jquery-ui/themes/base/jquery-ui.min.css"],main:j,pageContext:e,scripts:["/vendors/jquery-ui/jquery-ui.min.js"]},n.createElement("div",{id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-weekly-heatmap-tsx-ae38191102869defc906.js.map