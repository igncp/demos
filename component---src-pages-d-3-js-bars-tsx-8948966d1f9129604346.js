(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[964],{9646:function(t,r,n){"use strict";var e;n.d(r,{Z:function(){return m}});var a=new Uint8Array(16);function i(){if(!e&&!(e="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return e(a)}var s=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;for(var o=function(t){return"string"==typeof t&&s.test(t)},u=[],c=0;c<256;++c)u.push((c+256).toString(16).substr(1));var l,d,f=function(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=(u[t[r+0]]+u[t[r+1]]+u[t[r+2]]+u[t[r+3]]+"-"+u[t[r+4]]+u[t[r+5]]+"-"+u[t[r+6]]+u[t[r+7]]+"-"+u[t[r+8]]+u[t[r+9]]+"-"+u[t[r+10]]+u[t[r+11]]+u[t[r+12]]+u[t[r+13]]+u[t[r+14]]+u[t[r+15]]).toLowerCase();if(!o(n))throw TypeError("Stringified UUID is invalid");return n},h=0,v=0;var m=function(t,r,n){var e=r&&n||0,a=r||new Array(16),s=(t=t||{}).node||l,o=void 0!==t.clockseq?t.clockseq:d;if(null==s||null==o){var u=t.random||(t.rng||i)();null==s&&(s=l=[1|u[0],u[1],u[2],u[3],u[4],u[5]]),null==o&&(o=d=16383&(u[6]<<8|u[7]))}var c=void 0!==t.msecs?t.msecs:Date.now(),m=void 0!==t.nsecs?t.nsecs:v+1,p=c-h+(m-v)/1e4;if(p<0&&void 0===t.clockseq&&(o=o+1&16383),(p<0||c>h)&&void 0===t.nsecs&&(m=0),m>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");h=c,v=m,d=o;var g=(1e4*(268435455&(c+=122192928e5))+m)%4294967296;a[e++]=g>>>24&255,a[e++]=g>>>16&255,a[e++]=g>>>8&255,a[e++]=255&g;var b=c/4294967296*1e4&268435455;a[e++]=b>>>8&255,a[e++]=255&b,a[e++]=b>>>24&15|16,a[e++]=b>>>16&255,a[e++]=o>>>8|128,a[e++]=255&o;for(var y=0;y<6;++y)a[e+y]=s[y];return r||f(a)}},6126:function(t,r,n){"use strict";var e;n.d(r,{H:function(){return a},d:function(){return e}}),function(t){t.STORYBOOK="storybook",t.TESTING="testing"}(e||(e={}));var a={SCRIPT:"/vendors/jquery-ui/jquery-ui.min.js",STYLE:"/vendors/jquery-ui/themes/base/jquery-ui.min.css"}},9511:function(t,r,n){"use strict";n.r(r),n.d(r,{default:function(){return E}});var e=n(7294),a=n(6126),i=n(4275),s=n(8634),o=n(2656),u=n.n(o),c=n(2094),l=n(9646),d="bars-module--axis--_Qwuv",f="bars-module--addItemButton--3NA4a",h=160,v=100,m=500-2*v,p=30,g=["#323247","#7C7CC9","#72B66C","#429742"],b=function(t){return m-7*t.metric},y=function(t){return 7*t.metric},w=function(){function t(t){var r=t.bars,n=t.rootElId;this.bars=r,this.rootElId=n,this.barClassName="bars-"+(0,l.Z)().slice(0,6),this.interval=null,this.chart=null,this.color=null}var r=t.prototype;return r.render=function(){var t=this.bars,r=this.rootElId,n=document.getElementById(r).getBoundingClientRect().width,e=(0,c.BYU)().domain((0,c.Wem)(t,(function(t){return t.metric}))).range([0,1]),a=(0,c.BYU)().domain((0,c.w6H)(0,1,1/g.length)).range(g);this.color=function(t){return a(e(t.metric))};var i=(0,c.Ys)("#"+r).append("svg");i.attr("height",500).attr("width",n).attr("class","bars-module--barsChart--3abBv"),i.append("g").append("filter").attr("height","300%").attr("x","-100%").attr("y","-100%").attr("id","blur").attr("width","300%").append("feGaussianBlur").attr("stdDeviation","2 2");var s=i.append("g");this.chart=s,s.attr("transform","translate("+h+","+v+")"),this.interval=setInterval(this.getIntervalFn(),1e3);var o=(0,c.BYU)().domain([.5,t.length+.5]).range([1,p*t.length]),u=(0,c.BYU)().domain([0,(0,c.Fp7)(t,(function(t){return t.metric}))]).rangeRound([0,-7*(0,c.Fp7)(t,(function(t){return t.metric}))]),l=s.append("g");l.attr("class","xAxis "+d).attr("transform","translate(0,"+m+")").call((0,c.LLu)(o)),l.append("text").attr("transform","translate("+p*t.length/2+" ,0)").attr("class","xAxisLabel").attr("y",40).attr("font-size","1.3em").attr("fill","black").style("text-anchor","end").text("Number");var f=s.append("g");f.attr("class","yAxis "+d).attr("transform","translate(0,"+m+")").call((0,c.y4O)(u)),f.append("text").attr("transform","translate(-30,-220)").attr("y",40).attr("font-size","1.3em").attr("fill","black").style("text-anchor","end").text("Value"),this.drawRectangles()},r.addBar=function(t){this.bars.push(t)},r.getBars=function(){return this.bars.slice()},r.refresh=function(){this.drawRectangles(),this.redraw()},r.clearInterval=function(t){function r(){return t.apply(this,arguments)}return r.toString=function(){return t.toString()},r}((function(){this.interval&&clearInterval(this.interval)})),r.getBarsSelection=function(){return this.chart.selectAll("rect")},r.drawRectangles=function(){var t=this,r=this.bars,n=this.color;this.getBarsSelection().data(r).enter().append("rect").attr("x",(function(){for(var t=arguments.length,r=new Array(t),n=0;n<t;n++)r[n]=arguments[n];var e=r[1];return p*e})).attr("y",b).attr("width",p).attr("height",y).attr("class",this.barClassName).attr("fill",(function(t){return n(t)})).on("mouseover",(function(){for(var r=arguments.length,n=new Array(r),e=0;e<r;e++)n[e]=arguments[e];var a=n[1];t.getBarsSelection().style("filter",(function(t){return t.id===a.id?null:"url(#blur)"})),t.clearInterval()})).on("mouseleave",(function(){t.getBarsSelection().style("filter",null),t.clearInterval(),t.interval=setInterval(t.getIntervalFn(),1e3)})).attr("title",(function(t){return t.metric})),$("."+this.barClassName).tooltip({track:!0})},r.getIntervalFn=function(){var t=this;return function(){var r=t.bars;r.unshift(r.pop()),t.redraw()}},r.redraw=function(){var t=this.bars,r=this.chart,n=this.color;if(r){var e=(0,c.BYU)().domain([.5,t.length+.5]).range([1,p*t.length]),a=(0,c.LLu)(e);r.select(".xAxis").transition().duration(500).call(a),r.select(".xAxisLabel").transition().duration(500).attr("transform","translate("+p*t.length/2+" ,0)"),r.selectAll("rect").data(t).transition().duration(500).attr("y",b).attr("height",y).attr("fill",n).select("title").text((function(t){return t.metric}))}},t}(),x="chart",B=function(){var t=(0,s.Z)(u().mark((function t(){var r;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch("/demos/data/d3js/bars/data.json");case 2:return r=t.sent,t.abrupt("return",r.json());case 4:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),C=function(){var t=(0,s.Z)(u().mark((function t(){var r,n,e,a;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,B();case 2:r=t.sent,n={bars:{bars:r}.bars.map((function(){for(var t=arguments.length,r=new Array(t),n=0;n<t;n++)r[n]=arguments[n];var e=r[0],a=r[1];return{id:a,metric:e}})),rootElId:x},(e=new w(n)).render(),(a=document.getElementById(f)).addEventListener("click",(function(){var t=e.getBars(),r=(0,c.Fp7)(t,(function(t){return t.id}))+1;e.addBar({id:r,metric:Math.floor(Math.random()*(0,c.Fp7)(t,(function(t){return t.metric})))+1}),e.refresh(),t.length>=20&&a.setAttribute("disabled","disabled")}));case 8:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),I=C,E=function(t){var r=t.pageContext;return e.createElement(i.Z,{links:[a.H.STYLE],main:I,pageContext:r,scripts:[a.H.SCRIPT]},e.createElement("form",null,e.createElement("button",{className:"btn btn-info",id:f,type:"button"},"Add item")),e.createElement("div",{id:x}))}},2656:function(t,r,n){t.exports=n(3076)},8634:function(t,r,n){"use strict";function e(t,r,n,e,a,i,s){try{var o=t[i](s),u=o.value}catch(c){return void n(c)}o.done?r(u):Promise.resolve(u).then(e,a)}function a(t){return function(){var r=this,n=arguments;return new Promise((function(a,i){var s=t.apply(r,n);function o(t){e(s,a,i,o,u,"next",t)}function u(t){e(s,a,i,o,u,"throw",t)}o(void 0)}))}}n.d(r,{Z:function(){return a}})}}]);
//# sourceMappingURL=component---src-pages-d-3-js-bars-tsx-8948966d1f9129604346.js.map