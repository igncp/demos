(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[257],{9646:function(t,e,r){"use strict";var n;r.d(e,{Z:function(){return h}});var a=new Uint8Array(16);function o(){if(!n&&!(n="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return n(a)}var i=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;for(var c=function(t){return"string"==typeof t&&i.test(t)},s=[],u=0;u<256;++u)s.push((u+256).toString(16).substr(1));var l,p,d=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=(s[t[e+0]]+s[t[e+1]]+s[t[e+2]]+s[t[e+3]]+"-"+s[t[e+4]]+s[t[e+5]]+"-"+s[t[e+6]]+s[t[e+7]]+"-"+s[t[e+8]]+s[t[e+9]]+"-"+s[t[e+10]]+s[t[e+11]]+s[t[e+12]]+s[t[e+13]]+s[t[e+14]]+s[t[e+15]]).toLowerCase();if(!c(r))throw TypeError("Stringified UUID is invalid");return r},m=0,f=0;var h=function(t,e,r){var n=e&&r||0,a=e||new Array(16),i=(t=t||{}).node||l,c=void 0!==t.clockseq?t.clockseq:p;if(null==i||null==c){var s=t.random||(t.rng||o)();null==i&&(i=l=[1|s[0],s[1],s[2],s[3],s[4],s[5]]),null==c&&(c=p=16383&(s[6]<<8|s[7]))}var u=void 0!==t.msecs?t.msecs:Date.now(),h=void 0!==t.nsecs?t.nsecs:f+1,g=u-m+(h-f)/1e4;if(g<0&&void 0===t.clockseq&&(c=c+1&16383),(g<0||u>m)&&void 0===t.nsecs&&(h=0),h>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");m=u,f=h,p=c;var v=(1e4*(268435455&(u+=122192928e5))+h)%4294967296;a[n++]=v>>>24&255,a[n++]=v>>>16&255,a[n++]=v>>>8&255,a[n++]=255&v;var y=u/4294967296*1e4&268435455;a[n++]=y>>>8&255,a[n++]=255&y,a[n++]=y>>>24&15|16,a[n++]=y>>>16&255,a[n++]=c>>>8|128,a[n++]=255&c;for(var w=0;w<6;++w)a[n+w]=i[w];return e||d(a)}},7978:function(t,e,r){"use strict";r.r(e),r.d(e,{default:function(){return x}});var n=r(7294),a=r(4275),o=r(2137),i=r(7757),c=r.n(i),s=r(7956),u=r(7723),l=r(9646),p="circles-map-chart-module--circle--1Thr1",d="circles-map-chart-module--modal--hs5K4",m=0,f=0,h=1e3-0-0,g=function(t){(0,u.Ys)(this).transition().duration(500).attr("transform",t.transform)},v=function(t){var e=t.circlesData,r=t.getCircleId,n=t.mapLayout,a=t.rootElId,o=document.getElementById(a),i=o.getBoundingClientRect().width-m-f,c=(0,u.mw4)().translate([i/2,h/2]),v=(0,u.l49)().projection(c),y=p+"-"+(0,l.Z)().slice(0,6),w=y+" "+p,C="mapLayoutItem-"+(0,l.Z)().slice(0,6),k={isDuringAnimation:!1,selectedCircle:null},b=(0,u.Ys)("#"+a).append("div").attr("class",d).style("top","-250px"),M=e.map((function(t){return Object.assign({},t,{geometry:t.geolocation,type:"Feature"})})),x=function(){k.isDuringAnimation||(k.selectedCircle=null,j.attr("class",w),(0,s.Z)({targets:"."+y,translateX:0,translateY:0}),k.isDuringAnimation=!0,(0,s.Z)({complete:function(){k.isDuringAnimation=!1,b.text("")},targets:"."+d,translateY:0}))},A=function(e){var n=e.clickedCircle;if(!k.isDuringAnimation){var a=r(n);if(k.selectedCircle!==a){k.selectedCircle=a;var i=t.getModalHTML(n);b.html(i);var u=function(t){var e=t.targetCircle,n=c(e.geometry.coordinates),a=M.slice(0).filter((function(t){return!!t.geometry})).map((function(t){var e=t.geometry.coordinates,r=c(e),a=[r[0]-n[0],r[1]-n[1]],o=Math.sqrt(Math.pow(a[0],2)+Math.pow(a[1],2));return Object.assign({},t,{vector:a,vectorLength:o})})).filter((function(t){return t.vectorLength<20&&0!==t.vectorLength})).map((function(t){return Object.assign({},t,{vectorNormalized:[t.vector[0]/t.vectorLength,t.vector[1]/t.vectorLength]})})),o=new Set(a.map((function(t){return r(t)}))),i=a.reduce((function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];var a=e[0],o=e[1];return a[r(o)]=o.vectorNormalized,a}),{});return{nearCircles:a,nearCirclesSet:o,vectorsMap:i}}({targetCircle:n}),l=u.nearCirclesSet,p=u.vectorsMap,m=function(t){var e=M[t];return r(e)===r(n)||!l.has(r(e))};j.attr("class",(function(t){return l.has(r(t))?"circles-map-chart-module--moved--3crHY "+w:r(t)===r(n)?"circles-map-chart-module--active--2o6S0 "+w:w}));var f=function(t){return function(){for(var e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];var o=n[1];if(m(o))return 0;var i=M[o],c=p[r(i)];return 20*c[t]}};(0,s.Z)({targets:"."+y,translateX:f(0),translateY:f(1)});var h=o.getBoundingClientRect().top;(0,s.Z)({targets:"."+d,translateY:300+h+window.scrollY})}else x()}},L=(0,u.Ys)("#"+a).append("svg").attr("width",i).attr("height",h-250).style("cursor","pointer").on("click",x).style("transform-origin","top left").call((0,u.sPX)().extent([[0,0],[i,h]]).on("end",g)),T=L.append("g");L.append("text").text(t.chartTitle).attr("text-anchor","middle").style("font-size","20px").attr("transform","translate("+i/2+",40)").style("font-weight","bold");!function(){var e="dialog-"+(0,l.Z)().slice(0,6),r=L.append("g").attr("transform","translate("+(i-50)+",50)").attr("class","circles-map-chart-module--infoTrigger--uo5R3");L.append("g").html('\n<filter id="pulse" x="0" y="0" width="100%" height="100%">\n  <feTurbulence result="cloud" baseFrequency=".01" seed="1"  type="fractalNoise" numOctaves="2">\n  <animate attributeName="baseFrequency" calcMode="paced" begin="0s" dur="12s" values=".01;.13;.01;" repeatCount="indefinite"/>\n  </feTurbulence>\n  <feComposite operator="in" in="cloud" in2="SourceGraphic"/>\n</filter>\n    ');var n=(0,u.Ys)(document.body).append("div").attr("id",e).html(t.chartHelpHTML);$("#"+e).dialog({autoOpen:!1,modal:!0,resizable:!1}),r.append("circle").attr("r","20").attr("filter","url(#pulse)"),r.append("text").text("?"),r.on("click",(function(){$("#"+e).dialog("open")}))}(),T.append("g").attr("class",C).selectAll("path").data(n.features).enter().append("path").attr("d",v).attr("fill","#ccc").style("stroke","white").style("stroke-width",1.5).style("opacity",.8).style("stroke","white").style("stroke-width",.3).on("click",x).attr("title",(function(t){return t.properties.name}));var j=T.append("g").on("click",x).selectAll("path").data(M).enter().append("path").attr("d",v).attr("class",w).style("stroke","white").style("cursor","pointer").style("stroke-width",1.5).style("opacity",.8).attr("title",(function(e){return t.getCircleTitle(e)})).on("click",(function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[0],a=e[1];n.stopPropagation(),A({clickedCircle:a})}));$("."+y).tooltip({track:!0}),$("."+C).tooltip({tooltipClass:"circles-map-chart-module--mapLayoutItemTooltip--2bFce",track:!0})},y=r(2203),w=function(){function t(t){this.countries=t}return t.createAndFetch=function(){var e=(0,o.Z)(c().mark((function e(){var r;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,u.AVB)("/demos/data/d3js/meteorites-map/world_countries.json");case 2:return r=e.sent,e.abrupt("return",new t(r));case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),t.prototype.getCountries=function(){return this.countries},t}(),C=function(){function t(t){this.meteorites=t}return t.createAndFetch=function(){var e=(0,o.Z)(c().mark((function e(){var r;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,u.AVB)("/demos/data/d3js/meteorites-map/meteorites.json");case 2:return r=e.sent,e.abrupt("return",new t(r));case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),t.getMeteoriteId=function(t){return t.id},t.getMeteoriteSummaryHTML=function(t){var e=(0,u.i$Z)("%Y")(new Date(t.year)),r=(new Intl.NumberFormat).format(+t.mass);return("\n<h1>"+t.name+"</h1>\n<p>Year: "+e+', Class: <a href="https://www.google.com/search?'+y.stringify({q:t.recclass+" Meteorite Class"})+'" target="_blank">'+t.recclass+"</a></p>\n<p>"+(r?"Mass: "+r+"g, ":"")+"Name: "+t.nametype+'</p>\n<p><a href="https://www.google.com/search?'+y.stringify({q:t.name+" Meteorite "+e})+'" target="_blank">Click here to search</a></p>\n').trim()},t.getMeteoriteName=function(t){return t.name},t.prototype.getMeteorites=function(){return this.meteorites.slice()},t}(),k='\n<p>The green circles refer to meteorites which were moved in the map to allow seeing the selected meteorite, which is in red.</p>\n<p>You can find the <a href="http://www.meteoritemarket.com/type.htm">meteorites classification here</a></p>\n'.trim(),b=function(t){var e=t.countriesLayout,r=t.meteoritesData.getMeteorites();return{chartHelpHTML:k,chartTitle:"Meteorite landings in Earth",circlesData:r,getCircleId:function(t){return C.getMeteoriteId(t)},getCircleTitle:function(t){return t.name},getModalHTML:function(t){return C.getMeteoriteSummaryHTML(t)},mapLayout:e.getCountries(),rootElId:"chart"}},M=function(){var t=(0,o.Z)(c().mark((function t(){var e,r,n,a;return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Promise.all([C.createAndFetch(),w.createAndFetch()]);case 2:e=t.sent,r=e[0],n=e[1],a=b({countriesLayout:n,meteoritesData:r}),v(a);case 7:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),x=function(t){var e=t.pageContext;return n.createElement(a.Z,{links:["/vendors/jquery-ui/themes/base/jquery-ui.min.css"],main:M,pageContext:e,scripts:["/vendors/jquery-ui/jquery-ui.min.js"]},n.createElement("div",{id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-meteorites-map-tsx-b023eed60a4a5055a636.js.map