(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[909],{2137:function(t,e,i){"use strict";function n(t,e,i,n,r,a,s){try{var o=t[a](s),c=o.value}catch(u){return void i(u)}o.done?e(c):Promise.resolve(c).then(n,r)}function r(t){return function(){var e=this,i=arguments;return new Promise((function(r,a){var s=t.apply(e,i);function o(t){n(s,r,a,o,c,"next",t)}function c(t){n(s,r,a,o,c,"throw",t)}o(void 0)}))}}i.d(e,{Z:function(){return r}})},7624:function(t,e,i){"use strict";i.r(e),i.d(e,{default:function(){return S}});var n=i(7294),r=i(4275),a=i(2137),s=i(7757),o=i.n(s),c=i(7723);function u(t){var e=t.initialDistortion,i=t.initialFocus,n=t.scale,r=e,a=i,s=function(t){var e=n(t),i=e<a,s=(0,c.Wem)(n.range()),o=s[0],u=s[1],d=i?a-o:u-a,l=0===d?u-o:d;return(i?-1:1)*l*(r+1)/(r+l/Math.abs(e-a))+a};return s.distortion=function(t){return r=t,s},s.focus=function(t){return a=t,s},s.copy=function(){return u({initialDistortion:e,initialFocus:i,scale:n.copy()})},s.domain=function(){var t=n.domain.apply(n,arguments);return t===n?s:t},s.range=function(){var t=n.range.apply(n,arguments);return t===n?s:t},s.nice=n.nice,s.ticks=n.ticks,s.tickFormat=n.tickFormat,s}var d={scale:function(t){return u({initialDistortion:3,initialFocus:0,scale:t()})}},l="fish-eye-module--axis--2iiOh",h="chart",f=function(){var t=(0,a.Z)(o().mark((function t(){return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,c.AVB)("/demos/data/d3js/fish-eye/data.json"));case 1:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),p=function(t){for(var e=t.toString();;){var i=e.replace(/(\d)(\d{3})($|,|\.)/g,"$1,$2$3");if(i===e)break;e=i}return e},m=70,v=70,y=50,x=80,g=700-x-m,w=function(){function t(t){var e=t.incomeMetrics,i=t.rootElId;this.rootElId=i,this.incomeMetrics=e,this.setupRootEl(),this.setVars(),this.setDom()}var e=t.prototype;return e.render=function(){this.setChartTitle(),this.setBackground(),this.setPointer(),this.setFilter(),this.setAxis(),this.setLabels(),this.setDots(),this.setTitles(),this.bindMousemove(),this.bindClick()},e.setupRootEl=function(){var t=document.getElementById(this.rootElId);t.classList.add("fish-eye-module--fishEyeChart--r1OJ9"),this.width=t.getBoundingClientRect().width-v-y},e.setDom=function(){this.dom={svg:(0,c.Ys)("#"+this.rootElId).append("svg").attr("width",this.width+v+y).attr("height",g+x+m).append("g").attr("transform","translate("+v+","+x+")")}},e.setChartTitle=function(){this.dom.svg.append("text").attr("class","fish-eye-module--chartTitle--z6BaN").attr("text-anchor","middle").attr("transform","translate("+this.width/2+",-40)").text("Income Per Capita vs Life Expectancy vs Population vs Region - 180 Countries").style("font-weight","bold")},e.setVars=function(){var t=(0,c.PKp)().domain(["Sub-Saharan Africa","South Asia","Middle East & North Africa","America","Europe & Central Asia","East Asia & Pacific"]).range(c.i4X),e=(0,c.PUr)().domain([0,5e8]).range([5,60]),i=d.scale(c.p2C).domain([300,1e5]).range([0,this.width]),n=d.scale(c.BYU).domain([20,90]).range([g,0]);this.vars={colorScale:t,focused:!1,radiusScale:e,xScale:i,yScale:n}},e.setAxis=function(){this.dom.xAxis=(0,c.LLu)(this.vars.xScale).tickFormat((0,c.WUZ)(",d")).tickSize(-g),this.dom.yAxis=(0,c.y4O)(this.vars.yScale).tickSize(-this.width),this.dom.svg.append("g").attr("class","x "+l).attr("transform","translate(0,"+g+")").call(this.dom.xAxis),this.dom.svg.append("g").attr("class","y "+l).call(this.dom.yAxis)},e.setBackground=function(){return this.dom.svg.append("rect").attr("class","fish-eye-module--background--1I5aD").attr("width",this.width).attr("height",g)},e.setLabels=function(){this.dom.svg.append("text").attr("class","x label").attr("text-anchor","end").attr("x",this.width-26).attr("y",g+26).text("income per capita, inflation-adjusted (dollars)"),this.dom.svg.append("text").attr("class","y label").attr("text-anchor","end").attr("x",-26).attr("y",-40).attr("dy",".75em").attr("transform","rotate(-90)").text("life expectancy (years)")},e.setFilter=function(){var t=this.dom.svg.append("defs").append("filter").attr("id","drop-shadow-circles");t.attr("height","500%").attr("width","500%").attr("x","-200%").attr("y","-200%"),t.append("feOffset").attr("dx",.5).attr("dy",.5).attr("in","SourceGraphic").attr("result","offOut"),t.append("feGaussianBlur").attr("in","offOut").attr("result","blurOut").attr("stdDeviation",1.5),t.append("feBlend").attr("in","SourceGraphic").attr("in2","blurOut").attr("mode","normal"),t.append("feComponentTransfer").append("feFuncA").attr("slope",.6).attr("type","linear")},e.position=function(){var t=this;this.dom.dot.attr("cx",(function(e){return t.vars.xScale(e.income)})).attr("cy",(function(e){return t.vars.yScale(e.lifeExpectancy)})).attr("r",(function(e){return t.vars.radiusScale(e.population)}))},e.setDots=function(){var t=this;this.dom.dot=this.dom.svg.append("g").attr("class","dots").selectAll(".dot").data(this.incomeMetrics).enter().append("circle").attr("class","dot").style("fill",(function(e){return t.vars.colorScale(e.region)})).style("filter","url(#drop-shadow-circles)").style("stroke","black").style('"stroke-width"',"1px").sort((function(){for(var t=arguments.length,e=new Array(t),i=0;i<t;i++)e[i]=arguments[i];var n=e[0],r=e[1];return r.population-n.population})),this.position()},e.setTitles=function(){this.dom.dot.append("title").text((function(t){return t.name+":\n- Income: "+p(t.income)+" $/P.C.\n- Population: "+p(t.population)+"\n- Life expectancy: "+t.lifeExpectancy+" years"}))},e.zoom=function(t){var e=(0,c.cx$)(t);this.vars.xScale.distortion(2.5).focus(e[0]),this.vars.yScale.distortion(2.5).focus(e[1]),this.position(),this.dom.svg.select(".x."+l).call(this.dom.xAxis),this.dom.svg.select(".y."+l).call(this.dom.yAxis)},e.setPointer=function(){this.dom.pointer=this.dom.svg.append("text").text("+").attr("class","fish-eye-module--pointer--BU8Qx")},e.bindMousemove=function(){var t=this;return this.dom.svg.on("mousemove",(function(e){t.vars.focused||t.zoom(e)}))},e.bindClick=function(){var t=this;this.dom.svg.on("click",(function(e){if(t.vars.focused=!t.vars.focused,t.vars.focused){var i=(0,c.cx$)(t);t.dom.pointer.attr("x",i[0]).attr("y",i[1]).style("opacity",1)}else t.dom.pointer.style("opacity",0),t.zoom(e)}))},t}(),k=function(){var t=(0,a.Z)(o().mark((function t(){var e;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,f();case 2:e=t.sent,new w({incomeMetrics:e,rootElId:h}).render();case 5:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),S=function(t){var e=t.pageContext;return n.createElement(r.Z,{main:k,pageContext:e},n.createElement("div",{id:h}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-fish-eye-tsx-0bd65be0b1ce0be05fbb.js.map