(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[964],{9646:function(t,r,e){"use strict";var n;e.d(r,{Z:function(){return m}});var a=new Uint8Array(16);function i(){if(!n&&!(n="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return n(a)}var s=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;for(var o=function(t){return"string"==typeof t&&s.test(t)},u=[],c=0;c<256;++c)u.push((c+256).toString(16).substr(1));var l,d,f=function(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,e=(u[t[r+0]]+u[t[r+1]]+u[t[r+2]]+u[t[r+3]]+"-"+u[t[r+4]]+u[t[r+5]]+"-"+u[t[r+6]]+u[t[r+7]]+"-"+u[t[r+8]]+u[t[r+9]]+"-"+u[t[r+10]]+u[t[r+11]]+u[t[r+12]]+u[t[r+13]]+u[t[r+14]]+u[t[r+15]]).toLowerCase();if(!o(e))throw TypeError("Stringified UUID is invalid");return e},h=0,v=0;var m=function(t,r,e){var n=r&&e||0,a=r||new Array(16),s=(t=t||{}).node||l,o=void 0!==t.clockseq?t.clockseq:d;if(null==s||null==o){var u=t.random||(t.rng||i)();null==s&&(s=l=[1|u[0],u[1],u[2],u[3],u[4],u[5]]),null==o&&(o=d=16383&(u[6]<<8|u[7]))}var c=void 0!==t.msecs?t.msecs:Date.now(),m=void 0!==t.nsecs?t.nsecs:v+1,p=c-h+(m-v)/1e4;if(p<0&&void 0===t.clockseq&&(o=o+1&16383),(p<0||c>h)&&void 0===t.nsecs&&(m=0),m>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");h=c,v=m,d=o;var g=(1e4*(268435455&(c+=122192928e5))+m)%4294967296;a[n++]=g>>>24&255,a[n++]=g>>>16&255,a[n++]=g>>>8&255,a[n++]=255&g;var b=c/4294967296*1e4&268435455;a[n++]=b>>>8&255,a[n++]=255&b,a[n++]=b>>>24&15|16,a[n++]=b>>>16&255,a[n++]=o>>>8|128,a[n++]=255&o;for(var y=0;y<6;++y)a[n+y]=s[y];return r||f(a)}},6126:function(t,r,e){"use strict";var n;e.d(r,{H:function(){return a},d:function(){return n}}),function(t){t.STORYBOOK="storybook",t.TESTING="testing"}(n||(n={}));var a={SCRIPT:"/vendors/jquery-ui/jquery-ui.min.js",STYLE:"/vendors/jquery-ui/themes/base/jquery-ui.min.css"}},9511:function(t,r,e){"use strict";e.r(r),e.d(r,{default:function(){return E}});var n=e(7294),a=e(6126),i=e(4275),s=e(8634),o=e(2656),u=e.n(o),c=e(862),l=e(9646),d="bars-module--axis--8e5e1",f="bars-module--addItemButton--4a90d",h=160,v=100,m=500-2*v,p=30,g=["#323247","#7C7CC9","#72B66C","#429742"],b=function(t){return m-7*t.metric},y=function(t){return 7*t.metric},w=function(){function t(t){var r=t.bars,e=t.rootElId;this.bars=r,this.rootElId=e,this.barClassName="bars-"+(0,l.Z)().slice(0,6),this.interval=null,this.chart=null,this.color=null}var r=t.prototype;return r.render=function(){var t=this.bars,r=this.rootElId,e=document.getElementById(r).getBoundingClientRect().width,n=(0,c.BYU)().domain((0,c.Wem)(t,(function(t){return t.metric}))).range([0,1]),a=(0,c.BYU)().domain((0,c.w6H)(0,1,1/g.length)).range(g);this.color=function(t){return a(n(t.metric))};var i=(0,c.Ys)("#"+r).append("svg");i.attr("height",500).attr("width",e).attr("class","bars-module--barsChart--e89b5"),i.append("g").append("filter").attr("height","300%").attr("x","-100%").attr("y","-100%").attr("id","blur").attr("width","300%").append("feGaussianBlur").attr("stdDeviation","2 2");var s=i.append("g");this.chart=s,s.attr("transform","translate("+h+","+v+")"),this.interval=setInterval(this.getIntervalFn(),1e3);var o=(0,c.BYU)().domain([.5,t.length+.5]).range([1,p*t.length]),u=(0,c.BYU)().domain([0,(0,c.Fp7)(t,(function(t){return t.metric}))]).rangeRound([0,-7*(0,c.Fp7)(t,(function(t){return t.metric}))]),l=s.append("g");l.attr("class","xAxis "+d).attr("transform","translate(0,"+m+")").call((0,c.LLu)(o)),l.append("text").attr("transform","translate("+p*t.length/2+" ,0)").attr("class","xAxisLabel").attr("y",40).attr("font-size","1.3em").attr("fill","black").style("text-anchor","end").text("Number");var f=s.append("g");f.attr("class","yAxis "+d).attr("transform","translate(0,"+m+")").call((0,c.y4O)(u)),f.append("text").attr("transform","translate(-30,-220)").attr("y",40).attr("font-size","1.3em").attr("fill","black").style("text-anchor","end").text("Value"),this.drawRectangles()},r.addBar=function(t){this.bars.push(t)},r.getBars=function(){return this.bars.slice()},r.refresh=function(){this.drawRectangles(),this.redraw()},r.clearInterval=function(t){function r(){return t.apply(this,arguments)}return r.toString=function(){return t.toString()},r}((function(){this.interval&&clearInterval(this.interval)})),r.getBarsSelection=function(){return this.chart.selectAll("rect")},r.drawRectangles=function(){var t=this,r=this.bars,e=this.color;this.getBarsSelection().data(r).enter().append("rect").attr("x",(function(){for(var t=arguments.length,r=new Array(t),e=0;e<t;e++)r[e]=arguments[e];var n=r[1];return p*n})).attr("y",b).attr("width",p).attr("height",y).attr("class",this.barClassName).attr("fill",(function(t){return e(t)})).on("mouseover",(function(){for(var r=arguments.length,e=new Array(r),n=0;n<r;n++)e[n]=arguments[n];var a=e[1];t.getBarsSelection().style("filter",(function(t){return t.id===a.id?null:"url(#blur)"})),t.clearInterval()})).on("mouseleave",(function(){t.getBarsSelection().style("filter",null),t.clearInterval(),t.interval=setInterval(t.getIntervalFn(),1e3)})).attr("title",(function(t){return t.metric})),$("."+this.barClassName).tooltip({track:!0})},r.getIntervalFn=function(){var t=this;return function(){var r=t.bars;r.unshift(r.pop()),t.redraw()}},r.redraw=function(){var t=this.bars,r=this.chart,e=this.color;if(r){var n=(0,c.BYU)().domain([.5,t.length+.5]).range([1,p*t.length]),a=(0,c.LLu)(n);r.select(".xAxis").transition().duration(500).call(a),r.select(".xAxisLabel").transition().duration(500).attr("transform","translate("+p*t.length/2+" ,0)"),r.selectAll("rect").data(t).transition().duration(500).attr("y",b).attr("height",y).attr("fill",e).select("title").text((function(t){return t.metric}))}},t}(),x="chart",C=function(){var t=(0,s.Z)(u().mark((function t(){var r;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch("/demos/data/d3js/bars/data.json");case 2:return r=t.sent,t.abrupt("return",r.json());case 4:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),B=function(){var t=(0,s.Z)(u().mark((function t(){var r,e,n,a;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,C();case 2:r=t.sent,e={bars:{bars:r}.bars.map((function(){for(var t=arguments.length,r=new Array(t),e=0;e<t;e++)r[e]=arguments[e];var n=r[0],a=r[1];return{id:a,metric:n}})),rootElId:x},(n=new w(e)).render(),(a=document.getElementById(f)).addEventListener("click",(function(){var t=n.getBars(),r=(0,c.Fp7)(t,(function(t){return t.id}))+1;n.addBar({id:r,metric:Math.floor(Math.random()*(0,c.Fp7)(t,(function(t){return t.metric})))+1}),n.refresh(),t.length>=20&&a.setAttribute("disabled","disabled")}));case 8:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),I=B,E=function(t){var r=t.pageContext;return n.createElement(i.Z,{links:[a.H.STYLE],main:I,pageContext:r,scripts:[a.H.SCRIPT]},n.createElement("form",null,n.createElement("button",{className:"btn btn-info",id:f,type:"button"},"Add item")),n.createElement("div",{id:x}))}},2656:function(t,r,e){t.exports=e(3076)},8634:function(t,r,e){"use strict";function n(t,r,e,n,a,i,s){try{var o=t[i](s),u=o.value}catch(c){return void e(c)}o.done?r(u):Promise.resolve(u).then(n,a)}function a(t){return function(){var r=this,e=arguments;return new Promise((function(a,i){var s=t.apply(r,e);function o(t){n(s,a,i,o,u,"next",t)}function u(t){n(s,a,i,o,u,"throw",t)}o(void 0)}))}}e.d(r,{Z:function(){return a}})}}]);
//# sourceMappingURL=component---src-pages-d-3-js-bars-tsx-7964803a09c235dea265.js.map