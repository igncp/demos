(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[914],{9483:function(e,t,n){var r=n(7854),i=n(4411),s=n(6330),a=r.TypeError;e.exports=function(e){if(i(e))return e;throw a(s(e)+" is not a constructor")}},648:function(e,t,n){var r=n(7854),i=n(1694),s=n(614),a=n(4326),u=n(5112)("toStringTag"),o=r.Object,l="Arguments"==a(function(){return arguments}());e.exports=i?a:function(e){var t,n,r;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(n=function(e,t){try{return e[t]}catch(n){}}(t=o(e),u))?n:l?a(t):"Object"==(r=a(t))&&s(t.callee)?"Arguments":r}},4411:function(e,t,n){var r=n(1702),i=n(7293),s=n(614),a=n(648),u=n(5005),o=n(2788),l=function(){},c=[],f=u("Reflect","construct"),d=/^\s*(?:class|function)\b/,h=r(d.exec),p=!d.exec(l),v=function(e){if(!s(e))return!1;try{return f(l,c,e),!0}catch(t){return!1}},m=function(e){if(!s(e))return!1;switch(a(e)){case"AsyncFunction":case"GeneratorFunction":case"AsyncGeneratorFunction":return!1}try{return p||!!h(d,o(e))}catch(t){return!0}};m.sham=!0,e.exports=!f||i((function(){var e;return v(v.call)||!v(Object)||!v((function(){e=!0}))||e}))?m:v},3366:function(e,t,n){var r=n(7854);e.exports=r.Promise},8523:function(e,t,n){"use strict";var r=n(9662),i=function(e){var t,n;this.promise=new e((function(e,r){if(void 0!==t||void 0!==n)throw TypeError("Bad Promise constructor");t=e,n=r})),this.resolve=r(t),this.reject=r(n)};e.exports.f=function(e){return new i(e)}},9478:function(e,t,n){var r=n(9670),i=n(111),s=n(8523);e.exports=function(e,t){if(r(e),i(t)&&t.constructor===e)return t;var n=s.f(e);return(0,n.resolve)(t),n.promise}},6707:function(e,t,n){var r=n(9670),i=n(9483),s=n(5112)("species");e.exports=function(e,t){var n,a=r(e).constructor;return void 0===a||null==(n=r(a)[s])?t:i(n)}},1694:function(e,t,n){var r={};r[n(5112)("toStringTag")]="z",e.exports="[object z]"===String(r)},5837:function(e,t,n){n(2109)({global:!0},{globalThis:n(7854)})},7727:function(e,t,n){"use strict";var r=n(2109),i=n(1913),s=n(3366),a=n(7293),u=n(5005),o=n(614),l=n(6707),c=n(9478),f=n(1320);if(r({target:"Promise",proto:!0,real:!0,forced:!!s&&a((function(){s.prototype.finally.call({then:function(){}},(function(){}))}))},{finally:function(e){var t=l(this,u("Promise")),n=o(e);return this.then(n?function(n){return c(t,e()).then((function(){return n}))}:e,n?function(n){return c(t,e()).then((function(){throw n}))}:e)}}),!i&&o(s)){var d=u("Promise").prototype.finally;s.prototype.finally!==d&&f(s.prototype,"finally",d,{unsafe:!0})}},5743:function(e,t,n){n(5837)},7103:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return A}});var r=n(1578),i=n.n(r),s=n(7294),a=n(5414),u=n(5633),o=function(e){e.test("d3.arc",(function(e){var t=(0,u.Nb1)().outerRadius(10).innerRadius(0);e.deepEqual(typeof t({}),"string")})),e.test("d3.arc#centroid",(function(e){var t=(0,u.Nb1)().outerRadius(50).innerRadius(0).startAngle(0).endAngle(Math.PI);e.deepEqual(t.centroid({}),[25,0])})),e.test("d3.extent returns expected values",(function(e){e.deepEqual((0,u.Wem)([0,-10,5,100,-50,7]),[-50,100]),e.deepEqual((0,u.Wem)([]),[void 0,void 0]),e.deepEqual((0,u.Wem)([1,1]),[1,1])})),e.test("d3.interpolateNumber simple",(function(e){var t=(0,u.k46)(10,30);e.deepEqual(t(0),10),e.deepEqual(t(.5),20),e.deepEqual(t(1),30)})),e.test("d3.interpolate hex colors",(function(e){var t=(0,u.sXR)("#ccc","#fff");e.deepEqual(t(0),"rgb(204, 204, 204)"),e.deepEqual(t(.5),"rgb(230, 230, 230)"),e.deepEqual(t(1),"rgb(255, 255, 255)")})),e.test("d3.interpolate nested",(function(e){var t=(0,u.sXR)({bar:"white",foo:1},{bar:"black",foo:3});e.deepEqual(t(0),{bar:"rgb(255, 255, 255)",foo:1}),e.deepEqual(t(.5),{bar:"rgb(128, 128, 128)",foo:2}),e.deepEqual(t(1),{bar:"rgb(0, 0, 0)",foo:3})})),e.test("d3.geoOrthographic",(function(e){var t=(0,u.WvA)().scale(100),n=(0,u.WvA)().scale(1);e.deepEqual(t([0,0]),[480,250]),e.deepEqual(n([0,0]),[480,250])})),e.test("d3.max",(function(e){e.deepEqual((0,u.Fp7)([{foo:1},{foo:2},{foo:-1}],(function(e){return e.foo})),2)})),e.test("d3.pie generates the expected data",(function(e){var t=(0,u.ve8)().sort(null).value((function(e){return e.val}));e.deepEqual(t([{val:1},{val:1}]),[{data:{val:1},endAngle:Math.PI,index:0,padAngle:0,startAngle:0,value:1},{data:{val:1},endAngle:2*Math.PI,index:1,padAngle:0,startAngle:Math.PI,value:1}])})),e.test("d3.range returns expected values",(function(e){e.deepEqual((0,u.w6H)(0,10,1),[0,1,2,3,4,5,6,7,8,9]),e.deepEqual((0,u.w6H)(0,10,5),[0,5]),e.deepEqual((0,u.w6H)(0,10,6),[0,6]),e.deepEqual((0,u.w6H)(0,10,11),[0])})),e.test("d3.scaleLinear simple",(function(e){var t=(0,u.BYU)().domain([0,10]).range([1,2]);e.deepEqual(t(0),1),e.deepEqual(t(10),2),e.deepEqual(t(5),1.5)})),e.test("d3.scaleLinear simple 2",(function(e){var t=(0,u.BYU)().domain([0,1]).range([0,100]);e.deepEqual(t(0),0),e.deepEqual(t(.1),10),e.deepEqual(t(.2),20)})),e.test("d3.scaleOrdinal with color",(function(e){var t=(0,u.PKp)(u.i4X);e.deepEqual(t("0"),"#b3e2cd")})),e.test("d3.scaleQuantile",(function(e){var t=(0,u.FTZ)().domain([0,100]).range(["A","B","C","D","E"]);e.deepEqual(t(0),"A"),e.deepEqual(t(19),"A"),e.deepEqual(t(20),"B"),e.deepEqual(t(100),"E")})),e.test("d3.scaleQuantize",(function(e){var t=(0,u.aE8)().domain([0,100]).range(Array.from({length:11}).map((function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var r=t[1];return r})));e.deepEqual(t(0),0),e.deepEqual(t(19),2),e.deepEqual(t(25),2),e.deepEqual(t(26),2),e.deepEqual(t(30),3),e.deepEqual(t(60),6),e.deepEqual(t(100),10)})),e.test("d3.select",(function(e){var t=document.createElement("div"),n=(0,u.Ys)(t).append("svg"),r=n.append("path").data([1]);n.attr("id","foo"),e.deepEqual(n.node()instanceof SVGElement,!0),e.deepEqual(n.node().getAttribute("id"),"foo"),e.deepEqual(r.node()instanceof SVGPathElement,!0)}))},l="undefined"==typeof window?null:n(3793),c=function(e){e.test("basic",(function(e){var t=document.createElement("div"),n=l(t,100,100);e.deepEqual(n instanceof l,!0),e.deepEqual(n.canvas instanceof SVGSVGElement,!0),e.deepEqual(n.width,100),e.deepEqual(n.height,100),e.deepEqual(n.getSize(),{height:0,width:0})}))},f=n(3456),d=n(5671),h=n(3144),p={uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:"\n\n\t\tvarying vec2 vUv;\n\n\t\tvoid main() {\n\n\t\t\tvUv = uv;\n\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n\t\t}",fragmentShader:"\n\n\t\tuniform float opacity;\n\n\t\tuniform sampler2D tDiffuse;\n\n\t\tvarying vec2 vUv;\n\n\t\tvoid main() {\n\n\t\t\tvec4 texel = texture2D( tDiffuse, vUv );\n\t\t\tgl_FragColor = opacity * texel;\n\n\t\t}"},v=n(136),m=n(6215),E=n(1120),g=function(){function e(){(0,d.Z)(this,e),this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}return(0,h.Z)(e,[{key:"setSize",value:function(){}},{key:"render",value:function(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}}]),e}(),q=new f.iKG(-1,1,1,-1,0,1),w=new f.u9r;w.setAttribute("position",new f.a$l([-1,3,0,-1,-1,0,3,-1,0],3)),w.setAttribute("uv",new f.a$l([0,2,0,0,2,0],2));var y=function(){function e(t){(0,d.Z)(this,e),this._mesh=new f.Kj0(w,t)}return(0,h.Z)(e,[{key:"dispose",value:function(){this._mesh.geometry.dispose()}},{key:"render",value:function(e){e.render(this._mesh,q)}},{key:"material",get:function(){return this._mesh.material},set:function(e){this._mesh.material=e}}]),e}();function b(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=(0,E.Z)(e);if(t){var i=(0,E.Z)(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return(0,m.Z)(this,n)}}var x=function(e){(0,v.Z)(n,e);var t=b(n);function n(e,r){var i;return(0,d.Z)(this,n),(i=t.call(this)).textureID=void 0!==r?r:"tDiffuse",e instanceof f.jyz?(i.uniforms=e.uniforms,i.material=e):e&&(i.uniforms=f.rDY.clone(e.uniforms),i.material=new f.jyz({defines:Object.assign({},e.defines),uniforms:i.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),i.fsQuad=new y(i.material),i}return(0,h.Z)(n,[{key:"render",value:function(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}}]),n}(g);function S(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=(0,E.Z)(e);if(t){var i=(0,E.Z)(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return(0,m.Z)(this,n)}}var R=function(e){(0,v.Z)(n,e);var t=S(n);function n(e,r){var i;return(0,d.Z)(this,n),(i=t.call(this)).scene=e,i.camera=r,i.clear=!0,i.needsSwap=!1,i.inverse=!1,i}return(0,h.Z)(n,[{key:"render",value:function(e,t,n){var r,i,s=e.getContext(),a=e.state;a.buffers.color.setMask(!1),a.buffers.depth.setMask(!1),a.buffers.color.setLocked(!0),a.buffers.depth.setLocked(!0),this.inverse?(r=0,i=1):(r=1,i=0),a.buffers.stencil.setTest(!0),a.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),a.buffers.stencil.setFunc(s.ALWAYS,r,4294967295),a.buffers.stencil.setClear(i),a.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),a.buffers.color.setLocked(!1),a.buffers.depth.setLocked(!1),a.buffers.stencil.setLocked(!1),a.buffers.stencil.setFunc(s.EQUAL,1,4294967295),a.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),a.buffers.stencil.setLocked(!0)}}]),n}(g),T=function(e){(0,v.Z)(n,e);var t=S(n);function n(){var e;return(0,d.Z)(this,n),(e=t.call(this)).needsSwap=!1,e}return(0,h.Z)(n,[{key:"render",value:function(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}]),n}(g),k=function(){function e(t,n){if((0,d.Z)(this,e),this.renderer=t,void 0===n){var r={minFilter:f.wem,magFilter:f.wem,format:f.wk1},i=t.getSize(new f.FM8);this._pixelRatio=t.getPixelRatio(),this._width=i.width,this._height=i.height,(n=new f.dd2(this._width*this._pixelRatio,this._height*this._pixelRatio,r)).texture.name="EffectComposer.rt1"}else this._pixelRatio=1,this._width=n.width,this._height=n.height;this.renderTarget1=n,this.renderTarget2=n.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],void 0===p&&console.error("THREE.EffectComposer relies on CopyShader"),void 0===x&&console.error("THREE.EffectComposer relies on ShaderPass"),this.copyPass=new x(p),this.clock=new f.SUY}return(0,h.Z)(e,[{key:"swapBuffers",value:function(){var e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}},{key:"addPass",value:function(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}},{key:"insertPass",value:function(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}},{key:"removePass",value:function(e){var t=this.passes.indexOf(e);-1!==t&&this.passes.splice(t,1)}},{key:"isLastEnabledPass",value:function(e){for(var t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}},{key:"render",value:function(e){void 0===e&&(e=this.clock.getDelta());for(var t=this.renderer.getRenderTarget(),n=!1,r=0,i=this.passes.length;r<i;r++){var s=this.passes[r];if(!1!==s.enabled){if(s.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(r),s.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),s.needsSwap){if(n){var a=this.renderer.getContext(),u=this.renderer.state.buffers.stencil;u.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),u.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}void 0!==R&&(s instanceof R?n=!0:s instanceof T&&(n=!1))}}this.renderer.setRenderTarget(t)}},{key:"reset",value:function(e){if(void 0===e){var t=this.renderer.getSize(new f.FM8);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,(e=this.renderTarget1.clone()).setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}},{key:"setSize",value:function(e,t){this._width=e,this._height=t;var n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(var i=0;i<this.passes.length;i++)this.passes[i].setSize(n,r)}},{key:"setPixelRatio",value:function(e){this._pixelRatio=e,this.setSize(this._width,this._height)}}]),e}(),P=(new f.iKG(-1,1,1,-1,0,1),new f.u9r);P.setAttribute("position",new f.a$l([-1,3,0,-1,-1,0,3,-1,0],3)),P.setAttribute("uv",new f.a$l([0,2,0,0,2,0],2));var _=function(e){e.test("Audio",(function(e){var t=new f.SJI,n=new f.BbS(t);e.deepEqual(n.name,""),e.deepEqual(n.autoplay,!1),e.deepEqual(n.isPlaying,!1),e.deepEqual(n.duration,void 0)})),e.test("Color",(function(e){var t=new f.Ilk(16776960),n=new f.Ilk(16711680);e.deepEqual(t.r,1),e.deepEqual(t.b,0),e.deepEqual(t.getHex(),16776960),e.deepEqual(t.getHexString(),"ffff00"),e.deepEqual(t.getStyle(),"rgb(255,255,0)"),e.deepEqual(t.sub(n).getHexString(),"00ff00"),e.deepEqual(t.getHexString(),"00ff00"),e.deepEqual(n.getHexString(),"ff0000")})),e.test("EffectComposer",(function(e){var t=new f.CP7,n=new k(t),r=new g;e.deepEqual(n.passes,[]),n.addPass(r),e.deepEqual(n.passes,[r]),n.removePass(r),e.deepEqual(n.passes,[])})),e.test("MeshLambertMaterial",(function(e){var t=new f.YBo;e.deepEqual(t.lightMap,null),e.deepEqual(t.alphaTest,0),e.deepEqual(t.type,"MeshLambertMaterial"),e.deepEqual(t.opacity,1),e.deepEqual(t.toJSON().reflectivity,1),e.deepEqual(t.emissive,new f.Ilk(0))})),e.test("Vector3",(function(e){var t=new f.Pa4(1,1,1),n=new f.Pa4;e.deepEqual(t.distanceTo(n).toFixed(3),Math.pow(3,.5).toFixed(3)),e.deepEqual(t.divideScalar(.5),new f.Pa4(2,2,2)),e.deepEqual(t.x,2)})),e.test("WebGLRenderer",(function(e){var t=new f.CP7;e.deepEqual(t.domElement instanceof HTMLCanvasElement,!0),e.deepEqual(t.info.memory,{geometries:0,textures:0}),e.deepEqual(t.autoClear,!0)}))},A=function(){return(0,s.useEffect)((function(){if("undefined"==typeof window)return function(){};i().module("d3",(function(){o(i())})),i().module("raphael",(function(){c(i())})),i().module("threeJS",(function(){_(i())})),i().start();var e=window.setTimeout((function(){e=null,function(){var e=document.createElement("a"),t=document.createElement("span");e.setAttribute("href","https://github.com/igncp/demos/tree/main/src/tests/qunit"),e.setAttribute("target","_blank"),e.innerText="Read tests files in Github",t.innerText=" | ";var n=document.querySelector("#qunit-header"),r=null==n?void 0:n.querySelector("a");r&&(r.setAttribute("href","/demos/"),r.innerText="Demos"),null==n||n.appendChild(t),null==n||n.appendChild(e)}()}),20);return function(){e&&clearTimeout(e)}}),[]),s.createElement("div",null,s.createElement(a.q,{meta:[{content:"Testing page for learning the usage of libraries like D3",name:"description"}],title:"Demos - QUnit Tests"}),s.createElement("link",{href:"https://code.jquery.com/qunit/qunit-2.16.0.css",rel:"stylesheet"}),s.createElement("div",{id:"qunit"}),s.createElement("div",{id:"qunit-fixture"}))}},5861:function(e,t,n){"use strict";function r(e,t,n,r,i,s,a){try{var u=e[s](a),o=u.value}catch(l){return void n(l)}u.done?t(o):Promise.resolve(o).then(r,i)}function i(e){return function(){var t=this,n=arguments;return new Promise((function(i,s){var a=e.apply(t,n);function u(e){r(a,i,s,u,o,"next",e)}function o(e){r(a,i,s,u,o,"throw",e)}u(void 0)}))}}n.d(t,{Z:function(){return i}})}}]);
//# sourceMappingURL=component---src-pages-testing-tsx-032d60209078b470b1b1.js.map