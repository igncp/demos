(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[914],{3099:function(e){e.exports=function(e){if("function"!=typeof e)throw TypeError(String(e)+" is not a function");return e}},8113:function(e,t,n){var a=n(5005);e.exports=a("navigator","userAgent")||""},7392:function(e,t,n){var a,o,r=n(7854),u=n(8113),i=r.process,l=i&&i.versions,d=l&&l.v8;d?o=(a=d.split("."))[0]<4?1:a[0]+a[1]:u&&(!(a=u.match(/Edge\/(\d+)/))||a[1]>=74)&&(a=u.match(/Chrome\/(\d+)/))&&(o=a[1]),e.exports=o&&+o},3366:function(e,t,n){var a=n(7854);e.exports=a.Promise},133:function(e,t,n){var a=n(7392),o=n(7293);e.exports=!!Object.getOwnPropertySymbols&&!o((function(){var e=Symbol();return!String(e)||!(Object(e)instanceof Symbol)||!Symbol.sham&&a&&a<41}))},8523:function(e,t,n){"use strict";var a=n(3099),o=function(e){var t,n;this.promise=new e((function(e,a){if(void 0!==t||void 0!==n)throw TypeError("Bad Promise constructor");t=e,n=a})),this.resolve=a(t),this.reject=a(n)};e.exports.f=function(e){return new o(e)}},9478:function(e,t,n){var a=n(9670),o=n(111),r=n(8523);e.exports=function(e,t){if(a(e),o(t)&&t.constructor===e)return t;var n=r.f(e);return(0,n.resolve)(t),n.promise}},6707:function(e,t,n){var a=n(9670),o=n(3099),r=n(5112)("species");e.exports=function(e,t){var n,u=a(e).constructor;return void 0===u||null==(n=a(u)[r])?t:o(n)}},3307:function(e,t,n){var a=n(133);e.exports=a&&!Symbol.sham&&"symbol"==typeof Symbol.iterator},5112:function(e,t,n){var a=n(7854),o=n(2309),r=n(6656),u=n(9711),i=n(133),l=n(3307),d=o("wks"),c=a.Symbol,s=l?c:c&&c.withoutSetter||u;e.exports=function(e){return r(d,e)&&(i||"string"==typeof d[e])||(i&&r(c,e)?d[e]=c[e]:d[e]=s("Symbol."+e)),d[e]}},7727:function(e,t,n){"use strict";var a=n(2109),o=n(1913),r=n(3366),u=n(7293),i=n(5005),l=n(6707),d=n(9478),c=n(1320);if(a({target:"Promise",proto:!0,real:!0,forced:!!r&&u((function(){r.prototype.finally.call({then:function(){}},(function(){}))}))},{finally:function(e){var t=l(this,i("Promise")),n="function"==typeof e;return this.then(n?function(n){return d(t,e()).then((function(){return n}))}:e,n?function(n){return d(t,e()).then((function(){throw n}))}:e)}}),!o&&"function"==typeof r){var s=i("Promise").prototype.finally;r.prototype.finally!==s&&c(r.prototype,"finally",s,{unsafe:!0})}},268:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return c}});var a=n(7294),o=n(5586),r=n.n(o),u=n(628),i=function(e){e.test("d3.arc",(function(e){var t=(0,u.Nb1)().outerRadius(10).innerRadius(0);e.deepEqual(typeof t({}),"string")})),e.test("d3.arc#centroid",(function(e){var t=(0,u.Nb1)().outerRadius(50).innerRadius(0).startAngle(0).endAngle(Math.PI);e.deepEqual(t.centroid({}),[25,0])})),e.test("d3.extent returns expected values",(function(e){e.deepEqual((0,u.Wem)([0,-10,5,100,-50,7]),[-50,100]),e.deepEqual((0,u.Wem)([]),[void 0,void 0]),e.deepEqual((0,u.Wem)([1,1]),[1,1])})),e.test("d3.interpolateNumber simple",(function(e){var t=(0,u.k46)(10,30);e.deepEqual(t(0),10),e.deepEqual(t(.5),20),e.deepEqual(t(1),30)})),e.test("d3.interpolate hex colors",(function(e){var t=(0,u.sXR)("#ccc","#fff");e.deepEqual(t(0),"rgb(204, 204, 204)"),e.deepEqual(t(.5),"rgb(230, 230, 230)"),e.deepEqual(t(1),"rgb(255, 255, 255)")})),e.test("d3.interpolate nested",(function(e){var t=(0,u.sXR)({bar:"white",foo:1},{bar:"black",foo:3});e.deepEqual(t(0),{bar:"rgb(255, 255, 255)",foo:1}),e.deepEqual(t(.5),{bar:"rgb(128, 128, 128)",foo:2}),e.deepEqual(t(1),{bar:"rgb(0, 0, 0)",foo:3})})),e.test("d3.geoOrthographic",(function(e){var t=(0,u.WvA)().scale(100),n=(0,u.WvA)().scale(1);e.deepEqual(t([0,0]),[480,250]),e.deepEqual(n([0,0]),[480,250])})),e.test("d3.max",(function(e){e.deepEqual((0,u.Fp7)([{foo:1},{foo:2},{foo:-1}],(function(e){return e.foo})),2)})),e.test("d3.pie generates the expected data",(function(e){var t=(0,u.ve8)().sort(null).value((function(e){return e.val}));e.deepEqual(t([{val:1},{val:1}]),[{data:{val:1},endAngle:Math.PI,index:0,padAngle:0,startAngle:0,value:1},{data:{val:1},endAngle:2*Math.PI,index:1,padAngle:0,startAngle:Math.PI,value:1}])})),e.test("d3.range returns expected values",(function(e){e.deepEqual((0,u.w6H)(0,10,1),[0,1,2,3,4,5,6,7,8,9]),e.deepEqual((0,u.w6H)(0,10,5),[0,5]),e.deepEqual((0,u.w6H)(0,10,6),[0,6]),e.deepEqual((0,u.w6H)(0,10,11),[0])})),e.test("d3.scaleLinear simple",(function(e){var t=(0,u.BYU)().domain([0,10]).range([1,2]);e.deepEqual(t(0),1),e.deepEqual(t(10),2),e.deepEqual(t(5),1.5)})),e.test("d3.scaleLinear simple 2",(function(e){var t=(0,u.BYU)().domain([0,1]).range([0,100]);e.deepEqual(t(0),0),e.deepEqual(t(.1),10),e.deepEqual(t(.2),20)})),e.test("d3.scaleOrdinal with color",(function(e){var t=(0,u.PKp)(u.i4X);e.deepEqual(t("0"),"#b3e2cd")})),e.test("d3.scaleQuantile",(function(e){var t=(0,u.FTZ)().domain([0,100]).range(["A","B","C","D","E"]);e.deepEqual(t(0),"A"),e.deepEqual(t(19),"A"),e.deepEqual(t(20),"B"),e.deepEqual(t(100),"E")})),e.test("d3.scaleQuantize",(function(e){var t=(0,u.aE8)().domain([0,100]).range(Array.from({length:11}).map((function(e,t){return t})));e.deepEqual(t(0),0),e.deepEqual(t(19),2),e.deepEqual(t(25),2),e.deepEqual(t(26),2),e.deepEqual(t(30),3),e.deepEqual(t(60),6),e.deepEqual(t(100),10)})),e.test("d3.select",(function(e){var t=document.createElement("div"),n=(0,u.Ys)(t).append("svg"),a=n.append("path").data([1]);n.attr("id","foo"),e.deepEqual(n.node()instanceof SVGElement,!0),e.deepEqual(n.node().getAttribute("id"),"foo"),e.deepEqual(a.node()instanceof SVGPathElement,!0)}))},l="undefined"==typeof window?null:n(3793),d=function(e){e.test("basic",(function(e){var t=document.createElement("div"),n=l(t,100,100);e.deepEqual(n instanceof l,!0),e.deepEqual(n.canvas instanceof SVGSVGElement,!0),e.deepEqual(n.width,100),e.deepEqual(n.height,100),e.deepEqual(n.getSize(),{height:0,width:0})}))},c=function(){return(0,a.useEffect)((function(){"undefined"!=typeof window&&(r().module("d3",(function(){i(r())})),r().module("raphael",(function(){d(r())})),r().start())}),[]),a.createElement("div",null,a.createElement("link",{href:"https://code.jquery.com/qunit/qunit-2.16.0.css",rel:"stylesheet"}),a.createElement("div",{id:"qunit"}),a.createElement("div",{id:"qunit-fixture"}))}}}]);
//# sourceMappingURL=component---src-pages-testing-tsx-2501efd1a266a08795da.js.map