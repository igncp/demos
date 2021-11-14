"use strict";(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[230],{9023:function(t,e,a){a.r(e),a.d(e,{default:function(){return H}});var n,r,i=a(7294),s=a(6126),c=a(4275),d=a(8634),o=a(2656),h=a.n(o),l=a(862),u=a(2203),f="timeline-bands-brush-chart-module--bandMinMaxLabel--41236",m="timeline-bands-brush-chart-module--interval--6cf00",p="timeline-bands-brush-chart-module--instant--44763";!function(t){t.Ascending="ascending",t.Descending="descending"}(n||(n={})),function(t){t.Backward="backward",t.Forward="forward"}(r||(r={}));var g,b=0,v=20,x=20,w=60,C=700-w-b,y=function(t){var e=t.getUTCFullYear();return e>=0?e.toString():" BC"+Math.abs(e)},I=function(){function t(t){this.chartConfig=t;var e=document.getElementById(t.rootElId);e.classList.add("timeline-bands-brush-chart-module--timelineChart--8b836");var a=e.getBoundingClientRect().width;this.width=a-v-x,this.bandY=0,this.bandNum=0,this.dataContent={},this.components=[],this.bands={};var n=(0,l.Ys)("#"+t.rootElId).text("").append("svg").attr("height",700+w+b).attr("width",a+v+x).append("g").attr("transform","translate("+v+","+w+")");n.append("text").attr("class","chart-title").attr("text-anchor","middle").attr("transform","translate("+a/2+",-20)").text(t.chartTitle).style("font-weight","bold"),function(t){var e=t.deviation,a=t.id,n=t.slope,r=t.svg.append("defs").append("filter").attr("height","500%").attr("id","drop-shadow-"+a).attr("width","500%").attr("x","-200%").attr("y","-200%");r.append("feGaussianBlur").attr("in","SourceAlpha").attr("stdDeviation",e),r.append("feOffset").attr("dx",1).attr("dy",1),r.append("feComponentTransfer").append("feFuncA").attr("slope",n).attr("type","linear");var i=r.append("feMerge");i.append("feMergeNode"),i.append("feMergeNode").attr("in","SourceGraphic")}({deviation:1,id:"intervals",slope:.2,svg:n}),n.append("clipPath").attr("id","chart-area").append("rect").attr("width",this.width).attr("height",C),n.on("mouseup",(function(){return(0,l.td_)("."+m+" rect").style("filter","url(#drop-shadow-intervals)")})),this.chart=n.append("g").attr("class","timeline-bands-brush-chart-module--chart--f790b").attr("clip-path","url(#chart-area)")}var e=t.prototype;return e.addChartData=function(t){var e=this,a=[];this.dataContent.chartItems=t;var i,s,c,d,o,h,u;return i={chartItems:this.dataContent.chartItems,sortOrderInitial:n.Descending,timeOrderInitial:r.Backward},s=i.chartItems,c=i.sortOrderInitial,d=i.timeOrderInitial,o=null!=c?c:n.Descending,h=null!=d?d:r.Forward,u=e.chartConfig.getSortFn(o),e.dataContent.chartItems.sort(u),h!==r.Forward?s.forEach((function(t){var n=0;for(n=0;n<a.length&&!(e.chartConfig.getItemLimitRight(t)<a[n]);n+=1);t.track=n,a[n]=e.chartConfig.getItemLimitLeft(t)})):s.forEach((function(t){var n=0;for(n=0;n<a.length&&!(e.chartConfig.getItemLimitLeft(t)>a[n]);n+=1);t.track=n,a[n]=e.chartConfig.getItemLimitRight(t)})),this.dataContent.nTracks=a.length,this.dataContent.minDate=(0,l.VV$)(this.dataContent.chartItems,this.chartConfig.getItemLimitLeft),this.dataContent.maxDate=new Date,this},e.xAxis=function(t){var e=this.bands[t],a=(0,l.LLu)(e.xScale).tickSize(6).tickFormat((function(t){return y(t)})),n=this.chart.append("g").attr("class","timeline-bands-brush-chart-module--axis--6a527").attr("transform","translate(0,"+(e.y+e.h)+")");return n.redraw=function(){n.call(a)},e.parts.push(n),this.components.push(n),this},e.createTooltip=function(){return $(".part."+p+", .part."+m).tooltip({track:!0}),this},e.addBand=function(t){var e=this,a=t.bandName,n=t.sizeFactor,r={};r.id="band"+this.bandNum,r.x=0,r.y=this.bandY,r.w=this.width,r.h=C*(n||1),r.trackOffset=0,r.trackHeight=Math.min((r.h-r.trackOffset)/this.dataContent.nTracks,20),r.itemHeight=.7*r.trackHeight,r.parts=[],r.instantWidth=100,r.xScale=(0,l.Xf)().domain([this.dataContent.minDate,this.dataContent.maxDate]).range([0,r.w]),r.yScale=function(t){return r.trackOffset+t*r.trackHeight},r.g=this.chart.append("g").attr("id",r.id).attr("transform","translate(0,"+r.y+")"),r.g.append("rect").attr("class","timeline-bands-brush-chart-module--band--e8d9f").attr("width",r.w).attr("height",r.h);var i=r.g.selectAll("g").data(this.dataContent.chartItems).enter().append("svg").attr("y",(function(t){return r.yScale(t.track)})).attr("height",r.itemHeight).attr("title",this.chartConfig.getItemTitle).attr("class",(function(t){return"part "+(t.instant?p:m)})),s=(0,l.Ys)("#band"+this.bandNum).selectAll("."+m),c=(0,l.Ys)("#band"+this.bandNum).selectAll("."+p);s.append("rect").attr("height","100%").attr("width","100%").attr("x","1px").attr("y",".5px").style("filter","url(#drop-shadow-intervals)"),s.append("text").attr("class","timeline-bands-brush-chart-module--intervalLabel--bfede").attr("x",3).attr("y",9.5),c.append("circle").attr("cx",r.itemHeight/2).attr("cy",r.itemHeight/2).attr("r",5),c.append("text").attr("class","timeline-bands-brush-chart-module--instantLabel--7cf9e").attr("x",15).attr("y",10),[s,c].forEach((function(t){t.on("click",(function(){for(var t=arguments.length,a=new Array(t),n=0;n<t;n++)a[n]=arguments[n];var r=a[1];e.chartConfig.onChartItemClick(r)})),t.style("cursor","pointer")}));var d=this.chartConfig,o=d.getItemLimitLeft,h=d.getItemLimitRight;return r.redraw=function(){i.attr("x",(function(t){return r.xScale(o(t))})).attr("width",(function(t){return r.xScale(h(t))-r.xScale(o(t))})).select("text").text((function(t){var a=(r.xScale(h(t))-r.xScale(o(t)))/9;return e.chartConfig.getItemText({chartItem:t,maxLetters:a})})),r.parts.forEach((function(t){t.redraw()}))},this.bands[a]=r,this.components.push(r),this.bandY+=r.h+25,this.bandNum+=1,this},e.labels=function(t){var e=this.bands[t],a=e.y+e.h-10,n=[{className:f,getText:function(t){return y(t)},id:"Start of the selected interval",left:0,textAnchor:"start",textLeft:4,top:a},{className:f,getText:function(){for(var t=arguments.length,e=new Array(t),a=0;a<t;a++)e[a]=arguments[a];var n=e[1];return y(n)},id:"End of the selected interval",left:e.w-46,textAnchor:"end",textLeft:e.w-4,top:a},{className:"timeline-bands-brush-chart-module--bandMidLabel--529cb",getText:function(){for(var t=arguments.length,e=new Array(t),a=0;a<t;a++)e[a]=arguments[a];var n=e[0],r=e[1];return(r.getUTCFullYear()-n.getUTCFullYear()).toString()},id:"Length of the selected interval",left:(e.w-46)/2,textAnchor:"middle",textLeft:e.w/2,top:a}],r=this.chart.append("g").attr("id",t+"Labels").attr("transform","translate(0,"+(e.y+e.h+1)+")").selectAll("#"+t+"Labels").data(n).enter().append("g");r.append("rect").attr("class","timeline-bands-brush-chart-module--bandLabel--4276c").attr("x",(function(t){return t.left})).attr("width",46).attr("height",20).style("opacity",1);var i=r.append("text").attr("class",(function(t){return t.className})).attr("id",(function(t){return t.id})).attr("x",(function(t){return t.textLeft})).attr("y",15).attr("text-anchor",(function(t){return t.textAnchor}));return i.redraw=function(){var t=e.xScale.domain()[0],a=e.xScale.domain()[1];i.text((function(e){return e.getText(t,a)}))},e.parts.push(i),this.components.push(i),this},e.addBrush=function(t){var e=this,a=t.brushBandName,n=t.targetBandName,r=this.bands[a],i=(0,l.Yud)(),s=this.dataContent,c=s.maxDate,d=[s.minDate.getTime(),c.getTime()],o=(0,l.Xf)().domain([0,this.width]).range(d);return i.on("brush",(function(t){var a=r.xScale.domain();if(t.selection){var i=t.selection,s=i[0],c=i[1];a=[o(Math.max(0,s)),o(Math.min(e.width,c))]}(0,l.td_)("."+m+" rect").style("filter","none"),e.bands[n].xScale.domain(a),e.bands[n].redraw()})),r.g.append("svg").attr("class","x").call(i).selectAll("rect").attr("y",1).attr("height",r.h-1),this},e.redraw=function(){return this.components.forEach((function(t){t.redraw()})),this},t}(),L="chart",N=function(t){var e=t.getUTCFullYear();return e>=0?e.toString():" BC"+Math.abs(e)},k=function(t){var e=(0,l.Z1g)("%Y-%m-%d")(t);if(null!==e)return e;var a=isNaN(Number(t))?-t.replace(/[^0-9]/g,""):+t;return a<0||a>99?e=new Date(a,6,1):0===a?e=new Date(-1,6,1):(e=new Date(a,6,1)).setUTCFullYear(a),e},S=function(){var t=(0,d.Z)(h().mark((function t(){var e,a;return h().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,l.gyn)("/demos/data/d3js/philosophers-timeline/data.csv");case 2:return e=t.sent,a=new Date,316224e7,e.forEach((function(t){t.start=k(t.start.toString()),""===t.end?(t.end=new Date(t.start.getTime()+316224e7),t.instant=!0):(t.end=k(t.end.toString()),t.instant=!1),t.end>a&&(t.end=a)})),t.abrupt("return",e);case 7:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),T=function(t){return t.start},A=function(t){return t.end},B=function(t){return function(){for(var e=arguments.length,a=new Array(e),r=0;r<e;r++)a[r]=arguments[r];var i=a[0],s=a[1],c=t===n.Ascending?1:-1,d=Number(i.start)-Number(s.start);return 0!==d?d*c:(Number(s.end)-Number(i.end))*c}},D=function(t){var e=t.chartItem,a=t.maxLetters;return e.label.length>a?e.label.substr(0,a-1)+"..":e.label},F=function(t){return t.instant?t.label+": "+N(t.start):t.label+": "+N(t.start)+" - "+N(t.end)},M=function(t){var e=t.instant?t.label:("Philosopher "+t.label+" "+(t.end?t.end.getFullYear():"")).trim();window.open("https://www.google.com/search?"+u.stringify({q:e}))};!function(t){t.Main="mainBand",t.Navi="naviBand"}(g||(g={}));var Y=function(){var t=(0,d.Z)(h().mark((function t(){var e;return h().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,S();case 2:e=t.sent,new I({chartTitle:"Philosophers through History",getItemLimitLeft:T,getItemLimitRight:A,getItemText:D,getItemTitle:F,getSortFn:B,onChartItemClick:M,rootElId:L}).addChartData(e).addBand({bandName:g.Main,sizeFactor:.82}).addBand({bandName:g.Navi,sizeFactor:.08}).xAxis(g.Main).xAxis(g.Navi).labels(g.Main).labels(g.Navi).addBrush({brushBandName:g.Navi,targetBandName:g.Main}).redraw().createTooltip();case 5:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),E=Y,H=function(t){var e=t.pageContext;return i.createElement(c.Z,{links:[s.H.STYLE],main:E,pageContext:e,scripts:[s.H.SCRIPT]},i.createElement("div",{id:L}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-philosophers-timeline-tsx-d701e3e0b180de0a2c7d.js.map