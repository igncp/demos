(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[640],{1616:function(t,e,n){"use strict";var r=n(2453),a=n(2492),o=n.n(a),l={colorsScale:function(t,e){var n=r.BYU().domain(e).range([0,1]),a=r.BYU().domain(r.w6H(0,1,1/t.length)).range(t);return function(t){return a(n(t))}},filterBlackOpacity:function(t,e,n,r){var a=e.append("defs").append("filter").attr("height","500%").attr("id","drop-shadow-"+t).attr("width","500%").attr("x","-200%").attr("y","-200%");a.append("feGaussianBlur").attr("in","SourceAlpha").attr("stdDeviation",n),a.append("feOffset").attr("dx",1).attr("dy",1),a.append("feComponentTransfer").append("feFuncA").attr("slope",r).attr("type","linear");var o=a.append("feMerge");return o.append("feMergeNode"),o.append("feMergeNode").attr("in","SourceGraphic")},filterColor:function(t,e,n,r,a){null==a&&(a=!1);var o=e.append("defs").append("filter").attr("id","drop-shadow-"+t);return a&&o.attr("height","500%").attr("width","500%").attr("x","-200%").attr("y","-200%"),o.append("feOffset").attr("dx",.5).attr("dy",.5).attr("in","SourceGraphic").attr("result","offOut"),o.append("feGaussianBlur").attr("in","offOut").attr("result","blurOut").attr("stdDeviation",n),o.append("feBlend").attr("in","SourceGraphic").attr("in2","blurOut").attr("mode","normal"),o.append("feComponentTransfer").append("feFuncA").attr("slope",r).attr("type","linear")},middleTitle:function(t,e,n,r){null==r&&(r=-15),t.append("text").attr("class","chart-title").attr("text-anchor","middle").attr("transform","translate("+String(e/2)+","+r+")").text(n).style("font-weight","bold")},svg:function(t,e,n,a){return r.Ys(t).text("").append("svg").attr("height",n+a.top+a.bottom).attr("width",e+a.left+a.right).append("g").attr("transform","translate("+a.left+","+a.top+")")},tooltip:function(t,e){null==e&&(e={});var n=o()({elementSelector:"",followElement:!1,followMouse:!1,leftOffst:60,tOpts:{container:"body",viewport:{selector:"#chart svg"}},topOffst:40},e);$(t).tooltip(n.tOpts),n.followMouse?$(t).hover((function(t){return $(".tooltip").css({left:String(t.pageX-n.leftOffst)+"px",top:String(t.pageY-n.topOffst)+"px"})})):n.followElement&&$(t).hover((function(){return $(".tooltip").css({left:String($(n.elementSelector).position().left-n.leftOffst)+"px",top:String($(n.elementSelector).position().top-n.topOffst)+"px"})}))}};e.Z=l},2395:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return y}});var r=n(7294),a=n(2247),o=n(2137),l=n(7757),i=n.n(l),s=n(2453),p=n(9734),c=n.n(p),f=n(1616),u={bottom:20,left:200,right:40,top:90},d=750-u.top-u.bottom,m=["#7C7CC9","#429742","#63BD28","#D14141"],h="Comparison of 41 map projections by four different types of distortion. Lower is better.",g=function(t){var e=t.data,n=t.rootElId,r=document.getElementById(n);r.classList.add("map-distorsions-chart");var a=r.getBoundingClientRect().width-u.left-u.right,o=[{name:"name",scale:s.q2y().range([0,d]),type:String},{name:"Acc. 40º 150%",scale:s.BYU().range([0,d]),type:Number},{name:"Scale",scale:s.BYU().range([d,0]),type:Number},{name:"Areal",scale:s.PUr().range([d,0]),type:Number},{name:"Angular",scale:s.BYU().range([d,0]),type:Number}],l=f.Z.svg("#"+n,a,d,u);f.Z.middleTitle(l,a,h,-60);var i=s.q2y().domain(o.map((function(t){return t.name}))).range([0,a]),p=s.jvg().defined((function(t){return!isNaN(t[1])})),g=l.selectAll(".dimension").data(o).enter().append("g").attr("class","dimension").attr("transform",(function(t){return"translate("+i(t.name)+")"}));f.Z.filterColor("lines",l,2,.4);var v=c()(e,"name"),y=f.Z.colorsScale(m,[0,v.length-1]);o.forEach((function(t){return t.scale.domain(t.type===Number?s.Wem(v,(function(e){return+e[t.name]})):v.map((function(e){return e[t.name]})).sort())}));var x=function(t){return p(o.map((function(e){return[i(e.name),e.scale(t[e.name])]})))},b=function(t){var e=["Acc. 40º 150%","Scale","Areal","Angular"].map((function(e){return String(Number(t[e]).toFixed(2))}));return t.name+":  "+e.join(" - ")};l.append("g").attr("class","background").selectAll("path").data(v).enter().append("path").attr("d",x).attr("data-title",b),l.append("g").attr("class","foreground").selectAll("path").data(v).enter().append("path").attr("d",x).attr("data-title",b),g.append("g").attr("class","axis").each((function(t){var e=s.y4O(t.scale);return s.Ys(this).call(e)})).append("text").attr("class","title").attr("text-anchor","middle").attr("y",-9).text((function(t){return t.name})),l.select(".axis").selectAll("text:not(.title)").attr("class","label").data(v,(function(t){return t.name||t})).style("fill",(function(t,e){return y(e)}));var w=function(){this.parentNode.appendChild(this)};l.selectAll(".foreground path").style("filter","url(#drop-shadow-lines)").style("stroke",(function(t,e){return y(e)}));var A=l.selectAll(".axis text,.background path,.foreground path").on("mouseover",(function(t,e){l.selectAll(".foreground path").style("filter","none"),l.classed("active",!0),A.classed("inactive",(function(t){return t.name!==e.name})),A.filter((function(t){return t.name===e.name})).each(w)})).on("mouseout",(function(){l.selectAll(".foreground path").style("filter","url(#drop-shadow-lines)"),l.classed("active",!1),A.classed("inactive",!1)}));f.Z.tooltip(".background path, .foreground path",{followMouse:!0,leftOffst:100,topOffst:50})},v=function(){var t=(0,o.Z)(i().mark((function t(){var e;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,s.pvA("/demos/data/d3js/map-distorsions/data.tsv");case 2:e=t.sent,"chart",g({data:e,rootElId:"chart"});case 5:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),y=function(t){var e=t.pageContext.demoInfo;return r.createElement(a.Z,{demoInfo:e,main:v},r.createElement("div",{id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-map-distorsions-tsx-0d7d19e75bac1086aa3c.js.map