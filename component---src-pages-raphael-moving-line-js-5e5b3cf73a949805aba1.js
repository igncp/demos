(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[619],{6220:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return f}});var a=n(7294),r=n(7538),o="undefined"==typeof window?null:n(3793),i=function(){$.ajax("/demos/data/raphael/moving-line/data.json").done((function(e){var t=function(){return e.current<e.charts.length-1?e.current++:e.current=1,a(e,e.charts[e.current])},n=function(e){for(var t=e.charts[0].points,n=0,a=t.length;n<a;){var r=e.xOffset+n*e.xDelta,o=e.yOffset,i=e.paper.circle(r,o,6);i.node.className.baseVal="point",i.attr("title","Value: 0"),t[n].point=i,n++}},a=function(e,t){for(var n="",a=parseInt(t.upper)||1,r=parseInt(t.lower)||0,o=e.yOffset/(a-r),i=e.charts[0].points,f=0,s=i.length;f<s;)0===f?(n+="M ",n+=e.xOffset+" ",n+=e.yOffset-(t.points[f].value-r)*o+" "):(n+="L ",n+=e.xOffset+f*e.xDelta+" ",n+=e.yOffset-(t.points[f].value-r)*o),i[f].point.animate({cy:e.yOffset-(t.points[f].value-r)*o},800,"ease-in-out"),i[f].point.node.childNodes[0].remove(),i[f].point.attr("title","Value: "+t.points[f].value),f++;return e.line.animate({path:n},800,"ease-in-out")},r=function(e){for(var t=e.charts[e.current].points,n="M "+e.xOffset+" "+(e.yOffset-t[0].value),a=0,r=t.length;a<r;)n+=" L ",n+=e.xOffset+a*e.xDelta+" ",n+=e.yOffset-t[a].value,a++;return n};!function(){var a=document.getElementById("chart").getBoundingClientRect().width,i=o("chart",a,300);e.paper=i;var f=r(e),s=i.path(f);e.line=s,n(e),setInterval(t,3e3)}()}))},f=function(e){var t=e.pageContext.demoInfo;return a.createElement(r.Z,{demoInfo:t,main:i},a.createElement("div",{className:"moving-line-chart",id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-raphael-moving-line-js-5e5b3cf73a949805aba1.js.map