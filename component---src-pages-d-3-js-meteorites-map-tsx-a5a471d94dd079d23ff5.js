"use strict";(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[257],{9646:function(t,e,r){var n;r.d(e,{Z:function(){return h}});var a=new Uint8Array(16);function o(){if(!n&&!(n="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return n(a)}var i=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;for(var c=function(t){return"string"==typeof t&&i.test(t)},s=[],u=0;u<256;++u)s.push((u+256).toString(16).substr(1));var l,p,d=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=(s[t[e+0]]+s[t[e+1]]+s[t[e+2]]+s[t[e+3]]+"-"+s[t[e+4]]+s[t[e+5]]+"-"+s[t[e+6]]+s[t[e+7]]+"-"+s[t[e+8]]+s[t[e+9]]+"-"+s[t[e+10]]+s[t[e+11]]+s[t[e+12]]+s[t[e+13]]+s[t[e+14]]+s[t[e+15]]).toLowerCase();if(!c(r))throw TypeError("Stringified UUID is invalid");return r},f=0,m=0;var h=function(t,e,r){var n=e&&r||0,a=e||new Array(16),i=(t=t||{}).node||l,c=void 0!==t.clockseq?t.clockseq:p;if(null==i||null==c){var s=t.random||(t.rng||o)();null==i&&(i=l=[1|s[0],s[1],s[2],s[3],s[4],s[5]]),null==c&&(c=p=16383&(s[6]<<8|s[7]))}var u=void 0!==t.msecs?t.msecs:Date.now(),h=void 0!==t.nsecs?t.nsecs:m+1,g=u-f+(h-m)/1e4;if(g<0&&void 0===t.clockseq&&(c=c+1&16383),(g<0||u>f)&&void 0===t.nsecs&&(h=0),h>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");f=u,m=h,p=c;var v=(1e4*(268435455&(u+=122192928e5))+h)%4294967296;a[n++]=v>>>24&255,a[n++]=v>>>16&255,a[n++]=v>>>8&255,a[n++]=255&v;var y=u/4294967296*1e4&268435455;a[n++]=y>>>8&255,a[n++]=255&y,a[n++]=y>>>24&15|16,a[n++]=y>>>16&255,a[n++]=c>>>8|128,a[n++]=255&c;for(var w=0;w<6;++w)a[n+w]=i[w];return e||d(a)}},7978:function(t,e,r){r.r(e),r.d(e,{default:function(){return T}});var n=r(7294),a=r(6126),o=r(4275),i=r(8634),c=r(2656),s=r.n(c),u=r(7956),l=r(5221),p=r(9646),d="circles-map-chart-module--circle--090d8",f="circles-map-chart-module--modal--1a59f",m=0,h=0,g=1e3-0-0;function v(t){(0,l.Ys)(this).transition().duration(500).attr("transform",t.transform)}var y=function(t){var e=t.circlesData,r=t.getCircleId,n=t.mapLayout,a=t.rootElId,o=document.getElementById(a),i=o.getBoundingClientRect().width-m-h,c=(0,l.mw4)().translate([i/2,g/2]),s=(0,l.l49)().projection(c),y=d+"-"+(0,p.Z)().slice(0,6),w=y+" "+d,C="mapLayoutItem-"+(0,p.Z)().slice(0,6),k={isDuringAnimation:!1,selectedCircle:null},M=(0,l.Ys)("#"+a).append("div").attr("class",f).style("top","-250px"),b=e.map((function(t){return Object.assign({},t,{geometry:t.geolocation,type:"Feature"})})),L=function(){k.isDuringAnimation||(k.selectedCircle=null,Y.attr("class",w),(0,u.Z)({targets:"."+y,translateX:0,translateY:0}),k.isDuringAnimation=!0,(0,u.Z)({complete:function(){k.isDuringAnimation=!1,M.text("")},targets:"."+f,translateY:0}))},x=function(e){var n=e.clickedCircle;if(!k.isDuringAnimation){var a=r(n);if(k.selectedCircle!==a){k.selectedCircle=a;var i=t.getModalHTML(n);M.html(i);var s=function(t){var e=t.targetCircle,n=c(e.geometry.coordinates),a=b.slice(0).filter((function(t){return!!t.geometry})).map((function(t){var e=t.geometry.coordinates,r=c(e),a=[r[0]-n[0],r[1]-n[1]],o=Math.sqrt(Math.pow(a[0],2)+Math.pow(a[1],2));return Object.assign({},t,{vector:a,vectorLength:o})})).filter((function(t){return t.vectorLength<20&&0!==t.vectorLength})).map((function(t){return Object.assign({},t,{vectorNormalized:[t.vector[0]/t.vectorLength,t.vector[1]/t.vectorLength]})})),o=new Set(a.map((function(t){return r(t)}))),i=a.reduce((function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];var a=e[0],o=e[1];return a[r(o)]=o.vectorNormalized,a}),{});return{nearCircles:a,nearCirclesSet:o,vectorsMap:i}}({targetCircle:n}),l=s.nearCirclesSet,p=s.vectorsMap,d=function(t){var e=b[t];return r(e)===r(n)||!l.has(r(e))};Y.attr("class",(function(t){return l.has(r(t))?"circles-map-chart-module--moved--e6420 "+w:r(t)===r(n)?"circles-map-chart-module--active--9358b "+w:w}));var m=function(t){return function(){for(var e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];var o=n[1];if(d(o))return 0;var i=b[o],c=p[r(i)];return 20*c[t]}};(0,u.Z)({targets:"."+y,translateX:m(0),translateY:m(1)});var h=o.getBoundingClientRect().top;(0,u.Z)({targets:"."+f,translateY:300+h+window.scrollY})}else L()}},A=(0,l.Ys)("#"+a).append("svg").attr("width",i).attr("height",g-250).style("cursor","pointer").on("click",L).style("transform-origin","top left").call((0,l.sPX)().extent([[0,0],[i,g]]).on("end",v)),T=A.append("g");A.append("text").text(t.chartTitle).attr("text-anchor","middle").style("font-size","20px").attr("transform","translate("+i/2+",40)").style("font-weight","bold");!function(){var e="dialog-"+(0,p.Z)().slice(0,6),r=A.append("g").attr("transform","translate("+(i-50)+",50)").attr("class","circles-map-chart-module--infoTrigger--9049c");A.append("g").html('\n<filter id="pulse" x="0" y="0" width="100%" height="100%">\n  <feTurbulence result="cloud" baseFrequency=".01" seed="1"  type="fractalNoise" numOctaves="2">\n  <animate attributeName="baseFrequency" calcMode="paced" begin="0s" dur="12s" values=".01;.13;.01;" repeatCount="indefinite"/>\n  </feTurbulence>\n  <feComposite operator="in" in="cloud" in2="SourceGraphic"/>\n</filter>\n    ');var n=(0,l.Ys)(document.body).append("div").attr("id",e).html(t.chartHelpHTML);$("#"+e).dialog({autoOpen:!1,modal:!0,resizable:!1}),r.append("circle").attr("r","20").attr("filter","url(#pulse)"),r.append("text").text("?"),r.on("click",(function(){$("#"+e).dialog("open")}))}(),T.append("g").attr("class",C).selectAll("path").data(n.features).enter().append("path").attr("d",s).attr("fill","#ccc").style("stroke","white").style("stroke-width",1.5).style("opacity",.8).style("stroke","white").style("stroke-width",.3).on("click",L).attr("title",(function(t){return t.properties.name}));var Y=T.append("g").on("click",L).selectAll("path").data(b).enter().append("path").attr("d",s).attr("class",w).style("stroke","white").style("cursor","pointer").style("stroke-width",1.5).style("opacity",.8).attr("title",(function(e){return t.getCircleTitle(e)})).on("click",(function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[0],a=e[1];n.stopPropagation(),x({clickedCircle:a})}));$("."+y).tooltip({track:!0}),$("."+C).tooltip({tooltipClass:"circles-map-chart-module--mapLayoutItemTooltip--fc153",track:!0})},w=r(2203),C=function(){function t(t){this.countries=t}return t.createAndFetch=function(){var e=(0,i.Z)(s().mark((function e(){var r;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,l.AVB)("/demos/data/d3js/meteorites-map/world_countries.json");case 2:return r=e.sent,e.abrupt("return",new t(r));case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),t.prototype.getCountries=function(){return this.countries},t}(),k=function(){function t(t){this.meteorites=t}return t.createAndFetch=function(){var e=(0,i.Z)(s().mark((function e(){var r;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,l.AVB)("/demos/data/d3js/meteorites-map/meteorites.json");case 2:return r=e.sent,e.abrupt("return",new t(r));case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),t.getMeteoriteId=function(t){return t.id},t.getMeteoriteSummaryHTML=function(t){var e=(0,l.i$Z)("%Y")(new Date(t.year)),r=(new Intl.NumberFormat).format(+t.mass);return("\n<h1>"+t.name+"</h1>\n<p>Year: "+e+', Class: <a href="https://www.google.com/search?'+w.stringify({q:t.recclass+" Meteorite Class"})+'" target="_blank">'+t.recclass+"</a></p>\n<p>"+(r?"Mass: "+r+"g, ":"")+"Name: "+t.nametype+'</p>\n<p><a href="https://www.google.com/search?'+w.stringify({q:t.name+" Meteorite "+e})+'" target="_blank">Click here to search</a></p>\n').trim()},t.getMeteoriteName=function(t){return t.name},t.prototype.getMeteorites=function(){return this.meteorites.slice()},t}(),M="chart",b='\n<p>The green circles refer to meteorites which were moved in the map to allow seeing the selected meteorite, which is in red.</p>\n<p>You can find the <a href="http://www.meteoritemarket.com/type.htm">meteorites classification here</a></p>\n'.trim(),L=function(t){var e=t.countriesLayout,r=t.meteoritesData.getMeteorites();return{chartHelpHTML:b,chartTitle:"Meteorite landings in Earth",circlesData:r,getCircleId:function(t){return k.getMeteoriteId(t)},getCircleTitle:function(t){return t.name},getModalHTML:function(t){return k.getMeteoriteSummaryHTML(t)},mapLayout:e.getCountries(),rootElId:M}},x=function(){var t=(0,i.Z)(s().mark((function t(){var e,r,n,a;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Promise.all([k.createAndFetch(),C.createAndFetch()]);case 2:e=t.sent,r=e[0],n=e[1],a=L({countriesLayout:n,meteoritesData:r}),y(a);case 7:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),A=x,T=function(t){var e=t.pageContext;return n.createElement(o.Z,{links:[a.H.STYLE],main:A,pageContext:e,scripts:[a.H.SCRIPT]},n.createElement("div",{id:M}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-meteorites-map-tsx-a5a471d94dd079d23ff5.js.map