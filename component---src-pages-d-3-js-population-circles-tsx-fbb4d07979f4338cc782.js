(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[147],{7102:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return w}});var a=n(7294),r=n(4275),o=n(2137),i=n(7757),l=n.n(i),u=n(7723),s=n(581),c=n(7956),p=n(3873),m=n.n(p),d="population-circles-module--slider--3hzyU",f="population-circles-module--circle--Q63YD",g="dropShadowBase",v=0,h=70,x=400,y=function(e){var t=document.getElementById(e.rootElId).getBoundingClientRect().width,n={k:1,x:0,y:0},a=(0,u.PKp)().domain(e.colorDomain).range(u.UCG),r=(0,u.sPX)().extent([[0,0],[t/2,200]]).on("end",(function(e){var t=(0,u.Ys)(this).transition().duration(150),a=e.transform,r=a.x,o=a.y,i=e.transform.k;i!==n.k&&(r=n.x,o=n.y),t.attr("transform","translate("+r+", "+o+") scale("+i+")"),n.k=i,n.x=r,n.y=o})),o=(0,u.Ys)("#"+e.rootElId).append("svg").attr("viewBox",[0,0,t,x+h].join(", ")).attr("font-size",10).attr("font-family","sans-serif").attr("text-anchor","middle").call(r);I(o,g,.5,2);var i=o.append("text").attr("class","population-circles-module--header--1mim1").text("").attr("transform","translate("+t/2+", 50)"),l=o.append("g").attr("transform","translate("+v+", "+h+")"),s=function(){var n=e.getChartItems(),r={},o=(0,u.bT9)(Object.assign({},e.getEmptyItem(),{children:n})).sum(e.getItemMetric),s=e.getIsSmall(),p=(0,u.P2p)().size(s?[t/2,200]:[t,x]).padding(3)(o).leaves();i.text(e.getHeaderText({chartItems:n}));var d=function(t){return e.getItemId(t.data)},g=l.selectAll(".leaf").data(p,d);g.exit().remove();var v=function(t){return e.getItemTitle({itemData:t.data})};g.attr("title",v).transition().duration(1e3).ease(u.sq$).attr("transform",(function(e){return s?"translate("+(e.x+t/4)+","+(e.y+100)+")":"translate("+(e.x+1)+","+(e.y+1)+")"}));var h=g.enter().append("g").attr("class","leaf").attr("title",v).attr("transform",(function(e){return"translate("+(e.x+1)+","+(e.y+1)+")"})).on("mouseenter",(function(t,n){var a=(0,u.Ys)(this).select("."+f);(0,u.Ys)(this).select(".letter").attr("filter","url(#dropShadowBase)");var o=e.getItemId(n.data),i=(0,c.Z)({complete:function(){r[o]=null},strokeWidth:"5px",targets:[a.node()]});r[o]=i})).on("mouseleave",(function(t,n){var a=(0,u.Ys)(this).select("."+f);(0,u.Ys)(this).select(".letter").attr("filter",null);var o=e.getItemId(n.data),i=r[o];i&&(i.seek(0),c.Z.remove(a.node()),r[o]=null),(0,c.Z)({strokeWidth:"0px",targets:[a.node()]})})).on("click",(function(t,n){e.onClick(n.data)})),y=function(t){return a(e.getStringForColor(t.data))},I=function(e){var t=y(e);return m()(t).darken(1.5).hex()},k=function(t){t.text((function(t){return e.getItemLabel(t.data)})).style("font-size",(function(e){return e.r.toFixed(0)+"px"})).attr("dy",(function(e){return e.r/3})).attr("fill",I)},T=function(e){e.attr("r",(function(e){return e.r})).attr("fill",y).attr("stroke",I)};T(h.append("circle").attr("class",f)),k(h.append("text").attr("class","letter"));var E=function(e){return e},C=g.selectAll("."+f).data(E,d),R=g.selectAll(".letter").data(E,d);T(C.transition().duration(1e3).ease(u.vaZ)),k(R.transition().duration(1e3).ease(u.vaZ)),$(".leaf").tooltip({track:!0})};return s(),{updateChart:s}},I=function(e,t,n,a){e.append("filter").html('\n<filter id="'+t+'" height="130%">\n  <feGaussianBlur in="SourceAlpha" stdDeviation="'+a+'"/>\n  <feOffset dx="2" dy="2" result="offsetblur"/>\n  <feComponentTransfer>\n    <feFuncA type="linear" slope="'+n+'"/>\n  </feComponentTransfer>\n  <feMerge>\n    <feMergeNode/>\n    <feMergeNode in="SourceGraphic"/>\n  </feMerge>\n</filter>\n')},k=n(2203),T=function(e){return Number(e.toFixed(0)).toLocaleString(void 0,{maximumFractionDigits:0,minimumFractionDigits:0})},E={females:"females",males:"males",total:"people"},C=function(e){return new Date(e).getFullYear()},R=function(e,t){return{colorDomain:e.map((function(e){return e.name})),getChartItems:function(){var n=t.populationRange,a=t.populationType,r=t.timeRangeIndex,o=e.filter((function(e){return!!e.values[a][r]})),i=o.map((function(e){return e.values[a][r].count})),l=i.reduce((function(e,t,n){var a;return e[t]=null!==(a=e[t])&&void 0!==a?a:[],e[t].push(n),e}),{}),u=i.sort((function(e,t){return e-t})),s=u.reduce((function(e,t,n){var a=n/u.length;return l[t].forEach((function(t){e[t]=a})),e}),[]);return o.filter((function(e,t){var a=s[t];return"number"==typeof a&&a>=n[0]&&a<=n[1]}))},getEmptyItem:function(){return{name:"",values:{females:[],males:[],total:[]}}},getHeaderText:function(e){var n=e.chartItems,a=n[0].values[t.populationType][t.timeRangeIndex].date,r=C(a),o=n.reduce((function(e,n){return e+n.values[t.populationType][t.timeRangeIndex].count}),0),i=T(o)+" "+E[t.populationType],l=n.filter((function(e){return e.values[t.populationType].length>=t.timeRangeIndex+1})).length;return"Population in Malaga: "+r+" - "+i+(0===t.populationRange[0]&&1===t.populationRange[1]?"":" - From "+(100*t.populationRange[0]).toFixed(0)+" percentile to "+(100*t.populationRange[1]).toFixed(0)+" percentile")+" - "+l+" municipalities"},getIsSmall:function(){return"total"!==t.populationType},getItemId:function(e){return e.name},getItemLabel:function(e){return e.name[0]},getItemMetric:function(e){if(!e.values)return 1;var n=e.values[t.populationType][t.timeRangeIndex];return n?n.count:0},getItemTitle:function(e){var n=e.itemData,a=n.values[t.populationType][t.timeRangeIndex];if(!a)return"";var r=E[t.populationType];return n.name+" - "+T(a.count)+" "+r+" - "+C(a.date)},getStringForColor:function(e){return e.name},onClick:function(e){s.Z.isPressed("control")&&window.open("https://www.google.com/search?"+k.stringify({q:"Malaga "+e.name}))},rootElId:"chart"}},b=function(){var e=(0,o.Z)(l().mark((function e(){var t,n,a,r,o,i;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return(0,s.Z)("control",(function(){})),e.next=3,(0,u.AVB)("/demos/data/d3js/population-circles/data.json");case 3:t=e.sent,a=R(t,n={populationRange:[0,1],populationType:"total",timeRangeIndex:0}),r=y(a),o=r.updateChart,(0,u.Ys)("form").on("change",(function(e){n.populationType=e.target.value,o()})),$(".population-slider").slider({change:function(e,t){var a=t.values.map((function(e){return e/100}));n.populationRange=a,o()},range:!0,values:[0,100]}),i=t[0].values.total.length-1,$(".time-slider").slider({change:function(e,t){var a=t.value;n.timeRangeIndex=a,o()},max:i,min:0,value:0});case 11:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),w=function(e){var t=e.pageContext;return a.createElement(r.Z,{links:["/vendors/jquery-ui/themes/base/jquery-ui.min.css"],main:b,pageContext:t,scripts:["/vendors/jquery-ui/jquery-ui.min.js"]},a.createElement("form",null,[{id:"total",label:"Total"},{id:"males",label:"Males"},{id:"females",label:"Females"}].map((function(e,t){var n=e.id,r=e.label;return a.createElement("div",{className:"population-circles-module--radio--1S8Dr",key:n},a.createElement("input",{defaultChecked:0===t,id:n,name:"type",type:"radio",value:n}),a.createElement("label",{htmlFor:n},r))}))),a.createElement("div",{className:d},a.createElement("p",null,"Time"),a.createElement("div",{className:"time-slider"})),a.createElement("div",{className:d},a.createElement("p",null,"Population Percentile"),a.createElement("div",{className:"population-slider"})),a.createElement("div",{id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-population-circles-tsx-fbb4d07979f4338cc782.js.map