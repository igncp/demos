(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[902],{2137:function(t,e,n){"use strict";function r(t,e,n,r,a,o,i){try{var c=t[o](i),u=c.value}catch(l){return void n(l)}c.done?e(u):Promise.resolve(u).then(r,a)}function a(t){return function(){var e=this,n=arguments;return new Promise((function(a,o){var i=t.apply(e,n);function c(t){r(i,a,o,c,u,"next",t)}function u(t){r(i,a,o,c,u,"throw",t)}c(void 0)}))}}n.d(e,{Z:function(){return a}})},4225:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return v}});var r=n(7294),a=n(1335),o=n(2137),i=n(7757),c=n.n(i),u=n(8314),l=5,s=.5,d=function(t){var e=t.rootElId,n=t.data,r=n.nodes,a=n.links,o=document.getElementById(e);o.classList.add("vectors-chart");var i=o.getBoundingClientRect().width,c="C".charCodeAt(0),d=null,f=null,v=null,p=u.A4v(r).force("charge",u.q5i().strength(-50)).force("center",u.wqt(i/2,300)).force("link",u.Fsl().links(a).distance(100)).on("tick",(function(){h(),m()})),g=u.Ys("#"+e).append("svg").attr("width",i).attr("height",600);!function(t){t.append("svg:defs").append("svg:marker").attr("id","end-arrow").attr("viewBox","0 -5 10 10").attr("refX",6).attr("markerWidth",3).attr("markerHeight",3).attr("orient","auto").append("svg:path").attr("d","M0,-5L10,0L0,5").attr("fill","#000"),t.append("svg:defs").append("svg:marker").attr("id","start-arrow").attr("viewBox","0 -5 10 10").attr("refX",4).attr("markerWidth",3).attr("markerHeight",3).attr("orient","auto").append("svg:path").attr("d","M10,-5L0,0L10,5").attr("fill","#000")}(g),g.selectAll(".link").data(a).enter().append("svg:path").attr("class","link").attr("marker-end","url(#end)").attr("id",(function(t,e){return"link-"+e}));var h=function(){var t=g.selectAll(".link").data(a);t.enter().append("path").merge(t).attr("d",(function(t){var e=t.target.x-t.source.x,n=t.target.y-t.source.y,r=Math.sqrt(e*e+n*n),a=e/r,o=n/r,i=t.left?17:12,c=t.right?17:12;return"M"+(t.source.x+i*a)+","+(t.source.y+i*o)+"L"+(t.target.x-c*a)+","+(t.target.y-c*o)})).attr("class","link dragline"),t.exit().remove()},m=function(){var t=g.selectAll("circle").data(r),e=g.selectAll("text").data(r);t.enter().append("circle").merge(t).attr("cx",(function(t){return t.x})).attr("cy",(function(t){return t.y})).attr("r",(function(){return l})).attr("fill","#fff").each((function(){u.Ys(this).on("mouseover",(function(t,e){u.Ys("#node-text-"+e.index).style("opacity",1)})).on("mouseleave",(function(t,e){u.Ys("#node-text-"+e.index).style("opacity",s)}))})).call(u.ohM().on("start",x).on("drag",y).on("end",k)),e.enter().append("text").merge(e).text((function(t){return t.id})).attr("x",(function(t){return t.x})).attr("y",(function(t){return t.y})).attr("class","id"),t.exit().remove(),e.exit().remove()},x=function(t,e){t.active||p.alphaTarget(.3).restart(),e.fx=e.x,e.fy=e.y},y=function(t,e){e.fx=t.x,e.fy=t.y},k=function(t,e){t.active||p.alphaTarget(0),e.fx=null,e.fy=null};g.on("mousedown",(function(t){if(g.classed("active",!0),!(t.ctrlKey||f||d)){var e=t.target.getBoundingClientRect(),n=t.clientX-e.left,a=t.clientY-e.top,o={id:String.fromCharCode(++c),index:r.length,reflexive:!1,vx:0,vy:0,x:n,y:a};r.push(o),p.nodes(r),p.alpha(.5).restart()}})).on("mousemove",(function(){console.log("mousemoveSVG")})).on("mouseup",(function(){console.log("mouseupSVG",v),f=null,v=null,d=null})),window.addEventListener("keyup",(function(){console.log("keyup")})),window.addEventListener("keydown",(function(){console.log("keydown")}))},f=function(){var t=(0,o.Z)(c().mark((function t(){return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e=void 0,d({data:{links:[{left:!1,right:!0,source:(e=[{id:"A",reflexive:!1},{id:"B",reflexive:!1},{id:"C",reflexive:!1}])[0],target:e[1]},{left:!1,right:!0,source:e[1],target:e[2]}],nodes:e},rootElId:"chart"});case 2:case"end":return t.stop()}var e}),t)})));return function(){return t.apply(this,arguments)}}(),v=function(t){var e=t.pageContext.demoInfo;return r.createElement(a.Z,{demoInfo:e,main:f,scripts:["/vendors/d3/d3.min.js"]},r.createElement("div",{id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-vectors-tsx-29cf61d7381440c25344.js.map