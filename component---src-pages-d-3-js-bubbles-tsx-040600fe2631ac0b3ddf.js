(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[418],{2137:function(t,e,n){"use strict";function r(t,e,n,r,a,o,s){try{var i=t[o](s),u=i.value}catch(c){return void n(c)}i.done?e(u):Promise.resolve(u).then(r,a)}function a(t){return function(){var e=this,n=arguments;return new Promise((function(a,o){var s=t.apply(e,n);function i(t){r(s,a,o,i,u,"next",t)}function u(t){r(s,a,o,i,u,"throw",t)}i(void 0)}))}}n.d(e,{Z:function(){return a}})},7589:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return h}});var r=n(7294),a=n(4275),o=n(2137),s=n(7757),i=n.n(s),u=function(t){return new Promise((function(e){var n=document.createElement("script");n.setAttribute("type","text/javascript"),n.setAttribute("src",t),n.onload=e,document.body.appendChild(n)}))},c=function(t){return new Promise((function(e){var n=document.createElement("link");n.onload=e,n.href=t,n.setAttribute("rel","stylesheet"),n.setAttribute("type","text/css"),document.head.appendChild(n)}))},d=function(){var t=(0,o.Z)(i().mark((function t(){return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Promise.all([c("/demos/vendors/nvd3/nv.d3.min.css"),(0,o.Z)(i().mark((function t(){return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u("/demos/vendors/d3/d3.min.js");case 2:return t.next=4,u("/demos/vendors/nvd3/nv.d3.min.js");case 4:case"end":return t.stop()}}),t)})))()]);case 2:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),m=function(t){var e=t.split(":");return 60*Number(e[0])+Number(e[1])+Number(e[2])/60},l={bottom:100,left:100,right:100,top:100},f=function(){var t=(0,o.Z)(i().mark((function t(){var e,n;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch("/demos/data/d3js/bubbles/data.json");case 2:return e=t.sent,t.next=5,e.json();case 5:return n=t.sent,t.abrupt("return",n.data);case 7:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),p=function(t){var e=t.jsonData,n=t.rootElId,r=window,a=r.d3,o=r.nv,s=document.getElementById(n);s.classList.add("bubbles-module--bubblesChart--5KhpF");var i=s.getBoundingClientRect().width,u=a.scale.category20b(),c=[{key:"Data",values:e.map((function(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];var a=n[0],o=n[1],s=+a.metricSummary.distance,i=m(a.metricSummary.duration),c=i/s;return{color:u(s),jsonItem:a,size:s,x:e.length-o,y:c}}))}],d=o.models.scatterChart();d.margin(l),o.utils.windowResize(d.update),d.forceY([4.5,6.5]).forceX([0,135]),d.tooltipContent((function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];var r=e[3];return r.point.size.toFixed(1)+" km - "+r.point.jsonItem.deviceType})),d.xAxis.axisLabelDistance(45).tickFormat(a.format("f")).axisLabel("Person Number"),d.yAxis.tickFormat(a.format(".2f")).axisLabelDistance(10).axisLabel("Pace (min/km)"),a.select("#"+n).append("svg").attr("width",i).datum(c).call(d)},v=function(){var t=(0,o.Z)(i().mark((function t(){var e,n;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Promise.all([f(),d()]);case 2:e=t.sent,n=e[0],p({jsonData:n,rootElId:"chart"});case 5:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),h=function(t){var e=t.pageContext;return r.createElement(a.Z,{main:v,pageContext:e},r.createElement("div",{id:"chart",style:{height:600}}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-bubbles-tsx-040600fe2631ac0b3ddf.js.map