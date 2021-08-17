(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[175],{3758:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return E}});var r=n(7294),a=n(4275),i=n(2137),s=n(7757),u=n.n(s),o=n(7723),c=n(6073),d=n.n(c),p=n(928),l=n.n(p),f="mareys-schedule-module--axis--1fY92",m={B:"mareys-schedule-module--tB--2FnG5",L:"mareys-schedule-module--tL--3NtZj",N:"mareys-schedule-module--tN--1jtuN"},h=function(){var t=(0,i.Z)(u().mark((function t(){var e,n,r;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,o.pvA)("/demos/data/d3js/mareys-schedule/data.tsv");case 2:return e=t.sent,n=[],r=e.map((function(t,e){if(0===e)for(var r in t)if(/^stop\|/.test(r)){var a=r.split("|");n.push({distance:+a[2],key:r,name:a[1],zone:+a[3]})}return{direction:t.direction,index:e,number:t.number,stops:n.map((function(n){return{station:n,time:g(t[n.key]),trainIndex:e}})).filter((function(t){return null!==t.time})),type:t.type}})),t.abrupt("return",{stations:n,trains:r});case 6:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),v=function(t){return"S"===t.direction?t.stops[0].station.name+" -> "+l()(t.stops).station.name:l()(t.stops).station.name+" -> "+t.stops[0].station.name},x=function(){return(0,o.Z1g)("%I:%M%p")},g=function(t){var e=x()(t);return null!==e&&e.getHours()<3&&e.setDate(e.getDate()+1),e},y=50,w=120,k=50,M=80,b=600-M-y,j=function(t){var e=t.data,n=t.rootElId,r=e.stations,a=e.trains,i=document.getElementById(n);i.classList.add("mareys-schedule-module--mareysScheduleChart--3lJCF");var s=i.getBoundingClientRect().width-w-k,u=function(t){var e=(0,o.Xf)().domain([g(t[0]),g(t[1])]).range([0,s]),i=(0,o.BYU)().range([0,b]),u=x(),c=(0,o.F5q)(e).ticks(8).tickFormat(u),d=(0,o.LLu)(e).ticks(8).tickFormat(u),p=(0,o.Ys)("#"+n).text("").append("svg").attr("height",b+M+y).attr("width",s+w+k).append("g").attr("transform","translate("+w+","+M+")");p.append("text").attr("class","mareys-schedule-module--chartTitle--xA3nT").attr("text-anchor","middle").attr("transform","translate("+s/2+",-40)").text("E.J. Marey’s graphical train schedule (4:30AM - 1:30AM)").style("font-weight","bold"),A("trains",p,2,.2),p.append("defs").append("clipPath").attr("id","clip").append("rect").attr("y",-M).attr("width",s).attr("height",b+M+y),i.domain((0,o.Wem)(r,(function(t){return t.distance})));var l=p.append("g").attr("class","mareys-schedule-module--station--2Lwu0").selectAll("g").data(r).enter().append("g").attr("transform",(function(t){return"translate(0,"+i(t.distance)+")"}));l.append("text").attr("x",-6).attr("dy",".35em").text((function(t){return t.name})),l.append("line").attr("x2",s),p.append("g").attr("class","x top "+f).call(c),p.append("g").attr("class","x bottom "+f).attr("transform","translate(0,"+b+")").call(d);var h=p.append("g").attr("class","mareys-schedule-module--train--2F17o").attr("clip-path","url(#clip)").selectAll("g").data(a.filter((function(t){return/[NLB]/.test(t.type)}))).enter().append("g").attr("class",(function(t){return m[t.type]+" train-"+t.index})).on("mouseover",(function(t,e){(0,o.Ys)(".train-"+e.index).select("path").style("stroke-width","5px")})).on("mouseleave",(function(t,e){(0,o.Ys)(".train-"+e.index).select("path").style("stroke-width","2.5px")})),j=(0,o.jvg)().x((function(t){return e(t.time)})).y((function(t){return i(t.station.distance)}));h.append("path").attr("d",(function(t){return j(t.stops)})).append("title").text((function(t){return v(t)})),h.selectAll("circle").data((function(t){return t.stops})).enter().append("circle").attr("transform",(function(t){return"translate("+e(t.time)+","+i(t.station.distance)+")"})).style("filter","url(#drop-shadow-trains)").attr("r","5px").append("title").text((function(t){return v(a[t.trainIndex])+"\n"+t.station.name+" at "+function(t){var e=t.getHours(),n=e>=12?"PM":"AM";e=(e%=12)||12;var r=t.getMinutes();return e+":"+(r<10?"0"+r:r.toString())+" "+n}(t.time)}))};return{refresh:function(t){!function(t){var e=t.limits,n=t.redraw,r=[];d()(e,(function(t){var e=t/100*1200,n="AM",a=Math.floor(e/60),i=Math.floor(e%60);i>30?(i-=30,a+=1):i+=30,(a+=4)>23?a-=24===a?12:24:a>11&&(n="PM",12!==a&&(a-=12));var s=a+":"+(i<10?"0"+i:i.toString())+n;return r.push(s)})),n(r)}({limits:t,redraw:u})}}},A=function(t,e,n,r){var a=e.append("defs").append("filter").attr("height","500%").attr("id","drop-shadow-"+t).attr("width","500%").attr("x","-200%").attr("y","-200%");a.append("feGaussianBlur").attr("in","SourceAlpha").attr("stdDeviation",n),a.append("feOffset").attr("dx",1).attr("dy",1),a.append("feComponentTransfer").append("feFuncA").attr("slope",r).attr("type","linear");var i=a.append("feMerge");i.append("feMergeNode"),i.append("feMergeNode").attr("in","SourceGraphic")},C=function(){var t=(0,i.Z)(u().mark((function t(){var e,n,r,a,i;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e="chart",t.next=3,h();case 3:n=t.sent,r=j({data:n,rootElId:e}),a=r.refresh,(i=$(".slider")).slider({change:function(){var t=i.slider("values");a(t)},range:!0}),i.slider("values",[10,50]);case 8:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),E=function(t){var e=t.pageContext;return r.createElement(a.Z,{links:["/vendors/jquery-ui/themes/base/jquery-ui.min.css"],main:C,pageContext:e,scripts:["/vendors/jquery-ui/jquery-ui.min.js"]},r.createElement("div",null,r.createElement("div",{className:"slider"})),r.createElement("div",{id:"chart"}))}},9881:function(t,e,n){var r=n(7816),a=n(9291)(r);t.exports=a},8483:function(t,e,n){var r=n(5063)();t.exports=r},7816:function(t,e,n){var r=n(8483),a=n(3674);t.exports=function(t,e){return t&&r(t,e,a)}},4290:function(t,e,n){var r=n(6557);t.exports=function(t){return"function"==typeof t?t:r}},9291:function(t,e,n){var r=n(8612);t.exports=function(t,e){return function(n,a){if(null==n)return n;if(!r(n))return t(n,a);for(var i=n.length,s=e?i:-1,u=Object(n);(e?s--:++s<i)&&!1!==a(u[s],s,u););return n}}},5063:function(t){t.exports=function(t){return function(e,n,r){for(var a=-1,i=Object(e),s=r(e),u=s.length;u--;){var o=s[t?u:++a];if(!1===n(i[o],o,i))break}return e}}},6073:function(t,e,n){t.exports=n(4486)},4486:function(t,e,n){var r=n(7412),a=n(9881),i=n(4290),s=n(1469);t.exports=function(t,e){return(s(t)?r:a)(t,i(e))}},6557:function(t){t.exports=function(t){return t}},928:function(t){t.exports=function(t){var e=null==t?0:t.length;return e?t[e-1]:void 0}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-mareys-schedule-tsx-3cb2ab4b09312792047e.js.map