(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[907],{2137:function(e,t,n){"use strict";function r(e,t,n,r,o,a,i){try{var s=e[a](i),u=s.value}catch(c){return void n(c)}s.done?t(u):Promise.resolve(u).then(r,o)}function o(e){return function(){var t=this,n=arguments;return new Promise((function(o,a){var i=e.apply(t,n);function s(e){r(i,o,a,s,u,"next",e)}function u(e){r(i,o,a,s,u,"throw",e)}s(void 0)}))}}n.d(t,{Z:function(){return o}})},9646:function(e,t,n){"use strict";var r;n.d(t,{Z:function(){return m}});var o=new Uint8Array(16);function a(){if(!r&&!(r="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return r(o)}var i=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;for(var s=function(e){return"string"==typeof e&&i.test(e)},u=[],c=0;c<256;++c)u.push((c+256).toString(16).substr(1));var l,d,f=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=(u[e[t+0]]+u[e[t+1]]+u[e[t+2]]+u[e[t+3]]+"-"+u[e[t+4]]+u[e[t+5]]+"-"+u[e[t+6]]+u[e[t+7]]+"-"+u[e[t+8]]+u[e[t+9]]+"-"+u[e[t+10]]+u[e[t+11]]+u[e[t+12]]+u[e[t+13]]+u[e[t+14]]+u[e[t+15]]).toLowerCase();if(!s(n))throw TypeError("Stringified UUID is invalid");return n},p=0,g=0;var m=function(e,t,n){var r=t&&n||0,o=t||new Array(16),i=(e=e||{}).node||l,s=void 0!==e.clockseq?e.clockseq:d;if(null==i||null==s){var u=e.random||(e.rng||a)();null==i&&(i=l=[1|u[0],u[1],u[2],u[3],u[4],u[5]]),null==s&&(s=d=16383&(u[6]<<8|u[7]))}var c=void 0!==e.msecs?e.msecs:Date.now(),m=void 0!==e.nsecs?e.nsecs:g+1,v=c-p+(m-g)/1e4;if(v<0&&void 0===e.clockseq&&(s=s+1&16383),(v<0||c>p)&&void 0===e.nsecs&&(m=0),m>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");p=c,g=m,d=s;var h=(1e4*(268435455&(c+=122192928e5))+m)%4294967296;o[r++]=h>>>24&255,o[r++]=h>>>16&255,o[r++]=h>>>8&255,o[r++]=255&h;var y=c/4294967296*1e4&268435455;o[r++]=y>>>8&255,o[r++]=255&y,o[r++]=y>>>24&15|16,o[r++]=y>>>16&255,o[r++]=s>>>8|128,o[r++]=255&s;for(var x=0;x<6;++x)o[r+x]=i[x];return t||f(o)}},5250:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return k}});var r,o,a=n(7294),i=n(4275),s=n(2137),u=n(7757),c=n.n(u),l=n(7723),d=n(9646),f="expenses-chord-module--chordGroup--2xhSq",p="expenses-chord-module--groupText--2wIqW",g="expenses-chord-module--ribbon--28nns",m=800;!function(e){e.Source="source",e.Target="target"}(r||(r={})),function(e){e.Arrow="arrow",e.Common="common"}(o||(o={}));var v=1e3,h=500,y=l.XeF,x=function(e){e.style("opacity",.7).on("mouseenter",(function(){(0,l.Ys)(this).style("opacity",1)})).on("mouseleave",(function(){(0,l.Ys)(this).style("opacity",.7)}))},A=function(e){(0,l.Ys)(this).transition().duration(h).attr("transform",e.transform)},C=function(e){var t=e.rootElId,n={lastFocused:null},a=e.chordGroupsIds,i=(0,l.PKp)(a,l.K2I),s=document.getElementById(t).getBoundingClientRect().width,u=.5*Math.min(s,m)-20,c=u+20,h=function(e){return e.radius(u-.5).padAngle(1/u)},C=h((0,l.tQZ)()),w=h((0,l.N22)()),b=(0,l.sPX)().extent([[0,0],[s/2,400]]).on("end",A),I=(0,l.Ys)("#"+t).attr("class","expenses-chord-module--chartWrapper--1V-_7").append("svg").attr("width",s).attr("height",850).append("g").attr("transform","translate("+s/2+", 425)").append("g").call(b).on("dblclick.zoom",null);I.append("rect").attr("fill","#fff").attr("width",s).attr("height",m).attr("transform","translate(-"+s/2+", -425)");var R=(0,d.Z)(),k=(0,l.rKe)().padAngle(12/u).sortSubgroups(l.$1i).sortChords(l.$1i);I.append("path").attr("fill","none").attr("id",R).attr("d",(0,l.Nb1)()({endAngle:2*Math.PI,innerRadius:0,outerRadius:c,startAngle:0}));var L=(0,l.Nb1)().innerRadius(u).outerRadius(c),T=I.append("g"),E=I.append("g").attr("font-family","sans-serif").attr("font-size",10),D=function(e){return e.source.index+"_"+e.target.index},F=function(){var t=e.getRibbonType()===o.Common?w:C,s=e.getChordMatrix(),u=k(s),d=T.selectAll("."+g).data().reduce((function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var r=t[0],o=t[1];return r[D(o)]=o,r}),{}),m=function(t){return i(e.getRibbonGroupIdColor(a[t.source.index],a[t.target.index]))},h=T.selectAll("."+g).data(u,(function(e){return D(e)})).join((function(e){var n=e.append("path").attr("class",g).attr("fill",m);return x(n),n.transition().duration(v).attrTween("d",(function(e){var n={endAngle:0,startAngle:0},r={endAngle:0,startAngle:0},o=(0,l.sXR)(n,e.source),a=(0,l.sXR)(r,e.target);return function(e){var n={source:o(e),target:a(e)};return t(n)}}))}),(function(e){return e.transition().duration(v).attr("fill",m).attrTween("d",(function(e){var n=d[D(e)];if(!n)return function(){return t(e)};var r=(0,l.sXR)(n.source,e.source),o=(0,l.sXR)(n.target,e.target);return function(e){var n={source:r(e),target:o(e)};return t(n)}})),e}));h.attr("title",(function(t){return e.getChordTitle(t.source.index,t.target.index,t.source.value,t.target.value)})).on("click",(function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var o=t[1],i=(0,l.Ys)(this),s=a[o.source.index]+"_"+a[o.target.index];n.lastFocused===s?(h.attr("display","block"),n.lastFocused=null):(h.attr("display","none"),i.attr("display","block"),n.lastFocused=s)})),$("."+g).tooltip({track:!0});var A=function(t){return t.endAngle-t.startAngle<.07?"":e.getChordGroupTitle(a[t.index])},b=E.selectAll("."+f).data();E.selectAll("."+f).data(u.groups,(function(e){return e.index})).join((function(t){var o=t.append("g").attr("class",f).attr("title",(function(t){return e.getChordGroupTitle(a[t.index])}));return x(o),o.append("path").attr("class","group-path").transition().duration(v).ease(y).attrTween("d",(function(e){var t=(0,l.sXR)(Object.assign({},e,{endAngle:0,startAngle:0}),e);return function(e){return L(t(e))}})).attr("fill",(function(e){return i(a[e.index])})).attr("stroke","#fff"),o.append("text").attr("dy",-3).append("textPath").attr("xlink:href","#"+R).attr("class",p).text(A).transition().duration(v).ease(y).attr("startOffset",(function(e){return e.startAngle*c})),o.on("click",(function(){for(var t=arguments.length,o=new Array(t),i=0;i<t;i++)o[i]=arguments[i];var s=o[1],u=a[s.index],c=T.selectAll("."+g);if(n.lastFocused===u)return c.attr("display",(function(){return"block"})),void(n.lastFocused=null);n.lastFocused=u,e.getDisplayTypeOnGroupClick(u)!==r.Source?c.attr("display",(function(e){return e.target.index===s.index?"block":"none"})):c.attr("display",(function(e){return e.source.index===s.index?"block":"none"}))})),$("."+f).tooltip({track:!0}),o}),(function(e){return e.select(".group-path").transition().duration(v).attrTween("d",(function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var r=t[0],o=t[1],a=b[o],i=(0,l.sXR)(a,r);return function(e){return L(i(e))}})),e.select("."+p).text(A).transition().duration(v).attr("startOffset",(function(e){return e.startAngle*c})),e}),(function(e){return e.remove()})).attr("class",f)};return F(),{renderItems:F}},w=function(){function e(e){var t=Object.keys(e).sort();this.countries=t,this.regions=Object.keys(e[t[0]]).sort(),this.expensesData=e,this.names=t.concat(this.regions)}e.fetchAndCreate=function(){var t=(0,s.Z)(c().mark((function t(){var n;return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,l.AVB)("/demos/data/d3js/expenses-chord/data.json");case 2:return n=t.sent,t.abrupt("return",new e(n));case 4:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();var t=e.prototype;return t.getRelationsMatrix=function(t){var n=t.countryFilter,r=t.regionFilter,o=t.timeIndexFilter,a=this.expensesData,i=this.names;return i.map((function(t){return a[t]&&[e.ALL_ID,t].includes(n)?i.map((function(n){var i=a[t][n];return i&&[e.ALL_ID,n].includes(r)?i[o].value:0})):i.map((function(){return 0}))}))},t.getTimeFramesNumber=function(){var e=this.countries,t=this.expensesData,n=this.regions;return t[e[0]][n[0]].length-1},t.getCountriesList=function(){return this.countries.slice()},t.getRegionsList=function(){return this.regions.slice()},t.getAllNames=function(){return this.names.slice()},e}();w.ALL_ID="All";var b=function(e){var t=e.expenses,n=e.state,a=t.getAllNames();return{chordGroupsIds:a,getChordGroupTitle:function(e){return e},getChordMatrix:function(){return t.getRelationsMatrix({countryFilter:n.selectedCountry,regionFilter:n.selectedRegion,timeIndexFilter:n.timeIndex})},getChordTitle:function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var r=t[0],o=t[1],i=t[2];return'People from "'+a[r]+'" spend into "'+a[o]+'": '+i},getDisplayTypeOnGroupClick:function(e){return t.getCountriesList().includes(e)?r.Source:r.Target},getRibbonGroupIdColor:function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var o=t[0],a=t[1];return n.selectedRegion===w.ALL_ID?a:o},getRibbonType:function(){return n.selectedCountry!==w.ALL_ID&&n.selectedRegion!==w.ALL_ID?o.Common:o.Arrow},rootElId:"chart"}},I=function(e){var t=e.expenses,n=e.renderItems,r=e.state;$("#slider-time").slider({change:function(){for(var e=arguments.length,t=new Array(e),o=0;o<e;o++)t[o]=arguments[o];var a=t[1].value;3!==a&&(r.timeIndex=a,n())},max:t.getTimeFramesNumber(),min:0});var o=function(e){var t=e.id,n=e.onChange,r=e.selectOptions,o=document.getElementById(t);[w.ALL_ID].concat(r).forEach((function(e){var t=document.createElement("option");t.setAttribute("value",e),t.innerText=e,o.appendChild(t)})),o.addEventListener("change",(function(){n(o.value)}))};o({id:"countries-select",onChange:function(e){r.selectedCountry=e,n()},selectOptions:t.getCountriesList()}),o({id:"regions-select",onChange:function(e){r.selectedRegion=e,n()},selectOptions:t.getRegionsList()})},R=function(){var e=(0,s.Z)(c().mark((function e(){var t,n,r,o,a;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,w.fetchAndCreate();case 2:t=e.sent,n={selectedCountry:w.ALL_ID,selectedRegion:w.ALL_ID,timeIndex:0},r=b({expenses:t,state:n}),o=C(r),a=o.renderItems,I({expenses:t,renderItems:a,state:n});case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),k=function(e){var t=e.pageContext;return a.createElement(i.Z,{links:["/vendors/jquery-ui/themes/base/jquery-ui.min.css"],main:R,pageContext:t,scripts:["/vendors/jquery-ui/jquery-ui.min.js"]},a.createElement("div",null,"Time Item:"),a.createElement("div",{className:"expenses-chord-module--sliderTime--1AAv8",id:"slider-time"}),a.createElement("p",null,a.createElement("span",null,"Countries:"),a.createElement("select",{className:"expenses-chord-module--countriesSelect--bu3tz",id:"countries-select"}),a.createElement("span",null,"Regions:"),a.createElement("select",{id:"regions-select"})),a.createElement("div",{id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-expenses-chord-tsx-7088e658c212bf1413f7.js.map