(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[923],{2137:function(t,r,e){"use strict";function n(t,r,e,n,a,o,i){try{var u=t[o](i),s=u.value}catch(c){return void e(c)}u.done?r(s):Promise.resolve(s).then(n,a)}function a(t){return function(){var r=this,e=arguments;return new Promise((function(a,o){var i=t.apply(r,e);function u(t){n(i,a,o,u,s,"next",t)}function s(t){n(i,a,o,u,s,"throw",t)}u(void 0)}))}}e.d(r,{Z:function(){return a}})},9646:function(t,r,e){"use strict";var n;e.d(r,{Z:function(){return v}});var a=new Uint8Array(16);function o(){if(!n&&!(n="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return n(a)}var i=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;for(var u=function(t){return"string"==typeof t&&i.test(t)},s=[],c=0;c<256;++c)s.push((c+256).toString(16).substr(1));var d,l,f=function(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,e=(s[t[r+0]]+s[t[r+1]]+s[t[r+2]]+s[t[r+3]]+"-"+s[t[r+4]]+s[t[r+5]]+"-"+s[t[r+6]]+s[t[r+7]]+"-"+s[t[r+8]]+s[t[r+9]]+"-"+s[t[r+10]]+s[t[r+11]]+s[t[r+12]]+s[t[r+13]]+s[t[r+14]]+s[t[r+15]]).toLowerCase();if(!u(e))throw TypeError("Stringified UUID is invalid");return e},p=0,h=0;var v=function(t,r,e){var n=r&&e||0,a=r||new Array(16),i=(t=t||{}).node||d,u=void 0!==t.clockseq?t.clockseq:l;if(null==i||null==u){var s=t.random||(t.rng||o)();null==i&&(i=d=[1|s[0],s[1],s[2],s[3],s[4],s[5]]),null==u&&(u=l=16383&(s[6]<<8|s[7]))}var c=void 0!==t.msecs?t.msecs:Date.now(),v=void 0!==t.nsecs?t.nsecs:h+1,g=c-p+(v-h)/1e4;if(g<0&&void 0===t.clockseq&&(u=u+1&16383),(g<0||c>p)&&void 0===t.nsecs&&(v=0),v>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");p=c,h=v,l=u;var m=(1e4*(268435455&(c+=122192928e5))+v)%4294967296;a[n++]=m>>>24&255,a[n++]=m>>>16&255,a[n++]=m>>>8&255,a[n++]=255&m;var y=c/4294967296*1e4&268435455;a[n++]=y>>>8&255,a[n++]=255&y,a[n++]=y>>>24&15|16,a[n++]=y>>>16&255,a[n++]=u>>>8|128,a[n++]=255&u;for(var b=0;b<6;++b)a[n+b]=i[b];return r||f(a)}},6126:function(t,r,e){"use strict";e.d(r,{p:function(){return n},H:function(){return a}});var n="storybook",a={SCRIPT:"/vendors/jquery-ui/jquery-ui.min.js",STYLE:"/vendors/jquery-ui/themes/base/jquery-ui.min.css"}},4015:function(t,r,e){"use strict";e.r(r),e.d(r,{default:function(){return A}});var n=e(7294),a=e(6126),o=e(4275),i=e(2137),u=e(7757),s=e.n(u),c=e(7723),d="chart",l=function(t){var r=t.getDebits(),e=t.getCredits(),n=t.getCountriesList(),a=(0,c.WUZ)(",.3r"),o=n.map((function(t){return{id:t.id,label:t.name}})),i=function(t){return t.map((function(t){return t?+t.amount:0}))};return{chords:[r.map(i),e.map(i)],chordsTitles:["Debits","Credits"],getGroupTitle:function(t){var r=t.chartIndex,e=t.chordGroup;return n[e.index].name+" "+(r?"owes":"is owed")+" $"+a(e.value)+"B."},getRibbonTitle:function(t){var r=t.sourceIndex,e=t.sourceValue,o=t.targetIndex,i=n[r],u=n[o];return i.name+" owes "+u.name+" $"+a(e)+"B."},groupItems:o,rootElId:d}},f=function(){function t(t){var r=t.countriesList,e=t.credits,n=t.debits;this.credits=e,this.debits=n,this.countriesList=r}t.fetchAndCreate=function(){var r=(0,i.Z)(s().mark((function r(){var e,n,a,o,i,u,d,l;return s().wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,(0,c.gyn)("/demos/data/d3js/chord/data.csv");case 2:return e=r.sent,n=[],a={},o=[],i=[],u=0,d=function(t){return t in a||(a[t]={id:u,name:t},u+=1),a[t]},l=e.map((function(t){return Object.assign({},t,{creditor:d(t.creditor),debtor:Object.assign({},d(t.debtor),{risk:t.risk})})})),Array.from({length:u}).forEach((function(){for(var t=arguments.length,r=new Array(t),e=0;e<t;e++)r[e]=arguments[e];var n=r[1];o[n]=[],i[n]=[],Array.from({length:u}).forEach((function(){for(var t=arguments.length,r=new Array(t),e=0;e<t;e++)r[e]=arguments[e];var a=r[1];o[n][a]=null,i[n][a]=null}))})),l.forEach((function(t){o[t.creditor.id][t.debtor.id]=t,i[t.debtor.id][t.creditor.id]=t,n[t.creditor.id]=t.creditor,n[t.debtor.id]=t.debtor})),r.abrupt("return",new t({countriesList:n,credits:i,debits:o}));case 13:case"end":return r.stop()}}),r)})));return function(){return r.apply(this,arguments)}}();var r=t.prototype;return r.getCredits=function(){return this.credits},r.getDebits=function(){return this.debits},r.getCountriesList=function(){return this.countriesList},t}(),p=e(9646),h="chord-module--chord--1Zjd0",v="chord-module--group--309FH",g="chord-module--headingTitle--A2lxW",m=function(t){var r=t.charts,e=t.deviation,n=t.name,a=t.slope,o=r.append("defs").append("filter").attr("id",n);o.append("feOffset").attr("dx",.5).attr("dy",.5).attr("in","SourceGraphic").attr("result","offOut"),o.append("feGaussianBlur").attr("in","offOut").attr("result","blurOut").attr("stdDeviation",e),o.append("feBlend").attr("in","SourceGraphic").attr("in2","blurOut").attr("mode","normal"),o.append("feComponentTransfer").append("feFuncA").attr("slope",a).attr("type","linear")},y=["#39B347","#C92E47","#DB704D","#FFA22C","#5E92AA","#F8EDD3"],b=20,x=50,w=500,C=function(t){var r=t.chords,e=t.chordsTitles,n=t.groupItems,a=t.rootElId,o=document.getElementById(a),i=r[0],u=r[1],s=e[0],d=e[1],l="drop-shadow-ribbons-"+(0,p.Z)().slice(0,6),f="drop-shadow-groups-"+(0,p.Z)().slice(0,6),C="ribbon-item-"+(0,p.Z)().slice(0,6),k="chord-group-"+(0,p.Z)().slice(0,6);o.classList.add("chord-module--chordChart--lzAYO");var A=o.getBoundingClientRect().width/2-20,E=Math.min(A,w)/2-4,I=E-20,T=(0,c.Nb1)().innerRadius(I).outerRadius(E),R=(0,c.Ys)("#"+a).selectAll("div").data([i,u]).enter().append("div").style("display","inline-block").style("width",A+"px").style("height",w+x+b+"px").append("svg:svg").attr("width",A).attr("height",w+x+b).append("svg:g").attr("transform","translate("+A/2+","+(250+x)+")"),B=R.filter((function(){for(var t=arguments.length,r=new Array(t),e=0;e<t;e++)r[e]=arguments[e];var n=r[1];return 0===n})),D=R.filter((function(){for(var t=arguments.length,r=new Array(t),e=0;e<t;e++)r[e]=arguments[e];var n=r[1];return 1===n})),Z=function(t){var r=t.chart,e=t.label;return r.append("text").text(e).attr("transform","translate(0,-260)").attr("class","chord-module--chartTitle--33urD").attr("text-anchor","middle")};Z({chart:B,label:s}),Z({chart:D,label:d}),m({charts:R,deviation:2,name:l,slope:.4}),m({charts:R,deviation:3,name:f,slope:.5});var j=(0,c.BYU)().domain((0,c.Wem)([0,n.length-1])).range([0,1]),L=(0,c.BYU)().domain((0,c.w6H)(0,1,1/y.length)).range(y),S=function(t){return L(j(t))};R.each((function(){for(var r=arguments.length,e=new Array(r),a=0;a<r;a++)e[a]=arguments[a];var o=e[0],i=e[1],u=(0,c.Ys)(this),s=(0,c.fFo)().sortGroups(c.$1i).sortSubgroups(c.$1i).sortChords(c.$1i)(o),d=(0,c.N22)().radius(I);u.selectAll("path."+h).data(s).enter().append("path").attr("d",d).attr("class",h+" "+C).style("fill",(function(t){return S(t.target.index)})).style("filter","url(#"+l+")").style("stroke",(function(t){var r=S(t.target.index);return(0,c.B8C)(r).darker().formatHex()})).style("stroke-width",2).attr("title",(function(r){return t.getRibbonTitle({sourceIndex:r.source.index,sourceValue:r.source.value,targetIndex:r.target.index,targetValue:r.source.value})}));var p=u.selectAll("g."+v).data(s.groups).enter().append("svg:g").attr("class",v);p.append("svg:path").attr("d",T).style("fill",(function(t){return S(t.index)})).attr("id",(function(t){return"group"+t.index+"-"+i})).attr("class",k).style("filter",(function(){return"url(#"+f+")"})).attr("title",(function(r){return t.getGroupTitle({chartIndex:i,chordGroup:r})})),p.append("svg:text").attr("x",6).attr("dy",15).filter((function(t){return t.value>150})).append("svg:textPath").attr("xlink:href",(function(t){return"#group"+t.index+"-"+i})).text((function(t){return n[t.index].label})).attr("class",g),$("."+C).tooltip({track:!0}),$("."+k).tooltip({track:!0})}))},k=function(){var t=(0,i.Z)(s().mark((function t(){var r,e;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,f.fetchAndCreate();case 2:r=t.sent,e=l(r),C(e);case 5:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),A=function(t){var r=t.pageContext;return n.createElement(o.Z,{links:[a.H.STYLE],main:k,pageContext:r,scripts:[a.H.SCRIPT]},n.createElement("div",{id:d}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-chord-tsx-0bbbbdb58c4da0f239c7.js.map