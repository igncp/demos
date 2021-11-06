"use strict";(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[175],{9646:function(t,e,n){var r;n.d(e,{Z:function(){return h}});var a=new Uint8Array(16);function i(){if(!r&&!(r="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return r(a)}var o=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;for(var s=function(t){return"string"==typeof t&&o.test(t)},c=[],u=0;u<256;++u)c.push((u+256).toString(16).substr(1));var l,d,p=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=(c[t[e+0]]+c[t[e+1]]+c[t[e+2]]+c[t[e+3]]+"-"+c[t[e+4]]+c[t[e+5]]+"-"+c[t[e+6]]+c[t[e+7]]+"-"+c[t[e+8]]+c[t[e+9]]+"-"+c[t[e+10]]+c[t[e+11]]+c[t[e+12]]+c[t[e+13]]+c[t[e+14]]+c[t[e+15]]).toLowerCase();if(!s(n))throw TypeError("Stringified UUID is invalid");return n},f=0,g=0;var h=function(t,e,n){var r=e&&n||0,a=e||new Array(16),o=(t=t||{}).node||l,s=void 0!==t.clockseq?t.clockseq:d;if(null==o||null==s){var c=t.random||(t.rng||i)();null==o&&(o=l=[1|c[0],c[1],c[2],c[3],c[4],c[5]]),null==s&&(s=d=16383&(c[6]<<8|c[7]))}var u=void 0!==t.msecs?t.msecs:Date.now(),h=void 0!==t.nsecs?t.nsecs:g+1,v=u-f+(h-g)/1e4;if(v<0&&void 0===t.clockseq&&(s=s+1&16383),(v<0||u>f)&&void 0===t.nsecs&&(h=0),h>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");f=u,g=h,d=s;var m=(1e4*(268435455&(u+=122192928e5))+h)%4294967296;a[r++]=m>>>24&255,a[r++]=m>>>16&255,a[r++]=m>>>8&255,a[r++]=255&m;var y=u/4294967296*1e4&268435455;a[r++]=y>>>8&255,a[r++]=255&y,a[r++]=y>>>24&15|16,a[r++]=y>>>16&255,a[r++]=s>>>8|128,a[r++]=255&s;for(var k=0;k<6;++k)a[r+k]=o[k];return e||p(a)}},3071:function(t,e,n){n.r(e),n.d(e,{default:function(){return R}});var r,a,i=n(7294),o=n(6126),s=n(4275),c=n(8634),u=n(2656),l=n.n(u),d=n(862),p=n(9646),f="crossing-lines-chart-module--axis--YCLOJ";!function(t){t.Black="Black",t.Orange="Orange",t.Red="Red"}(a||(a={}));var g=((r={})[a.Red]="crossing-lines-chart-module--redLine--wEa4z",r[a.Orange]="crossing-lines-chart-module--orangeLine--FiFjB",r[a.Black]="crossing-lines-chart-module--blackLine--lXx8c",r),h=50,v=120,m=50,y=80,k=600-y-h,w=function(t){var e=t.crossingLinesData,n=t.rootElId,r=e.horizontalMarkers,a=e.lines,i=document.getElementById(n);i.classList.add("crossing-lines-chart-module--mareysScheduleChart--Yp9k4");var o=i.getBoundingClientRect().width-v-m,s="line-"+(0,p.Z)().slice(0,6),c="point-"+(0,p.Z)().slice(0,6),u="lines-"+(0,p.Z)().slice(0,6),l="clip-"+(0,p.Z)().slice(0,6);return{refresh:function(e){!function(e){var i=e[0],p=e[1],w=(0,d.Xf)().domain([i,p]).range([0,o]),x=(0,d.BYU)().range([0,k]),M=(0,d.F5q)(w).ticks(8).tickFormat(t.getXAxisLabel),T=(0,d.LLu)(w).ticks(8).tickFormat(t.getXAxisLabel),A=(0,d.Ys)("#"+n).text("").append("svg").attr("height",k+y+h).attr("width",o+v+m).append("g").attr("transform","translate("+v+","+y+")");A.append("text").attr("class","crossing-lines-chart-module--chartTitle--JsYuo").attr("text-anchor","middle").attr("transform","translate("+o/2+",-40)").text(t.chartTitle).style("font-weight","bold"),function(t){var e=t.deviation,n=t.id,r=t.slope,a=t.svg.append("defs").append("filter").attr("height","500%").attr("id","drop-shadow-"+n).attr("width","500%").attr("x","-200%").attr("y","-200%");a.append("feGaussianBlur").attr("in","SourceAlpha").attr("stdDeviation",e),a.append("feOffset").attr("dx",1).attr("dy",1),a.append("feComponentTransfer").append("feFuncA").attr("slope",r).attr("type","linear");var i=a.append("feMerge");i.append("feMergeNode"),i.append("feMergeNode").attr("in","SourceGraphic")}({deviation:2,id:u,slope:.2,svg:A}),A.append("defs").append("clipPath").attr("id",l).append("rect").attr("y",-y).attr("width",o).attr("height",k+y+h),x.domain((0,d.Wem)(r,(function(t){return t.position})));var S=A.append("g").attr("class","crossing-lines-chart-module--horizontalMarker--fDfnE").selectAll("g").data(r).enter().append("g").attr("transform",(function(t){return"translate(0,"+x(t.position)+")"}));S.append("text").attr("x",-6).attr("dy",".35em").text((function(t){return t.label})),S.append("line").attr("x2",o),A.append("g").attr("class","x top "+f).call(M),A.append("g").attr("class","x bottom "+f).attr("transform","translate(0,"+k+")").call(T);var b=A.append("g").attr("class","crossing-lines-chart-module--line--vidMa").attr("clip-path","url(#"+l+")").selectAll("g").data(a).enter().append("g").attr("class",(function(e){var n=t.getLineStyle(e);return g[n]+" line-"+e.id})).on("mouseover",(function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];var r=e[1];(0,d.Ys)(".line-"+r.id).select("path").style("stroke-width","5px")})).on("mouseleave",(function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];var r=e[1];(0,d.Ys)(".line-"+r.id).select("path").style("stroke-width","2.5px")})),C=(0,d.jvg)().x((function(t){return w(t.x)})).y((function(t){return x(t.horizontalMarker.position)}));b.append("path").attr("d",(function(t){return C(t.points)})).attr("class",s).attr("title",t.getLineTitle),b.selectAll("circle").data((function(t){return t.points})).enter().append("circle").style("cursor","pointer").on("click",(function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];var a=n[1];return t.onPointClick(a)})).attr("transform",(function(t){return"translate("+w(t.x)+","+x(t.horizontalMarker.position)+")"})).style("filter","url(#drop-shadow-"+u+")").attr("r","5px").attr("class",c).attr("title",(function(e){return t.getPointTitle(e)})),$("."+s).tooltip({track:!0}),$("."+c).tooltip({track:!0})}(e)}}},x=n(2203),M="%I:%M%p",T=function(t){var e=(0,d.Z1g)(M)(t);return null!==e&&e.getHours()<3&&e.setDate(e.getDate()+1),e},A=function(){function t(t){this.schedulesData=t}t.fetchAndCreateSchedules=function(){var e=(0,c.Z)(l().mark((function e(){var n,r,a,i;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,d.pvA)("/demos/data/d3js/mareys-schedule/data.tsv");case 2:return n=e.sent,r=[],a=n.map((function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];var a=e[0],i=e[1];if(0===i)for(var o in a)if(/^stop\|/.test(o)){var s=o.split("|");r.push({distance:+s[2],key:o,name:s[1],zone:+s[3]})}return{direction:a.direction,id:i,number:a.number,stops:r.map((function(t){return{station:t,time:T(a[t.key]),trainId:i}})).filter((function(t){return null!==t.time})),type:a.type}})).filter((function(t){return/[NLB]/.test(t.type)})),i={stations:r,trains:a},e.abrupt("return",new t(i));case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),t.convertDateToString=function(t){return(0,d.i$Z)(M)(t)},t.convertStringToDate=function(t){return T(t)},t.getTrainTitle=function(t){var e=t.stops,n=e[0],r=e[t.stops.length-1];return"S"===t.direction?n.station.name+" -> "+r.station.name:r.station.name+" -> "+n.station.name};var e=t.prototype;return e.getStations=function(){return this.schedulesData.stations.slice()},e.getTrains=function(){return this.schedulesData.trains.slice()},e.getTrainsMap=function(){return this.schedulesData.trains.reduce((function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];var r=e[0],a=e[1];return r[a.id]=a,r}),{})},t}(),S="chart",b="schedule-range",C=function(t){var e=$("#"+b);e.slider({change:function(){var n=function(t){var e=[];return t.forEach((function(t){var n=t/100*1200,r="AM",a=Math.floor(n/60),i=Math.floor(n%60);i>30?(i-=30,a+=1):i+=30,(a+=4)>23?a-=24===a?12:24:a>11&&(r="PM",12!==a&&(a-=12));var o=a+":"+(i<10?"0"+i:i.toString())+r;return e.push(o)})),e}(e.slider("values")).map(A.convertStringToDate);t(n)},range:!0}),e.slider("values",[10,50])},L=function(t){var e=t.getStations().map((function(t){return{key:t.key,label:t.name,position:t.distance}})),n=e.reduce((function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];var r=e[0],a=e[1];return r[a.key]=a,r}),{}),r=t.getTrains().map((function(t){return{id:t.id,points:t.stops.map((function(t){return{horizontalMarker:n[t.station.key],lineId:t.trainId,x:t.time}}))}})),i=t.getTrainsMap();return{chartTitle:"E.J. Marey’s graphical train schedule (4:30AM - 1:30AM)",crossingLinesData:{horizontalMarkers:e,lines:r},getLineStyle:function(t){switch(i[t.id].type){default:return a.Red;case"L":return a.Black;case"N":return a.Orange}},getLineTitle:function(t){var e=i[t.id];return A.getTrainTitle(e)},getPointTitle:function(t){var e=i[t.lineId];return A.getTrainTitle(e)+"\n"+t.horizontalMarker.label+" at "+function(t){var e=t.getHours(),n=e>=12?"PM":"AM";e=(e%=12)||12;var r=t.getMinutes();return e+":"+(r<10?"0"+r:r.toString())+" "+n}(t.x)},getXAxisLabel:function(t){return A.convertDateToString(t)},onPointClick:function(t){window.open("https://www.google.com/search?"+x.stringify({q:"Station California "+t.horizontalMarker.label}))},rootElId:S}},D=function(){var t=(0,c.Z)(l().mark((function t(){var e,n,r,a;return l().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,A.fetchAndCreateSchedules();case 2:e=t.sent,n=L(e),r=w(n),a=r.refresh,C(a);case 6:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),E=D,R=function(t){var e=t.pageContext;return i.createElement(s.Z,{links:[o.H.STYLE],main:E,pageContext:e,scripts:[o.H.SCRIPT]},i.createElement("div",null,i.createElement("div",{id:b})),i.createElement("div",{id:S}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-mareys-schedule-tsx-f2c7e67d214098edafe0.js.map