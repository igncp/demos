(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[118],{307:function(t,o,n){"use strict";n.r(o),n.d(o,{default:function(){return s}});var i=n(7294),e=n(4275),r=n(7723),c=function(){function t(o){var n=this;this.rootElId=o.rootElId,this.setConfig(),this.setDom(),this.setVars();var i=this.dom.svg.selectAll("path").data(t.getIcosahedronFaces()).enter().append("path").each((function(t){t.polygon=(0,r.WFE)(t.map(n.dom.projection))})).style("fill",(function(t,o){return n.config.color(""+o)}));this.dom.faces=i,this.vars.velocity=this.config.defaultVelocity}t.getIcosahedronFaces=function(){for(var t=[],o=180*Math.atan2(1,2)/Math.PI,n=0;n<360;n+=72)t.push([[n+0,-90],[n+0,-o],[n+72,-o]],[[n+36,o],[n+72,-o],[n+0,-o]],[[n+36,o],[n+0,-o],[n-36,o]],[[n+36,o],[n-36,o],[n-36,90]]);return t};var o=t.prototype;return o.start=function(){var t=this;(0,r.HTH)((function(){return t.timer()}))},o.setConfig=function(){var t=(0,r.PKp)(r.i4X);this.config={color:t,defaultVelocity:[1,.4,.07],height:500,rotationFactor1:.001,rotationFactor2:4,t0:Date.now(),width:document.getElementById(this.rootElId).getBoundingClientRect().width,zeroVelocity:[0,0,0]}},o.setDom=function(){document.getElementById(this.rootElId).classList.add("icosahedron-module--icosahedronChart--UzLaM");var t=(0,r.WvA)().scale(this.config.height/2-10),o=(0,r.Ys)("#"+this.rootElId).append("svg").attr("width",this.config.width).attr("height",this.config.height);this.dom={faces:null,projection:t,svg:o}},o.setVars=function(){this.vars={velocity:null}},o.calcNewPosition=function(t,o){var n=this.vars.velocity;return[n[0]*Math.abs(Math.sin(t*this.config.rotationFactor1)*this.config.rotationFactor2)+o[0],n[1]+o[1],o[2]+n[2]]},o.timer=function(){var t=this,o=Date.now()-this.config.t0,n=this.dom.projection.rotate();return this.dom.projection.rotate(this.calcNewPosition(o,n)),this.dom.faces.each((function(o){return o.forEach((function(n,i){return o.polygon[i]=t.dom.projection(n),null}))})).style("display",(function(t){return(0,r.mIS)(t.polygon)>0?null:"none"})).attr("d",(function(t){return"M"+t.polygon.join("L")+"Z"})).on("click",(function(){var o;(null===(o=t.vars.velocity)||void 0===o?void 0:o.toString())!==t.config.zeroVelocity.toString()?t.vars.velocity=t.config.zeroVelocity:t.vars.velocity=t.config.defaultVelocity})),null},t}(),a=function(){return new c({rootElId:"chart"}).start(),Promise.resolve()},s=function(t){var o=t.pageContext;return i.createElement(e.Z,{main:a,pageContext:o,scripts:["/vendors/d3/d3.min.js"]},i.createElement("div",{id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-icosahedron-tsx-f1af14b0f49a50cca9f2.js.map