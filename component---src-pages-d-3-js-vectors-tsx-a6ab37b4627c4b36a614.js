"use strict";(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[902],{7858:function(t,e,r){r.r(e),r.d(e,{default:function(){return f}});var n=r(7294),a=r(4275),o=r(5221),i="vectors-module--link--0218a",c="chart",l=5,s=.5,d=function(t){var e=t.rootElId,r=t.vectorsData,n=r.links,a=r.nodes,c=document.getElementById(e);c.classList.add("vectors-module--vectorsChart--beff0");var d=c.getBoundingClientRect().width,u=(0,o.Ys)("#"+e).append("svg").attr("width",d).attr("height",600);!function(t){t.append("svg:defs").append("svg:marker").attr("id","end-arrow").attr("viewBox","0 -5 10 10").attr("refX",6).attr("markerWidth",3).attr("markerHeight",3).attr("orient","auto").append("svg:path").attr("d","M0,-5L10,0L0,5").attr("fill","#000"),t.append("svg:defs").append("svg:marker").attr("id","start-arrow").attr("viewBox","0 -5 10 10").attr("refX",4).attr("markerWidth",3).attr("markerHeight",3).attr("orient","auto").append("svg:path").attr("d","M10,-5L0,0L10,5").attr("fill","#000")}(u);var f="C".charCodeAt(0),v=(0,o.A4v)(a).force("charge",(0,o.q5i)().strength(-50)).force("center",(0,o.wqt)(d/2,300)).force("link",(0,o.Fsl)().links(n).distance(100)).on("tick",(function(){var t;(t=u.selectAll("."+i).data(n)).enter().append("path").merge(t).attr("d",(function(t){var e=t.target.x-t.source.x,r=t.target.y-t.source.y,n=Math.sqrt(e*e+r*r),a=e/n,o=r/n,i=t.left?17:12,c=t.right?17:12;return"M"+(t.source.x+i*a)+","+(t.source.y+i*o)+"L"+(t.target.x-c*a)+","+(t.target.y-c*o)})).attr("class",i+" vectors-module--dragline--4a4bc"),t.exit().remove(),m()})),g=function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[0],a=e[1];n.active||v.alphaTarget(.3).restart(),a.fx=a.x,a.fy=a.y},p=function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[0],a=e[1];a.fx=n.x,a.fy=n.y},h=function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[0],a=e[1];n.active||v.alphaTarget(0),a.fx=null,a.fy=null},m=function(){var t=u.selectAll("circle").data(a),e=u.selectAll("text").data(a);t.enter().append("circle").merge(t).attr("cx",(function(t){return t.x})).attr("cy",(function(t){return t.y})).attr("r",(function(){return l})).attr("fill","#fff").each((function(){(0,o.Ys)(this).on("mouseover",(function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[1];(0,o.Ys)("#node-text-"+n.index).style("opacity",1)})).on("mouseleave",(function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[1];(0,o.Ys)("#node-text-"+n.index).style("opacity",s)}))})).call((0,o.ohM)().on("start",g).on("drag",p).on("end",h)),e.enter().append("text").merge(e).text((function(t){return t.id})).attr("x",(function(t){return t.x})).attr("y",(function(t){return t.y})).attr("class","vectors-module--id--53fe7"),t.exit().remove(),e.exit().remove()};u.selectAll("."+i).data(n).enter().append("svg:path").attr("class",i).attr("marker-end","url(#end)").attr("id",(function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e[1];return"link-"+n}));u.on("mousedown",(function(t){if(u.classed("vectors-module--active--1831f",!0),!t.ctrlKey){var e=t.target.getBoundingClientRect(),r=t.clientX-e.left,n=t.clientY-e.top;f+=1;var o={id:String.fromCharCode(f),index:a.length,reflexive:!1,vx:0,vy:0,x:r,y:n};a.push(o),v.nodes(a),v.alpha(.5).restart()}})).on("mousemove",(function(){console.log("mousemoveSVG")})).on("mouseup",(function(){})),window.addEventListener("keyup",(function(){console.log("keyup")})),window.addEventListener("keydown",(function(){console.log("keydown")}))},u=function(){var t,e={links:[{left:!1,right:!0,source:(t=[{id:"A",reflexive:!1},{id:"B",reflexive:!1},{id:"C",reflexive:!1}])[0],target:t[1]},{left:!1,right:!0,source:t[1],target:t[2]}],nodes:t};return d({rootElId:c,vectorsData:e}),Promise.resolve()},f=function(t){var e=t.pageContext;return n.createElement(a.Z,{main:u,pageContext:e},n.createElement("div",{id:c}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-vectors-tsx-a6ab37b4627c4b36a614.js.map