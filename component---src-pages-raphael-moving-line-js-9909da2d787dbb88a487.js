(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[619],{6220:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return o}});var a=n(7294),r=n(7538),s=function(){$.ajax("/data/raphael/moving-line/data.json").done((function(e){var t=function(){return e.current<e.charts.length-1?e.current++:e.current=1,a(e,e.charts[e.current])},n=function(e){for(var t=e.charts[0].points,n=0,a=t.length;n<a;){var r=e.xOffset+n*e.xDelta,s=e.yOffset,o=e.paper.circle(r,s,6);o.node.className.baseVal="point",o.attr({title:"Value: 0"}),t[n].point=o,n++}},a=function(e,t){for(var n="",a=parseInt(t.upper)||1,r=parseInt(t.lower)||0,s=e.yOffset/(a-r),o=e.charts[0].points,i=0,f=o.length;i<f;)0===i?(n+="M ",n+=e.xOffset+" ",n+=e.yOffset-(t.points[i].value-r)*s+" "):(n+="L ",n+=e.xOffset+i*e.xDelta+" ",n+=e.yOffset-(t.points[i].value-r)*s),o[i].point.animate({cy:e.yOffset-(t.points[i].value-r)*s},800,"ease-in-out"),o[i].point.node.childNodes[0].remove(),o[i].point.attr("title","Value: "+t.points[i].value),i++;return e.line.animate({path:n},800,"ease-in-out")},r=function(e){for(var t=e.charts[e.current].points,n="M "+e.xOffset+" "+(e.yOffset-t[0].value),a=0,r=t.length;a<r;)n+=" L ",n+=e.xOffset+a*e.xDelta+" ",n+=e.yOffset-t[a].value,a++;return n};!function(){var a=$("#chart").width(),s=Raphael("chart",a,300);e.paper=s;var o=r(e),i=s.path(o);e.line=i,n(e),setInterval(t,3e3)}()}))},o=function(e){var t=e.pageContext.demoInfo;return a.createElement(r.Z,{demoInfo:t,main:s,scripts:["/vendors/raphael/raphael-min.js"]},a.createElement("div",{className:"moving-line-chart",id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-raphael-moving-line-js-9909da2d787dbb88a487.js.map