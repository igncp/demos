"use strict";(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[189],{9646:function(t,e,r){var n;r.d(e,{Z:function(){return g}});var a=new Uint8Array(16);function o(){if(!n&&!(n="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return n(a)}var i=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;for(var u=function(t){return"string"==typeof t&&i.test(t)},c=[],l=0;l<256;++l)c.push((l+256).toString(16).substr(1));var s,d,p=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=(c[t[e+0]]+c[t[e+1]]+c[t[e+2]]+c[t[e+3]]+"-"+c[t[e+4]]+c[t[e+5]]+"-"+c[t[e+6]]+c[t[e+7]]+"-"+c[t[e+8]]+c[t[e+9]]+"-"+c[t[e+10]]+c[t[e+11]]+c[t[e+12]]+c[t[e+13]]+c[t[e+14]]+c[t[e+15]]).toLowerCase();if(!u(r))throw TypeError("Stringified UUID is invalid");return r},f=0,m=0;var g=function(t,e,r){var n=e&&r||0,a=e||new Array(16),i=(t=t||{}).node||s,u=void 0!==t.clockseq?t.clockseq:d;if(null==i||null==u){var c=t.random||(t.rng||o)();null==i&&(i=s=[1|c[0],c[1],c[2],c[3],c[4],c[5]]),null==u&&(u=d=16383&(c[6]<<8|c[7]))}var l=void 0!==t.msecs?t.msecs:Date.now(),g=void 0!==t.nsecs?t.nsecs:m+1,v=l-f+(g-m)/1e4;if(v<0&&void 0===t.clockseq&&(u=u+1&16383),(v<0||l>f)&&void 0===t.nsecs&&(g=0),g>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");f=l,m=g,d=u;var h=(1e4*(268435455&(l+=122192928e5))+g)%4294967296;a[n++]=h>>>24&255,a[n++]=h>>>16&255,a[n++]=h>>>8&255,a[n++]=255&h;var y=l/4294967296*1e4&268435455;a[n++]=y>>>8&255,a[n++]=255&y,a[n++]=y>>>24&15|16,a[n++]=y>>>16&255,a[n++]=u>>>8|128,a[n++]=255&u;for(var I=0;I<6;++I)a[n+I]=i[I];return e||p(a)}},6126:function(t,e,r){var n;r.d(e,{H:function(){return a},d:function(){return n}}),function(t){t.STORYBOOK="storybook",t.TESTING="testing"}(n||(n={}));var a={SCRIPT:"/vendors/jquery-ui/jquery-ui.min.js",STYLE:"/vendors/jquery-ui/themes/base/jquery-ui.min.css"}},2682:function(t,e,r){r.r(e),r.d(e,{default:function(){return k}});var n=r(7294),a=r(6126),o=r(4275),i=r(8634),u=r(2656),c=r.n(u),l=r(1354),s=r(2149),d=r(9646),p="area-chart-module--axis--2jpe6",f=function(t){var e=t.areaPoints,r=t.rootElId,n=document.getElementById(r).getBoundingClientRect().width,a=n<500,o="voronoi-group-"+(0,d.Z)().slice(0,6),i="point-"+(0,d.Z)().slice(0,6)+"-",u=50,c=a?50:70,f=a?10:50,m=50,g=400-m-u,v=n-c-f,h=(0,l.Ys)("#"+r).append("svg").attr("height",g+m+u).attr("width",v+c+f).append("g").attr("transform","translate("+c+","+m+")").attr("class","area-chart-module--areaChart--Ked6_");h.append("text").attr("class","area-chart-module--chartTitle--3_EHS").attr("text-anchor","middle").attr("transform","translate("+v/2+","+"-15)").text(t.chartTitle).style("font-weight","bold"),function(t){var e=t.deviation,r=t.id,n=t.slope,a=t.svg.append("defs").append("filter").attr("height","500%").attr("id","drop-shadow-"+r).attr("width","500%").attr("x","-200%").attr("y","-200%");a.append("feGaussianBlur").attr("in","SourceAlpha").attr("stdDeviation",e),a.append("feOffset").attr("dx",1).attr("dy",1),a.append("feComponentTransfer").append("feFuncA").attr("slope",n).attr("type","linear");var o=a.append("feMerge");o.append("feMergeNode"),o.append("feMergeNode").attr("in","SourceGraphic")}({deviation:2,id:"points",slope:.5,svg:h});var y=(0,l.Fp7)(e,t.getItemXValue),I=(0,l.VV$)(e,t.getItemXValue),w=(0,l.Fp7)(e,t.getItemYValue),V=(0,l.VV$)(e,t.getItemYValue),x=(0,l.BYU)().domain([I,y]).range([0,v]),C=(0,l.BYU)().domain([w+.05,V-.05]).range([0,g]),k=function(e){return x(t.getItemXValue(e))},E=function(e){return C(t.getItemYValue(e))},S=a?(0,l.aE8)().domain([0,500]).range(Array.from({length:6}).map((function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[1];return n})))(n):null,b=(0,l.LLu)(x).tickFormat((0,l.WUZ)(".0f")).ticks(S),A=(0,l.y4O)(C).tickFormat((0,l.WUZ)(".0%")).tickSize(10);h.append("g").attr("class","area-chart-module--x--1LLGJ "+p).attr("transform","translate(0,"+g+")").call(b).selectAll("text").attr("dy","1.25em"),h.append("g").attr("class","area-chart-module--y--1GhEy "+p).call(A).selectAll("text").attr("dx","-.25em");var T=(0,l.SOn)().x(k).y0(g).y1(E),Y=(0,l.jvg)().x(k).y(E);h.append("path").datum(e).attr("class","area-chart-module--line--1O1QS").attr("d",Y).attr("clip-path","url(#clip)"),h.append("clipPath").attr("id","clip").append("rect").attr("height",g).attr("width",v),h.append("path").datum(e).attr("class","area-chart-module--area--ul7t6").attr("d",T).attr("clip-path","url(#clip)");var j=s.Z.from(e,k,E).voronoi([-c,-m,v+f,g+u]);h.selectAll("circle").data(e).enter().append("circle").attr("transform",(function(t){return"translate("+k(t)+","+E(t)+")"})).attr("r","5px").attr("class",(function(e){return"area-chart-module--point--3nljr "+i+t.getItemId(e)})).style("filter","url(#drop-shadow-points)");var R=h.append("g").attr("class","area-chart-module--voronoi--3QRtu");return R.selectAll("path").data(e).enter().append("path").attr("d",(function(e){return j.renderCell(t.getItemId(e))})).on("mouseover",(function(){for(var e=arguments.length,r=new Array(e),n=0;n<e;n++)r[n]=arguments[n];var a=r[1];(0,l.Ys)("."+i+t.getItemId(a)).style("display","block")})).on("mouseleave",(function(){for(var e=arguments.length,r=new Array(e),n=0;n<e;n++)r[n]=arguments[n];var a=r[1];(0,l.Ys)("."+i+t.getItemId(a)).style("display","none")})).attr("class",o).attr("title",t.getItemTitle),$("."+o).tooltip({track:!0}),{toggleVoronoi:function(){var t=R.attr("class"),e="area-chart-module--showVoronoi--3rQXC",r=t.includes(e)?t.replace(e,"").trim():t+" "+e;R.attr("class",r)}}},m="chart",g=function(t){return t.getYear()},v=function(t){return t.getNormalizedValue()},h=function(t){return t.getId()},y=function(t){return t.getSummary()},I=function(t){return{areaPoints:t,chartTitle:"Share of top decile [aka top 10%] in national income",getItemId:h,getItemTitle:y,getItemXValue:g,getItemYValue:v,rootElId:m}},w=function(t){document.getElementById("toggle-voronoi").addEventListener("click",(function(e){e.preventDefault(),t()}))},V=function(){function t(t){this.incomeItemData=t}t.fetchAndCreateCollection=function(){var e=(0,i.Z)(c().mark((function e(){var r,n;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,l.gyn)("/demos/data/d3js/area/data.csv");case 2:return r=e.sent,n=r.map((function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[0],a=e[1];return Object.assign({},n,{pointIndex:a})})),e.abrupt("return",n.map((function(e){return new t(e)})));case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();var e=t.prototype;return e.getYear=function(){return this.incomeItemData.year},e.getNormalizedValue=function(){return this.incomeItemData.percent/100},e.getId=function(){return this.incomeItemData.pointIndex},e.getSummary=function(){var t=this.incomeItemData;return"Year: "+t.year+", Percent: "+t.percent+"%"},t}(),x=function(){var t=(0,i.Z)(c().mark((function t(){var e,r,n,a;return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,V.fetchAndCreateCollection();case 2:e=t.sent,r=I(e),n=f(r),a=n.toggleVoronoi,w(a);case 6:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),C=x,k=function(t){var e=t.pageContext;return n.createElement(o.Z,{links:[a.H.STYLE],main:C,pageContext:e,scripts:[a.H.SCRIPT]},n.createElement("form",null,n.createElement("button",{className:"btn btn-info",id:"toggle-voronoi",type:"button"},"Toggle Voronoi")),n.createElement("div",{id:m}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-area-tsx-4b4f31b6b4f134615aea.js.map