(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[13],{9451:function(t,o,n){"use strict";n.r(o),n.d(o,{default:function(){return s}});var i=n(7294),e=n(7538),c=n(5161),r=function(){function t(){var o=this;this.setConfig(),this.setDom(),this.setVars(),this.dom.faces=this.dom.svg.selectAll("path").data(t.icosahedronFaces()).enter().append("path").each((function(t){t.polygon=c.WFE(t.map(o.dom.projection))})).style("fill",(function(t,n){return o.config.color(n)})),this.vars.velocity=this.config.defaultVelocity}t.icosahedronFaces=function(){for(var t=[],o=180*Math.atan2(1,2)/Math.PI,n=0;n<360;n+=72)t.push([[n+0,-90],[n+0,-o],[n+72,-o]],[[n+36,o],[n+72,-o],[n+0,-o]],[[n+36,o],[n+0,-o],[n-36,o]],[[n+36,o],[n-36,o],[n-36,90]]);return t};var o=t.prototype;return o.setConfig=function(){this.config={color:c.PKp(c.i4X),defaultVelocity:[1,.4,.07],height:500,rotationFactor1:.001,rotationFactor2:4,t0:Date.now(),width:$("#chart").innerWidth(),zeroVelocity:[0,0,0]}},o.setDom=function(){this.dom={faces:"",projection:c.WvA().scale(this.config.height/2-10),svg:c.Ys("#chart").append("svg").attr("width",this.config.width).attr("height",this.config.height)}},o.setVars=function(){this.vars={velocity:""}},o.calcNewPosition=function(t,o,n){return[t[0]*Math.abs(Math.sin(o*this.config.rotationFactor1)*this.config.rotationFactor2)+n[0],t[1]+n[1],n[2]+t[2]]},o.timer=function(){var t=this,o=Date.now()-this.config.t0,n=this.dom.projection.rotate();return this.dom.projection.rotate(this.calcNewPosition(this.vars.velocity,o,n)),this.dom.faces.each((function(o){return o.forEach((function(n,i){return o.polygon[i]=t.dom.projection(n),null}))})).style("display",(function(t){return c.mIS(t.polygon)>0?null:"none"})).attr("d",(function(t){return"M"+t.polygon.join("L")+"Z"})).on("click",(function(){String(t.vars.velocity)!==String(t.config.zeroVelocity)?t.vars.velocity=t.config.zeroVelocity:t.vars.velocity=t.config.defaultVelocity})),null},o.start=function(){var t=this;c.HTH((function(){return t.timer()}))},t}(),a=function(){(new r).start()},s=function(t){var o=t.pageContext.demoInfo;return i.createElement(e.Z,{demoInfo:o,main:a,scripts:["/vendors/d3/d3.min.js"]},i.createElement("div",{className:"icosahedron-chart",id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-icosahedron-js-a46eae5e0b76bb4015b8.js.map