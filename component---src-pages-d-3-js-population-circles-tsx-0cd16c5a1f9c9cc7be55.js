"use strict";(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[147],{5380:function(e,t,n){n.r(t),n.d(t,{default:function(){return Z}});var r=n(7294),a=n(6126),i=n(4275),o=n(8634),l=n(2656),u=n.n(l),s=n(1354),c=n(581),p=n(7956),m=n(3873),f=n.n(m),d="population-circles-module--radio--1S8Dr",g="population-circles-module--slider--3hzyU",v="population-circles-module--circle--Q63YD",h="dropShadowBase",y=0,x=70,I=400,w=function(e){var t=document.getElementById(e.rootElId).getBoundingClientRect().width,n={k:1,x:0,y:0};var r,a,i,o,l=(0,s.PKp)().domain(e.colorDomain).range(s.UCG),u=(0,s.sPX)().extent([[0,0],[t/2,200]]).on("end",(function(e){var t=(0,s.Ys)(this).transition().duration(150),r=e.transform,a=r.x,i=r.y,o=e.transform.k;o!==n.k&&(a=n.x,i=n.y),t.attr("transform","translate("+a+", "+i+") scale("+o+")"),n.k=o,n.x=a,n.y=i})),c=(0,s.Ys)("#"+e.rootElId).append("svg").attr("viewBox",[0,0,t,I+x].join(", ")).attr("font-size",10).attr("font-family","sans-serif").attr("text-anchor","middle").call(u);a=(r={deviation:2,name:h,slope:.5,svg:c}).deviation,i=r.name,o=r.slope,r.svg.append("filter").html('\n<filter id="'+i+'" height="130%">\n  <feGaussianBlur in="SourceAlpha" stdDeviation="'+a+'"/>\n  <feOffset dx="2" dy="2" result="offsetblur"/>\n  <feComponentTransfer>\n    <feFuncA type="linear" slope="'+o+'"/>\n  </feComponentTransfer>\n  <feMerge>\n    <feMergeNode/>\n    <feMergeNode in="SourceGraphic"/>\n  </feMerge>\n</filter>\n');var m=c.append("text").attr("class","population-circles-module--header--1mim1").text("").attr("transform","translate("+t/2+", 50)"),d=c.append("g").attr("transform","translate("+y+", "+x+")"),g=function(){var n=e.getChartItems(),r={},a=(0,s.bT9)(Object.assign({},e.getEmptyItem(),{children:n})).sum(e.getItemMetric),i=e.getIsSmall(),o=(0,s.P2p)().size(i?[t/2,200]:[t,I]).padding(3)(a).leaves();m.text(e.getHeaderText({chartItems:n}));var u=function(t){return e.getItemId(t.data)},c=d.selectAll(".leaf").data(o,u);c.exit().remove();var g=function(t){return e.getItemTitle({circleData:t.data})};c.attr("title",g).transition().duration(1e3).ease(s.sq$).attr("transform",(function(e){return i?"translate("+(e.x+t/4)+","+(e.y+100)+")":"translate("+(e.x+1)+","+(e.y+1)+")"}));var h=c.enter().append("g").attr("class","leaf").attr("title",g).attr("transform",(function(e){return"translate("+(e.x+1)+","+(e.y+1)+")"})).on("mouseenter",(function(){for(var t=arguments.length,n=new Array(t),a=0;a<t;a++)n[a]=arguments[a];var i=n[1],o=(0,s.Ys)(this).select("."+v);(0,s.Ys)(this).select(".letter").attr("filter","url(#dropShadowBase)");var l=e.getItemId(i.data),u=(0,p.Z)({complete:function(){r[l]=null},strokeWidth:"5px",targets:[o.node()]});r[l]=u})).on("mouseleave",(function(){for(var t=arguments.length,n=new Array(t),a=0;a<t;a++)n[a]=arguments[a];var i=n[1],o=(0,s.Ys)(this).select("."+v);(0,s.Ys)(this).select(".letter").attr("filter",null);var l=e.getItemId(i.data),u=r[l];u&&(u.seek(0),p.Z.remove(o.node()),r[l]=null),(0,p.Z)({strokeWidth:"0px",targets:[o.node()]})})).on("click",(function(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];var a=n[1];e.onClick(a.data)})),y=function(t){return l(e.getStringForColor(t.data))},x=function(e){var t=y(e);return f()(t).darken(1.5).hex()},w=function(t){t.text((function(t){return e.getItemLabel(t.data)})).style("font-size",(function(e){return e.r.toFixed(0)+"px"})).attr("dy",(function(e){return e.r/3})).attr("fill",x)},k=function(e){e.attr("r",(function(e){return e.r})).attr("fill",y).attr("stroke",x)};k(h.append("circle").attr("class",v)),w(h.append("text").attr("class","letter"));var T=function(e){return e},E=c.selectAll("."+v).data(T,u),C=c.selectAll(".letter").data(T,u);k(E.transition().duration(1e3).ease(s.vaZ)),w(C.transition().duration(1e3).ease(s.vaZ)),$(".leaf").tooltip({track:!0})};return g(),{updateChart:g}};function k(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}var T=n(2203),E=["values"],C="chart",b=function(){var e=(0,o.Z)(u().mark((function e(){var t;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,s.AVB)("/demos/data/d3js/population-circles/data.json");case 2:return t=e.sent,e.abrupt("return",t.map((function(e){var t=e.values,n=k(e,E);return Object.assign({},n,{metrics:t})})));case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),A=function(e){return Number(e.toFixed(0)).toLocaleString(void 0,{maximumFractionDigits:0,minimumFractionDigits:0})},R={females:"females",males:"males",total:"people"},F=function(e){return new Date(e).getFullYear()},S=function(e){var t=e.municipalities,n=e.state;return{colorDomain:t.map((function(e){return e.name})),getChartItems:function(){var e=n.populationRange,r=n.populationType,a=n.timeRangeIndex,i=t.filter((function(e){return!!e.metrics[r][a]})),o=i.map((function(e){return e.metrics[r][a].count})),l=o.reduce((function(){for(var e,t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];var a=n[0],i=n[1],o=n[2];return a[i]=null!==(e=a[o])&&void 0!==e?e:[],a[i].push(o),a}),{}),u=o.sort((function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var r=t[0],a=t[1];return r-a})),s=u.reduce((function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var r=t[0],a=t[1],i=t[2],o=i/u.length,s=l[a];return s.forEach((function(e){r[e]=o})),r}),[]);return i.filter((function(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];var a=n[1],i=s[a];return"number"==typeof i&&i>=e[0]&&i<=e[1]}))},getEmptyItem:function(){return{metrics:{females:[],males:[],total:[]},name:""}},getHeaderText:function(e){var t=e.chartItems,r=t[0].metrics[n.populationType][n.timeRangeIndex].date,a=F(r),i=t.reduce((function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var a=t[0],i=t[1];return a+i.metrics[n.populationType][n.timeRangeIndex].count}),0),o=A(i)+" "+R[n.populationType],l=t.filter((function(e){return e.metrics[n.populationType].length>=n.timeRangeIndex+1})).length;return"Population in Malaga: "+a+" - "+o+(0===n.populationRange[0]&&1===n.populationRange[1]?"":" - From "+(100*n.populationRange[0]).toFixed(0)+" percentile to "+(100*n.populationRange[1]).toFixed(0)+" percentile")+" - "+l+" municipalities"},getIsSmall:function(){return"total"!==n.populationType},getItemId:function(e){return e.name},getItemLabel:function(e){return e.name[0]},getItemMetric:function(e){if(!e.metrics)return 1;var t=e.metrics[n.populationType][n.timeRangeIndex];return t?t.count:0},getItemTitle:function(e){var t=e.circleData,r=t.metrics[n.populationType][n.timeRangeIndex];if(!r)return"";var a=R[n.populationType];return t.name+" - "+A(r.count)+" "+a+" - "+F(r.date)},getStringForColor:function(e){return e.name},onClick:function(e){c.Z.isPressed("control")&&window.open("https://www.google.com/search?"+T.stringify({q:"Malaga "+e.name}))},rootElId:C}},D=function(){var e=(0,o.Z)(u().mark((function e(){var t,n,r,a,i,o;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return(0,c.Z)("control",(function(){})),e.next=3,b();case 3:t=e.sent,r=S({municipalities:t,state:n={populationRange:[0,1],populationType:"total",timeRangeIndex:0}}),a=w(r),i=a.updateChart,(0,s.Ys)("form").on("change",(function(e){n.populationType=e.target.value,i()})),$(".population-slider").slider({change:function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var a=t[1].values,o=a.map((function(e){return e/100}));n.populationRange=o,i()},range:!0,values:[0,100]}),o=t[0].metrics.total.length-1,$(".time-slider").slider({change:function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var a=t[1].value;n.timeRangeIndex=a,i()},max:o,min:0,value:0});case 11:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),Y=D,Z=function(e){var t=e.pageContext;return r.createElement(i.Z,{links:[a.H.STYLE],main:Y,pageContext:t,scripts:[a.H.SCRIPT]},r.createElement("form",null,[{id:"total",label:"Total"},{id:"males",label:"Males"},{id:"females",label:"Females"}].map((function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var a=t[0],i=a.id,o=a.label,l=t[1];return r.createElement("div",{className:d,key:i},r.createElement("input",{defaultChecked:0===l,id:i,name:"type",type:"radio",value:i}),r.createElement("label",{htmlFor:i},o))}))),r.createElement("div",{className:g},r.createElement("p",null,"Time"),r.createElement("div",{className:"time-slider"})),r.createElement("div",{className:g},r.createElement("p",null,"Population Percentile"),r.createElement("div",{className:"population-slider"})),r.createElement("div",{id:C}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-population-circles-tsx-0cd16c5a1f9c9cc7be55.js.map