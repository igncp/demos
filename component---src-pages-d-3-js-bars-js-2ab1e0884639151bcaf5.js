(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[211],{2137:function(t,n,e){"use strict";function r(t,n,e,r,a,i,o){try{var s=t[i](o),l=s.value}catch(c){return void e(c)}s.done?n(l):Promise.resolve(l).then(r,a)}function a(t){return function(){var n=this,e=arguments;return new Promise((function(a,i){var o=t.apply(n,e);function s(t){r(o,a,i,s,l,"next",t)}function l(t){r(o,a,i,s,l,"throw",t)}s(void 0)}))}}e.d(n,{Z:function(){return a}})},8757:function(t,n,e){"use strict";e.r(n),e.d(n,{default:function(){return w}});var r=e(7294),a=e(7538),i=e(2137),o=e(7757),s=e.n(o),l=e(8649),c=160,u=100,d=500-2*u,h=30,f=["#323247","#7C7CC9","#72B66C","#429742"],v=function(t){return d-7*t},p=function(t){return 7*t},m=function(){function t(t){var n=t.data,e=t.rootElId;this.data=n,this.rootElId=e,this.interval=null,this.chart=null,this.color=null}var n=t.prototype;return n.render=function(){var t=this.data,n=this.rootElId,e=document.getElementById(n).getBoundingClientRect().width,r=l.BYU().domain(l.Wem(t)).range([0,1]),a=l.BYU().domain(l.w6H(0,1,1/f.length)).range(f);this.color=function(t){return a(r(t))};var i=l.Ys("#"+n).append("svg");i.attr("height",500).attr("width",e);var o=i.append("g");this.chart=o,o.attr("transform","translate("+c+","+u+")"),this.interval=setInterval(this.getIntervalFn(),1e3);var s=l.BYU().domain([.5,t.length+.5]).range([1,h*t.length]),v=l.BYU().domain([0,l.Fp7(t)]).rangeRound([0,-7*l.Fp7(t)]),p=o.append("g");p.attr("class","x-axis axis").attr("transform","translate(0,"+d+")").call(l.LLu(s)),p.append("text").attr("transform","translate("+h*t.length/2+" ,0)").attr("class","x-axis-label").attr("y",40).attr("font-size","1.3em").attr("fill","black").style("text-anchor","end").text("Number");var m=o.append("g");m.attr("class","x-axis axis").attr("transform","translate(0,"+d+")").call(l.y4O(v)),m.append("text").attr("transform","translate(-30,"+String(-220)+")").attr("y",40).attr("font-size","1.3em").attr("fill","black").style("text-anchor","end").text("Value"),this.drawRectangles()},n.refresh=function(){this.drawRectangles(),this.redraw()},n.clearInterval=function(t){function n(){return t.apply(this,arguments)}return n.toString=function(){return t.toString()},n}((function(){this.interval&&clearInterval(this.interval)})),n.drawRectangles=function(){var t=this,n=this.data,e=this.chart,r=this.color;e.selectAll("rect").data(n).enter().append("rect").attr("x",(function(t,n){return h*n})).attr("y",v).attr("width",h).attr("height",p).attr("fill",(function(t){return r(t)})).on("mouseover",(function(){t.clearInterval()})).on("mouseleave",(function(){t.clearInterval(),t.interval=setInterval(t.getIntervalFn(),1e3)})).append("title").text((function(t){return t}))},n.getIntervalFn=function(){var t=this;return function(){var n=t.data;n.unshift(n.pop()),t.redraw()}},n.redraw=function(){var t=this.data,n=this.chart,e=this.color;if(n){var r=l.BYU().domain([.5,t.length+.5]).range([1,h*t.length]);n.select(".x-axis").transition().duration(500).call(l.LLu(r)),n.select(".x-axis-label").transition().duration(500).attr("transform","translate("+h*t.length/2+" ,0)"),n.selectAll("rect").data(t).transition().duration(500).attr("y",v).attr("height",p).attr("fill",e).select("title").text((function(t){return t}))}},t}(),g=function(){var t=(0,i.Z)(s().mark((function t(){var n,e;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch("/demos/data/d3js/bars/data.json");case 2:return n=t.sent,t.next=5,n.json();case 5:return e=t.sent,t.abrupt("return",e);case 7:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),x=function(){var t=(0,i.Z)(s().mark((function t(){var n,e,r;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,g();case 2:n=t.sent,(e=new m({data:n,rootElId:"chart"})).render(),(r=document.getElementById("add-item")).addEventListener("click",(function(){n.length<20?(n.push(Math.floor(Math.random()*l.Fp7(n))+1),e.refresh()):r.setAttribute("disabled","disabled")}));case 7:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),w=function(t){var n=t.pageContext.demoInfo;return r.createElement(a.Z,{demoInfo:n,main:x},r.createElement("form",null,r.createElement("button",{className:"btn btn-info",id:"add-item",type:"button"},"Add item")),r.createElement("div",{className:"bars-chart",id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-bars-js-2ab1e0884639151bcaf5.js.map