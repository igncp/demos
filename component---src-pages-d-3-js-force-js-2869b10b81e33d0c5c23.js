(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[955],{8640:function(t,r,e){"use strict";e.r(r),e.d(r,{default:function(){return c}});var n=e(7294),a=e(7538),s=function(){var t={};return async.parallel([function(r){return d3.json("/data/d3js/force/nodes.json",(function(e,n){return t.nodes=n,r()}))},function(r){return d3.json("/data/d3js/force/links.json",(function(e,n){return t.links=n,r()}))}],(function(){var r=t.links.filter((function(t){return t.source!==t.target})),e=t.nodes,n=$("#chart").innerWidth(),a=d3.layout.force().nodes(e).links(r).size([n,600]).linkDistance(60).charge(-400).linkStrength((function(t){return t.strength})).on("tick",(function(){return c.attr("d",(function(t){var r=t.target.x-t.source.x,e=t.target.y-t.source.y,n=Math.sqrt(r*r+e*e);return"M"+t.source.x+","+t.source.y+"A"+n+","+n+" 0 0,1 "+t.target.x+","+t.target.y})),o.attr("x",(function(t){var r=t.target.x-t.source.x;return t.source.y<t.target.y?t.source.x+.3*r+15:t.source.x+.3*r-15})).attr("y",(function(t){var r=t.target.y-t.source.y;return t.source.y+.3*r})).attr("text-anchor",(function(t){return t.source.y<t.target.y?"beginning":"end"})),u.attr("transform",(function(t){return"translate("+t.x+","+t.y+")"}))})).start(),s=d3.select("#chart").append("svg").attr("width",n).attr("height",600);s.append("svg:defs").selectAll("marker").data(["end"]).enter().append("svg:marker").attr("id",String).attr("viewBox","0 -5 10 10").attr("refX",15).attr("refY",-1.5).attr("markerWidth",6).attr("markerHeight",6).attr("orient","auto").append("svg:path").attr("d","M0,-5L10,0L0,5");var c=(r=s.selectAll(".link").data(a.links()).enter().append("g").attr("class","link")).append("svg:path").attr("class","link").attr("marker-end","url(#end)"),o=r.append("text").text((function(t){return t.name})),u=s.selectAll(".node").data(a.nodes()).enter().append("g").attr("class","node").call(a.drag);return u.append("circle").attr("r",5),u.append("text").attr("x",12).attr("dy",".35em").text((function(t){return t.name}))}))},c=function(t){var r=t.pageContext.demoInfo;return n.createElement(a.Z,{demoInfo:r,main:s,scripts:["/vendors/d3/d3.min.js"]},n.createElement("div",{className:"force-chart",id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-force-js-2869b10b81e33d0c5c23.js.map