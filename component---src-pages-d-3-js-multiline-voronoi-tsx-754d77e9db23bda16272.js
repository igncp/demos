(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[305],{2738:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return C}});var r=n(7294),o=n(4275),a=n(2137),i=n(7757),c=n.n(i),u=n(8061),s=n(2149),l="multiline-voronoi-module--axis--2WPgb",d="multiline-voronoi-module--cityHover--1wUSq",p="%Y-%m",m="US Unemployment Rate",f=function(t){return t.cityName.trim()+": "},v=function(t){var e=g[t.date.getMonth()]+" of "+t.date.getFullYear();return" "+(100*t.value).toFixed(2)+"% - "+e},h=function(){var t=(0,a.Z)(c().mark((function t(){var e,n,r,o,a;return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=(0,u.i$Z)(p),n=(0,u.Z1g)(p),t.next=4,(0,u.pvA)("/demos/data/d3js/multiline-voronoi/data.tsv");case 4:return r=t.sent,o=Object.keys(r[0]).map((function(t){return n(t)})).filter(Number),a=r.map((function(t){var n=t.name.replace(/(msa|necta div|met necta|met div)$/i,"").trim();return{metrics:o.map((function(r){var o=e(r),a=t[o],i=Number(a)/100;return{cityName:n,date:r,value:i}})),name:n}})),t.abrupt("return",{cities:a,months:o});case 8:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),g=["January","February","March","April","May","June","July","August","September","October","November","December"],y=70,x=80,w=70,b=60,k=function(t){var e=t.cities,n=t.months,r=t.rootElId,o=(0,u.PKp)(u.i4X),a={clickToggle:!1,voronoiGroup:null},i=document.getElementById(r);i.classList.add("multiline-voronoi-module--multilineVoronoiChart--2aVN8");var c=i.getBoundingClientRect().width-x-w,p=500-b-y,h=(0,u.Xf)().range([0,c]),g=(0,u.BYU)().range([p,0]),k=function(t){return h(t.date)},E=function(t){return g(t.value)},C={},A=(0,u.Ys)("#"+r).append("svg").attr("width",c+x+w).attr("height",p+b+y).append("g").attr("transform","translate("+x+","+b+")");h.domain((0,u.Wem)(n)),g.domain([0,(0,u.Fp7)(e,(function(t){return(0,u.Fp7)(t.metrics,(function(t){return t.value}))}))]).nice(),A.append("g").attr("class",l+" axis--x").attr("transform","translate(0,"+p+")").call((0,u.LLu)(h)),A.append("g").attr("class",l+" axis--y").call((0,u.y4O)(g).ticks(10,"%")).append("text").attr("x",20).attr("dy",".32em").style("font-weight","bold").text(m),N(A);var F=(0,u.jvg)().x(k).y(E),S=function(t){var n=A.append("g").attr("transform","translate(-100,-100)").attr("class","multiline-voronoi-module--focus--2F38m");n.append("circle").attr("r",3.5),n.append("text").attr("class","text1").attr("y",-30),n.append("text").attr("class","text2").attr("y",-10);var r=t.reduce((function(t,e){return e.metrics.forEach((function(e){t.push(e)})),t}),[]),o=s.Z.from(r,k,E).voronoi([-x,-b,c+w,p+y]);a.voronoiGroup=A.append("g").attr("class","multiline-voronoi-module--voronoi--17R-N"),a.voronoiGroup.selectAll("path").data(r).enter().append("path").attr("d",(function(t,e){return o.renderCell(e)})).on("mouseover",(function(t,e){var r=C[e.cityName];(0,u.Ys)(r).classed(d,!0),r.parentNode.appendChild(r),n.attr("transform","translate("+k(e)+","+E(e)+")"),n.select(".text1").text(f(e)),n.select(".text2").text(v(e))})).on("mouseout",(function(t,e){var r=C[e.cityName];return(0,u.Ys)(r).classed(d,!1),n.attr("transform","translate(-100,-100)")})).on("click",(function(t,n){a.clickToggle=!a.clickToggle,(0,u.td_)(".cities").remove(),(0,u.td_)(".voronoi").remove(),(0,u.td_)(".focus").remove();var r=a.clickToggle?[e.find((function(t){return t.name===n.cityName}))]:e;Y(r)}))},Y=function(t){A.append("g").attr("class","multiline-voronoi-module--cities--o95QD").selectAll("path").data(t).enter().append("path").attr("d",(function(t){return C[t.name]=this,F(t.metrics)})).style("stroke",(function(t,e){return o(e.toString())})).style("filter",(function(){return"url(#drop-shadow)"})),S(t)};return Y(e),{setVoronoi:function(t){a.voronoiGroup.classed("multiline-voronoi-module--voronoiShow--PdA3D",t)}}},N=function(t){var e=t.append("defs").append("filter").attr("id","drop-shadow");e.append("feGaussianBlur").attr("in","SourceAlpha").attr("stdDeviation",1),e.append("feOffset").attr("dx",1).attr("dy",1),e.append("feComponentTransfer").append("feFuncA").attr("slope","1").attr("type","linear");var n=e.append("feMerge");n.append("feMergeNode"),n.append("feMergeNode").attr("in","SourceGraphic")},E=function(){var t=(0,a.Z)(c().mark((function t(){var e,n,r,o,a,i,s;return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e="chart",t.next=3,h();case 3:n=t.sent,r=n.cities,o=n.months,a=k({cities:r,months:o,rootElId:e}),i=a.setVoronoi,s=document.getElementById("form"),document.getElementById(e).appendChild(s),(0,u.Ys)("#show-voronoi").property("disabled",!1).on("change",(function(t){i(t.target.checked||!1)}));case 11:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),C=function(t){var e=t.pageContext;return r.createElement(o.Z,{main:E,pageContext:e},r.createElement("form",{id:"form"},r.createElement("input",{id:"show-voronoi",type:"checkbox"})," ",r.createElement("label",{htmlFor:"show-voronoi"},"Show Voronoi lines")),r.createElement("div",{id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-multiline-voronoi-tsx-754d77e9db23bda16272.js.map