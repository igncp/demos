(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[105],{3398:function(t,r,e){"use strict";var a="undefined"==typeof window?null:e(3793);r.Z=a},8400:function(t,r,e){"use strict";e.r(r),e.d(r,{default:function(){return l}});var a=e(7294),n=e(4275),i=e(3398);function c(t){var r=t.angle,e=t.endX,a=t.endY,n=t.radius1,i=t.radius2,c=t.startX,s=t.startY,o=[n,i,r,0,1,e,a].join(" ");return this.path("M"+c+" "+s+" a "+o)}function s(t){var r=t.centerX,e=t.centerY,a=t.endAngle,n=t.radius,i=t.startAngle,c=r+n*Math.cos(i*Math.PI/180),s=e+n*Math.sin(i*Math.PI/180),o=r+n*Math.cos(a*Math.PI/180),u=e+n*Math.sin(a*Math.PI/180);return this.arc({angle:0,endX:o-c,endY:u-s,radius1:n,radius2:n,startX:c,startY:s})}var o=function(t){var r=t.arcI,e=t.fill,a=t.paper,n=t.stroke,i=a.width/(4+r)+2,c=a.circularArc({centerX:i+30+Math.pow(r,1.5),centerY:a.height-(100-2*r),endAngle:0,radius:a.width/(4+r),startAngle:180});c.attr("fill",e).attr("fill-opacity",.2).attr("stroke",n).attr("stroke-width",3),c.hover((function(){this.attr("fill-opacity",.3),this.animate({"stroke-width":7.5},500,"bounce")}),(function(){this.attr("fill-opacity",.2),this.animate({"stroke-width":3},500,"bounce")}))},u=function(){var t="chart",r=document.getElementById(t);r.classList.add("circular-arcs-module--circularArcsChart--6jEV-");var e=r.getBoundingClientRect().width;i.Z.fn.circularArc=s,i.Z.fn.arc=c;for(var a=(0,i.Z)(t,e,500),n=0;n<=50;++n)o({arcI:n,fill:"#85D588",paper:a,stroke:"#558857"});return Promise.resolve()},l=function(t){var r=t.pageContext;return a.createElement(n.Z,{main:u,pageContext:r},a.createElement("div",{id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-raphael-circular-arcs-tsx-0010b37f2edfff493f7a.js.map