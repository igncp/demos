(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[907],{9646:function(e,t,n){"use strict";var r;n.d(t,{Z:function(){return h}});var o=new Uint8Array(16);function a(){if(!r&&!(r="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return r(o)}var i=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;for(var s=function(e){return"string"==typeof e&&i.test(e)},u=[],c=0;c<256;++c)u.push((c+256).toString(16).substr(1));var d,l,f=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=(u[e[t+0]]+u[e[t+1]]+u[e[t+2]]+u[e[t+3]]+"-"+u[e[t+4]]+u[e[t+5]]+"-"+u[e[t+6]]+u[e[t+7]]+"-"+u[e[t+8]]+u[e[t+9]]+"-"+u[e[t+10]]+u[e[t+11]]+u[e[t+12]]+u[e[t+13]]+u[e[t+14]]+u[e[t+15]]).toLowerCase();if(!s(n))throw TypeError("Stringified UUID is invalid");return n},p=0,g=0;var h=function(e,t,n){var r=t&&n||0,o=t||new Array(16),i=(e=e||{}).node||d,s=void 0!==e.clockseq?e.clockseq:l;if(null==i||null==s){var u=e.random||(e.rng||a)();null==i&&(i=d=[1|u[0],u[1],u[2],u[3],u[4],u[5]]),null==s&&(s=l=16383&(u[6]<<8|u[7]))}var c=void 0!==e.msecs?e.msecs:Date.now(),h=void 0!==e.nsecs?e.nsecs:g+1,v=c-p+(h-g)/1e4;if(v<0&&void 0===e.clockseq&&(s=s+1&16383),(v<0||c>p)&&void 0===e.nsecs&&(h=0),h>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");p=c,g=h,l=s;var m=(1e4*(268435455&(c+=122192928e5))+h)%4294967296;o[r++]=m>>>24&255,o[r++]=m>>>16&255,o[r++]=m>>>8&255,o[r++]=255&m;var y=c/4294967296*1e4&268435455;o[r++]=y>>>8&255,o[r++]=255&y,o[r++]=y>>>24&15|16,o[r++]=y>>>16&255,o[r++]=s>>>8|128,o[r++]=255&s;for(var x=0;x<6;++x)o[r+x]=i[x];return t||f(o)}},6126:function(e,t,n){"use strict";var r;n.d(t,{H:function(){return o},d:function(){return r}}),function(e){e.STORYBOOK="storybook",e.TESTING="testing"}(r||(r={}));var o={SCRIPT:"/vendors/jquery-ui/jquery-ui.min.js",STYLE:"/vendors/jquery-ui/themes/base/jquery-ui.min.css"}},5250:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return F}});var r,o,a=n(7294),i=n(6126),s=n(4275),u=n(8634),c=n(2656),d=n.n(c),l=n(2094),f=n(9646),p="expenses-chord-module--chordGroup--2xhSq",g="expenses-chord-module--groupText--2wIqW",h="expenses-chord-module--ribbon--28nns";!function(e){e.Source="source",e.Target="target"}(r||(r={})),function(e){e.Arrow="arrow",e.Common="common"}(o||(o={}));var v=1e3,m=l.XeF,y=function(e){e.style("opacity",.7).on("mouseenter",(function(){(0,l.Ys)(this).style("opacity",1)})).on("mouseleave",(function(){(0,l.Ys)(this).style("opacity",.7)}))},x=function(e){var t=e.rootElId,n={lastFocused:null},a=e.chordGroupsIds,i=(0,l.PKp)(a,l.K2I),s=document.getElementById(t).getBoundingClientRect().width,u=.5*Math.min(s,800)-20,c=u+20,d=function(e){return e.radius(u-.5).padAngle(1/u)},x=d((0,l.tQZ)()),A=d((0,l.N22)()),C=(0,l.Ys)("#"+t).attr("class","expenses-chord-module--chartWrapper--1V-_7").append("svg").attr("width",s).attr("height",850);!function(e){var t=e.deviation,n=e.id,r=e.slope,o=e.svg.append("defs").append("filter").attr("height","500%").attr("id","drop-shadow-"+n).attr("width","500%").attr("x","-200%").attr("y","-200%");o.append("feGaussianBlur").attr("in","SourceAlpha").attr("stdDeviation",t),o.append("feOffset").attr("dx",1).attr("dy",1),o.append("feComponentTransfer").append("feFuncA").attr("slope",r).attr("type","linear");var a=o.append("feMerge");a.append("feMergeNode"),a.append("feMergeNode").attr("in","SourceGraphic")}({deviation:2,id:"groups",slope:.5,svg:C});var k=C.append("g").attr("transform","translate("+s/2+", 425)").append("g").attr("class","svg-drag");!function(e){var t=e.svgDrag,n=e.svgTop,r={s:1,x:0,y:0},o=function(){t.attr("transform","translate("+r.x+","+r.y+") scale("+r.s+")")},a=(0,l.ohM)().on("drag",(function(e){r.x+=e.dx,r.y+=e.dy,o()}));o(),n.style("cursor","move").call(a).on("wheel",(function(e){e.preventDefault(),r.s+=-e.deltaY/1e3,o()}))}({svgDrag:k,svgTop:C}),k.append("rect").attr("fill","#fff").attr("width",s).attr("height",800).attr("transform","translate(-"+s/2+", -425)");var b=(0,f.Z)(),w=(0,l.rKe)().padAngle(12/u).sortSubgroups(l.$1i).sortChords(l.$1i);k.append("path").attr("fill","none").attr("id",b).attr("d",(0,l.Nb1)()({endAngle:2*Math.PI,innerRadius:0,outerRadius:c,startAngle:0}));var I=(0,l.Nb1)().innerRadius(u).outerRadius(c),T=k.append("g"),R=k.append("g").attr("font-family","sans-serif").attr("font-size",10),L=function(e){return e.source.index+"_"+e.target.index},E=function(){var t=e.getRibbonType()===o.Common?A:x,s=e.getChordMatrix(),u=w(s),d=T.selectAll("."+h).data().reduce((function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var r=t[0],o=t[1];return r[L(o)]=o,r}),{}),f=function(t){return i(e.getRibbonGroupIdColor(a[t.source.index],a[t.target.index]))},C=T.selectAll("."+h).data(u,(function(e){return L(e)})).join((function(e){var n=e.append("path").attr("class",h).attr("fill",f);return y(n),n.transition().duration(v).attrTween("d",(function(e){var n={endAngle:0,startAngle:0},r={endAngle:0,startAngle:0},o=(0,l.sXR)(n,e.source),a=(0,l.sXR)(r,e.target);return function(e){var n={source:o(e),target:a(e)};return t(n)}}))}),(function(e){return e.transition().duration(v).attr("fill",f).attrTween("d",(function(e){var n=d[L(e)];if(!n)return function(){return t(e)};var r=(0,l.sXR)(n.source,e.source),o=(0,l.sXR)(n.target,e.target);return function(e){var n={source:r(e),target:o(e)};return t(n)}})),e}));C.attr("title",(function(t){return e.getChordTitle(t.source.index,t.target.index,t.source.value,t.target.value)})).on("click",(function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var o=t[1],i=(0,l.Ys)(this),s=a[o.source.index]+"_"+a[o.target.index];n.lastFocused===s?(C.attr("display","block"),n.lastFocused=null):(C.attr("display","none"),i.attr("display","block"),n.lastFocused=s)})),$("."+h).tooltip({track:!0});var k=function(t){return t.endAngle-t.startAngle<.07?"":e.getChordGroupTitle(a[t.index])},E=R.selectAll("."+p).data();R.selectAll("."+p).data(u.groups,(function(e){return e.index})).join((function(t){var o=t.append("g").attr("class",p).attr("title",(function(t){return e.getChordGroupTitle(a[t.index])})).style("filter","url(#drop-shadow-groups)");return y(o),o.append("path").attr("class","group-path").transition().duration(v).ease(m).attrTween("d",(function(e){var t=(0,l.sXR)(Object.assign({},e,{endAngle:0,startAngle:0}),e);return function(e){return I(t(e))}})).attr("fill",(function(e){return i(a[e.index])})).attr("stroke","#fff"),o.append("text").attr("dy",-3).append("textPath").attr("xlink:href","#"+b).attr("class",g).text(k).transition().duration(v).ease(m).attr("startOffset",(function(e){return e.startAngle*c})),o.on("click",(function(){for(var t=arguments.length,o=new Array(t),i=0;i<t;i++)o[i]=arguments[i];var s=o[1],u=a[s.index],c=T.selectAll("."+h);if(n.lastFocused===u)return c.attr("display",(function(){return"block"})),void(n.lastFocused=null);n.lastFocused=u,e.getDisplayTypeOnGroupClick(u)!==r.Source?c.attr("display",(function(e){return e.target.index===s.index?"block":"none"})):c.attr("display",(function(e){return e.source.index===s.index?"block":"none"}))})),$("."+p).tooltip({track:!0}),o}),(function(e){return e.select(".group-path").transition().duration(v).attrTween("d",(function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var r=t[0],o=t[1],a=E[o],i=(0,l.sXR)(a,r);return function(e){return I(i(e))}})),e.select("."+g).text(k).transition().duration(v).attr("startOffset",(function(e){return e.startAngle*c})),e}),(function(e){return e.remove()})).attr("class",p)};return E(),{renderItems:E}},A=function(){function e(e){var t=Object.keys(e).sort();this.countries=t,this.regions=Object.keys(e[t[0]]).sort(),this.expensesData=e,this.names=t.concat(this.regions)}e.fetchAndCreate=function(){var t=(0,u.Z)(d().mark((function t(){var n;return d().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,l.AVB)("/demos/data/d3js/expenses-chord/data.json");case 2:return n=t.sent,t.abrupt("return",new e(n));case 4:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();var t=e.prototype;return t.getRelationsMatrix=function(t){var n=t.countryFilter,r=t.regionFilter,o=t.timeIndexFilter,a=this.expensesData,i=this.names;return i.map((function(t){return a[t]&&[e.ALL_ID,t].includes(n)?i.map((function(n){var i=a[t][n];return i&&[e.ALL_ID,n].includes(r)?i[o].value:0})):i.map((function(){return 0}))}))},t.getTimeFramesNumber=function(){var e=this.countries,t=this.expensesData,n=this.regions;return t[e[0]][n[0]].length-1},t.getCountriesList=function(){return this.countries.slice()},t.getRegionsList=function(){return this.regions.slice()},t.getAllNames=function(){return this.names.slice()},e}();A.ALL_ID="All";var C="chart",k="automatic-time",b="slider-time",w="countries-select",I="regions-select",T=function(){function e(e){var t=e.onChecked,n=e.onUnchecked;this.onChecked=t,this.onUnchecked=n,this.checkbox=document.getElementById(k)}var t=e.prototype;return t.init=function(){var e=this;this.checkbox.setAttribute("checked","checked"),this.onChecked(),this.checkbox.addEventListener("change",(function(){e.checkbox.checked?e.onChecked():e.onUnchecked()}))},t.uncheck=function(){this.checkbox.checked=!1,this.onUnchecked()},e}(),R=function(e){var t=e.expenses,n=e.state,a=t.getAllNames();return{chordGroupsIds:a,getChordGroupTitle:function(e){return e},getChordMatrix:function(){return t.getRelationsMatrix({countryFilter:n.selectedCountry,regionFilter:n.selectedRegion,timeIndexFilter:n.timeIndex})},getChordTitle:function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var r=t[0],o=t[1],i=t[2];return'People from "'+a[r]+'" spend into "'+a[o]+'": '+i},getDisplayTypeOnGroupClick:function(e){return t.getCountriesList().includes(e)?r.Source:r.Target},getRibbonGroupIdColor:function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];var o=t[0],a=t[1];return n.selectedRegion===A.ALL_ID?a:o},getRibbonType:function(){return n.selectedCountry!==A.ALL_ID&&n.selectedRegion!==A.ALL_ID?o.Common:o.Arrow},rootElId:C}},L=function(e){var t=e.expenses,n=e.renderItems,r=e.state,o=t.getTimeFramesNumber();$("#slider-time").slider({change:function(){for(var e=arguments.length,t=new Array(e),o=0;o<e;o++)t[o]=arguments[o];var a=t[1].value;3!==a&&(r.timeIndex=a,n())},max:o,min:0});var a=function(e){var t=e.id,n=e.onChange,r=e.selectOptions,o=document.getElementById(t);[A.ALL_ID].concat(r).forEach((function(e){var t=document.createElement("option");t.setAttribute("value",e),t.innerText=e,o.appendChild(t)})),o.addEventListener("change",(function(){n(o.value)}))};a({id:w,onChange:function(e){r.selectedCountry=e,n()},selectOptions:t.getCountriesList()}),a({id:I,onChange:function(e){r.selectedRegion=e,n()},selectOptions:t.getRegionsList()});var i=null,s=new T({onChecked:function(){clearInterval(i),i=window.setInterval((function(){var e=$("#slider-time").slider("value")+1;$("#slider-time").slider("value",e),e>=o&&s.uncheck()}),2e3)},onUnchecked:function(){clearInterval(i)}});s.init()},E=function(){var e=(0,u.Z)(d().mark((function e(){var t,n,r,o,a;return d().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,A.fetchAndCreate();case 2:t=e.sent,n={selectedCountry:A.ALL_ID,selectedRegion:A.ALL_ID,timeIndex:0},r=R({expenses:t,state:n}),o=x(r),a=o.renderItems,L({expenses:t,renderItems:a,state:n});case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),D=E,F=function(e){var t=e.pageContext;return a.createElement(s.Z,{links:[i.H.STYLE],main:D,pageContext:t,scripts:[i.H.SCRIPT]},a.createElement("div",null,"Time Item:"),a.createElement("div",{className:"expenses-chord-module--sliderTime--1AAv8",id:b}),a.createElement("p",null,a.createElement("span",null,"Countries:"),a.createElement("select",{className:"expenses-chord-module--countriesSelect--bu3tz",id:w}),a.createElement("span",null,"Regions:"),a.createElement("select",{id:I}),a.createElement("span",{className:"expenses-chord-module--automaticTime--1uXGb"},"Automatic Time Change:"),a.createElement("input",{id:k,type:"checkbox"})),a.createElement("div",{id:C}))}},2656:function(e,t,n){e.exports=n(3076)},8634:function(e,t,n){"use strict";function r(e,t,n,r,o,a,i){try{var s=e[a](i),u=s.value}catch(c){return void n(c)}s.done?t(u):Promise.resolve(u).then(r,o)}function o(e){return function(){var t=this,n=arguments;return new Promise((function(o,a){var i=e.apply(t,n);function s(e){r(i,o,a,s,u,"next",e)}function u(e){r(i,o,a,s,u,"throw",e)}s(void 0)}))}}n.d(t,{Z:function(){return o}})}}]);
//# sourceMappingURL=component---src-pages-d-3-js-expenses-chord-tsx-f89aaf3cf3010ff71f4d.js.map