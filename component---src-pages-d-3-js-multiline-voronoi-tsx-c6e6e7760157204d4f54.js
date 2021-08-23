(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[305],{2738:function(t,e,r){"use strict";r.r(e),r.d(e,{default:function(){return C}});var n=r(7294),a=r(4275),o=r(2137),i=r(7757),c=r.n(i),u=r(7723),l=r(2149),s="multiline-voronoi-module--axis--2WPgb",p="multiline-voronoi-module--cities--o95QD",d="multiline-voronoi-module--cityHover--1wUSq",m="multiline-voronoi-module--voronoi--17R-N",f="%Y-%m",v=["January","February","March","April","May","June","July","August","September","October","November","December"],h="US Unemployment Rate",g=function(t){return t.cityName.trim()+": "},y=function(t){var e=v[t.date.getMonth()]+" of "+t.date.getFullYear();return" "+(100*t.employmentRate).toFixed(2)+"% - "+e},x=function(){var t=(0,o.Z)(c().mark((function t(){var e,r,n,a,o;return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=(0,u.i$Z)(f),r=(0,u.Z1g)(f),t.next=4,(0,u.pvA)("/demos/data/d3js/multiline-voronoi/data.tsv");case 4:return n=t.sent,a=Object.keys(n[0]).map((function(t){return r(t)})).filter(Number),o=n.map((function(t){var r=t.name.replace(/(msa|necta div|met necta|met div)$/i,"").trim();return{metrics:a.map((function(n){var a=e(n),o=t[a],i=Number(o)/100;return{cityName:r,date:n,employmentRate:i}})),name:r}})),t.abrupt("return",{cities:o,months:a});case 8:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),w=70,b=80,k=70,A=60,N=function(t){var e=t.cities,r=t.months,n=t.rootElId,a=(0,u.PKp)(u.i4X),o={clickToggle:!1,voronoiGroup:null},i=document.getElementById(n);i.classList.add("multiline-voronoi-module--multilineVoronoiChart--2aVN8");var c=i.getBoundingClientRect().width-b-k,f=500-A-w,v=(0,u.Xf)().range([0,c]),x=(0,u.BYU)().range([f,0]),N=function(t){return v(t.date)},E=function(t){return x(t.employmentRate)},C={},F=(0,u.Ys)("#"+n).append("svg").attr("width",c+b+k).attr("height",f+A+w).append("g").attr("transform","translate("+b+","+A+")");v.domain((0,u.Wem)(r)),x.domain([0,(0,u.Fp7)(e,(function(t){return(0,u.Fp7)(t.metrics,(function(t){return t.employmentRate}))}))]).nice(),F.append("g").attr("class",s+" axis--x").attr("transform","translate(0,"+f+")").call((0,u.LLu)(v)),F.append("g").attr("class",s+" axis--y").call((0,u.y4O)(x).ticks(10,"%")).append("text").attr("x",20).attr("dy",".32em").style("font-weight","bold").text(h);var S=F.append("g").attr("transform","translate(-100,-100)").attr("class","multiline-voronoi-module--focus--2F38m");!function(t){var e=t.append("defs").append("filter").attr("id","drop-shadow");e.append("feGaussianBlur").attr("in","SourceAlpha").attr("stdDeviation",1),e.append("feOffset").attr("dx",1).attr("dy",1),e.append("feComponentTransfer").append("feFuncA").attr("slope","1").attr("type","linear");var r=e.append("feMerge");r.append("feMergeNode"),r.append("feMergeNode").attr("in","SourceGraphic")}(F);var R=(0,u.jvg)().x(N).y(E),Y=function(t){F.append("g").attr("class",p).selectAll("path").data(t).enter().append("path").attr("d",(function(t){return C[t.name]=this,R(t.metrics)})).style("stroke",(function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[1];return a(n.toString())})).style("filter",(function(){return"url(#drop-shadow)"})),B(t)},B=function(t){S.append("circle").attr("r",3.5),S.append("text").attr("class","text1").attr("y",-30),S.append("text").attr("class","text2").attr("y",-10);var r=t.reduce((function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[0],a=e[1];return a.metrics.forEach((function(t){n.push(t)})),n}),[]),n=l.Z.from(r,N,E).voronoi([-b,-A,c+k,f+w]);o.voronoiGroup=F.append("g").attr("class",m),o.voronoiGroup.selectAll("path").data(r).enter().append("path").attr("d",(function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var a=e[1];return n.renderCell(a)})).on("mouseover",(function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[1],a=C[n.cityName];(0,u.Ys)(a).classed(d,!0),a.parentNode.appendChild(a),S.attr("transform","translate("+N(n)+","+E(n)+")"),S.select(".text1").text(g(n)),S.select(".text2").text(y(n))})).on("mouseout",(function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[1],a=C[n.cityName];return(0,u.Ys)(a).classed(d,!1),S.attr("transform","translate(-100,-100)")})).on("click",(function(){for(var t=arguments.length,r=new Array(t),n=0;n<t;n++)r[n]=arguments[n];var a=r[1];o.clickToggle=!o.clickToggle,(0,u.td_)("."+p).remove(),(0,u.td_)("."+m).remove();var i=o.clickToggle?[e.find((function(t){return t.name===a.cityName}))]:e;Y(i)}))};return Y(e),{setVoronoi:function(t){o.voronoiGroup.classed("multiline-voronoi-module--voronoiShow--PdA3D",t)}}},E=function(){var t=(0,o.Z)(c().mark((function t(){var e,r,n,a,o,i,l;return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e="chart",t.next=3,x();case 3:r=t.sent,n=r.cities,a=r.months,o=N({cities:n,months:a,rootElId:e}),i=o.setVoronoi,l=document.getElementById("form"),document.getElementById(e).appendChild(l),(0,u.Ys)("#show-voronoi").property("disabled",!1).on("change",(function(t){i(t.target.checked||!1)}));case 11:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),C=function(t){var e=t.pageContext;return n.createElement(a.Z,{main:E,pageContext:e},n.createElement("form",{id:"form"},n.createElement("input",{id:"show-voronoi",type:"checkbox"})," ",n.createElement("label",{htmlFor:"show-voronoi"},"Show Voronoi lines")),n.createElement("div",{id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-multiline-voronoi-tsx-c6e6e7760157204d4f54.js.map