(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[540],{2137:function(t,e,a){"use strict";function n(t,e,a,n,r,i,s){try{var d=t[i](s),o=d.value}catch(c){return void a(c)}d.done?e(o):Promise.resolve(o).then(n,r)}function r(t){return function(){var e=this,a=arguments;return new Promise((function(r,i){var s=t.apply(e,a);function d(t){n(s,r,i,d,o,"next",t)}function o(t){n(s,r,i,d,o,"throw",t)}d(void 0)}))}}a.d(e,{Z:function(){return r}})},6598:function(t,e,a){"use strict";a.r(e),a.d(e,{default:function(){return C}});var n=a(7294),r=a(4275),i=a(2137),s=a(7757),d=a.n(s),o=a(628),c="timeline-module--bandMinMaxLabel--3JvSy",u="timeline-module--interval--3ADVQ",l="timeline-module--instant--1w4uA",h=0,p=20,f=20,m=60,g=700-m-h,v=function(t){var e=(0,o.Z1g)("%Y-%m-%d")(t);if(null!==e)return e;var a=isNaN(Number(t))?-t.replace(/[^0-9]/g,""):+t;return a<0||a>99?e=new Date(a,6,1):0===a?e=new Date(-1,6,1):(e=new Date(a,6,1)).setUTCFullYear(a),e},x=function(t){var e=t.getUTCFullYear();return e>=0?e.toString():" BC"+Math.abs(e)},b=function(){function t(t){var e=t.rootElId,a=document.getElementById(e);a.classList.add("timeline-module--timelineChart--3qWN8");var n=a.getBoundingClientRect().width;this.width=n-p-f,this.bandY=0,this.bandNum=0,this.dataContent={},this.components=[],this.bands={};var r=(0,o.Ys)("#"+e).text("").append("svg").attr("height",700+m+h).attr("width",n+p+f).append("g").attr("transform","translate("+p+","+m+")");r.append("text").attr("class","chart-title").attr("text-anchor","middle").attr("transform","translate("+n/2+",-20)").text("Philosophers through History").style("font-weight","bold"),w("intervals",r,1,.2),r.append("clipPath").attr("id","chart-area").append("rect").attr("width",this.width).attr("height",g),r.on("mouseup",(function(){return(0,o.td_)("."+u+" rect").style("filter","url(#drop-shadow-intervals)")})),this.chart=r.append("g").attr("class","timeline-module--chart--2GJYA").attr("clip-path","url(#chart-area)")}var e=t.prototype;return e.data=function(t){var e=this,a=new Date,n=[];this.dataContent.items=t;var r=function(t,e){var a=t.start-e.start;return a<0?-1:a>0?1:(a=e.end-t.end)<0?-1:a>0?1:0},i=function(t,e){var a=t.start-e.start;return a<0?1:a>0?-1:(a=e.end-t.end)<0?1:a>0?-1:0};return this.dataContent.items.forEach((function(t){t.start=v(t.start),""===t.end?(t.end=new Date(t.start.getTime()+316224e7),t.instant=!0):(t.end=v(t.end),t.instant=!1),t.end>a&&(t.end=a)})),function(t,a,s){s=s||"backward";"ascending"===(a=a||"descending")?e.dataContent.items.sort(r):e.dataContent.items.sort(i),"forward"===s?t.forEach((function(t){for(var e=0,a=0,r=0,i=n.length;(0<=i?r<i:r>i)&&!(t.start>n[a]);a=0<=i?++r:--r)e++;t.track=e,n[e]=t.end})):t.forEach((function(t){for(var e=0,a=0,r=0,i=n.length;(0<=i?r<i:r>i)&&!(t.end<n[a]);a=0<=i?++r:--r)e++;t.track=e,n[e]=t.start}))}(this.dataContent.items,"descending","backward"),this.dataContent.nTracks=n.length,this.dataContent.minDate=(0,o.VV$)(this.dataContent.items,(function(t){return t.start})),this.dataContent.maxDate=(0,o.Fp7)(this.dataContent.items,(function(t){return t.end})),this},e.xAxis=function(t){var e=this.bands[t],a=(0,o.LLu)(e.xScale).tickSize(6).tickFormat((function(t){return x(t)})),n=this.chart.append("g").attr("class","timeline-module--axis--2Kd6K").attr("transform","translate(0,"+(e.y+e.h)+")");return n.redraw=function(){n.call(a)},e.parts.push(n),this.components.push(n),this},e.createTooltip=function(){return $(".part."+l+", .part."+u).tooltip({track:!0}),this},e.band=function(t,e){var a={};a.id="band"+this.bandNum,a.x=0,a.y=this.bandY,a.w=this.width,a.h=g*(e||1),a.trackOffset=0,a.trackHeight=Math.min((a.h-a.trackOffset)/this.dataContent.nTracks,20),a.itemHeight=.7*a.trackHeight,a.parts=[],a.instantWidth=100,a.xScale=(0,o.Xf)().domain([this.dataContent.minDate,this.dataContent.maxDate]).range([0,a.w]),a.yScale=function(t){return a.trackOffset+t*a.trackHeight},a.yearsScale=this.dataContent.maxDate.getUTCFullYear()-this.dataContent.minDate.getUTCFullYear(),a.g=this.chart.append("g").attr("id",a.id).attr("transform","translate(0,"+a.y+")"),a.g.append("rect").attr("class","timeline-module--band--1PQ93").attr("width",a.w).attr("height",a.h);var n=a.g.selectAll("g").data(this.dataContent.items).enter().append("svg").attr("y",(function(t){return a.yScale(t.track)})).attr("height",a.itemHeight).attr("title",(function(t){return t.instant?t.label+": "+x(t.start):t.label+": "+x(t.start)+" - "+x(t.end)})).attr("class",(function(t){return t.instant?"part "+l:"part "+u})),r=(0,o.Ys)("#band"+this.bandNum).selectAll("."+u);r.append("rect").attr("height","80%").attr("width","80%").attr("x","1px").attr("y",".5px").style("filter","url(#drop-shadow-intervals)"),r.append("text").attr("class","timeline-module--intervalLabel--eyMIb").attr("x",3).attr("y",9.5);var i=(0,o.Ys)("#band"+this.bandNum).selectAll("."+l);return i.append("circle").attr("cx",a.itemHeight/2).attr("cy",a.itemHeight/2).attr("r",5),i.append("text").attr("class","timeline-module--instantLabel--2X-Rh").attr("x",15).attr("y",10),a.addActions=function(t){t.forEach((function(t){return n.on(t[0],t[1])}))},a.redraw=function(){n.attr("x",(function(t){return a.xScale(t.start)})).attr("width",(function(t){return a.xScale(t.end)-a.xScale(t.start)})).select("text").text((function(t){var e=(a.xScale(t.end)-a.xScale(t.start))/9;return t.label.length>e?t.label.substr(0,e-1)+"..":t.label})),a.parts.forEach((function(t){return t.redraw()}))},this.bands[t]=a,this.components.push(a),this.bandY+=a.h+25,this.bandNum+=1,this},e.labels=function(t){var e=this.bands[t],a=e.y+e.h-10,n=[["start",c,0,4,function(t){return x(t)},"Start of the selected interval",e.x+30,a],["end",c,e.w-46,e.w-4,function(t,e){return x(e)},"End of the selected interval",e.x+e.w-152,a],["middle","timeline-module--bandMidLabel--3TTUb",(e.w-46)/2,e.w/2,function(t,e){return e.getUTCFullYear()-t.getUTCFullYear()},"Length of the selected interval",e.x+e.w/2-75,a]],r=this.chart.append("g").attr("id",t+"Labels").attr("transform","translate(0,"+(e.y+e.h+1)+")").selectAll("#"+t+"Labels").data(n).enter().append("g");r.append("rect").attr("class","timeline-module--bandLabel--EEttd").attr("x",(function(t){return t[2]})).attr("width",46).attr("height",20).style("opacity",1);var i=r.append("text").attr("class",(function(t){return t[1]})).attr("id",(function(t){return t[0]})).attr("x",(function(t){return t[3]})).attr("y",15).attr("text-anchor",(function(t){return t[0]}));return i.redraw=function(){var t=e.xScale.domain()[0],a=e.xScale.domain()[1];return i.text((function(e){return e[4](t,a)}))},e.parts.push(i),this.components.push(i),this},e.brush=function(t,e){var a=this,n=this.bands[t],r=(0,o.Yud)(),i=(0,o.Xf)().domain([0,1e3]).range([this.dataContent.minDate.getTime(),this.dataContent.maxDate.getTime()]);return r.on("brush",(function(t){var r=n.xScale.domain();t.selection&&(r=[i(t.selection[0]),i(t.selection[1])]),(0,o.td_)("."+u+" rect").style("filter","none"),e.forEach((function(t){a.bands[t].xScale.domain(r),a.bands[t].redraw()}))})),n.g.append("svg").attr("class","x").call(r).selectAll("rect").attr("y",1).attr("height",n.h-1),this},e.redraw=function(){return this.components.forEach((function(t){return t.redraw()})),this},t}(),w=function(t,e,a,n){var r=e.append("defs").append("filter").attr("height","500%").attr("id","drop-shadow-"+t).attr("width","500%").attr("x","-200%").attr("y","-200%");r.append("feGaussianBlur").attr("in","SourceAlpha").attr("stdDeviation",a),r.append("feOffset").attr("dx",1).attr("dy",1),r.append("feComponentTransfer").append("feFuncA").attr("slope",n).attr("type","linear");var i=r.append("feMerge");i.append("feMergeNode"),i.append("feMergeNode").attr("in","SourceGraphic")},y=function(){var t=(0,i.Z)(d().mark((function t(){var e;return d().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,o.gyn)("/demos/data/d3js/timeline/data.csv");case 2:e=t.sent,new b({rootElId:"chart"}).data(e).band("mainBand",.82).band("naviBand",.08).xAxis("mainBand").xAxis("naviBand").labels("mainBand").labels("naviBand").brush("naviBand",["mainBand"]).redraw().createTooltip();case 4:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),C=function(t){var e=t.pageContext;return n.createElement(r.Z,{links:["/vendors/jquery-ui/themes/base/jquery-ui.min.css"],main:y,pageContext:e,scripts:["/vendors/jquery-ui/jquery-ui.min.js"]},n.createElement("div",{id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-timeline-tsx-32621de3ca3d0afe2b60.js.map