(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[902],{7858:function(t,e,r){"use strict";r.r(e),r.d(e,{default:function(){return u}});var n=r(7294),a=r(4275),o=r(2245),i="vectors-module--link--gZdMO",l=5,c=.5,d=function(t){var e=t.data,r=t.rootElId,n=e.links,a=e.nodes,d=document.getElementById(r);d.classList.add("vectors-module--vectorsChart--2a3f-");var s=d.getBoundingClientRect().width,u="C".charCodeAt(0),f=null,v=null,g=null,p=(0,o.A4v)(a).force("charge",(0,o.q5i)().strength(-50)).force("center",(0,o.wqt)(s/2,300)).force("link",(0,o.Fsl)().links(n).distance(100)).on("tick",(function(){h(),x()})),m=(0,o.Ys)("#"+r).append("svg").attr("width",s).attr("height",600);!function(t){t.append("svg:defs").append("svg:marker").attr("id","end-arrow").attr("viewBox","0 -5 10 10").attr("refX",6).attr("markerWidth",3).attr("markerHeight",3).attr("orient","auto").append("svg:path").attr("d","M0,-5L10,0L0,5").attr("fill","#000"),t.append("svg:defs").append("svg:marker").attr("id","start-arrow").attr("viewBox","0 -5 10 10").attr("refX",4).attr("markerWidth",3).attr("markerHeight",3).attr("orient","auto").append("svg:path").attr("d","M10,-5L0,0L10,5").attr("fill","#000")}(m),m.selectAll("."+i).data(n).enter().append("svg:path").attr("class",i).attr("marker-end","url(#end)").attr("id",(function(t,e){return"link-"+e}));var h=function(){var t=m.selectAll("."+i).data(n);t.enter().append("path").merge(t).attr("d",(function(t){var e=t.target.x-t.source.x,r=t.target.y-t.source.y,n=Math.sqrt(e*e+r*r),a=e/n,o=r/n,i=t.left?17:12,l=t.right?17:12;return"M"+(t.source.x+i*a)+","+(t.source.y+i*o)+"L"+(t.target.x-l*a)+","+(t.target.y-l*o)})).attr("class",i+" vectors-module--dragline--3KmwN"),t.exit().remove()},x=function(){var t=m.selectAll("circle").data(a),e=m.selectAll("text").data(a);t.enter().append("circle").merge(t).attr("cx",(function(t){return t.x})).attr("cy",(function(t){return t.y})).attr("r",(function(){return l})).attr("fill","#fff").each((function(){(0,o.Ys)(this).on("mouseover",(function(t,e){(0,o.Ys)("#node-text-"+e.index).style("opacity",1)})).on("mouseleave",(function(t,e){(0,o.Ys)("#node-text-"+e.index).style("opacity",c)}))})).call((0,o.ohM)().on("start",y).on("drag",k).on("end",w)),e.enter().append("text").merge(e).text((function(t){return t.id})).attr("x",(function(t){return t.x})).attr("y",(function(t){return t.y})).attr("class","vectors-module--id--12nlj"),t.exit().remove(),e.exit().remove()},y=function(t,e){t.active||p.alphaTarget(.3).restart(),e.fx=e.x,e.fy=e.y},k=function(t,e){e.fx=t.x,e.fy=t.y},w=function(t,e){t.active||p.alphaTarget(0),e.fx=null,e.fy=null};m.on("mousedown",(function(t){if(m.classed("vectors-module--active--Oo1QL",!0),!(t.ctrlKey||v||f)){var e=t.target.getBoundingClientRect(),r=t.clientX-e.left,n=t.clientY-e.top,o={id:String.fromCharCode(++u),index:a.length,reflexive:!1,vx:0,vy:0,x:r,y:n};a.push(o),p.nodes(a),p.alpha(.5).restart()}})).on("mousemove",(function(){console.log("mousemoveSVG")})).on("mouseup",(function(){console.log("mouseupSVG",g),v=null,g=null,f=null})),window.addEventListener("keyup",(function(){console.log("keyup")})),window.addEventListener("keydown",(function(){console.log("keydown")}))},s=function(){var t,e={links:[{left:!1,right:!0,source:(t=[{id:"A",reflexive:!1},{id:"B",reflexive:!1},{id:"C",reflexive:!1}])[0],target:t[1]},{left:!1,right:!0,source:t[1],target:t[2]}],nodes:t};return d({data:e,rootElId:"chart"}),Promise.resolve()},u=function(t){var e=t.pageContext;return n.createElement(a.Z,{main:s,pageContext:e,scripts:["/vendors/d3/d3.min.js"]},n.createElement("div",{id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-vectors-tsx-30979c4fd0729e65d64c.js.map