(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[796],{3099:function(e){e.exports=function(e){if("function"!=typeof e)throw TypeError(String(e)+" is not a function");return e}},8113:function(e,t,n){var o=n(5005);e.exports=o("navigator","userAgent")||""},7392:function(e,t,n){var o,r,a=n(7854),i=n(8113),u=a.process,l=u&&u.versions,d=l&&l.v8;d?r=(o=d.split("."))[0]<4?1:o[0]+o[1]:i&&(!(o=i.match(/Edge\/(\d+)/))||o[1]>=74)&&(o=i.match(/Chrome\/(\d+)/))&&(r=o[1]),e.exports=r&&+r},3366:function(e,t,n){var o=n(7854);e.exports=o.Promise},133:function(e,t,n){var o=n(7392),r=n(7293);e.exports=!!Object.getOwnPropertySymbols&&!r((function(){var e=Symbol();return!String(e)||!(Object(e)instanceof Symbol)||!Symbol.sham&&o&&o<41}))},8523:function(e,t,n){"use strict";var o=n(3099),r=function(e){var t,n;this.promise=new e((function(e,o){if(void 0!==t||void 0!==n)throw TypeError("Bad Promise constructor");t=e,n=o})),this.resolve=o(t),this.reject=o(n)};e.exports.f=function(e){return new r(e)}},9478:function(e,t,n){var o=n(9670),r=n(111),a=n(8523);e.exports=function(e,t){if(o(e),r(t)&&t.constructor===e)return t;var n=a.f(e);return(0,n.resolve)(t),n.promise}},6707:function(e,t,n){var o=n(9670),r=n(3099),a=n(5112)("species");e.exports=function(e,t){var n,i=o(e).constructor;return void 0===i||null==(n=o(i)[a])?t:r(n)}},3307:function(e,t,n){var o=n(133);e.exports=o&&!Symbol.sham&&"symbol"==typeof Symbol.iterator},5112:function(e,t,n){var o=n(7854),r=n(2309),a=n(6656),i=n(9711),u=n(133),l=n(3307),d=r("wks"),c=o.Symbol,s=l?c:c&&c.withoutSetter||i;e.exports=function(e){return a(d,e)&&(u||"string"==typeof d[e])||(u&&a(c,e)?d[e]=c[e]:d[e]=s("Symbol."+e)),d[e]}},7354:function(e,t,n){"use strict";var o=n(2109),r=n(1913),a=n(3366),i=n(7293),u=n(5005),l=n(6707),d=n(9478),c=n(1320);if(o({target:"Promise",proto:!0,real:!0,forced:!!a&&i((function(){a.prototype.finally.call({then:function(){}},(function(){}))}))},{finally:function(e){var t=l(this,u("Promise")),n="function"==typeof e;return this.then(n?function(n){return d(t,e()).then((function(){return n}))}:e,n?function(n){return d(t,e()).then((function(){throw n}))}:e)}}),!r&&"function"==typeof a){var s=u("Promise").prototype.finally;a.prototype.finally!==s&&c(a.prototype,"finally",s,{unsafe:!0})}},5145:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return d}});var o=n(7294),r=n(5586),a=n(5161),i=function(e){e.test("d3.arc",(function(e){var t=a.Nb1().outerRadius(10).innerRadius(0);e.deepEqual(typeof t({}),"string")})),e.test("d3.arc#centroid",(function(e){var t=a.Nb1().outerRadius(50).innerRadius(0).startAngle(0).endAngle(Math.PI);e.deepEqual(t.centroid({}),[25,0])})),e.test("d3.extent returns expected values",(function(e){e.deepEqual(a.Wem([0,-10,5,100,-50,7]),[-50,100]),e.deepEqual(a.Wem([]),[void 0,void 0]),e.deepEqual(a.Wem([1,1]),[1,1])})),e.test("d3.interpolateNumber simple",(function(e){var t=a.k46(10,30);e.deepEqual(t(0),10),e.deepEqual(t(.5),20),e.deepEqual(t(1),30)})),e.test("d3.interpolate hex colors",(function(e){var t=a.sXR("#ccc","#fff");e.deepEqual(t(0),"rgb(204, 204, 204)"),e.deepEqual(t(.5),"rgb(230, 230, 230)"),e.deepEqual(t(1),"rgb(255, 255, 255)")})),e.test("d3.interpolate nested",(function(e){var t=a.sXR({bar:"white",foo:1},{bar:"black",foo:3});e.deepEqual(t(0),{bar:"rgb(255, 255, 255)",foo:1}),e.deepEqual(t(.5),{bar:"rgb(128, 128, 128)",foo:2}),e.deepEqual(t(1),{bar:"rgb(0, 0, 0)",foo:3})})),e.test("d3.geoOrthographic",(function(e){var t=a.WvA().scale(100),n=a.WvA().scale(1);e.deepEqual(t([0,0]),[480,250]),e.deepEqual(n([0,0]),[480,250])})),e.test("d3.max",(function(e){e.deepEqual(a.Fp7([{foo:1},{foo:2},{foo:-1}],(function(e){return e.foo})),2)})),e.test("d3.pie generates the expected data",(function(e){var t=a.ve8().sort(null).value((function(e){return e.val}));e.deepEqual(t([{val:1},{val:1}]),[{data:{val:1},endAngle:Math.PI,index:0,padAngle:0,startAngle:0,value:1},{data:{val:1},endAngle:2*Math.PI,index:1,padAngle:0,startAngle:Math.PI,value:1}])})),e.test("d3.range returns expected values",(function(e){e.deepEqual(a.w6H(0,10,1),[0,1,2,3,4,5,6,7,8,9]),e.deepEqual(a.w6H(0,10,5),[0,5]),e.deepEqual(a.w6H(0,10,6),[0,6]),e.deepEqual(a.w6H(0,10,11),[0])})),e.test("d3.scaleLinear simple",(function(e){var t=a.BYU().domain([0,10]).range([1,2]);e.deepEqual(t(0),1),e.deepEqual(t(10),2),e.deepEqual(t(5),1.5)})),e.test("d3.scaleLinear simple 2",(function(e){var t=a.BYU().domain([0,1]).range([0,100]);e.deepEqual(t(0),0),e.deepEqual(t(.1),10),e.deepEqual(t(.2),20)})),e.test("d3.scaleOrdinal with color",(function(e){var t=a.PKp(a.i4X);e.deepEqual(t("0"),"#b3e2cd")})),e.test("d3.select",(function(e){var t=document.createElement("div"),n=a.Ys(t).append("svg"),o=n.append("path").data([1]);n.attr("id","foo"),e.deepEqual(n.node()instanceof SVGElement,!0),e.deepEqual(n.node().getAttribute("id"),"foo"),e.deepEqual(o.node()instanceof SVGPathElement,!0)}))},u="undefined"==typeof window?null:n(3793),l=function(e){e.test("basic",(function(e){var t=document.createElement("div"),n=u(t,100,100);e.deepEqual(n instanceof u,!0),e.deepEqual(n.canvas instanceof SVGSVGElement,!0),e.deepEqual(n.width,100),e.deepEqual(n.height,100),e.deepEqual(n.getSize(),{height:0,width:0})}))},d=function(){return(0,o.useEffect)((function(){"undefined"!=typeof window&&(r.QUnit.module("d3",(function(){i(r.QUnit)})),r.QUnit.module("raphael",(function(){l(r.QUnit)})),r.QUnit.start())}),[]),o.createElement("div",null,o.createElement("link",{href:"https://code.jquery.com/qunit/qunit-2.16.0.css",rel:"stylesheet"}),o.createElement("div",{id:"qunit"}),o.createElement("div",{id:"qunit-fixture"}))}}}]);
//# sourceMappingURL=component---src-pages-testing-js-c75dc00849c259daeaee.js.map