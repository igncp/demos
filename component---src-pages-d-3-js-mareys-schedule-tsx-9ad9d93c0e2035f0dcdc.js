(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[175],{2137:function(t,e,r){"use strict";function n(t,e,r,n,a,i,o){try{var s=t[i](o),u=s.value}catch(c){return void r(c)}s.done?e(u):Promise.resolve(u).then(n,a)}function a(t){return function(){var e=this,r=arguments;return new Promise((function(a,i){var o=t.apply(e,r);function s(t){n(o,a,i,s,u,"next",t)}function u(t){n(o,a,i,s,u,"throw",t)}s(void 0)}))}}r.d(e,{Z:function(){return a}})},9646:function(t,e,r){"use strict";var n;r.d(e,{Z:function(){return v}});var a=new Uint8Array(16);function i(){if(!n&&!(n="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return n(a)}var o=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;for(var s=function(t){return"string"==typeof t&&o.test(t)},u=[],c=0;c<256;++c)u.push((c+256).toString(16).substr(1));var l,d,p=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=(u[t[e+0]]+u[t[e+1]]+u[t[e+2]]+u[t[e+3]]+"-"+u[t[e+4]]+u[t[e+5]]+"-"+u[t[e+6]]+u[t[e+7]]+"-"+u[t[e+8]]+u[t[e+9]]+"-"+u[t[e+10]]+u[t[e+11]]+u[t[e+12]]+u[t[e+13]]+u[t[e+14]]+u[t[e+15]]).toLowerCase();if(!s(r))throw TypeError("Stringified UUID is invalid");return r},f=0,h=0;var v=function(t,e,r){var n=e&&r||0,a=e||new Array(16),o=(t=t||{}).node||l,s=void 0!==t.clockseq?t.clockseq:d;if(null==o||null==s){var u=t.random||(t.rng||i)();null==o&&(o=l=[1|u[0],u[1],u[2],u[3],u[4],u[5]]),null==s&&(s=d=16383&(u[6]<<8|u[7]))}var c=void 0!==t.msecs?t.msecs:Date.now(),v=void 0!==t.nsecs?t.nsecs:h+1,g=c-f+(v-h)/1e4;if(g<0&&void 0===t.clockseq&&(s=s+1&16383),(g<0||c>f)&&void 0===t.nsecs&&(v=0),v>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");f=c,h=v,d=s;var m=(1e4*(268435455&(c+=122192928e5))+v)%4294967296;a[n++]=m>>>24&255,a[n++]=m>>>16&255,a[n++]=m>>>8&255,a[n++]=255&m;var y=c/4294967296*1e4&268435455;a[n++]=y>>>8&255,a[n++]=255&y,a[n++]=y>>>24&15|16,a[n++]=y>>>16&255,a[n++]=s>>>8|128,a[n++]=255&s;for(var k=0;k<6;++k)a[n+k]=o[k];return e||p(a)}},3071:function(t,e,r){"use strict";r.r(e),r.d(e,{default:function(){return C}});var n,a,i=r(7294),o=r(4275),s=r(2137),u=r(7757),c=r.n(u),l=r(7723),d=r(9646),p="crossing-lines-chart-module--axis--19tt7";!function(t){t.Black="Black",t.Purple="Purple",t.Red="Red"}(a||(a={}));var f=((n={})[a.Red]="crossing-lines-chart-module--redLine--aD8VJ",n[a.Purple]="crossing-lines-chart-module--purpleLine--_HKLG",n[a.Black]="crossing-lines-chart-module--blackLine--30fdP",n),h=50,v=120,g=50,m=80,y=600-m-h,k=function(t){var e=t.crossingLinesData,r=t.rootElId,n=e.horizontalMarkers,a=e.lines,i=document.getElementById(r);i.classList.add("crossing-lines-chart-module--mareysScheduleChart--49-Ce");var o=i.getBoundingClientRect().width-v-g,s="line-"+(0,d.Z)().slice(0,6),u="point-"+(0,d.Z)().slice(0,6),c="lines-"+(0,d.Z)().slice(0,6),k="clip-"+(0,d.Z)().slice(0,6);return{refresh:function(e){!function(e){var i=e[0],d=e[1],w=(0,l.Xf)().domain([i,d]).range([0,o]),x=(0,l.BYU)().range([0,y]),M=(0,l.F5q)(w).ticks(8).tickFormat(t.getXAxisLabel),A=(0,l.LLu)(w).ticks(8).tickFormat(t.getXAxisLabel),T=(0,l.Ys)("#"+r).text("").append("svg").attr("height",y+m+h).attr("width",o+v+g).append("g").attr("transform","translate("+v+","+m+")");T.append("text").attr("class","crossing-lines-chart-module--chartTitle--1ew56").attr("text-anchor","middle").attr("transform","translate("+o/2+",-40)").text(t.chartTitle).style("font-weight","bold"),function(t){var e=t.deviation,r=t.id,n=t.slope,a=t.svg.append("defs").append("filter").attr("height","500%").attr("id","drop-shadow-"+r).attr("width","500%").attr("x","-200%").attr("y","-200%");a.append("feGaussianBlur").attr("in","SourceAlpha").attr("stdDeviation",e),a.append("feOffset").attr("dx",1).attr("dy",1),a.append("feComponentTransfer").append("feFuncA").attr("slope",n).attr("type","linear");var i=a.append("feMerge");i.append("feMergeNode"),i.append("feMergeNode").attr("in","SourceGraphic")}({deviation:2,id:c,slope:.2,svg:T}),T.append("defs").append("clipPath").attr("id",k).append("rect").attr("y",-m).attr("width",o).attr("height",y+m+h),x.domain((0,l.Wem)(n,(function(t){return t.position})));var b=T.append("g").attr("class","crossing-lines-chart-module--horizontalMarker--1i6JR").selectAll("g").data(n).enter().append("g").attr("transform",(function(t){return"translate(0,"+x(t.position)+")"}));b.append("text").attr("x",-6).attr("dy",".35em").text((function(t){return t.label})),b.append("line").attr("x2",o),T.append("g").attr("class","x top "+p).call(M),T.append("g").attr("class","x bottom "+p).attr("transform","translate(0,"+y+")").call(A);var L=T.append("g").attr("class","crossing-lines-chart-module--line--1i1AQ").attr("clip-path","url(#"+k+")").selectAll("g").data(a).enter().append("g").attr("class",(function(e){var r=t.getLineStyle(e);return f[r]+" line-"+e.id})).on("mouseover",(function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[1];(0,l.Ys)(".line-"+n.id).select("path").style("stroke-width","5px")})).on("mouseleave",(function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[1];(0,l.Ys)(".line-"+n.id).select("path").style("stroke-width","2.5px")})),S=(0,l.jvg)().x((function(t){return w(t.x)})).y((function(t){return x(t.horizontalMarker.position)}));L.append("path").attr("d",(function(t){return S(t.points)})).attr("class",s).attr("title",t.getLineTitle),L.selectAll("circle").data((function(t){return t.points})).enter().append("circle").attr("transform",(function(t){return"translate("+w(t.x)+","+x(t.horizontalMarker.position)+")"})).style("filter","url(#drop-shadow-"+c+")").attr("r","5px").attr("class",u).attr("title",(function(e){return t.getPointTitle(e)})),$("."+s).tooltip({track:!0}),$("."+u).tooltip({track:!0})}(e)}}},w="%I:%M%p",x=function(t){var e=(0,l.Z1g)(w)(t);return null!==e&&e.getHours()<3&&e.setDate(e.getDate()+1),e},M=function(){function t(t){this.schedulesData=t}t.fetchAndCreateSchedules=function(){var e=(0,s.Z)(c().mark((function e(){var r,n,a,i;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,l.pvA)("/demos/data/d3js/mareys-schedule/data.tsv");case 2:return r=e.sent,n=[],a=r.map((function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var a=e[0],i=e[1];if(0===i)for(var o in a)if(/^stop\|/.test(o)){var s=o.split("|");n.push({distance:+s[2],key:o,name:s[1],zone:+s[3]})}return{direction:a.direction,id:i,number:a.number,stops:n.map((function(t){return{station:t,time:x(a[t.key]),trainId:i}})).filter((function(t){return null!==t.time})),type:a.type}})).filter((function(t){return/[NLB]/.test(t.type)})),i={stations:n,trains:a},e.abrupt("return",new t(i));case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),t.convertDateToString=function(t){return(0,l.i$Z)(w)(t)},t.convertStringToDate=function(t){return x(t)},t.getTrainTitle=function(t){var e=t.stops,r=e[0],n=e[t.stops.length-1];return"S"===t.direction?r.station.name+" -> "+n.station.name:n.station.name+" -> "+r.station.name};var e=t.prototype;return e.getStations=function(){return this.schedulesData.stations.slice()},e.getTrains=function(){return this.schedulesData.trains.slice()},e.getTrainsMap=function(){return this.schedulesData.trains.reduce((function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[0],a=e[1];return n[a.id]=a,n}),{})},t}(),A="chart",T="schedule-range",b=function(t){var e=$("#"+T);e.slider({change:function(){var r=function(t){var e=[];return t.forEach((function(t){var r=t/100*1200,n="AM",a=Math.floor(r/60),i=Math.floor(r%60);i>30?(i-=30,a+=1):i+=30,(a+=4)>23?a-=24===a?12:24:a>11&&(n="PM",12!==a&&(a-=12));var o=a+":"+(i<10?"0"+i:i.toString())+n;return e.push(o)})),e}(e.slider("values")).map(M.convertStringToDate);t(r)},range:!0}),e.slider("values",[10,50])},L=function(t){var e=t.getStations().map((function(t){return{key:t.key,label:t.name,position:t.distance}})),r=e.reduce((function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[0],a=e[1];return n[a.key]=a,n}),{}),n=t.getTrains().map((function(t){return{id:t.id,points:t.stops.map((function(t){return{horizontalMarker:r[t.station.key],lineId:t.trainId,x:t.time}}))}})),i=t.getTrainsMap();return{chartTitle:"E.J. Marey’s graphical train schedule (4:30AM - 1:30AM)",crossingLinesData:{horizontalMarkers:e,lines:n},getLineStyle:function(t){switch(i[t.id].type){case"B":return a.Red;case"L":return a.Black;case"N":return a.Purple;default:return a.Red}},getLineTitle:function(t){var e=i[t.id];return M.getTrainTitle(e)},getPointTitle:function(t){var e=i[t.lineId];return M.getTrainTitle(e)+"\n"+t.horizontalMarker.label+" at "+function(t){var e=t.getHours(),r=e>=12?"PM":"AM";e=(e%=12)||12;var n=t.getMinutes();return e+":"+(n<10?"0"+n:n.toString())+" "+r}(t.x)},getXAxisLabel:function(t){return M.convertDateToString(t)},rootElId:A}},S=function(){var t=(0,s.Z)(c().mark((function t(){var e,r,n,a;return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,M.fetchAndCreateSchedules();case 2:e=t.sent,r=L(e),n=k(r),a=n.refresh,b(a);case 6:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),C=function(t){var e=t.pageContext;return i.createElement(o.Z,{links:["/vendors/jquery-ui/themes/base/jquery-ui.min.css"],main:S,pageContext:e,scripts:["/vendors/jquery-ui/jquery-ui.min.js"]},i.createElement("div",null,i.createElement("div",{id:T})),i.createElement("div",{id:A}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-mareys-schedule-tsx-9ad9d93c0e2035f0dcdc.js.map