(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[700],{2137:function(e,t,r){"use strict";function n(e,t,r,n,o,a,i){try{var u=e[a](i),s=u.value}catch(c){return void r(c)}u.done?t(s):Promise.resolve(s).then(n,o)}function o(e){return function(){var t=this,r=arguments;return new Promise((function(o,a){var i=e.apply(t,r);function u(e){n(i,o,a,u,s,"next",e)}function s(e){n(i,o,a,u,s,"throw",e)}u(void 0)}))}}r.d(t,{Z:function(){return o}})},2242:function(e,t,r){"use strict";function n(e){return e}function o(e,t){return"string"==typeof t&&(t=e.objects[t]),"GeometryCollection"===t.type?{type:"FeatureCollection",features:t.geometries.map((function(t){return a(e,t)}))}:a(e,t)}function a(e,t){var r=t.id,o=t.bbox,a=null==t.properties?{}:t.properties,i=function(e,t){var r=function(e){if(null==e)return n;var t,r,o=e.scale[0],a=e.scale[1],i=e.translate[0],u=e.translate[1];return function(e,n){n||(t=r=0);var s=2,c=e.length,l=new Array(c);for(l[0]=(t+=e[0])*o+i,l[1]=(r+=e[1])*a+u;s<c;)l[s]=e[s],++s;return l}}(e.transform),o=e.arcs;function a(e,t){t.length&&t.pop();for(var n=o[e<0?~e:e],a=0,i=n.length;a<i;++a)t.push(r(n[a],a));e<0&&function(e,t){for(var r,n=e.length,o=n-t;o<--n;)r=e[o],e[o++]=e[n],e[n]=r}(t,i)}function i(e){return r(e)}function u(e){for(var t=[],r=0,n=e.length;r<n;++r)a(e[r],t);return t.length<2&&t.push(t[0]),t}function s(e){for(var t=u(e);t.length<4;)t.push(t[0]);return t}function c(e){return e.map(s)}function l(e){var t,r=e.type;switch(r){case"GeometryCollection":return{type:r,geometries:e.geometries.map(l)};case"Point":t=i(e.coordinates);break;case"MultiPoint":t=e.coordinates.map(i);break;case"LineString":t=u(e.arcs);break;case"MultiLineString":t=e.arcs.map(u);break;case"Polygon":t=c(e.arcs);break;case"MultiPolygon":t=e.arcs.map(c);break;default:return null}return{type:r,coordinates:t}}return l(t)}(e,t);return null==r&&null==o?{type:"Feature",properties:a,geometry:i}:null==o?{type:"Feature",id:r,properties:a,geometry:i}:{type:"Feature",id:r,bbox:o,properties:a,geometry:i}}r.d(t,{Z:function(){return o}})},9646:function(e,t,r){"use strict";var n;r.d(t,{Z:function(){return g}});var o=new Uint8Array(16);function a(){if(!n&&!(n="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return n(o)}var i=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;for(var u=function(e){return"string"==typeof e&&i.test(e)},s=[],c=0;c<256;++c)s.push((c+256).toString(16).substr(1));var l,p,f=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=(s[e[t+0]]+s[e[t+1]]+s[e[t+2]]+s[e[t+3]]+"-"+s[e[t+4]]+s[e[t+5]]+"-"+s[e[t+6]]+s[e[t+7]]+"-"+s[e[t+8]]+s[e[t+9]]+"-"+s[e[t+10]]+s[e[t+11]]+s[e[t+12]]+s[e[t+13]]+s[e[t+14]]+s[e[t+15]]).toLowerCase();if(!u(r))throw TypeError("Stringified UUID is invalid");return r},d=0,v=0;var g=function(e,t,r){var n=t&&r||0,o=t||new Array(16),i=(e=e||{}).node||l,u=void 0!==e.clockseq?e.clockseq:p;if(null==i||null==u){var s=e.random||(e.rng||a)();null==i&&(i=l=[1|s[0],s[1],s[2],s[3],s[4],s[5]]),null==u&&(u=p=16383&(s[6]<<8|s[7]))}var c=void 0!==e.msecs?e.msecs:Date.now(),g=void 0!==e.nsecs?e.nsecs:v+1,y=c-d+(g-v)/1e4;if(y<0&&void 0===e.clockseq&&(u=u+1&16383),(y<0||c>d)&&void 0===e.nsecs&&(g=0),g>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");d=c,v=g,p=u;var h=(1e4*(268435455&(c+=122192928e5))+g)%4294967296;o[n++]=h>>>24&255,o[n++]=h>>>16&255,o[n++]=h>>>8&255,o[n++]=255&h;var m=c/4294967296*1e4&268435455;o[n++]=m>>>8&255,o[n++]=255&m,o[n++]=m>>>24&15|16,o[n++]=m>>>16&255,o[n++]=u>>>8|128,o[n++]=255&u;for(var w=0;w<6;++w)o[n+w]=i[w];return t||f(o)}},6126:function(e,t,r){"use strict";r.d(t,{p:function(){return n},H:function(){return o}});var n="storybook",o={SCRIPT:"/vendors/jquery-ui/jquery-ui.min.js",STYLE:"/vendors/jquery-ui/themes/base/jquery-ui.min.css"}},258:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return E}});var n=r(7294),o=r(6126),a=r(4275),i=r(2137),u=r(7757),s=r.n(u),c=r(7723),l=r(2242),p=r(9646),f=["#323247","#7C7CC9","#72B66C","#429742"],d=500,v=20,g=50,y=function(e){var t=e.deviation,r=e.id,n=e.slope,o=e.svg.append("defs").append("filter").attr("id","drop-shadow-"+r);o.append("feGaussianBlur").attr("in","SourceAlpha").attr("stdDeviation",t),o.append("feOffset").attr("dx",1).attr("dy",1),o.append("feComponentTransfer").append("feFuncA").attr("slope",n).attr("type","linear");var a=o.append("feMerge");a.append("feMergeNode"),a.append("feMergeNode").attr("in","SourceGraphic")},h=function(e){var t=e.areasData,r=e.rootElId,n=document.getElementById(r).getBoundingClientRect().width,o=t.objects.data1,a=(0,l.Z)(t,o).features.map((function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var n=t[0],o=t[1];return Object.assign({},n,{areaIndex:o})})),i=(0,c.BYU)().domain([0,o.geometries.length]).range([0,1]),u=(0,c.BYU)().domain((0,c.w6H)(0,1,1/f.length)).range(f),s=function(e){return u(i(e.areaIndex))},h=(0,c.Ys)("#"+r),m="region-"+(0,p.Z)().slice(0,6),w=function(t){var r=t.filterId,n=t.path;t.svgComp.selectAll(".area").data(a).enter().append("path").attr("d",n).style("fill",s).style("stroke","#FFF").style("stroke-width",.4).style("filter",(function(){return"url(#drop-shadow-"+r+")"})).on("mouseover",(function(){return(0,c.Ys)(this).style("fill","#FFB61A").style("stroke-width","1px")})).on("mouseleave",(function(){return(0,c.Ys)(this).style("fill",s).style("stroke-width",.4)})).attr("title",(function(t){return e.getTitleText(t.properties)})).attr("class",m)},C=e.getWidths(n),b=C.map((function(e){return h.append("div").style("display","inline-block").style("height",d+g+v+"px").style("width",e+"px").append("svg:svg").attr("width",e).attr("height",d+g+v).append("svg:g").attr("transform","translate("+e/2+","+(250+g)+")")}));b.forEach((function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var n=t[0],o=t[1];y({deviation:2,id:o+1,slope:.3,svg:n})}));var k=e.projectionsCenters.map((function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var n=t[0],o=t[1];return(0,c.mw4)().center(n).scale(2650).translate([C[o]/2,250])})).map((function(e){return(0,c.l49)().projection(e)}));b.forEach((function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var n=t[0],o=t[1];w({filterId:o+1,path:k[o],svgComp:n})})),$("."+m).tooltip({track:!0})},m="chart",w=function(e){return[(e.NAME_3||"").includes("n.a.")?"":e.NAME_3,e.NAME_2,e.NAME_1].filter((function(e){return!!e})).join(", ")},C=function(e){var t=e/3.5;return[t,e-t-10]},b=[[-13,23],[10,35.5]],k=function(e){return{areasData:e,getTitleText:w,getWidths:C,projectionsCenters:b,rootElId:m}},A=function(){var e=(0,i.Z)(s().mark((function e(){var t,r;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,c.AVB)("/demos/data/d3js/spain-map/data.json");case 2:t=e.sent,r=k(t),h(r);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),E=function(e){var t=e.pageContext;return n.createElement(a.Z,{links:[o.H.STYLE],main:A,pageContext:t,scripts:[o.H.SCRIPT]},n.createElement("div",{id:m}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-spain-map-tsx-02cb4324ca89c05fae4f.js.map