(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[283],{409:function(t,e,r){"use strict";var a="undefined"==typeof window?null:r(3793);e.Z=a},4960:function(t,e,r){"use strict";r.r(e),r.d(e,{default:function(){return d}});var a=r(7294),n=r(7538),i=r(409);function c(t){var e=t.angle,r=t.endX,a=t.endY,n=t.radius1,i=t.radius2,c=t.startX,s=t.startY,o=[n,i,e,0,1,r,a].join(" ");return this.path("M"+c+" "+s+" a "+o)}function s(t){var e=t.centerX,r=t.centerY,a=t.radius,n=t.startAngle,i=t.endAngle,c=e+a*Math.cos(n*Math.PI/180),s=r+a*Math.sin(n*Math.PI/180),o=e+a*Math.cos(i*Math.PI/180),u=r+a*Math.sin(i*Math.PI/180);return this.arc({angle:0,endX:o-c,endY:u-s,radius1:a,radius2:a,startX:c,startY:s})}var o=function(t){var e=t.stroke,r=t.fill,a=t.arcI,n=t.paper,i=n.width/(4+a)+2,c=n.circularArc({centerX:i+30+Math.pow(a,1.5),centerY:n.height-(100-2*a),endAngle:0,radius:n.width/(4+a),startAngle:180});c.attr("fill",r).attr("fill-opacity",.2).attr("stroke",e).attr("stroke-width",3),c.hover((function(){this.attr("fill-opacity",.3),this.animate({"stroke-width":7.5},500,"bounce")}),(function(){this.attr("fill-opacity",.2),this.animate({"stroke-width":3},500,"bounce")}))},u=function(){var t="chart",e=document.getElementById(t).getBoundingClientRect().width;i.Z.fn.circularArc=s,i.Z.fn.arc=c;for(var r=(0,i.Z)(t,e,500),a=0;a<=50;++a)o({arcI:a,fill:"#85D588",paper:r,stroke:"#558857"})},d=function(t){var e=t.pageContext.demoInfo;return a.createElement(n.Z,{demoInfo:e,main:u},a.createElement("div",{className:"circular-arcs-chart",id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-raphael-circular-arcs-js-48acb0fb13cab7113854.js.map