(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[964],{2137:function(t,n,e){"use strict";function r(t,n,e,r,a,i,s){try{var o=t[i](s),l=o.value}catch(c){return void e(c)}o.done?n(l):Promise.resolve(l).then(r,a)}function a(t){return function(){var n=this,e=arguments;return new Promise((function(a,i){var s=t.apply(n,e);function o(t){r(s,a,i,o,l,"next",t)}function l(t){r(s,a,i,o,l,"throw",t)}o(void 0)}))}}e.d(n,{Z:function(){return a}})},1078:function(t,n,e){"use strict";e.r(n),e.d(n,{default:function(){return w}});var r=e(7294),a=e(4275),i=e(2137),s=e(7757),o=e.n(s),l=e(7723),c="bars-module--axis--_Qwuv",u=160,d=100,h=500-2*d,f=30,v=["#323247","#7C7CC9","#72B66C","#429742"],p=function(t){return h-7*t},m=function(t){return 7*t},g=function(){var t=(0,i.Z)(o().mark((function t(){var n,e;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch("/demos/data/d3js/bars/data.json");case 2:return n=t.sent,t.next=5,n.json();case 5:return e=t.sent,t.abrupt("return",e);case 7:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),x=function(){function t(t){var n=t.data,e=t.rootElId;this.data=n,this.rootElId=e,this.interval=null,this.chart=null,this.color=null}var n=t.prototype;return n.render=function(){var t=this.data,n=this.rootElId,e=document.getElementById(n).getBoundingClientRect().width,r=(0,l.BYU)().domain((0,l.Wem)(t)).range([0,1]),a=(0,l.BYU)().domain((0,l.w6H)(0,1,1/v.length)).range(v);this.color=function(t){return a(r(t))};var i=(0,l.Ys)("#"+n).append("svg");i.attr("height",500).attr("width",e).attr("class","bars-module--barsChart--3abBv");var s=i.append("g");this.chart=s,s.attr("transform","translate("+u+","+d+")"),this.interval=setInterval(this.getIntervalFn(),1e3);var o=(0,l.BYU)().domain([.5,t.length+.5]).range([1,f*t.length]),p=(0,l.BYU)().domain([0,(0,l.Fp7)(t)]).rangeRound([0,-7*(0,l.Fp7)(t)]),m=s.append("g");m.attr("class","xAxis "+c).attr("transform","translate(0,"+h+")").call((0,l.LLu)(o)),m.append("text").attr("transform","translate("+f*t.length/2+" ,0)").attr("class","xAxisLabel").attr("y",40).attr("font-size","1.3em").attr("fill","black").style("text-anchor","end").text("Number");var g=s.append("g");g.attr("class","yAxis "+c).attr("transform","translate(0,"+h+")").call((0,l.y4O)(p)),g.append("text").attr("transform","translate(-30,-220)").attr("y",40).attr("font-size","1.3em").attr("fill","black").style("text-anchor","end").text("Value"),this.drawRectangles()},n.refresh=function(){this.drawRectangles(),this.redraw()},n.clearInterval=function(t){function n(){return t.apply(this,arguments)}return n.toString=function(){return t.toString()},n}((function(){this.interval&&clearInterval(this.interval)})),n.drawRectangles=function(){var t=this,n=this.chart,e=this.color,r=this.data;n.selectAll("rect").data(r).enter().append("rect").attr("x",(function(t,n){return f*n})).attr("y",p).attr("width",f).attr("height",m).attr("fill",(function(t){return e(t)})).on("mouseover",(function(){t.clearInterval()})).on("mouseleave",(function(){t.clearInterval(),t.interval=setInterval(t.getIntervalFn(),1e3)})).append("title").text((function(t){return t}))},n.getIntervalFn=function(){var t=this;return function(){var n=t.data;n.unshift(n.pop()),t.redraw()}},n.redraw=function(){var t=this.chart,n=this.color,e=this.data;if(t){var r=(0,l.BYU)().domain([.5,e.length+.5]).range([1,f*e.length]),a=(0,l.LLu)(r);t.select(".xAxis").transition().duration(500).call(a),t.select(".xAxisLabel").transition().duration(500).attr("transform","translate("+f*e.length/2+" ,0)"),t.selectAll("rect").data(e).transition().duration(500).attr("y",p).attr("height",m).attr("fill",n).select("title").text((function(t){return t}))}},t}(),b=function(){var t=(0,i.Z)(o().mark((function t(){var n,e,r;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,g();case 2:n=t.sent,(e=new x({data:n,rootElId:"chart"})).render(),(r=document.getElementById("add-item")).addEventListener("click",(function(){n.length<20?(n.push(Math.floor(Math.random()*(0,l.Fp7)(n))+1),e.refresh()):r.setAttribute("disabled","disabled")}));case 7:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),w=function(t){var n=t.pageContext;return r.createElement(a.Z,{main:b,pageContext:n},r.createElement("form",null,r.createElement("button",{className:"btn btn-info",id:"add-item",type:"button"},"Add item")),r.createElement("div",{id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-bars-tsx-044087b82424531c7409.js.map