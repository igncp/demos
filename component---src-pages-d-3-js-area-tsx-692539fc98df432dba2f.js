"use strict";(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[189],{9646:function(t,e,r){var n;r.d(e,{Z:function(){return h}});var a=new Uint8Array(16);function o(){if(!n&&!(n="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return n(a)}var i=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;for(var c=function(t){return"string"==typeof t&&i.test(t)},s=[],l=0;l<256;++l)s.push((l+256).toString(16).substr(1));var u,d,p=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=(s[t[e+0]]+s[t[e+1]]+s[t[e+2]]+s[t[e+3]]+"-"+s[t[e+4]]+s[t[e+5]]+"-"+s[t[e+6]]+s[t[e+7]]+"-"+s[t[e+8]]+s[t[e+9]]+"-"+s[t[e+10]]+s[t[e+11]]+s[t[e+12]]+s[t[e+13]]+s[t[e+14]]+s[t[e+15]]).toLowerCase();if(!c(r))throw TypeError("Stringified UUID is invalid");return r},f=0,m=0;var h=function(t,e,r){var n=e&&r||0,a=e||new Array(16),i=(t=t||{}).node||u,c=void 0!==t.clockseq?t.clockseq:d;if(null==i||null==c){var s=t.random||(t.rng||o)();null==i&&(i=u=[1|s[0],s[1],s[2],s[3],s[4],s[5]]),null==c&&(c=d=16383&(s[6]<<8|s[7]))}var l=void 0!==t.msecs?t.msecs:Date.now(),h=void 0!==t.nsecs?t.nsecs:m+1,g=l-f+(h-m)/1e4;if(g<0&&void 0===t.clockseq&&(c=c+1&16383),(g<0||l>f)&&void 0===t.nsecs&&(h=0),h>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");f=l,m=h,d=c;var v=(1e4*(268435455&(l+=122192928e5))+h)%4294967296;a[n++]=v>>>24&255,a[n++]=v>>>16&255,a[n++]=v>>>8&255,a[n++]=255&v;var y=l/4294967296*1e4&268435455;a[n++]=y>>>8&255,a[n++]=255&y,a[n++]=y>>>24&15|16,a[n++]=y>>>16&255,a[n++]=c>>>8|128,a[n++]=255&c;for(var I=0;I<6;++I)a[n+I]=i[I];return e||p(a)}},6126:function(t,e,r){var n;r.d(e,{H:function(){return a},d:function(){return n}}),function(t){t.STORYBOOK="storybook",t.TESTING="testing"}(n||(n={}));var a={SCRIPT:"/vendors/jquery-ui/jquery-ui.min.js",STYLE:"/vendors/jquery-ui/themes/base/jquery-ui.min.css"}},4251:function(t,e,r){r.r(e),r.d(e,{default:function(){return E}});var n=r(7294),a=r(6126),o=r(4275),i=r(8634),c=r(2656),s=r.n(c),l=r(862),u=r(9646),d="area-chart-module--axis--bKucy",p=r(2149),f=function(){function t(t){this.state={hasVoronoi:!1},this.voronoiGroup=t.append("g")}var e=t.prototype;return e.toggleVoronoi=function(){this.state.hasVoronoi=!this.state.hasVoronoi,this.setVoronoi()},e.render=function(t){var e=t.animationDuration,r=t.boundaries,n=t.className,a=t.clipPath,o=t.extractXScale,i=t.extractYScale,c=t.filter,s=t.getItemId,u=t.getTitle,d=t.mouseenter,f=t.mouseleave,m=t.points,h=this.voronoiGroup,g=h.selectAll("path").data(m,(function(t){return s(t)}));g.enter().append("path"),g.exit().remove();var v=(0,l.PKp)(l.i4X),y=p.Z.from(m,o,i).voronoi(r);h.attr("clip-path",a).attr("class","area-chart-module--voronoi--JTmEy").selectAll("path").attr("fill",(function(t){var e=s(t),r=v(e),n=(0,l.$_Y)(r);return n.opacity=.2,n.formatRgb()})).on("mouseenter",d).on("mouseleave",f).attr("class",n).attr("title",u).style("filter",c).transition().duration(e).attr("d",(function(t){return y.renderCell(s(t))})),this.setVoronoi()},e.setVoronoi=function(){var t=this.state.hasVoronoi,e=this.voronoiGroup,r="area-chart-module--showVoronoi--W+xyL",n=e.attr("class").replace(r,"").trim(),a=t?n+" "+r:n;e.attr("class",a)},t}(),m=function(){function t(t){var e=this;this.handleWindowResize=function(){e.render(!0)},this.config=t;var r=t.rootElId,n=(0,l.Ys)("#"+r).append("svg"),a=n.append("g").attr("class","area-chart-module--areaChart--jM-1X"),o=a.append("g"),i=a.append("text").attr("class","area-chart-module--chartTitle--ypMr7").attr("text-anchor","middle").style("font-weight","bold"),c=a.append("g"),s=a.append("g"),d=a.append("path"),p=a.append("path"),m=new f(a),h=a.append("clipPath").attr("id","clip").append("rect"),g=a.append("clipPath").attr("id","clip-top").append("rect");this.svgOpacityFilter="opacity-"+(0,u.Z)().slice(0,6),function(t){var e=t.deviation,r=t.id,n=t.slope,a=t.svg.append("defs").append("filter").attr("height","500%").attr("id","drop-shadow-"+r).attr("width","500%").attr("x","-200%").attr("y","-200%");a.append("feGaussianBlur").attr("in","SourceAlpha").attr("stdDeviation",e),a.append("feOffset").attr("dx",1).attr("dy",1),a.append("feComponentTransfer").append("feFuncA").attr("slope",n).attr("type","linear");var o=a.append("feMerge");o.append("feMergeNode"),o.append("feMergeNode").attr("in","SourceGraphic")}({deviation:2,id:this.svgOpacityFilter,slope:.5,svg:a}),this.elements={areaSel:p,backgroundBands:o,chartTitleSel:i,clipRect:h,clipTopRect:g,lineSel:d,svg:n,svgG:a,voronoiGroup:m,xAxisSel:c,yAxisSel:s},this.render(!0),window.addEventListener("resize",this.handleWindowResize)}t.renderChart=function(e){return new t(e)};var e=t.prototype;return e.refresh=function(){this.render(!1)},e.tearDown=function(){window.removeEventListener("resize",this.handleWindowResize)},e.toggleVoronoi=function(){this.elements.voronoiGroup.toggleVoronoi()},e.render=function(t){var e=t?0:1e3,r=this.config.rootElId,n=document.getElementById(r).getBoundingClientRect().width,a=n<500,o=50,i=a?50:70,c=a?10:50,s=50,p=n-i-c,f=400-s-o,m=this.config,h=m.areaPoints,g="tooltip-item-"+(0,u.Z)().slice(0,6),v="point-"+(0,u.Z)().slice(0,6)+"-",y=this.elements,I=y.areaSel,w=y.backgroundBands,x=y.chartTitleSel,V=y.clipRect,S=y.clipTopRect,b=y.lineSel,A=y.svg,T=y.svgG,k=y.voronoiGroup,C=y.xAxisSel,E=y.yAxisSel;A.attr("height",f+s+o).attr("width",p+i+c),T.attr("transform","translate("+i+","+s+")"),x.attr("transform","translate("+(n/2-i)+","+"-15)").text((function(){return a?m.chartTitleShort:m.chartTitle}));var R=(0,l.Fp7)(h,m.getItemXValue),Y=(0,l.VV$)(h,m.getItemXValue),D=(0,l.Fp7)(h,m.getItemYValue),B=(0,l.VV$)(h,m.getItemYValue),M=(0,l.BYU)().domain([Y,R]).range([0,p]),O=(0,l.BYU)().domain([D+.05,B-.05]).range([0,f]),P=function(t){return M(m.getItemXValue(t))},G=function(t){return O(m.getItemYValue(t))},L=a?(0,l.aE8)().domain([0,500]).range(Array.from({length:6}).map((function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[1];return n})))(n):null,Z=(0,l.LLu)(M).tickFormat((0,l.WUZ)(".0f")).ticks(L),j=(0,l.y4O)(O).tickFormat((0,l.WUZ)(".0%")).tickSize(10);C.attr("class","area-chart-module--x--XO1ZY "+d).attr("transform","translate(0,"+f+")").call(Z).selectAll("text").attr("dy","1.25em"),E.attr("class","area-chart-module--y--x8u13 "+d).attr("clip-path","url(#clip-top)").transition().duration(e).call(j).selectAll("text").attr("dx","-.25em");var F=(0,l.SOn)().x(P).y0(f).y1(G),N=(0,l.jvg)().x(P).y(G);b.datum(h).attr("clip-path","url(#clip)").attr("class","area-chart-module--line--Vx-oD").transition().duration(e).attr("d",N),V.attr("height",f).attr("width",p),S.attr("height",f).attr("width",p).attr("transform","translate(-50,-5)"),I.datum(h).attr("class","area-chart-module--area--WvHPB").attr("clip-path","url(#clip)").transition().duration(e).attr("d",F);var U=function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[1];(0,l.Ys)("."+v+m.getItemId(n)).style("display","block")},X=function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[1];(0,l.Ys)("."+v+m.getItemId(n)).style("display","none")},z=2.5,q=Array.from({length:40}).map((function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[1];return n*z/100})),W=Math.abs(O(.025)-O(0)),H=w.selectAll("rect").data(q);H.enter().append("rect"),H.exit().remove(),w.selectAll("rect").attr("clip-path","url(#clip)").attr("x",0).attr("width",p).attr("fill",(function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[1];return n%2?"#f7f7f7":"#ffffff"})).attr("class","backgroundBands").transition().duration(e).attr("height",W).attr("y",(function(t){return O(t)}));var K=T.selectAll("circle").data(h);K.enter().append("circle"),K.exit().remove(),T.selectAll("circle").attr("r","5px").style("filter","url(#drop-shadow-"+this.svgOpacityFilter+")").attr("transform",(function(t){return"translate("+P(t)+","+G(t)+")"})).attr("class",(function(t){return"area-chart-module--point--Os+oA "+g+" "+v+m.getItemId(t)})).on("mouseenter",U).on("mouseleave",X).attr("title",m.getItemTitle),k.render({animationDuration:e,boundaries:[-i,-s,p+c,f+o],className:g,clipPath:"url(#clip)",extractXScale:P,extractYScale:G,filter:"url(#drop-shadow-"+this.svgOpacityFilter+")",getItemId:m.getItemId,getTitle:m.getItemTitle,mouseenter:U,mouseleave:X,points:h}),$("."+g).tooltip({track:!0})},t}(),h="chart",g=function(t){return t.getYear()},v=function(t){return t.getNormalizedValue()},y=function(t){return t.getId()},I=function(t){return t.getSummary()},w="Share of top decile [aka top 10%] in national income",x=w.replace(" [aka top 10%]",""),V=function(t){return{areaPoints:t,chartTitle:w,chartTitleShort:x,getItemId:y,getItemTitle:I,getItemXValue:g,getItemYValue:v,rootElId:h}},S="toggle-voronoi",b="update-voronoi",A=function(t){var e=t.onToggleVoronoiClick,r=t.onUpdateRandomValue,n=document.getElementById(S),a=document.getElementById(b);n.addEventListener("click",(function(t){t.preventDefault(),e()})),a.addEventListener("click",(function(t){t.preventDefault(),r()}))},T=function(){function t(t){this.incomeItemData=t,this.incomeItemData.percentage=Number(this.incomeItemData.percentage)}t.fetchAndCreateCollection=function(){var e=(0,i.Z)(s().mark((function e(){var r,n;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,l.gyn)("/demos/data/d3js/area/data.csv");case 2:return r=e.sent,n=r.map((function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[0],a=e[1];return Object.assign({},n,{percentage:n.percent,pointIndex:a})})),e.abrupt("return",n.map((function(e){return new t(e)})));case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();var e=t.prototype;return e.getYear=function(){return this.incomeItemData.year},e.changePercentage=function(t){var e=Math.max(this.incomeItemData.percentage+t,0),r=Math.min(100,e);this.incomeItemData.percentage=r},e.getNormalizedValue=function(){return this.incomeItemData.percentage/100},e.getId=function(){return this.incomeItemData.pointIndex},e.getSummary=function(){var t=this.incomeItemData;return"Year: "+t.year+", Percentage: "+t.percentage.toFixed(2)+"%"},t}(),k=function(){var t=(0,i.Z)(s().mark((function t(){var e,r,n;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,T.fetchAndCreateCollection();case 2:e=t.sent,r=V(e),n=m.renderChart(r),A({onToggleVoronoiClick:function(){n.toggleVoronoi()},onUpdateRandomValue:function(){Array.from({length:50}).forEach((function(){var t=Math.floor(Math.random()*e.length),r=10*Math.random()*(Math.random()>.5?1:-1);e[t].changePercentage(r)})),n.refresh()}});case 6:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),C=k,E=function(t){var e=t.pageContext;return n.createElement(o.Z,{links:[a.H.STYLE],main:C,pageContext:e,scripts:[a.H.SCRIPT]},n.createElement("form",{style:{marginBottom:20}},n.createElement("button",{className:"btn btn-info",id:S,type:"button"},"Toggle Voronoi"),n.createElement("button",{className:"btn btn-success",id:b,style:{marginLeft:20},type:"button"},"Update Random Values")),n.createElement("div",{id:h}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-area-tsx-692539fc98df432dba2f.js.map