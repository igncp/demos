(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[495],{1616:function(t,e,n){"use strict";var r=n(2453),a=n(2492),o=n.n(a),i={colorsScale:function(t,e){var n=r.BYU().domain(e).range([0,1]),a=r.BYU().domain(r.w6H(0,1,1/t.length)).range(t);return function(t){return a(n(t))}},filterBlackOpacity:function(t,e,n,r){var a=e.append("defs").append("filter").attr("height","500%").attr("id","drop-shadow-"+t).attr("width","500%").attr("x","-200%").attr("y","-200%");a.append("feGaussianBlur").attr("in","SourceAlpha").attr("stdDeviation",n),a.append("feOffset").attr("dx",1).attr("dy",1),a.append("feComponentTransfer").append("feFuncA").attr("slope",r).attr("type","linear");var o=a.append("feMerge");return o.append("feMergeNode"),o.append("feMergeNode").attr("in","SourceGraphic")},filterColor:function(t,e,n,r,a){null==a&&(a=!1);var o=e.append("defs").append("filter").attr("id","drop-shadow-"+t);return a&&o.attr("height","500%").attr("width","500%").attr("x","-200%").attr("y","-200%"),o.append("feOffset").attr("dx",.5).attr("dy",.5).attr("in","SourceGraphic").attr("result","offOut"),o.append("feGaussianBlur").attr("in","offOut").attr("result","blurOut").attr("stdDeviation",n),o.append("feBlend").attr("in","SourceGraphic").attr("in2","blurOut").attr("mode","normal"),o.append("feComponentTransfer").append("feFuncA").attr("slope",r).attr("type","linear")},middleTitle:function(t,e,n,r){null==r&&(r=-15),t.append("text").attr("class","chart-title").attr("text-anchor","middle").attr("transform","translate("+String(e/2)+","+r+")").text(n).style("font-weight","bold")},svg:function(t,e,n,a){return r.Ys(t).text("").append("svg").attr("height",n+a.top+a.bottom).attr("width",e+a.left+a.right).append("g").attr("transform","translate("+a.left+","+a.top+")")},tooltip:function(t,e){null==e&&(e={});var n=o()({elementSelector:"",followElement:!1,followMouse:!1,leftOffst:60,tOpts:{container:"body",viewport:{selector:"#chart svg"}},topOffst:40},e);$(t).tooltip(n.tOpts),n.followMouse?$(t).hover((function(t){return $(".tooltip").css({left:String(t.pageX-n.leftOffst)+"px",top:String(t.pageY-n.topOffst)+"px"})})):n.followElement&&$(t).hover((function(){return $(".tooltip").css({left:String($(n.elementSelector).position().left-n.leftOffst)+"px",top:String($(n.elementSelector).position().top-n.topOffst)+"px"})}))}};e.Z=i},6117:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return w}});var r=n(7294),a=n(2247),o=n(2137),i=n(7757),s=n.n(i),u=n(2453),p=n(6073),c=n.n(p),l=n(928),f=n.n(l),d=n(1616),m=function(){var t=(0,o.Z)(s().mark((function t(){var e,n,r,a;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.pvA("/demos/data/d3js/mareys-schedule/data.tsv");case 2:return e=t.sent,n=[],r=function(t,e){var r=null;if(!e)for(var a in t)/^stop\|/.test(a)&&(r=a.split("|"),n.push({distance:+r[2],key:a,name:r[1],zone:+r[3]}));return{direction:t.direction,number:t.number,stops:n.map((function(e){return{station:e,time:v(t[e.key])}})).filter((function(t){return null!==t.time})),type:t.type}},(a=e.map(r)).forEach((function(t,e){t.index=e,t.stops.forEach((function(t){t.train_index=e}))})),t.abrupt("return",{stations:n,trains:a});case 8:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),h=function(){return u.Z1g("%I:%M%p")},v=function(t){var e=h()(t);return null!==e&&e.getHours()<3&&e.setDate(e.getDate()+1),e},g={bottom:50,left:120,right:50,top:80},x=function(t){var e=t.rootElId,n=t.data,r=n.stations,a=n.trains,o=document.getElementById(e).getBoundingClientRect().width-g.left-g.right,i=600-g.top-g.bottom,s=function(t){var n=u.Xf().domain([v(t[0]),v(t[1])]).range([0,o]),s=u.BYU().range([0,i]),p=h(),c=u.F5q(n).ticks(8).tickFormat(p),l=u.LLu(n).ticks(8).tickFormat(p),m=d.Z.svg("#"+e,o,i,g);d.Z.middleTitle(m,o,"E.J. Marey’s graphical train schedule  (4:30AM - 1:30AM)",-40),d.Z.filterBlackOpacity("trains",m,2,.2),m.append("defs").append("clipPath").attr("id","clip").append("rect").attr("y",-g.top).attr("width",o).attr("height",i+g.top+g.bottom),s.domain(u.Wem(r,(function(t){return t.distance})));var x=m.append("g").attr("class","station").selectAll("g").data(r).enter().append("g").attr("transform",(function(t){return"translate(0,"+s(t.distance)+")"}));x.append("text").attr("x",-6).attr("dy",".35em").text((function(t){return t.name})),x.append("line").attr("x2",o),m.append("g").attr("class","x top axis").call(c),m.append("g").attr("class","x bottom axis").attr("transform","translate(0,"+i+")").call(l);var y=m.append("g").attr("class","train").attr("clip-path","url(#clip)").selectAll("g").data(a.filter((function(t){return/[NLB]/.test(t.type)}))).enter().append("g").attr("class",(function(t){return t.type+" train-"+t.index})).on("mouseover",(function(t,e){u.Ys(".train-"+e.index).select("path").style("stroke-width","5px")})).on("mouseleave",(function(t,e){u.Ys(".train-"+e.index).select("path").style("stroke-width","2.5px")})),w=u.jvg().x((function(t){return n(t.time)})).y((function(t){return s(t.station.distance)})),O=function(t){return"S"===t.direction?t.stops[0].station.name+" -> "+f()(t.stops).station.name:f()(t.stops).station.name+" -> "+t.stops[0].station.name};y.append("path").attr("d",(function(t){return w(t.stops)})).append("title").text((function(t){return O(t)})),y.selectAll("circle").data((function(t){return t.stops})).enter().append("circle").attr("transform",(function(t){return"translate("+n(t.time)+","+s(t.station.distance)+")"})).style("filter","url(#drop-shadow-trains)").attr("r","5px").append("title").text((function(t){return O(a[t.train_index])+"\n"+t.station.name+" at "+(e=t.time,n=e.getHours(),r=e.getMinutes(),o=n>=12?"PM":"AM",(n=(n%=12)||12)+":"+(r=r<10?"0"+r:r)+" "+o);var e,n,r,o}))},p=$(".slider");p.slider({change:function(){return function(t){var e=t.slider,n=t.redraw,r=[];return c()(e.slider("values"),(function(t){var e=t/100*1200,n="AM",a=Math.floor(e/60),o=Math.floor(e%60);o>30?(o-=30,a+=1):o+=30,(a+=4)>23?a-=24===a?12:24:a>11&&(n="PM",12!==a&&(a-=12)),o<10&&(o="0"+String(o));var i=String(a)+":"+o+n;return r.push(i)})),n(r)}({redraw:s,slider:p})},range:!0}),p.slider("values",[10,50])},y=function(){var t=(0,o.Z)(s().mark((function t(){var e,n;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e="chart",t.next=3,m();case 3:n=t.sent,x({data:n,rootElId:e});case 5:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),w=function(t){var e=t.pageContext.demoInfo;return r.createElement(a.Z,{demoInfo:e,links:["/vendors/jquery-ui/themes/base/theme.css","/vendors/jquery-ui/themes/base/slider.css"],main:y,scripts:["/vendors/jquery-ui/jquery-ui.min.js","/vendors/jquery-ui/ui/slider.js"]},r.createElement("div",null,r.createElement("div",{className:"slider"})),r.createElement("div",{className:"mareys-schedule-chart",id:"chart"}))}},7412:function(t){t.exports=function(t,e){for(var n=-1,r=null==t?0:t.length;++n<r&&!1!==e(t[n],n,t););return t}},4140:function(t,e,n){var r=n(7816),a=n(9291)(r);t.exports=a},7816:function(t,e,n){var r=n(8483),a=n(3674);t.exports=function(t,e){return t&&r(t,e,a)}},280:function(t,e,n){var r=n(5726),a=n(6916),o=Object.prototype.hasOwnProperty;t.exports=function(t){if(!r(t))return a(t);var e=[];for(var n in Object(t))o.call(t,n)&&"constructor"!=n&&e.push(n);return e}},4290:function(t,e,n){var r=n(6557);t.exports=function(t){return"function"==typeof t?t:r}},9291:function(t,e,n){var r=n(8612);t.exports=function(t,e){return function(n,a){if(null==n)return n;if(!r(n))return t(n,a);for(var o=n.length,i=e?o:-1,s=Object(n);(e?i--:++i<o)&&!1!==a(s[i],i,s););return n}}},6916:function(t,e,n){var r=n(5569)(Object.keys,Object);t.exports=r},6073:function(t,e,n){t.exports=n(4486)},4486:function(t,e,n){var r=n(7412),a=n(4140),o=n(4290),i=n(1469);t.exports=function(t,e){return(i(t)?r:a)(t,o(e))}},3674:function(t,e,n){var r=n(4636),a=n(280),o=n(8612);t.exports=function(t){return o(t)?r(t):a(t)}},928:function(t){t.exports=function(t){var e=null==t?0:t.length;return e?t[e-1]:void 0}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-mareys-schedule-js-f131d91dc01eac312f3d.js.map