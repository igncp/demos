(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[189],{9646:function(t,e,r){"use strict";var a;r.d(e,{Z:function(){return g}});var n=new Uint8Array(16);function o(){if(!a&&!(a="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return a(n)}var i=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;for(var u=function(t){return"string"==typeof t&&i.test(t)},c=[],l=0;l<256;++l)c.push((l+256).toString(16).substr(1));var s,d,p=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=(c[t[e+0]]+c[t[e+1]]+c[t[e+2]]+c[t[e+3]]+"-"+c[t[e+4]]+c[t[e+5]]+"-"+c[t[e+6]]+c[t[e+7]]+"-"+c[t[e+8]]+c[t[e+9]]+"-"+c[t[e+10]]+c[t[e+11]]+c[t[e+12]]+c[t[e+13]]+c[t[e+14]]+c[t[e+15]]).toLowerCase();if(!u(r))throw TypeError("Stringified UUID is invalid");return r},m=0,f=0;var g=function(t,e,r){var a=e&&r||0,n=e||new Array(16),i=(t=t||{}).node||s,u=void 0!==t.clockseq?t.clockseq:d;if(null==i||null==u){var c=t.random||(t.rng||o)();null==i&&(i=s=[1|c[0],c[1],c[2],c[3],c[4],c[5]]),null==u&&(u=d=16383&(c[6]<<8|c[7]))}var l=void 0!==t.msecs?t.msecs:Date.now(),g=void 0!==t.nsecs?t.nsecs:f+1,h=l-m+(g-f)/1e4;if(h<0&&void 0===t.clockseq&&(u=u+1&16383),(h<0||l>m)&&void 0===t.nsecs&&(g=0),g>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");m=l,f=g,d=u;var v=(1e4*(268435455&(l+=122192928e5))+g)%4294967296;n[a++]=v>>>24&255,n[a++]=v>>>16&255,n[a++]=v>>>8&255,n[a++]=255&v;var y=l/4294967296*1e4&268435455;n[a++]=y>>>8&255,n[a++]=255&y,n[a++]=y>>>24&15|16,n[a++]=y>>>16&255,n[a++]=u>>>8|128,n[a++]=255&u;for(var I=0;I<6;++I)n[a+I]=i[I];return e||p(n)}},2682:function(t,e,r){"use strict";r.r(e),r.d(e,{default:function(){return V}});var a=r(7294),n=r(4275),o=r(2137),i=r(7757),u=r.n(i),c=r(7723),l=r(2149),s=r(9646),d="area-chart-module--axis--2jpe6",p=function(t){var e=t.areaPoints,r=t.rootElId,a=document.getElementById(r).getBoundingClientRect().width,n=a<500,o="voronoi-group-"+(0,s.Z)().slice(0,6),i="point-"+(0,s.Z)().slice(0,6)+"-",u=50,p=n?50:70,m=n?10:50,f=50,g=400-f-u,h=a-p-m,v=(0,c.Ys)("#"+r).append("svg").attr("height",g+f+u).attr("width",h+p+m).append("g").attr("transform","translate("+p+","+f+")").attr("class","area-chart-module--areaChart--Ked6_");v.append("text").attr("class","area-chart-module--chartTitle--3_EHS").attr("text-anchor","middle").attr("transform","translate("+h/2+","+"-15)").text(t.chartTitle).style("font-weight","bold"),function(t){var e=t.deviation,r=t.id,a=t.slope,n=t.svg.append("defs").append("filter").attr("height","500%").attr("id","drop-shadow-"+r).attr("width","500%").attr("x","-200%").attr("y","-200%");n.append("feGaussianBlur").attr("in","SourceAlpha").attr("stdDeviation",e),n.append("feOffset").attr("dx",1).attr("dy",1),n.append("feComponentTransfer").append("feFuncA").attr("slope",a).attr("type","linear");var o=n.append("feMerge");o.append("feMergeNode"),o.append("feMergeNode").attr("in","SourceGraphic")}({deviation:2,id:"points",slope:.5,svg:v});var y=(0,c.Fp7)(e,t.getItemXValue),I=(0,c.VV$)(e,t.getItemXValue),w=(0,c.Fp7)(e,t.getItemYValue),V=(0,c.VV$)(e,t.getItemYValue),x=(0,c.BYU)().domain([I,y]).range([0,h]),C=(0,c.BYU)().domain([w+.05,V-.05]).range([0,g]),k=function(e){return x(t.getItemXValue(e))},b=function(e){return C(t.getItemYValue(e))},A=n?(0,c.aE8)().domain([0,500]).range(Array.from({length:6}).map((function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var a=e[1];return a})))(a):null,E=(0,c.LLu)(x).tickFormat((0,c.WUZ)(".0f")).ticks(A),S=(0,c.y4O)(C).tickFormat((0,c.WUZ)(".0%")).tickSize(10);v.append("g").attr("class","area-chart-module--x--1LLGJ "+d).attr("transform","translate(0,"+g+")").call(E).selectAll("text").attr("dy","1.25em"),v.append("g").attr("class","area-chart-module--y--1GhEy "+d).call(S).selectAll("text").attr("dx","-.25em");var Y=(0,c.SOn)().x(k).y0(g).y1(b),j=(0,c.jvg)().x(k).y(b);v.append("path").datum(e).attr("class","area-chart-module--line--1O1QS").attr("d",j).attr("clip-path","url(#clip)"),v.append("clipPath").attr("id","clip").append("rect").attr("height",g).attr("width",h),v.append("path").datum(e).attr("class","area-chart-module--area--ul7t6").attr("d",Y).attr("clip-path","url(#clip)");var D=l.Z.from(e,k,b).voronoi([-p,-f,h+m,g+u]);v.selectAll("circle").data(e).enter().append("circle").attr("transform",(function(t){return"translate("+k(t)+","+b(t)+")"})).attr("r","5px").attr("class",(function(e){return"area-chart-module--point--3nljr "+i+t.getItemId(e)})).style("filter","url(#drop-shadow-points)");var Z=v.append("g").attr("class","area-chart-module--voronoi--3QRtu");return Z.selectAll("path").data(e).enter().append("path").attr("d",(function(e){return D.renderCell(t.getItemId(e))})).on("mouseover",(function(){for(var e=arguments.length,r=new Array(e),a=0;a<e;a++)r[a]=arguments[a];var n=r[1];(0,c.Ys)("."+i+t.getItemId(n)).style("display","block")})).on("mouseleave",(function(){for(var e=arguments.length,r=new Array(e),a=0;a<e;a++)r[a]=arguments[a];var n=r[1];(0,c.Ys)("."+i+t.getItemId(n)).style("display","none")})).attr("class",o).attr("title",t.getItemTitle),$("."+o).tooltip({track:!0}),{toggleVoronoi:function(){var t=Z.attr("class"),e="area-chart-module--showVoronoi--3rQXC",r=t.includes(e)?t.replace(e,"").trim():t+" "+e;Z.attr("class",r)}}},m=function(t){return t.getYear()},f=function(t){return t.getNormalizedValue()},g=function(t){return t.getId()},h=function(t){return t.getSummary()},v=function(t){return{areaPoints:t,chartTitle:"Share of top decile [aka top 10%] in national income",getItemId:g,getItemTitle:h,getItemXValue:m,getItemYValue:f,rootElId:"chart"}},y=function(t){document.getElementById("toggle-voronoi").addEventListener("click",(function(e){e.preventDefault(),t()}))},I=function(){function t(t){this.incomeItemData=t}t.fetchAndCreateCollection=function(){var e=(0,o.Z)(u().mark((function e(){var r,a;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,c.gyn)("/demos/data/d3js/area/data.csv");case 2:return r=e.sent,a=r.map((function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var a=e[0],n=e[1];return Object.assign({},a,{pointIndex:n})})),e.abrupt("return",a.map((function(e){return new t(e)})));case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();var e=t.prototype;return e.getYear=function(){return this.incomeItemData.year},e.getNormalizedValue=function(){return this.incomeItemData.percent/100},e.getId=function(){return this.incomeItemData.pointIndex},e.getSummary=function(){var t=this.incomeItemData;return"Year: "+t.year+", Percent: "+t.percent+"%"},t}(),w=function(){var t=(0,o.Z)(u().mark((function t(){var e,r,a,n;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,I.fetchAndCreateCollection();case 2:e=t.sent,r=v(e),a=p(r),n=a.toggleVoronoi,y(n);case 6:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),V=function(t){var e=t.pageContext;return a.createElement(n.Z,{links:["/vendors/jquery-ui/themes/base/jquery-ui.min.css"],main:w,pageContext:e,scripts:["/vendors/jquery-ui/jquery-ui.min.js"]},a.createElement("form",null,a.createElement("button",{className:"btn btn-info",id:"toggle-voronoi",type:"button"},"Toggle Voronoi")),a.createElement("div",{id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-area-tsx-86248d08c68a4c47a816.js.map