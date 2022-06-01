"use strict";(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[289],{1745:function(e,t,n){n.d(t,{Z:function(){return g}});var r=n(7294),a=n(5414),l=n(2552),o=function(e){var t,n=e.isCompleted,a=e.mainSource,o=e.name;return r.createElement("h2",{className:"row",id:l.dc},r.createElement("span",{className:"col-xs-12 col-sm-10 p-0"},r.createElement("span",{className:l.jS},o," Chart "),r.createElement("small",{id:l.l4,title:"Main Source"},r.createElement("a",{href:a,rel:"noreferrer",target:"_blank"},"source")),!n&&r.createElement("small",{id:l.oT,title:"This demo is still work in progress"},"WIP")),r.createElement("span",Object.assign({className:"col-sm-2 p-0 d-xs-none "+l.eR},((t={})["data-back-home"]="",t)),r.createElement("a",{className:"btn btn-info",href:"/demos/",role:"button"},r.createElement("span",{className:"glyphicon glyphicon-home"})," Home")))},s=function(e){return"src/demos/"+e+"/tests/"+e+".e2e.ts"},c=function(){var e=(0,r.useState)(null),t=e[0],n=e[1];return(0,r.useEffect)((function(){var e="undefined"==typeof window?null:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth,document.body.offsetWidth,document.documentElement.offsetWidth,document.documentElement.clientWidth);null!==e&&n(e)}),[]),t},u=function(e){var t=e.content,n=(0,r.useState)(!1),a=n[0],o=n[1],s=c();return null===s?null:!s||s<1280&&!a?r.createElement("div",{className:l.wI},r.createElement("button",{className:l.W2+" btn btn-light",onClick:function(){return o(!0)},type:"button"},"Show Code")):r.createElement("pre",null,r.createElement("code",{dangerouslySetInnerHTML:{__html:t}}))},i=function(e){var t=e.filePath;return r.createElement(r.Fragment,null,r.createElement("span",null,"| "),r.createElement("a",{href:"https://github.com/igncp/demos/blob/main/"+t,rel:"noreferrer",target:"_blank"},"Code in Github"))},m=function(e){var t=e.filePath;return r.createElement(r.Fragment,null,r.createElement("span",null,"| "),r.createElement("a",{href:"https://igncp.github.io/demos/coverage-ts/files/"+t+".html",rel:"noreferrer",target:"_blank"},"TypeScript coverage report"))},d=function(e){var t=e.demoInfo;if("undefined"==typeof window)return null;var n="pages/"+t.category+"/"+t.key+"."+t.files.page.type;return r.createElement("div",null,!!t.notes.length&&r.createElement("div",{className:"bs-callout bs-callout-info"+l.$c},r.createElement("p",null,r.createElement("strong",null,"Notes:")),r.createElement("ul",null,t.notes.map((function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var a=t[0],l=t[1];return r.createElement("li",{dangerouslySetInnerHTML:{__html:a},key:l})})))),!!t.summary.length&&r.createElement("div",{className:"bs-callout bs-callout-summary "+l.$c},r.createElement("p",null,r.createElement("strong",null,"Implementation Summary:")),r.createElement("ul",null,t.summary.map((function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var a=t[0],l=t[1];return r.createElement("p",{dangerouslySetInnerHTML:{__html:a},key:l})})))),r.createElement("div",{className:"bs-callout bs-callout-primary",id:l.V2},r.createElement("p",null,r.createElement("strong",null,"Sources:")),r.createElement("ul",null,t.sources.map((function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var a=t[0],o=t[1];return r.createElement("li",{key:o},r.createElement("span",{className:l.hB},"[",o+1,"]"),":"," ",r.createElement("a",{href:a},a))})))),!!t.docs.length&&r.createElement("div",{className:"bs-callout bs-callout-secondary",id:"docs"},r.createElement("p",null,r.createElement("strong",null,"Docs:")),r.createElement("div",{className:l.Jw},t.docs.map((function(e){return r.createElement("span",{className:l._q,key:e[1]},r.createElement("a",{href:e[1],rel:"noreferrer",target:"_blank"},e[0]))})))),!!t.dataFiles.length&&r.createElement("div",{className:"bs-callout bs-callout-warning",id:l.sD},r.createElement("p",null,r.createElement("strong",null,"Data files: "),t.dataFiles.map((function(){for(var e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];var l=n[0],o=n[1];return r.createElement("a",{href:"/demos/data/"+t.category+"/"+t.key+"/"+l,key:o},l)})))),r.createElement("div",{className:"bs-callout bs-callout-success",id:"code"},r.createElement("p",null,r.createElement("strong",null,"Code:")),r.createElement("ul",null,t.files.demoTS.map((function(){for(var e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];var o=n[0],c=o.content,d=o.filePath,f=n[1];return r.createElement("li",{key:d},r.createElement("p",null,r.createElement("span",{className:l.s2},d)," ",r.createElement(i,{filePath:d})," ",r.createElement(m,{filePath:d}),0===f&&r.createElement(r.Fragment,null,r.createElement("span",null," | "),r.createElement("a",{href:"https://github.com/igncp/demos/blob/main/"+s(t.key),rel:"noreferrer",target:"_blank"},"E2E tests"))),r.createElement(u,{content:c}),r.createElement("div",{className:l.XP}))})),r.createElement("li",null,r.createElement("p",null,r.createElement("span",{className:l.s2},n)," ",r.createElement(i,{filePath:n})," ",r.createElement(m,{filePath:n})),r.createElement(u,{content:t.files.page.content}),!!t.files.demoCSS.length&&r.createElement("div",{className:l.XP})),t.files.demoCSS.map((function(){for(var e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];var o=n[0],s=o.content,c=o.filePath,m=n[1];return r.createElement("li",{key:c},r.createElement("p",null,r.createElement("span",{className:l.s2},c)," ",r.createElement(i,{filePath:c})),r.createElement(u,{content:s}),m!==t.files.demoCSS.length-1&&r.createElement("div",{className:l.XP}))})))))},f=n(2504),h=function(e){return"/"===e[0]?"/demos/"+e.replace(/^\//,""):e},g=function(e){var t=e.main,n=e.children,l=e.scripts,s=void 0===l?[]:l,c=e.links,u=void 0===c?[]:c,i=e.pageContext,m=i.demoInfo,g=i.meta,p=m.isCompleted,v=m.name,E=m.sources;return(0,r.useEffect)((function(){"undefined"!=typeof window&&t().catch((function(e){console.error("error:",e)}))}),[]),r.createElement(f.Z,null,r.createElement(a.q,{link:u.map((function(e){return{href:h(e),rel:"stylesheet",type:"text/css"}})),meta:[{content:g.description,name:"description"}],script:s.map((function(e){return{src:h(e),type:"text/javascript"}})),title:m.name+" | Demos igncp"}),r.createElement(o,{isCompleted:p,mainSource:E[0],name:v}),n,r.createElement(d,{demoInfo:m}))}},2504:function(e,t,n){n.d(t,{Z:function(){return s}});var r=n(7294),a=n(2552),l=function(){return r.createElement("div",{className:a.Mv},r.createElement("p",null,(new Date).getFullYear()))},o=function(){return r.createElement("div",{className:a.H6},r.createElement("h1",null,r.createElement("span",{className:a.FJ},r.createElement("a",{href:"/demos/"},"Demos")," ",r.createElement("small",{className:"hide-tablet"},"interactive data visualization examples")),r.createElement("span",{id:a.ak},r.createElement("iframe",{className:"hide-mobile",frameBorder:"0",height:"20",scrolling:"0",src:"https://ghbtns.com/github-btn.html?user=igncp&repo=demos&type=follow",width:"119"}),r.createElement("iframe",{className:"hide-mobile",frameBorder:"0",height:"20",scrolling:"0",src:"https://ghbtns.com/github-btn.html?user=igncp&repo=demos&type=fork",width:"62"}),r.createElement("iframe",{frameBorder:"0",height:"20",scrolling:"0",src:"https://ghbtns.com/github-btn.html?user=igncp&repo=demos&type=watch",width:"52"}))))},s=function(e){var t=e.children;return r.createElement("div",{className:a.Mg+" px-3 px-sm-5"},r.createElement("div",{className:a.cs},r.createElement(o,null)),r.createElement("div",{className:a.Fh},t),r.createElement("div",{className:a.Y2},r.createElement(l,null)))}},3412:function(e,t,n){n.r(t),n.d(t,{default:function(){return S}});var r=n(7294),a=n(1745),l=n(5861),o=n(7757),s=n.n(o),c=n(5633),u="force-module--linkCurved--42507",i=function(){function e(e){this.elements=e,this.state={dragX:0,dragY:0}}return e.prototype.setupBackgroundDrag=function(){var e=this,t=this.elements,n=t.svg,r=t.svgDrag,a=function(t){e.state.dragX+=t.dx,e.state.dragY+=t.dy,r.attr("transform","translate("+e.state.dragX+","+e.state.dragY+")")},l=(0,c.ohM)().on("drag",a);n.style("cursor","move").call(l).on("drag",a).on("wheel",null)},e}(),m=function(e){var t=this;this.setupNodes=function(e){e.call((0,c.ohM)().on("start",(function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];var a=n[0],l=n[1];t.opts.onDragStart({dragEvent:a,node:l})})).on("drag",(function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];var a=n[0],l=n[1];t.opts.onDrag({dragEvent:a,node:l})})).on("end",(function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];var a=n[0],l=n[1];t.opts.onDragEnded({dragEvent:a,node:l})})))},this.opts=e},d=.5,f=-40,h=5,g=function(e){return"node-text-"+e.index},p=function(){function e(t){var n,r=this;this.handleResize=function(){r.render()},this.config=t,this.state={radius:null!==(n=t.radius)&&void 0!==n?n:e.defaultRadius};var a=t.forceData,l=t.rootElId,o=a.links,s=a.nodes;document.getElementById(l).classList.add("force-module--forceChart--852bc");var u=(0,c.Ys)("#"+l).append("svg"),m=u.append("g"),d=m.append("g");this.elements={svg:u,svgDrag:m,svgG:d},this.backgroundDrag=new i({svg:u,svgDrag:m});var f=(0,c.Fsl)().links(o.map((function(e){return Object.assign({},e)}))),h=(0,c.Hh)(12).strength(1).iterations(100),g=(0,c.A4v)(s.map((function(e){return Object.assign({},e)}))).force("link",f).force("collide",h).on("tick",(function(){r.render()}));this.simulation=g,this.forceNodes=this.simulation.nodes(),this.forceLinks=f.links(),this.backgroundDrag.setupBackgroundDrag(),this.render(),window.addEventListener("resize",this.handleResize)}var t=e.prototype;return t.setRadius=function(e){this.state.radius=e,this.getNodes().attr("r",e)},t.render=function(){var e=this.config,t=e.height,n=e.rootElId,r=document.getElementById(n).getBoundingClientRect().width;this.simulation.force("charge",(0,c.q5i)().strength(f)).force("center",(0,c.wqt)(r/2,t/2)),this.elements.svg.attr("width",r).attr("height",t),this.updateLinks(),this.updateNodes()},t.updateLinks=function(){var e=this.elements.svgG.selectAll("."+u).data(this.forceLinks);e.enter().append("path").merge(e).attr("d",(function(e){var t=e,n=t.source,r=t.target,a=r.x-n.x,l=r.y-n.y,o=1.3*Math.sqrt(a*a+l*l);return"M"+n.x+","+n.y+"A"+o+","+o+" 0 0,1 "+r.x+","+r.y})).attr("class",u).attr("marker-end","url(#end)").attr("id",(function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var r=t[1];return"link-"+r})),e.exit().remove()},t.updateNodes=function(){var e=this,t=this.config.getNodeText,n=this.elements.svgG,r=this.forceNodes,a=this.getNodes().data(r),l=n.selectAll("text").data(r),o=function(e){var t=e.dragEvent,n=e.node;n.fx=t.x,n.fy=t.y},s=function(t){var n=t.dragEvent,r=t.node;n.active||e.simulation.alphaTarget(0),r.fx=null,r.fy=null},u=function(t){var n=t.dragEvent,r=t.node;n.active||e.simulation.alphaTarget(.3).restart(),r.fx=r.x,r.fy=r.y},i=function(e){var t=new m({onDrag:o,onDragEnded:s,onDragStart:u});e.on("mouseenter",(function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var r=t[1];(0,c.Ys)("#"+g(r)).style("opacity",1).style("fill","#000")})).on("mouseleave",(function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var r=t[1];(0,c.Ys)("#"+g(r)).style("opacity",d).style("fill",null)})).call(t.setupNodes).style("cursor","pointer")};a.enter().append("circle").merge(a).attr("cx",(function(e){return e.x})).attr("cy",(function(e){return e.y})).attr("r",(function(){return e.state.radius})).attr("fill","black").call(i),l.enter().append("text").merge(l).text(t).attr("x",(function(e){return e.x})).attr("y",(function(e){return e.y})).attr("dy",(function(){return h})).attr("id",g).style("opacity",d).call(i),a.exit().remove(),l.exit().remove()},t.getNodes=function(){return this.elements.svgG.selectAll("circle")},e}();p.defaultRadius=5;var v="chart",E="radius-select",y=function(e){return e.name},b=function(e){return{forceData:e.forceData,getNodeText:y,height:600,rootElId:v}},N=[1,5,10,20,50],k=function(e){var t=document.getElementById(E);N.forEach((function(e){var n=document.createElement("option"),r=e+"px";n.text=r,n.value=e.toFixed(),t.appendChild(n)})),t.value=e.initialRadiusValue.toFixed(),t.addEventListener("change",(function(){e.onRadiusChange(Number(t.value))}))},w=function(){var e=(0,l.Z)(s().mark((function e(){var t,n,r;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Promise.all([(0,c.AVB)("/demos/data/d3js/force/nodes.json"),(0,c.AVB)("/demos/data/d3js/force/links.json")]);case 2:return t=e.sent,n=t[0],r=t[1],e.abrupt("return",{links:r,nodes:n});case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),x=function(){var e=(0,l.Z)(s().mark((function e(){var t,n,r;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,w();case 2:t=e.sent,n=b({forceData:t}),r=new p(n),k({initialRadiusValue:p.defaultRadius,onRadiusChange:function(e){r.setRadius(e)}});case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),D=x,S=function(e){var t=e.pageContext;return r.createElement(a.Z,{main:D,pageContext:t},r.createElement("form",{className:"force-page-module--form--008ba"},r.createElement("span",null,"Radius: "),r.createElement("select",{className:"form-select",id:E})),r.createElement("div",{id:v}))}},2552:function(e,t,n){n.d(t,{eR:function(){return r},rT:function(){return a},UG:function(){return l},ZV:function(){return o},Bf:function(){return s},K7:function(){return c},wI:function(){return u},W2:function(){return i},Fh:function(){return m},jS:function(){return d},XP:function(){return f},s2:function(){return h},Mv:function(){return g},Y2:function(){return p},eQ:function(){return v},Be:function(){return E},he:function(){return y},cs:function(){return b},$c:function(){return N},Mg:function(){return k},hB:function(){return w},H6:function(){return x},FJ:function(){return D},YX:function(){return S},Jw:function(){return C},_q:function(){return A},zG:function(){return B},Vj:function(){return P},pn:function(){return I},x:function(){return L},oT:function(){return F},dc:function(){return R},l4:function(){return T},sD:function(){return W},V2:function(){return M},ak:function(){return _}});var r="styles-module--backHome--b9e05",a="styles-module--bullet--337e0",l="styles-module--d3js--ff3aa",o="styles-module--raphael--40af0",s="styles-module--storybook--f1bcc",c="styles-module--testing--9f8b3",u="styles-module--codeFragment--8d705",i="styles-module--codeFragmentButton--98bc0",m="styles-module--contentWrapper--2c2b6",d="styles-module--demoName--4057d",f="styles-module--divisor--4c75d",h="styles-module--fileNameWrapper--e0bd4",g="styles-module--footer--a0f96",p="styles-module--footerWrapper--5365d",v="styles-module--homeDemoNumber--755fe",E="styles-module--homeDemoNameLink--4b57a",y="styles-module--listGroup--88893",b="styles-module--navWrapper--08cc9",N="styles-module--notes--e1c07",k="styles-module--rootLayout--03362",w="styles-module--sourceNumber--335c1",x="styles-module--pageHeader--06484",D="styles-module--titleWrapper--81a79",S="styles-module--rowWrapper--9f3a4",C="styles-module--tagCollection--c96c8",A="styles-module--tag--8c674",B="styles-module--demosLegend--16d25",P="styles-module--demosLists--52492",I="styles-module--highlightStorybook--b465e",L="styles-module--highlightTesting--b7d3f",F="styles-module--demoWip--18449",R="styles-module--demoTitle--7c73a",T="styles-module--mainSource--f7ebb",W="styles-module--dataList--54f77",M="styles-module--sourcesList--27e91",_="styles-module--ghButtons--1d466"},5861:function(e,t,n){function r(e,t,n,r,a,l,o){try{var s=e[l](o),c=s.value}catch(u){return void n(u)}s.done?t(c):Promise.resolve(c).then(r,a)}function a(e){return function(){var t=this,n=arguments;return new Promise((function(a,l){var o=e.apply(t,n);function s(e){r(o,a,l,s,c,"next",e)}function c(e){r(o,a,l,s,c,"throw",e)}s(void 0)}))}}n.d(t,{Z:function(){return a}})}}]);
//# sourceMappingURL=component---src-pages-d-3-js-force-tsx-9c364d33e7f28410c314.js.map