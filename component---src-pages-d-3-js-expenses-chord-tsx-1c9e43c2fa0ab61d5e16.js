(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[907],{2137:function(t,e,n){"use strict";function r(t,e,n,r,o,a,i){try{var u=t[a](i),s=u.value}catch(c){return void n(c)}u.done?e(s):Promise.resolve(s).then(r,o)}function o(t){return function(){var e=this,n=arguments;return new Promise((function(o,a){var i=t.apply(e,n);function u(t){r(i,o,a,u,s,"next",t)}function s(t){r(i,o,a,u,s,"throw",t)}u(void 0)}))}}n.d(e,{Z:function(){return o}})},9646:function(t,e,n){"use strict";var r;n.d(e,{Z:function(){return m}});var o=new Uint8Array(16);function a(){if(!r&&!(r="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return r(o)}var i=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;for(var u=function(t){return"string"==typeof t&&i.test(t)},s=[],c=0;c<256;++c)s.push((c+256).toString(16).substr(1));var d,l,f=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=(s[t[e+0]]+s[t[e+1]]+s[t[e+2]]+s[t[e+3]]+"-"+s[t[e+4]]+s[t[e+5]]+"-"+s[t[e+6]]+s[t[e+7]]+"-"+s[t[e+8]]+s[t[e+9]]+"-"+s[t[e+10]]+s[t[e+11]]+s[t[e+12]]+s[t[e+13]]+s[t[e+14]]+s[t[e+15]]).toLowerCase();if(!u(n))throw TypeError("Stringified UUID is invalid");return n},p=0,g=0;var m=function(t,e,n){var r=e&&n||0,o=e||new Array(16),i=(t=t||{}).node||d,u=void 0!==t.clockseq?t.clockseq:l;if(null==i||null==u){var s=t.random||(t.rng||a)();null==i&&(i=d=[1|s[0],s[1],s[2],s[3],s[4],s[5]]),null==u&&(u=l=16383&(s[6]<<8|s[7]))}var c=void 0!==t.msecs?t.msecs:Date.now(),m=void 0!==t.nsecs?t.nsecs:g+1,v=c-p+(m-g)/1e4;if(v<0&&void 0===t.clockseq&&(u=u+1&16383),(v<0||c>p)&&void 0===t.nsecs&&(m=0),m>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");p=c,g=m,l=u;var h=(1e4*(268435455&(c+=122192928e5))+m)%4294967296;o[r++]=h>>>24&255,o[r++]=h>>>16&255,o[r++]=h>>>8&255,o[r++]=255&h;var x=c/4294967296*1e4&268435455;o[r++]=x>>>8&255,o[r++]=255&x,o[r++]=x>>>24&15|16,o[r++]=x>>>16&255,o[r++]=u>>>8|128,o[r++]=255&u;for(var y=0;y<6;++y)o[r+y]=i[y];return e||f(o)}},6564:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return k}});var r,o,a=n(7294),i=n(4275),u=n(2137),s=n(7757),c=n.n(s),d=n(7723),l=n(9646),f="expenses-chord-module--chordGroup--2xhSq",p="expenses-chord-module--groupText--2wIqW",g="expenses-chord-module--ribbon--28nns",m=800;!function(t){t.Source="source",t.Target="target"}(r||(r={})),function(t){t.Arrow="arrow",t.Common="common"}(o||(o={}));var v=1e3,h=500,x=d.XeF,y=function(t){(0,d.Ys)(this).transition().duration(h).attr("transform",t.transform)},b=function(t){var e=t.rootElId,n={lastFocused:null},a=t.chordGroupsIds,i=(0,d.PKp)(a,d.K2I),u=document.getElementById(e).getBoundingClientRect().width,s=.5*Math.min(u,m)-20,c=s+20,h=function(t){return t.radius(s-.5).padAngle(1/s)},b=h((0,d.tQZ)()),C=h((0,d.N22)()),A=(0,d.sPX)().extent([[0,0],[u/2,400]]).on("end",y),w=(0,d.Ys)("#"+e).attr("class","expenses-chord-module--chartWrapper--1V-_7").append("svg").attr("width",u).attr("height",850).append("g").attr("transform","translate("+u/2+", 425)").append("g").call(A).on("dblclick.zoom",null);w.append("rect").attr("fill","#fff").attr("width",u).attr("height",m).attr("transform","translate(-"+u/2+", -425)");var R=(0,l.Z)(),k=(0,d.rKe)().padAngle(12/s).sortSubgroups(d.$1i).sortChords(d.$1i);w.append("path").attr("fill","none").attr("id",R).attr("d",(0,d.Nb1)()({endAngle:2*Math.PI,innerRadius:0,outerRadius:c,startAngle:0}));var T=(0,d.Nb1)().innerRadius(s).outerRadius(c),E=w.append("g").attr("fill-opacity",.75),I=w.append("g").attr("font-family","sans-serif").attr("font-size",10),j=function(){var e=t.getRibbonType()===o.Common?C:b,u=t.getChordMatrix(),s=k(u),l=E.selectAll("."+g).data().reduce((function(t,e){return t[e.source.index+"_"+e.target.index]=e,t}),{}),m=function(e){return i(t.getRibbonGroupIdColor(a[e.source.index],a[e.target.index]))},h=E.selectAll("."+g).data(s,(function(t){return t.source.index+"_"+t.target.index})).join((function(t){return t.append("path").attr("class",g).attr("fill",m).transition().duration(v).attrTween("d",(function(t){var n={endAngle:0,startAngle:0},r={endAngle:0,startAngle:0},o=(0,d.sXR)(n,t.source),a=(0,d.sXR)(r,t.target);return function(t){var n={source:o(t),target:a(t)};return e(n)}}))}),(function(t){return t.transition().duration(v).attr("fill",m).attrTween("d",(function(t){var n=l[t.source.index+"_"+t.target.index];if(!n)return function(){return e(t)};var r=(0,d.sXR)(n.source,t.source),o=(0,d.sXR)(n.target,t.target);return function(t){var n={source:r(t),target:o(t)};return e(n)}})),t}));h.attr("title",(function(e){return t.getChordTitle(e.source.index,e.target.index,e.source.value,e.target.value)})).on("click",(function(t,e){var r=(0,d.Ys)(this),o=a[e.source.index]+"_"+a[e.target.index];n.lastFocused===o?(h.attr("display","block"),n.lastFocused=null):(h.attr("display","none"),r.attr("display","block"),n.lastFocused=o)})),$("."+g).tooltip({track:!0});var y=function(e){return e.endAngle-e.startAngle<.07?"":t.getChordGroupTitle(a[e.index])},A=I.selectAll("."+f).data();I.selectAll("."+f).data(s.groups,(function(t){return t.index})).join((function(e){var o=e.append("g").attr("class",f).attr("title",(function(e){return t.getChordGroupTitle(a[e.index])}));return o.append("path").attr("class","group-path").transition().duration(v).ease(x).attrTween("d",(function(t){var e=(0,d.sXR)(Object.assign({},t,{endAngle:0,startAngle:0}),t);return function(t){return T(e(t))}})).attr("fill",(function(t){return i(a[t.index])})).attr("stroke","#fff"),o.append("text").attr("dy",-3).append("textPath").attr("xlink:href","#"+R).attr("class",p).text(y).transition().duration(v).ease(x).attr("startOffset",(function(t){return t.startAngle*c})),o.on("click",(function(e,o){var i=a[o.index],u=E.selectAll("."+g);if(n.lastFocused===i)return u.attr("display",(function(){return"block"})),void(n.lastFocused=null);n.lastFocused=i,t.getDisplayTypeOnGroupClick(i)!==r.Source?u.attr("display",(function(t){return t.target.index===o.index?"block":"none"})):u.attr("display",(function(t){return t.source.index===o.index?"block":"none"}))})),$("."+f).tooltip({track:!0}),o}),(function(t){return t.select(".group-path").transition().duration(v).attrTween("d",(function(t,e){var n=A[e],r=(0,d.sXR)(n,t);return function(t){return T(r(t))}})),t.select("."+p).text(y).transition().duration(v).attr("startOffset",(function(t){return t.startAngle*c})),t}),(function(t){return t.remove()})).attr("class",f)};return j(),{renderItems:j}},C="All",A=function(t){var e=Object.keys(t).sort();return{countries:e,regions:Object.keys(t[e[0]]).sort()}},w=function(t){var e=t.countries,n=t.data,a=t.regions,i=t.state,u=e.concat(a);return{chordGroupsIds:u,getChordGroupTitle:function(t){return t},getChordMatrix:function(){return u.map((function(t){return n[t]&&[C,t].includes(i.selectedCountry)?u.map((function(e){var r=n[t][e];return r&&[C,e].includes(i.selectedRegion)?r[i.timeIndex].value:0})):u.map((function(){return 0}))}))},getChordTitle:function(t,e,n){return'People from "'+u[t]+'" spend into "'+u[e]+'": '+n},getDisplayTypeOnGroupClick:function(t){return e.includes(t)?r.Source:r.Target},getRibbonGroupIdColor:function(t,e){return i.selectedRegion===C?e:t},getRibbonType:function(){return i.selectedCountry!==C&&i.selectedRegion!==C?o.Common:o.Arrow},rootElId:"chart"}},R=function(){var t=(0,u.Z)(c().mark((function t(){var e,n,r,o,a,i,u,s,l;return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,d.AVB)("/demos/data/d3js/expenses-chord/data.json");case 2:e=t.sent,n={selectedCountry:C,selectedRegion:C,timeIndex:0},r=A(e),o=r.countries,a=r.regions,i=w({countries:o,data:e,regions:a,state:n}),u=b(i),s=u.renderItems,$("#slider-time").slider({change:function(t,e){var r=e.value;3!==r&&(n.timeIndex=r,s())},max:e[o[0]][a[0]].length-1,min:0}),(l=function(t,e,n){var r=document.getElementById(e);[C].concat(t).forEach((function(t){var e=document.createElement("option");e.setAttribute("value",t),e.innerText=t,r.appendChild(e)})),r.addEventListener("change",(function(){n(r.value)}))})(o,"countries-select",(function(t){n.selectedCountry=t,s()})),l(a,"regions-select",(function(t){n.selectedRegion=t,s()}));case 11:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),k=function(t){var e=t.pageContext;return a.createElement(i.Z,{links:["/vendors/jquery-ui/themes/base/jquery-ui.min.css"],main:R,pageContext:e,scripts:["/vendors/jquery-ui/jquery-ui.min.js"]},a.createElement("div",null,"Time Item:"),a.createElement("div",{className:"expenses-chord-module--sliderTime--1AAv8",id:"slider-time"}),a.createElement("p",null,a.createElement("span",null,"Countries:"),a.createElement("select",{className:"expenses-chord-module--countriesSelect--bu3tz",id:"countries-select"}),a.createElement("span",null,"Regions:"),a.createElement("select",{id:"regions-select"})),a.createElement("div",{id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-expenses-chord-tsx-1c9e43c2fa0ab61d5e16.js.map