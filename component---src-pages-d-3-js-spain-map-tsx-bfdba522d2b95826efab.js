(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[700],{2137:function(e,t,r){"use strict";function n(e,t,r,n,a,o,i){try{var s=e[o](i),u=s.value}catch(c){return void r(c)}s.done?t(u):Promise.resolve(u).then(n,a)}function a(e){return function(){var t=this,r=arguments;return new Promise((function(a,o){var i=e.apply(t,r);function s(e){n(i,a,o,s,u,"next",e)}function u(e){n(i,a,o,s,u,"throw",e)}s(void 0)}))}}r.d(t,{Z:function(){return a}})},2242:function(e,t,r){"use strict";function n(e){return e}function a(e,t){return"string"==typeof t&&(t=e.objects[t]),"GeometryCollection"===t.type?{type:"FeatureCollection",features:t.geometries.map((function(t){return o(e,t)}))}:o(e,t)}function o(e,t){var r=t.id,a=t.bbox,o=null==t.properties?{}:t.properties,i=function(e,t){var r=function(e){if(null==e)return n;var t,r,a=e.scale[0],o=e.scale[1],i=e.translate[0],s=e.translate[1];return function(e,n){n||(t=r=0);var u=2,c=e.length,l=new Array(c);for(l[0]=(t+=e[0])*a+i,l[1]=(r+=e[1])*o+s;u<c;)l[u]=e[u],++u;return l}}(e.transform),a=e.arcs;function o(e,t){t.length&&t.pop();for(var n=a[e<0?~e:e],o=0,i=n.length;o<i;++o)t.push(r(n[o],o));e<0&&function(e,t){for(var r,n=e.length,a=n-t;a<--n;)r=e[a],e[a++]=e[n],e[n]=r}(t,i)}function i(e){return r(e)}function s(e){for(var t=[],r=0,n=e.length;r<n;++r)o(e[r],t);return t.length<2&&t.push(t[0]),t}function u(e){for(var t=s(e);t.length<4;)t.push(t[0]);return t}function c(e){return e.map(u)}function l(e){var t,r=e.type;switch(r){case"GeometryCollection":return{type:r,geometries:e.geometries.map(l)};case"Point":t=i(e.coordinates);break;case"MultiPoint":t=e.coordinates.map(i);break;case"LineString":t=s(e.arcs);break;case"MultiLineString":t=e.arcs.map(s);break;case"Polygon":t=c(e.arcs);break;case"MultiPolygon":t=e.arcs.map(c);break;default:return null}return{type:r,coordinates:t}}return l(t)}(e,t);return null==r&&null==a?{type:"Feature",properties:o,geometry:i}:null==a?{type:"Feature",id:r,properties:o,geometry:i}:{type:"Feature",id:r,bbox:a,properties:o,geometry:i}}r.d(t,{Z:function(){return a}})},9646:function(e,t,r){"use strict";var n;r.d(t,{Z:function(){return g}});var a=new Uint8Array(16);function o(){if(!n&&!(n="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return n(a)}var i=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;for(var s=function(e){return"string"==typeof e&&i.test(e)},u=[],c=0;c<256;++c)u.push((c+256).toString(16).substr(1));var l,p,f=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=(u[e[t+0]]+u[e[t+1]]+u[e[t+2]]+u[e[t+3]]+"-"+u[e[t+4]]+u[e[t+5]]+"-"+u[e[t+6]]+u[e[t+7]]+"-"+u[e[t+8]]+u[e[t+9]]+"-"+u[e[t+10]]+u[e[t+11]]+u[e[t+12]]+u[e[t+13]]+u[e[t+14]]+u[e[t+15]]).toLowerCase();if(!s(r))throw TypeError("Stringified UUID is invalid");return r},d=0,v=0;var g=function(e,t,r){var n=t&&r||0,a=t||new Array(16),i=(e=e||{}).node||l,s=void 0!==e.clockseq?e.clockseq:p;if(null==i||null==s){var u=e.random||(e.rng||o)();null==i&&(i=l=[1|u[0],u[1],u[2],u[3],u[4],u[5]]),null==s&&(s=p=16383&(u[6]<<8|u[7]))}var c=void 0!==e.msecs?e.msecs:Date.now(),g=void 0!==e.nsecs?e.nsecs:v+1,h=c-d+(g-v)/1e4;if(h<0&&void 0===e.clockseq&&(s=s+1&16383),(h<0||c>d)&&void 0===e.nsecs&&(g=0),g>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");d=c,v=g,p=s;var m=(1e4*(268435455&(c+=122192928e5))+g)%4294967296;a[n++]=m>>>24&255,a[n++]=m>>>16&255,a[n++]=m>>>8&255,a[n++]=255&m;var y=c/4294967296*1e4&268435455;a[n++]=y>>>8&255,a[n++]=255&y,a[n++]=y>>>24&15|16,a[n++]=y>>>16&255,a[n++]=s>>>8|128,a[n++]=255&s;for(var w=0;w<6;++w)a[n+w]=i[w];return t||f(a)}},258:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return k}});var n=r(7294),a=r(4275),o=r(2137),i=r(7757),s=r.n(i),u=r(7723),c=r(2242),l=r(9646),p=["#323247","#7C7CC9","#72B66C","#429742"],f=500,d=20,v=50,g=function(e){var t=e.deviation,r=e.id,n=e.slope,a=e.svg.append("defs").append("filter").attr("id","drop-shadow-"+r);a.append("feGaussianBlur").attr("in","SourceAlpha").attr("stdDeviation",t),a.append("feOffset").attr("dx",1).attr("dy",1),a.append("feComponentTransfer").append("feFuncA").attr("slope",n).attr("type","linear");var o=a.append("feMerge");o.append("feMergeNode"),o.append("feMergeNode").attr("in","SourceGraphic")},h=function(e){var t=e.areasData,r=e.rootElId,n=document.getElementById(r).getBoundingClientRect().width,a=t.objects.data1,o=(0,c.Z)(t,a).features.map((function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var n=t[0],a=t[1];return Object.assign({},n,{areaIndex:a})})),i=(0,u.BYU)().domain([0,a.geometries.length]).range([0,1]),s=(0,u.BYU)().domain((0,u.w6H)(0,1,1/p.length)).range(p),h=function(e){return s(i(e.areaIndex))},m=(0,u.Ys)("#"+r),y="region-"+(0,l.Z)().slice(0,6),w=function(t){var r=t.filterId,n=t.path;t.svgComp.selectAll(".area").data(o).enter().append("path").attr("d",n).style("fill",h).style("stroke","#FFF").style("stroke-width",.4).style("filter",(function(){return"url(#drop-shadow-"+r+")"})).on("mouseover",(function(){return(0,u.Ys)(this).style("fill","#FFB61A").style("stroke-width","1px")})).on("mouseleave",(function(){return(0,u.Ys)(this).style("fill",h).style("stroke-width",.4)})).attr("title",(function(t){return e.getTitleText(t.properties)})).attr("class",y)},C=e.getWidths(n),b=C.map((function(e){return m.append("div").style("display","inline-block").style("height",f+v+d+"px").style("width",e+"px").append("svg:svg").attr("width",e).attr("height",f+v+d).append("svg:g").attr("transform","translate("+e/2+","+(250+v)+")")}));b.forEach((function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var n=t[0],a=t[1];g({deviation:2,id:a+1,slope:.3,svg:n})}));var k=e.projectionsCenters.map((function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var n=t[0],a=t[1];return(0,u.mw4)().center(n).scale(2650).translate([C[a]/2,250])})).map((function(e){return(0,u.l49)().projection(e)}));b.forEach((function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var n=t[0],a=t[1];w({filterId:a+1,path:k[a],svgComp:n})})),$("."+y).tooltip({track:!0})},m=function(e){return[(e.NAME_3||"").includes("n.a.")?"":e.NAME_3,e.NAME_2,e.NAME_1].filter((function(e){return!!e})).join(", ")},y=function(e){var t=e/3.5;return[t,e-t-10]},w=[[-13,23],[10,35.5]],C=function(e){return{areasData:e,getTitleText:m,getWidths:y,projectionsCenters:w,rootElId:"chart"}},b=function(){var e=(0,o.Z)(s().mark((function e(){var t,r;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,u.AVB)("/demos/data/d3js/spain-map/data.json");case 2:t=e.sent,r=C(t),h(r);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),k=function(e){var t=e.pageContext;return n.createElement(a.Z,{links:["/vendors/jquery-ui/themes/base/jquery-ui.min.css"],main:b,pageContext:t,scripts:["/vendors/jquery-ui/jquery-ui.min.js"]},n.createElement("div",{id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-spain-map-tsx-bfdba522d2b95826efab.js.map