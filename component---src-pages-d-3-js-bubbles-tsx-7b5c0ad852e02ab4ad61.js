(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[418],{2137:function(t,e,n){"use strict";function r(t,e,n,r,a,o,s){try{var i=t[o](s),c=i.value}catch(u){return void n(u)}i.done?e(c):Promise.resolve(c).then(r,a)}function a(t){return function(){var e=this,n=arguments;return new Promise((function(a,o){var s=t.apply(e,n);function i(t){r(s,a,o,i,c,"next",t)}function c(t){r(s,a,o,i,c,"throw",t)}i(void 0)}))}}n.d(e,{Z:function(){return a}})},31:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return v}});var r=n(7294),a=n(2247),o=n(2137),s=n(7757),i=n.n(s),c=function(t){return new Promise((function(e){var n=document.createElement("script");n.setAttribute("type","text/javascript"),n.setAttribute("src",t),n.onload=e,document.body.appendChild(n)}))},u=function(t){return new Promise((function(e){var n=document.createElement("link");n.onload=e,n.href=t,n.setAttribute("rel","stylesheet"),n.setAttribute("type","text/css"),document.head.appendChild(n)}))},d=function(){var t=(0,o.Z)(i().mark((function t(){return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Promise.all([u("/demos/vendors/nvd3/nv.d3.min.css"),(0,o.Z)(i().mark((function t(){return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,c("/demos/vendors/d3/d3.min.js");case 2:return t.next=4,c("/demos/vendors/nvd3/nv.d3.min.js");case 4:case"end":return t.stop()}}),t)})))()]);case 2:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),m={bottom:100,left:100,right:100,top:100},f=function(){var t=(0,o.Z)(i().mark((function t(){var e,n;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch("/demos/data/d3js/bubbles/data.json");case 2:return e=t.sent,t.next=5,e.json();case 5:return n=t.sent,t.abrupt("return",n);case 7:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),l=function(t){var e=t.rootElId,n=t.jsonData,r=window,a=r.d3,o=r.nv,s=document.getElementById(e);s.classList.add("bubbles-chart");var i=s.getBoundingClientRect().width,c=a.scale.category20b(),u=[{key:"Data",values:n.data.map((function(t,e,n){var r,a,o=+t.metricSummary.distance,s=(r=t.metricSummary.duration,a=r.split(":"),60*Number(a[0])+Number(a[1])+Number(a[2])/60)/o;return{color:c(o),data:t,size:o,x:n.length-e,y:s}}))}],d=o.models.scatterChart();d.margin(m),o.utils.windowResize(d.update),d.forceY([4.5,6.5]).forceX([0,135]),d.tooltipContent((function(t,e,n,r){return r.point.size.toFixed(1)+" km - "+r.point.data.deviceType})),d.xAxis.axisLabelDistance(45).tickFormat(a.format("f")).axisLabel("Person Number"),d.yAxis.tickFormat(a.format(".2f")).axisLabelDistance(10).axisLabel("Pace (min/km)"),a.select("#"+e).append("svg").attr("width",i).datum(u).call(d)},p=function(){var t=(0,o.Z)(i().mark((function t(){var e,n;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Promise.all([f(),d()]);case 2:e=t.sent,n=e[0],l({jsonData:n,rootElId:"chart"});case 5:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),v=function(t){var e=t.pageContext.demoInfo;return r.createElement(a.Z,{demoInfo:e,main:p},r.createElement("div",{id:"chart",style:{height:600}}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-bubbles-tsx-7b5c0ad852e02ab4ad61.js.map