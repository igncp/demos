(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[730],{6126:function(t,e,r){"use strict";var n;r.d(e,{H:function(){return a},d:function(){return n}}),function(t){t.STORYBOOK="storybook",t.TESTING="testing"}(n||(n={}));var a={SCRIPT:"/vendors/jquery-ui/jquery-ui.min.js",STYLE:"/vendors/jquery-ui/themes/base/jquery-ui.min.css"}},7986:function(t,e,r){"use strict";r.r(e),r.d(e,{default:function(){return R}});var n=r(7294),a=r(6126),l=r(4275),i=r(8634),o=r(2656),s=r.n(o),c=r(5221),u="weekly-heatmap-module--mono--4476c",d="weekly-heatmap-module--axisBold--507d8",f=["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"],h=f.length,g=100,m=50,v=50,p=50,y=function(){function t(t){var e=this;this.state={drag:{x:0,y:0},width:0},this.handleResize=function(){e.render()},this.config=t;var r=t.rootElId,n=(0,c.Ys)("#"+r).append("svg"),a=n.append("g"),l=a.append("g"),i={cell:"cell",legend:"legend"};this.classes=i,this.elements={get cellsSel(){return l.selectAll("."+i.cell)},gSel:l,get legendSel(){return l.selectAll("."+i.legend)},svgDragSel:a,svgSel:n},this.render(),window.addEventListener("resize",this.handleResize)}t.renderChart=function(e){return new t(e)};var e=t.prototype;return e.teardown=function(){window.removeEventListener("resize",this.handleResize)},e.refresh=function(){this.render()},e.render=function(){var t=this.config,e=this.elements,r=t.horizontalLabels,n=t.rootElId,a=t.verticalLabels,l=t.weeklyData,i=document.getElementById(n);i.classList.add("weekly-heatmap-module--weeklyHeatmapChart--f1173");var o=i.getBoundingClientRect().width-m-v,s=Math.max(o,850);this.state.width=o;var y=Math.max(Math.ceil(10*s/r.length)-p-g+60,250),x=Math.floor(s/r.length),w=2*x,b=(0,c.Fp7)(l,(function(e){return t.getItemValue(e)})),S=(0,c.FTZ)().domain([0,h-1,b]).range(f);e.svgSel.attr("height",y+p+g).attr("width",s+m+v),e.gSel.attr("transform","translate("+m+","+p+")"),e.gSel.selectAll(".verticalLabel").data(a).enter().append("text").attr("class",(function(){for(var e=arguments.length,r=new Array(e),n=0;n<e;n++)r[n]=arguments[n];var a=r[0],l=r[1];return"verticalLabel "+u+" axis"+(t.getIsVerticalLabelBold(a,l)?" "+d:"")})),e.gSel.selectAll(".verticalLabel").text((function(t){return t})).attr("transform","translate(-6,"+x/1.5+")").attr("x",0).attr("y",(function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[1];return n*x})).style("text-anchor","end"),e.gSel.selectAll(".horizontalLabel").data(r).enter().append("text").text((function(t){return t})).style("text-anchor","middle").attr("class",(function(){for(var e=arguments.length,r=new Array(e),n=0;n<e;n++)r[n]=arguments[n];var a=r[0],l=r[1];return"horizontalLabel "+u+" axis"+(t.getIsHorizontalLabelBold(a,l)?" "+d:"")})),e.gSel.selectAll(".horizontalLabel").attr("transform","translate("+x/2+", "+"-6)").attr("x",(function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[1];return n*x})).attr("y",0),e.cellsSel.data(l).enter().append("rect").attr("class",this.classes.cell+" weekly-heatmap-module--bordered--2b26a").style("fill",f[0]),e.cellsSel.transition().duration(2e3).style("fill",(function(e){return S(t.getItemValue(e))})),e.cellsSel.attr("height",x).attr("rx",100).attr("ry",100).attr("width",x).attr("x",(function(e){return t.getItemHorizontalIndex(e)*x})).attr("y",(function(e){return t.getItemVerticalIndex(e)*x})).attr("title",t.getItemTooltip),$("."+this.classes.cell).tooltip();var I=[0].concat(S.quantiles()),L=e.legendSel.data(I).enter().append("g").attr("class",this.classes.legend);L.append("rect").style("fill",(function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[1];return f[n]})).style("stroke","#ccc"),L.append("text").attr("class",u).style("text-anchor","middle"),e.legendSel.each((function(){for(var e=arguments.length,r=new Array(e),n=0;n<e;n++)r[n]=arguments[n];var a=r[0],l=r[1];(0,c.Ys)(this).selectAll("rect").attr("x",w*l).attr("y",y).attr("width",w).attr("height",x/2),(0,c.Ys)(this).selectAll("."+u).attr("x",w*l+w/2).text(t.getLegendText(a)).attr("y",y+x)})),this.setupDrag()},e.setupDrag=function(){var t=this,e=this.elements,r=function(){t.elements.svgDragSel.attr("transform","translate("+t.state.drag.x+","+t.state.drag.y+")")},n=this.state.width<850,a=function(e){n&&(t.state.drag.x+=e.dx,t.state.drag.y+=e.dy,r())},l=(0,c.ohM)().on("drag",a);e.svgSel.style("cursor",n?"move":"default"),n||(this.state.drag={x:0,y:0}),e.svgSel.call(l).on("drag",a),r()},t}(),x="chart",w="update-random",b=["Mo","Tu","We","Th","Fr","Sa","Su"],S=Array.from({length:24}).map((function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[1],a=n%12;return a+1+(n>=11&&23!==n?"pm":"am")})),I=function(){var t=(0,i.Z)(s().mark((function t(){var e;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,c.pvA)("/demos/data/d3js/weekly-heatmap/data.tsv");case 2:return e=t.sent,t.abrupt("return",e.map((function(t){return{arbitraryMetric:+t.value,day:+t.day,hour:+t.hour}})));case 4:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),L=function(t){return t.arbitraryMetric},A=function(t){return"Arbitrary Metric: "+t.arbitraryMetric.toFixed(2)},k=function(t){return t.hour-1},E=function(t){return t.day-1},z=function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[1];return n>=7&&n<=16},T=function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[1];return n>=0&&n<=4},M=function(t){return"≥ "+t.toFixed(2)},B=function(t){return{getIsHorizontalLabelBold:z,getIsVerticalLabelBold:T,getItemHorizontalIndex:k,getItemTooltip:A,getItemValue:L,getItemVerticalIndex:E,getLegendText:M,horizontalLabels:S,rootElId:x,verticalLabels:b,weeklyData:t}},C=function(){var t=(0,i.Z)(s().mark((function t(){var e,r,n,a;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,I();case 2:r=t.sent,n=B(r),a=y.renderChart(n),null===(e=document.getElementById(w))||void 0===e||e.addEventListener("click",(function(){r.forEach((function(t){Math.random()>.85&&(t.arbitraryMetric+=100*Math.random()+30)})),a.refresh()}));case 6:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),H=C,R=function(t){var e=t.pageContext;return n.createElement(l.Z,{links:[a.H.STYLE],main:H,pageContext:e,scripts:[a.H.SCRIPT]},n.createElement("form",{style:{marginBottom:20}},n.createElement("button",{className:"btn btn-info",id:w,type:"button"},"Update Random")),n.createElement("div",{id:x}))}},2656:function(t,e,r){t.exports=r(3076)},8634:function(t,e,r){"use strict";function n(t,e,r,n,a,l,i){try{var o=t[l](i),s=o.value}catch(c){return void r(c)}o.done?e(s):Promise.resolve(s).then(n,a)}function a(t){return function(){var e=this,r=arguments;return new Promise((function(a,l){var i=t.apply(e,r);function o(t){n(i,a,l,o,s,"next",t)}function s(t){n(i,a,l,o,s,"throw",t)}o(void 0)}))}}r.d(e,{Z:function(){return a}})}}]);
//# sourceMappingURL=component---src-pages-d-3-js-weekly-heatmap-tsx-3d7c3cd75f2f22158791.js.map