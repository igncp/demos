(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[923],{2137:function(t,r,e){"use strict";function n(t,r,e,n,a,i,o){try{var d=t[i](o),u=d.value}catch(s){return void e(s)}d.done?r(u):Promise.resolve(u).then(n,a)}function a(t){return function(){var r=this,e=arguments;return new Promise((function(a,i){var o=t.apply(r,e);function d(t){n(o,a,i,d,u,"next",t)}function u(t){n(o,a,i,d,u,"throw",t)}d(void 0)}))}}e.d(r,{Z:function(){return a}})},1412:function(t,r,e){"use strict";e.r(r),e.d(r,{default:function(){return y}});var n=e(7294),a=e(4275),i=e(2137),o=e(7757),d=e.n(o),u=e(7723),s="chord-module--chord--1Zjd0",c="chord-module--group--309FH",l=function(){var t=(0,i.Z)(d().mark((function t(){var r,e,n,a,i,o,s,c;return d().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,u.gyn)("/demos/data/d3js/chord/data.csv");case 2:return r=t.sent,e=[],n={},a=[],i=[],o=0,s=function(t){return t in n||(n[t]={id:o++,name:t}),n[t]},c=r.map((function(t){return Object.assign({},t,{creditor:s(t.creditor),debtor:Object.assign({},s(t.debtor),{risk:t.risk})})})),Array.from({length:o}).forEach((function(t,r){a[r]=[],i[r]=[],Array.from({length:o}).forEach((function(t,e){a[r][e]=null,i[r][e]=null}))})),c.forEach((function(t){a[t.creditor.id][t.debtor.id]=t,i[t.debtor.id][t.creditor.id]=t,e[t.creditor.id]=t.creditor,e[t.debtor.id]=t.debtor})),t.abrupt("return",{credits:i,debits:a,fullList:e});case 13:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),f=function(t,r,e,n){var a=t.append("defs").append("filter").attr("id","drop-shadow-"+r);a.append("feOffset").attr("dx",.5).attr("dy",.5).attr("in","SourceGraphic").attr("result","offOut"),a.append("feGaussianBlur").attr("in","offOut").attr("result","blurOut").attr("stdDeviation",e),a.append("feBlend").attr("in","SourceGraphic").attr("in2","blurOut").attr("mode","normal"),a.append("feComponentTransfer").append("feFuncA").attr("slope",n).attr("type","linear")},p=["#39B347","#C92E47","#DB704D","#FFA22C","#5E92AA","#F8EDD3"],h=20,v=50,g=500,m=function(t){var r=t.data,e=t.rootElId,n=document.getElementById(e);n.classList.add("chord-module--chordChart--lzAYO");var a=n.getBoundingClientRect().width/2-20,i=Math.min(a,g)/2-4,o=i-20,d=(0,u.WUZ)(",.3r"),l=(0,u.Nb1)().innerRadius(o).outerRadius(i),m=(0,u.Ys)("#"+e),x=r.credits,y=r.debits,b=r.fullList,w=m.selectAll("div").data([y,x]).enter().append("div").style("display","inline-block").style("width",a+"px").style("height",g+v+h+"px").append("svg:svg").attr("width",a).attr("height",g+v+h).append("svg:g").attr("transform","translate("+a/2+","+(250+v)+")"),k=w.filter((function(t,r){return 0===r})),C=w.filter((function(t,r){return 1===r})),A=function(t,r){return t.append("text").text(r).attr("transform","translate(0,-260)").attr("class","chord-module--chartTitle--33urD").attr("text-anchor","middle")};A(k,"Debits"),A(C,"Credits"),f(w,"chords",2,.4),f(w,"headings",3,.5);var B=(0,u.BYU)().domain((0,u.Wem)([0,b.length-1])).range([0,1]),E=(0,u.BYU)().domain((0,u.w6H)(0,1,1/p.length)).range(p),O=function(t){return E(B(t))};w.each((function(t,r){var e=(0,u.Ys)(this),n=t.map((function(t){return t.map((function(t){return t?+t.amount:0}))})),a=(0,u.fFo)().sortGroups(u.$1i).sortSubgroups(u.$1i).sortChords(u.$1i)(n),i=(0,u.N22)().radius(o);e.selectAll("path."+s).data(a).enter().append("svg:path").attr("class",s).style("fill",(function(t){return O(t.target.index)})).style("filter","url(#drop-shadow-chords)").style("stroke",(function(t){var r=O(t.target.index);return(0,u.B8C)(r).darker().formatHex()})).style("stroke-width",2).attr("d",i).append("svg:title").text((function(t){var r=b[t.source.index],e=b[t.target.index];return r.name+" owes "+e.name+" $"+d(t.source.value)+"B."}));var f=e.selectAll("g."+c).data(a.groups).enter().append("svg:g").attr("class",c);f.append("svg:path").style("fill",(function(t){return O(t.index)})).attr("id",(function(t){return"group"+t.index+"-"+r})).attr("d",l).style("filter",(function(){return"url(#drop-shadow-headings)"})).append("svg:title").text((function(t){return b[t.index].name+" "+(r?"owes":"is owed")+" $"+d(t.value)+"B."})),f.append("svg:text").attr("x",6).attr("dy",15).filter((function(t){return t.value>150})).append("svg:textPath").attr("xlink:href",(function(t){return"#group"+t.index+"-"+r})).text((function(t){return b[t.index].name})).attr("class","chord-module--headingTitle--A2lxW")}))},x=function(){var t=(0,i.Z)(d().mark((function t(){var r;return d().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,l();case 2:r=t.sent,m({data:r,rootElId:"chart"});case 4:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),y=function(t){var r=t.pageContext;return n.createElement(a.Z,{main:x,pageContext:r},n.createElement("div",{id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-chord-tsx-8a6f4e66b30d7310501d.js.map