(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[175],{9646:function(t,e,r){"use strict";var n;r.d(e,{Z:function(){return v}});var a=new Uint8Array(16);function s(){if(!n&&!(n="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return n(a)}var i=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;for(var o=function(t){return"string"==typeof t&&i.test(t)},u=[],c=0;c<256;++c)u.push((c+256).toString(16).substr(1));var d,l,p=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=(u[t[e+0]]+u[t[e+1]]+u[t[e+2]]+u[t[e+3]]+"-"+u[t[e+4]]+u[t[e+5]]+"-"+u[t[e+6]]+u[t[e+7]]+"-"+u[t[e+8]]+u[t[e+9]]+"-"+u[t[e+10]]+u[t[e+11]]+u[t[e+12]]+u[t[e+13]]+u[t[e+14]]+u[t[e+15]]).toLowerCase();if(!o(r))throw TypeError("Stringified UUID is invalid");return r},f=0,m=0;var v=function(t,e,r){var n=e&&r||0,a=e||new Array(16),i=(t=t||{}).node||d,o=void 0!==t.clockseq?t.clockseq:l;if(null==i||null==o){var u=t.random||(t.rng||s)();null==i&&(i=d=[1|u[0],u[1],u[2],u[3],u[4],u[5]]),null==o&&(o=l=16383&(u[6]<<8|u[7]))}var c=void 0!==t.msecs?t.msecs:Date.now(),v=void 0!==t.nsecs?t.nsecs:m+1,h=c-f+(v-m)/1e4;if(h<0&&void 0===t.clockseq&&(o=o+1&16383),(h<0||c>f)&&void 0===t.nsecs&&(v=0),v>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");f=c,m=v,l=o;var g=(1e4*(268435455&(c+=122192928e5))+v)%4294967296;a[n++]=g>>>24&255,a[n++]=g>>>16&255,a[n++]=g>>>8&255,a[n++]=255&g;var y=c/4294967296*1e4&268435455;a[n++]=y>>>8&255,a[n++]=255&y,a[n++]=y>>>24&15|16,a[n++]=y>>>16&255,a[n++]=o>>>8|128,a[n++]=255&o;for(var x=0;x<6;++x)a[n+x]=i[x];return e||p(a)}},3758:function(t,e,r){"use strict";r.r(e),r.d(e,{default:function(){return E}});var n=r(7294),a=r(4275),s=r(2137),i=r(7757),o=r.n(i),u=r(7723),c=r(6073),d=r.n(c),l=r(928),p=r.n(l),f=r(9646),m="mareys-schedule-module--axis--1fY92",v={B:"mareys-schedule-module--tB--2FnG5",L:"mareys-schedule-module--tL--3NtZj",N:"mareys-schedule-module--tN--1jtuN"},h="%I:%M%p",g=function(t){var e=(0,u.Z1g)(h)(t);return null!==e&&e.getHours()<3&&e.setDate(e.getDate()+1),e},y=function(){var t=(0,s.Z)(o().mark((function t(){var e,r,n;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,u.pvA)("/demos/data/d3js/mareys-schedule/data.tsv");case 2:return e=t.sent,r=[],n=e.map((function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];var a=e[0],s=e[1];if(0===s)for(var i in a)if(/^stop\|/.test(i)){var o=i.split("|");r.push({distance:+o[2],key:i,name:o[1],zone:+o[3]})}return{direction:a.direction,id:s,number:a.number,stops:r.map((function(t){return{station:t,time:g(a[t.key]),trainIndex:s}})).filter((function(t){return null!==t.time})),type:a.type}})),t.abrupt("return",{stations:r,trains:n});case 6:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),x=function(t){return"S"===t.direction?t.stops[0].station.name+" -> "+p()(t.stops).station.name:p()(t.stops).station.name+" -> "+t.stops[0].station.name},w=50,k=120,b=50,A=80,M=600-A-w,C=function(t){var e=t.rootElId,r=t.schedulesData,n=r.stations,a=r.trains,s=document.getElementById(e);s.classList.add("mareys-schedule-module--mareysScheduleChart--3lJCF");var i=s.getBoundingClientRect().width-k-b,o="train-"+(0,f.Z)().slice(0,6),c="stop-"+(0,f.Z)().slice(0,6),l=function(t){var r=(0,u.Xf)().domain([g(t[0]),g(t[1])]).range([0,i]),s=(0,u.BYU)().range([0,M]),d=function(t){return(0,u.i$Z)(h)(t)},l=(0,u.F5q)(r).ticks(8).tickFormat(d),p=(0,u.LLu)(r).ticks(8).tickFormat(d),f=(0,u.Ys)("#"+e).text("").append("svg").attr("height",M+A+w).attr("width",i+k+b).append("g").attr("transform","translate("+k+","+A+")");f.append("text").attr("class","mareys-schedule-module--chartTitle--xA3nT").attr("text-anchor","middle").attr("transform","translate("+i/2+",-40)").text("E.J. Marey’s graphical train schedule (4:30AM - 1:30AM)").style("font-weight","bold"),function(t){var e=t.deviation,r=t.id,n=t.slope,a=t.svg.append("defs").append("filter").attr("height","500%").attr("id","drop-shadow-"+r).attr("width","500%").attr("x","-200%").attr("y","-200%");a.append("feGaussianBlur").attr("in","SourceAlpha").attr("stdDeviation",e),a.append("feOffset").attr("dx",1).attr("dy",1),a.append("feComponentTransfer").append("feFuncA").attr("slope",n).attr("type","linear");var s=a.append("feMerge");s.append("feMergeNode"),s.append("feMergeNode").attr("in","SourceGraphic")}({deviation:2,id:"trains",slope:.2,svg:f}),f.append("defs").append("clipPath").attr("id","clip").append("rect").attr("y",-A).attr("width",i).attr("height",M+A+w),s.domain((0,u.Wem)(n,(function(t){return t.distance})));var y=f.append("g").attr("class","mareys-schedule-module--station--2Lwu0").selectAll("g").data(n).enter().append("g").attr("transform",(function(t){return"translate(0,"+s(t.distance)+")"}));y.append("text").attr("x",-6).attr("dy",".35em").text((function(t){return t.name})),y.append("line").attr("x2",i),f.append("g").attr("class","x top "+m).call(l),f.append("g").attr("class","x bottom "+m).attr("transform","translate(0,"+M+")").call(p);var C=f.append("g").attr("class","mareys-schedule-module--train--2F17o").attr("clip-path","url(#clip)").selectAll("g").data(a.filter((function(t){return/[NLB]/.test(t.type)}))).enter().append("g").attr("class",(function(t){return v[t.type]+" train-"+t.id})).on("mouseover",(function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[1];(0,u.Ys)(".train-"+n.id).select("path").style("stroke-width","5px")})).on("mouseleave",(function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[1];(0,u.Ys)(".train-"+n.id).select("path").style("stroke-width","2.5px")})),j=(0,u.jvg)().x((function(t){return r(t.time)})).y((function(t){return s(t.station.distance)}));C.append("path").attr("d",(function(t){return j(t.stops)})).attr("class",o).attr("title",x),C.selectAll("circle").data((function(t){return t.stops})).enter().append("circle").attr("transform",(function(t){return"translate("+r(t.time)+","+s(t.station.distance)+")"})).style("filter","url(#drop-shadow-trains)").attr("r","5px").attr("class",c).attr("title",(function(t){return x(a[t.trainIndex])+"\n"+t.station.name+" at "+function(t){var e=t.getHours(),r=e>=12?"PM":"AM";e=(e%=12)||12;var n=t.getMinutes();return e+":"+(n<10?"0"+n:n.toString())+" "+r}(t.time)})),$("."+o).tooltip({track:!0}),$("."+c).tooltip({track:!0})};return{refresh:function(t){!function(t){var e=t.limits,r=t.redraw,n=[];d()(e,(function(t){var e=t/100*1200,r="AM",a=Math.floor(e/60),s=Math.floor(e%60);s>30?(s-=30,a+=1):s+=30,(a+=4)>23?a-=24===a?12:24:a>11&&(r="PM",12!==a&&(a-=12));var i=a+":"+(s<10?"0"+s:s.toString())+r;return n.push(i)})),r(n)}({limits:t,redraw:l})}}},j=function(){var t=(0,s.Z)(o().mark((function t(){var e,r,n,a,s;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e="chart",t.next=3,y();case 3:r=t.sent,n=C({rootElId:e,schedulesData:r}),a=n.refresh,(s=$(".slider")).slider({change:function(){var t=s.slider("values");a(t)},range:!0}),s.slider("values",[10,50]);case 8:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),E=function(t){var e=t.pageContext;return n.createElement(a.Z,{links:["/vendors/jquery-ui/themes/base/jquery-ui.min.css"],main:j,pageContext:e,scripts:["/vendors/jquery-ui/jquery-ui.min.js"]},n.createElement("div",null,n.createElement("div",{className:"slider"})),n.createElement("div",{id:"chart"}))}},9881:function(t,e,r){var n=r(7816),a=r(9291)(n);t.exports=a},8483:function(t,e,r){var n=r(5063)();t.exports=n},7816:function(t,e,r){var n=r(8483),a=r(3674);t.exports=function(t,e){return t&&n(t,e,a)}},4290:function(t,e,r){var n=r(6557);t.exports=function(t){return"function"==typeof t?t:n}},9291:function(t,e,r){var n=r(8612);t.exports=function(t,e){return function(r,a){if(null==r)return r;if(!n(r))return t(r,a);for(var s=r.length,i=e?s:-1,o=Object(r);(e?i--:++i<s)&&!1!==a(o[i],i,o););return r}}},5063:function(t){t.exports=function(t){return function(e,r,n){for(var a=-1,s=Object(e),i=n(e),o=i.length;o--;){var u=i[t?o:++a];if(!1===r(s[u],u,s))break}return e}}},6073:function(t,e,r){t.exports=r(4486)},4486:function(t,e,r){var n=r(7412),a=r(9881),s=r(4290),i=r(1469);t.exports=function(t,e){return(i(t)?n:a)(t,s(e))}},6557:function(t){t.exports=function(t){return t}},928:function(t){t.exports=function(t){var e=null==t?0:t.length;return e?t[e-1]:void 0}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-mareys-schedule-tsx-85d30bc55f67619b6a92.js.map