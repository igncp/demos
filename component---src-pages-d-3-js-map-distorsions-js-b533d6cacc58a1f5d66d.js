(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[850],{7440:function(t,e){"use strict";var n={colorsScale:function(t,e){var n=d3.scale.linear().domain(e).range([0,1]),r=d3.scale.linear().domain(d3.range(0,1,1/t.length)).range(t);return function(t){return r(n(t))}},filterBlackOpacity:function(t,e,n,r){var a=e.append("defs").append("filter").attr({height:"500%",id:"drop-shadow-"+t,width:"500%",x:"-200%",y:"-200%"});a.append("feGaussianBlur").attr({in:"SourceAlpha",stdDeviation:n}),a.append("feOffset").attr({dx:1,dy:1}),a.append("feComponentTransfer").append("feFuncA").attr({slope:r,type:"linear"});var o=a.append("feMerge");return o.append("feMergeNode"),o.append("feMergeNode").attr("in","SourceGraphic")},filterColor:function(t,e,n,r,a){null==a&&(a=!1);var o=e.append("defs").append("filter").attr({id:"drop-shadow-"+t});return a&&o.attr({height:"500%",width:"500%",x:"-200%",y:"-200%"}),o.append("feOffset").attr({dx:.5,dy:.5,in:"SourceGraphic",result:"offOut"}),o.append("feGaussianBlur").attr({in:"offOut",result:"blurOut",stdDeviation:n}),o.append("feBlend").attr({in:"SourceGraphic",in2:"blurOut",mode:"normal"}),o.append("feComponentTransfer").append("feFuncA").attr({slope:r,type:"linear"})},middleTitle:function(t,e,n,r){null==r&&(r=-15),t.append("text").attr({class:"chart-title","text-anchor":"middle",transform:"translate("+String(e/2)+","+r+")"}).text(n).style("font-weight","bold")},svg:function(t,e,n,r){return d3.select(t).text("").append("svg").attr({height:n+r.top+r.bottom,width:e+r.left+r.right}).append("g").attr({transform:"translate("+r.left+","+r.top+")"})},tooltip:function(t,e){null==e&&(e={});var n=_.merge({elementSelector:"",followElement:!1,followMouse:!1,leftOffst:60,tOpts:{container:"body",viewport:{selector:"#chart svg"}},topOffst:40},e);$(t).tooltip(n.tOpts),n.followMouse?$(t).hover((function(t){return $(".tooltip").css({left:String(t.pageX-n.leftOffst)+"px",top:String(t.pageY-n.topOffst)+"px"})})):n.followElement&&$(t).hover((function(){return $(".tooltip").css({left:String($(n.elementSelector).position().left-n.leftOffst)+"px",top:String($(n.elementSelector).position().top-n.topOffst)+"px"})}))}};e.Z=n},5723:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return i}});var r=n(7294),a=n(7538),o=n(7440),l={bottom:20,left:200,right:40,top:90},s=function(){var t=$("#chart").innerWidth()-l.left-l.right,e=750-l.top-l.bottom,n=["#7C7CC9","#429742","#63BD28","#D14141"],r=[{name:"name",scale:d3.scale.ordinal().rangePoints([0,e]),type:String},{name:"Acc. 40º 150%",scale:d3.scale.linear().range([0,e]),type:Number},{name:"Scale",scale:d3.scale.linear().range([e,0]),type:Number},{name:"Areal",scale:d3.scale.sqrt().range([e,0]),type:Number},{name:"Angular",scale:d3.scale.linear().range([e,0]),type:Number}],a=o.Z.svg("#chart",t,e,l);o.Z.middleTitle(a,t,"Comparison of 41 map projections by four different types of distortion. Lower is better.",-60);var s=d3.scale.ordinal().domain(r.map((function(t){return t.name}))).rangePoints([0,t]),i=d3.svg.line().defined((function(t){return!isNaN(t[1])})),d=d3.svg.axis().orient("left"),c=a.selectAll(".dimension").data(r).enter().append("g").attr("class","dimension").attr("transform",(function(t){return"translate("+s(t.name)+")"}));d3.tsv("/demos/data/d3js/map-distorsions/data.tsv",(function(t){o.Z.filterColor("lines",a,2,.4),t=_.sortBy(t,"name");var e=o.Z.colorsScale(n,[0,t.length-1]);r.forEach((function(e){return e.scale.domain(e.type===Number?d3.extent(t,(function(t){return+t[e.name]})):t.map((function(t){return t[e.name]})).sort())}));var l=function(t){return i(r.map((function(e){return[s(e.name),e.scale(t[e.name])]})))},p=function(t){var e=_.map(["Acc. 40º 150%","Scale","Areal","Angular"],(function(e){return String(Number(t[e]).toFixed(2))}));return t.name+":  "+e.join(" - ")};a.append("g").attr("class","background").selectAll("path").data(t).enter().append("path").attr("d",l).attr('"data-title"',p),a.append("g").attr("class","foreground").selectAll("path").data(t).enter().append("path").attr("d",l).attr("data-title",p),c.append("g").attr("class","axis").each((function(t){return d3.select(this).call(d.scale(t.scale))})).append("text").attr("class","title").attr("text-anchor","middle").attr("y",-9).text((function(t){return t.name})),a.select(".axis").selectAll("text:not(.title)").attr("class","label").data(t,(function(t){return t.name||t})).style("fill",(function(t,n){return e(n)}));var f=function(){return this.parentNode.appendChild(this)};a.selectAll(".foreground path").style("filter","url(#drop-shadow-lines)").style("stroke",(function(t,n){return e(n)}));var u=a.selectAll(".axis text,.background path,.foreground path").on("mouseover",(function(t){return a.selectAll(".foreground path").style("filter","none"),a.classed("active",!0),u.classed("inactive",(function(e){return e!==t})),u.filter((function(e){return e===t})).each(f)})).on("mouseout",(function(){a.selectAll(".foreground path").style("filter","url(#drop-shadow-lines)"),a.classed("active",!1),u.classed("inactive",!1)}));o.Z.tooltip(".background path, .foreground path",{followMouse:!0,leftOffst:100,topOffst:50})}))},i=function(t){var e=t.pageContext.demoInfo;return r.createElement(a.Z,{demoInfo:e,main:s,scripts:["/vendors/d3/d3.min.js","/js/d3js-utils.js"]},r.createElement("div",{className:"map-distorsions-chart",id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-map-distorsions-js-b533d6cacc58a1f5d66d.js.map