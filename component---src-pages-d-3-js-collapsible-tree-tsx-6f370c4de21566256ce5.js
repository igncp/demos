(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[692],{2137:function(t,r,n){"use strict";function a(t,r,n,a,e,o,i){try{var c=t[o](i),d=c.value}catch(u){return void n(u)}c.done?r(d):Promise.resolve(d).then(a,e)}function e(t){return function(){var r=this,n=arguments;return new Promise((function(e,o){var i=t.apply(r,n);function c(t){a(i,e,o,c,d,"next",t)}function d(t){a(i,e,o,c,d,"throw",t)}c(void 0)}))}}n.d(r,{Z:function(){return e}})},3421:function(t,r,n){"use strict";n.r(r),n.d(r,{default:function(){return m}});var a=n(7294),e=n(4275),o=n(2137),i=n(7757),c=n.n(i),d=n(7723),u=function(){var t=(0,o.Z)(c().mark((function t(){return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,d.AVB)("/demos/data/d3js/collapsible-tree/data.json"));case 1:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),s=20,l=120,f=120,p=20,h=750,v=800-p-s,x=function(t){var r=t.rootData,n=t.rootElId,a=(0,d.bT9)(r),e=document.getElementById(n);e.classList.add("collapsible-tree-module--collapsibleTreeChart--39sg1");var o=e.getBoundingClientRect().width-f-l;a.data.x0=v/2,a.data.y0=0;var i=(0,d.G_s)().nodeSize([20,100]),c=i(a);c.descendants().forEach((function(){for(var t=arguments.length,r=new Array(t),n=0;n<t;n++)r[n]=arguments[n];var a=r[0],e=r[1];a.data.id=e,a.data._children=a.children,a.depth&&(a.children=void 0)}));var u=(0,d.h5h)().x((function(t){return t.y})).y((function(t){return t.x})),x=(0,d.Ys)("#"+n).append("svg").attr("width",o+f+l).attr("height",v+p+s).append("g").attr("transform","translate("+l+","+v/2+")"),y=x.append("g").attr("fill","none").attr("stroke","#555").attr("stroke-opacity",.4).attr("stroke-width",1.5),m=x.append("g").attr("cursor","pointer").attr("pointer-events","all");!function t(r){var n=c.descendants().reverse(),e=c.links();i(a);var o=a,d=a;a.eachBefore((function(t){t.data.x<o.data.x&&(o=t),t.data.x>d.data.x&&(d=t)}));var s=m.selectAll("g").data(n,(function(t){return t.data.id})),l=s.enter().append("g").attr("transform",(function(){return"translate("+r.data.y0+","+r.data.x0+")"})).attr("fill-opacity",0).attr("stroke-opacity",0).on("click",(function(){for(var r=arguments.length,n=new Array(r),a=0;a<r;a++)n[a]=arguments[a];var e=n[1];e.children=e.children?void 0:e.data._children,t(e)}));l.append("circle").attr("r",2.5).attr("fill",(function(t){return t.data._children?"#555":"#999"})).attr("stroke-width",10),l.append("text").attr("dy","0.31em").attr("x",(function(t){return t.data._children?-6:6})).attr("text-anchor",(function(t){return t.data._children?"end":"start"})).text((function(t){return t.data.name})).clone(!0).lower().attr("stroke-linejoin","round").attr("stroke-width",3).attr("stroke","white"),s.merge(l).transition().duration(h).attr("transform",(function(t){return"translate("+t.y+","+t.x+")"})).attr("fill-opacity",1).attr("stroke-opacity",1),s.exit().transition().duration(h).remove().attr("transform",(function(){return"translate("+r.y+","+r.x+")"})).attr("fill-opacity",0).attr("stroke-opacity",0);var f=y.selectAll("path").data(e,(function(t){return t.target.data.id})),p=f.enter().append("path").attr("d",(function(){var t={x:r.data.x0,y:r.data.y0};return u({source:t,target:t})}));f.merge(p).transition().duration(h).attr("d",u),f.exit().transition().duration(h).remove().attr("d",(function(){var t={x:r.x,y:r.y};return u({source:t,target:t})})),c.eachBefore((function(t){t.data.x0=t.x,t.data.y0=t.y}))}(c)},y=function(){var t=(0,o.Z)(c().mark((function t(){var r,n;return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r="chart",t.next=3,u();case 3:n=t.sent,x({rootData:n,rootElId:r});case 5:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),m=function(t){var r=t.pageContext;return a.createElement(e.Z,{main:y,pageContext:r},a.createElement("div",{id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-collapsible-tree-tsx-6f370c4de21566256ce5.js.map