"use strict";(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[902],{1745:function(e,t,n){n.d(t,{Z:function(){return h}});var r=n(7294),a=n(5414),l=n(2552),o=function(e){var t,n=e.isCompleted,a=e.mainSource,o=e.name;return r.createElement("h2",{className:"row",id:l.dc},r.createElement("span",{className:"col-xs-12 col-sm-10 p-0"},r.createElement("span",{className:l.jS},o," Chart "),r.createElement("small",{id:l.l4,title:"Main Source"},r.createElement("a",{href:a,rel:"noreferrer",target:"_blank"},"source")),!n&&r.createElement("small",{id:l.oT,title:"This demo is still work in progress"},"WIP")),r.createElement("span",Object.assign({className:"col-sm-2 p-0 d-xs-none "+l.eR},((t={})["data-back-home"]="",t)),r.createElement("a",{className:"btn btn-info",href:"/demos/",role:"button"},r.createElement("span",{className:"glyphicon glyphicon-home"})," Home")))},c=function(e){return"src/demos/"+e+"/tests/"+e+".e2e.ts"},s=function(){var e=(0,r.useState)(null),t=e[0],n=e[1];return(0,r.useEffect)((function(){var e="undefined"==typeof window?null:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth,document.body.offsetWidth,document.documentElement.offsetWidth,document.documentElement.clientWidth);null!==e&&n(e)}),[]),t},u=function(e){var t=e.content,n=(0,r.useState)(!1),a=n[0],o=n[1],c=s();return null===c?null:!c||c<1280&&!a?r.createElement("div",{className:l.wI},r.createElement("button",{className:l.W2+" btn btn-light",onClick:function(){return o(!0)},type:"button"},"Show Code")):r.createElement("pre",null,r.createElement("code",{dangerouslySetInnerHTML:{__html:t}}))},i=function(e){var t=e.filePath;return r.createElement(r.Fragment,null,r.createElement("span",null,"| "),r.createElement("a",{href:"https://github.com/igncp/demos/blob/main/"+t,rel:"noreferrer",target:"_blank"},"Code in Github"))},m=function(e){var t=e.filePath;return r.createElement(r.Fragment,null,r.createElement("span",null,"| "),r.createElement("a",{href:"https://igncp.github.io/demos/coverage-ts/files/"+t+".html",rel:"noreferrer",target:"_blank"},"TypeScript coverage report"))},d=function(e){var t=e.demoInfo;if("undefined"==typeof window)return null;var n="pages/"+t.category+"/"+t.key+"."+t.files.page.type;return r.createElement("div",null,!!t.notes.length&&r.createElement("div",{className:"bs-callout bs-callout-info"+l.$c},r.createElement("p",null,r.createElement("strong",null,"Notes:")),r.createElement("ul",null,t.notes.map((function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var a=t[0],l=t[1];return r.createElement("li",{dangerouslySetInnerHTML:{__html:a},key:l})})))),!!t.summary.length&&r.createElement("div",{className:"bs-callout bs-callout-summary "+l.$c},r.createElement("p",null,r.createElement("strong",null,"Implementation Summary:")),r.createElement("ul",null,t.summary.map((function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var a=t[0],l=t[1];return r.createElement("p",{dangerouslySetInnerHTML:{__html:a},key:l})})))),r.createElement("div",{className:"bs-callout bs-callout-primary",id:l.V2},r.createElement("p",null,r.createElement("strong",null,"Sources:")),r.createElement("ul",null,t.sources.map((function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var a=t[0],o=t[1];return r.createElement("li",{key:o},r.createElement("span",{className:l.hB},"[",o+1,"]"),":"," ",r.createElement("a",{href:a},a))})))),!!t.docs.length&&r.createElement("div",{className:"bs-callout bs-callout-secondary",id:"docs"},r.createElement("p",null,r.createElement("strong",null,"Docs:")),r.createElement("div",{className:l.Jw},t.docs.map((function(e){return r.createElement("span",{className:l._q,key:e[1]},r.createElement("a",{href:e[1],rel:"noreferrer",target:"_blank"},e[0]))})))),!!t.dataFiles.length&&r.createElement("div",{className:"bs-callout bs-callout-warning",id:l.sD},r.createElement("p",null,r.createElement("strong",null,"Data files: "),t.dataFiles.map((function(){for(var e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];var l=n[0],o=n[1];return r.createElement("a",{href:"/demos/data/"+t.category+"/"+t.key+"/"+l,key:o},l)})))),r.createElement("div",{className:"bs-callout bs-callout-success",id:"code"},r.createElement("p",null,r.createElement("strong",null,"Code:")),r.createElement("ul",null,t.files.demoTS.map((function(){for(var e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];var o=n[0],s=o.content,d=o.filePath,f=n[1];return r.createElement("li",{key:d},r.createElement("p",null,r.createElement("span",{className:l.s2},d)," ",r.createElement(i,{filePath:d})," ",r.createElement(m,{filePath:d}),0===f&&r.createElement(r.Fragment,null,r.createElement("span",null," | "),r.createElement("a",{href:"https://github.com/igncp/demos/blob/main/"+c(t.key),rel:"noreferrer",target:"_blank"},"E2E tests"))),r.createElement(u,{content:s}),r.createElement("div",{className:l.XP}))})),r.createElement("li",null,r.createElement("p",null,r.createElement("span",{className:l.s2},n)," ",r.createElement(i,{filePath:n})," ",r.createElement(m,{filePath:n})),r.createElement(u,{content:t.files.page.content}),!!t.files.demoCSS.length&&r.createElement("div",{className:l.XP})),t.files.demoCSS.map((function(){for(var e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];var o=n[0],c=o.content,s=o.filePath,m=n[1];return r.createElement("li",{key:s},r.createElement("p",null,r.createElement("span",{className:l.s2},s)," ",r.createElement(i,{filePath:s})),r.createElement(u,{content:c}),m!==t.files.demoCSS.length-1&&r.createElement("div",{className:l.XP}))})))))},f=n(2504),p=function(e){return"/"===e[0]?"/demos/"+e.replace(/^\//,""):e},h=function(e){var t=e.main,n=e.children,l=e.scripts,c=void 0===l?[]:l,s=e.links,u=void 0===s?[]:s,i=e.pageContext,m=i.demoInfo,h=i.meta,g=m.isCompleted,v=m.name,y=m.sources;return(0,r.useEffect)((function(){"undefined"!=typeof window&&t().catch((function(e){console.error("error:",e)}))}),[]),r.createElement(f.Z,null,r.createElement(a.q,{link:u.map((function(e){return{href:p(e),rel:"stylesheet",type:"text/css"}})),meta:[{content:h.description,name:"description"}],script:c.map((function(e){return{src:p(e),type:"text/javascript"}})),title:m.name+" | Demos igncp"}),r.createElement(o,{isCompleted:g,mainSource:y[0],name:v}),n,r.createElement(d,{demoInfo:m}))}},2504:function(e,t,n){n.d(t,{Z:function(){return c}});var r=n(7294),a=n(2552),l=function(){return r.createElement("div",{className:a.Mv},r.createElement("p",null,(new Date).getFullYear()))},o=function(){return r.createElement("div",{className:a.H6},r.createElement("h1",null,r.createElement("span",{className:a.FJ},r.createElement("a",{href:"/demos/"},"Demos")," ",r.createElement("small",{className:"hide-tablet"},"interactive data visualization examples")),r.createElement("span",{id:a.ak},r.createElement("iframe",{className:"hide-mobile",frameBorder:"0",height:"20",scrolling:"0",src:"https://ghbtns.com/github-btn.html?user=igncp&repo=demos&type=follow",width:"119"}),r.createElement("iframe",{className:"hide-mobile",frameBorder:"0",height:"20",scrolling:"0",src:"https://ghbtns.com/github-btn.html?user=igncp&repo=demos&type=fork",width:"62"}),r.createElement("iframe",{frameBorder:"0",height:"20",scrolling:"0",src:"https://ghbtns.com/github-btn.html?user=igncp&repo=demos&type=watch",width:"52"}))))},c=function(e){var t=e.children;return r.createElement("div",{className:a.Mg+" px-3 px-sm-5"},r.createElement("div",{className:a.cs},r.createElement(o,null)),r.createElement("div",{className:a.Fh},t),r.createElement("div",{className:a.Y2},r.createElement(l,null)))}},8452:function(e,t,n){n.r(t),n.d(t,{default:function(){return d}});var r=n(7294),a=n(1745),l=n(8558),o="chart",c="vectors-module--link--0218a",s=5,u=.5,i=function(e){var t=e.rootElId,n=e.vectorsData,r=n.links,a=n.nodes,o=document.getElementById(t);o.classList.add("vectors-module--vectorsChart--beff0");var i=o.getBoundingClientRect().width,m=(0,l.Ys)("#"+t).append("svg").attr("width",i).attr("height",600);!function(e){e.append("svg:defs").append("svg:marker").attr("id","end-arrow").attr("viewBox","0 -5 10 10").attr("refX",6).attr("markerWidth",3).attr("markerHeight",3).attr("orient","auto").append("svg:path").attr("d","M0,-5L10,0L0,5").attr("fill","#000"),e.append("svg:defs").append("svg:marker").attr("id","start-arrow").attr("viewBox","0 -5 10 10").attr("refX",4).attr("markerWidth",3).attr("markerHeight",3).attr("orient","auto").append("svg:path").attr("d","M10,-5L0,0L10,5").attr("fill","#000")}(m);var d="C".charCodeAt(0),f=(0,l.A4v)(a).force("charge",(0,l.q5i)().strength(-50)).force("center",(0,l.wqt)(i/2,300)).force("link",(0,l.Fsl)().links(r).distance(100)).on("tick",(function(){var e;(e=m.selectAll("."+c).data(r)).enter().append("path").merge(e).attr("d",(function(e){var t=e.target.x-e.source.x,n=e.target.y-e.source.y,r=Math.sqrt(t*t+n*n),a=t/r,l=n/r,o=e.left?17:12,c=e.right?17:12;return"M"+(e.source.x+o*a)+","+(e.source.y+o*l)+"L"+(e.target.x-c*a)+","+(e.target.y-c*l)})).attr("class",c+" vectors-module--dragline--4a4bc"),e.exit().remove(),v()})),p=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var r=t[0],a=t[1];r.active||f.alphaTarget(.3).restart(),a.fx=a.x,a.fy=a.y},h=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var r=t[0],a=t[1];a.fx=r.x,a.fy=r.y},g=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var r=t[0],a=t[1];r.active||f.alphaTarget(0),a.fx=null,a.fy=null},v=function(){var e=m.selectAll("circle").data(a),t=m.selectAll("text").data(a);e.enter().append("circle").merge(e).attr("cx",(function(e){return e.x})).attr("cy",(function(e){return e.y})).attr("r",(function(){return s})).attr("fill","#fff").each((function(){(0,l.Ys)(this).on("mouseover",(function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var r=t[1];(0,l.Ys)("#node-text-"+r.index).style("opacity",1)})).on("mouseleave",(function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var r=t[1];(0,l.Ys)("#node-text-"+r.index).style("opacity",u)}))})).call((0,l.ohM)().on("start",p).on("drag",h).on("end",g)),t.enter().append("text").merge(t).text((function(e){return e.id})).attr("x",(function(e){return e.x})).attr("y",(function(e){return e.y})).attr("class","vectors-module--id--53fe7"),e.exit().remove(),t.exit().remove()};m.selectAll("."+c).data(r).enter().append("svg:path").attr("class",c).attr("marker-end","url(#end)").attr("id",(function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var r=t[1];return"link-"+r}));m.on("mousedown",(function(e){if(m.classed("vectors-module--active--1831f",!0),!e.ctrlKey){var t=e.target.getBoundingClientRect(),n=e.clientX-t.left,r=e.clientY-t.top;d+=1;var l={id:String.fromCharCode(d),index:a.length,reflexive:!1,vx:0,vy:0,x:n,y:r};a.push(l),f.nodes(a),f.alpha(.5).restart()}})).on("mousemove",(function(){console.log("mousemoveSVG")})).on("mouseup",(function(){})),window.addEventListener("keyup",(function(){console.log("keyup")})),window.addEventListener("keydown",(function(){console.log("keydown")}))},m=function(){var e,t={links:[{left:!1,right:!0,source:(e=[{id:"A",reflexive:!1},{id:"B",reflexive:!1},{id:"C",reflexive:!1}])[0],target:e[1]},{left:!1,right:!0,source:e[1],target:e[2]}],nodes:e};return i({rootElId:o,vectorsData:t}),Promise.resolve()},d=function(e){var t=e.pageContext;return r.createElement(a.Z,{main:m,pageContext:t},r.createElement("div",{id:o}))}},2552:function(e,t,n){n.d(t,{eR:function(){return r},rT:function(){return a},UG:function(){return l},ZV:function(){return o},Bf:function(){return c},K7:function(){return s},wI:function(){return u},W2:function(){return i},Fh:function(){return m},jS:function(){return d},XP:function(){return f},s2:function(){return p},Mv:function(){return h},Y2:function(){return g},eQ:function(){return v},Be:function(){return y},cs:function(){return E},$c:function(){return b},Mg:function(){return k},hB:function(){return w},H6:function(){return x},FJ:function(){return N},YX:function(){return C},Jw:function(){return S},_q:function(){return A},zG:function(){return L},Vj:function(){return W},pn:function(){return B},x:function(){return P},oT:function(){return M},dc:function(){return F},l4:function(){return I},sD:function(){return T},V2:function(){return _},ak:function(){return D}});var r="styles-module--backHome--b9e05",a="styles-module--bullet--337e0",l="styles-module--d3js--ff3aa",o="styles-module--raphael--40af0",c="styles-module--storybook--f1bcc",s="styles-module--testing--9f8b3",u="styles-module--codeFragment--8d705",i="styles-module--codeFragmentButton--98bc0",m="styles-module--contentWrapper--2c2b6",d="styles-module--demoName--4057d",f="styles-module--divisor--4c75d",p="styles-module--fileNameWrapper--e0bd4",h="styles-module--footer--a0f96",g="styles-module--footerWrapper--5365d",v="styles-module--homeDemoNumber--755fe",y="styles-module--homeDemoNameLink--4b57a",E="styles-module--navWrapper--08cc9",b="styles-module--notes--e1c07",k="styles-module--rootLayout--03362",w="styles-module--sourceNumber--335c1",x="styles-module--pageHeader--06484",N="styles-module--titleWrapper--81a79",C="styles-module--rowWrapper--9f3a4",S="styles-module--tagCollection--c96c8",A="styles-module--tag--8c674",L="styles-module--demosLegend--16d25",W="styles-module--demosLists--52492",B="styles-module--highlightStorybook--b465e",P="styles-module--highlightTesting--b7d3f",M="styles-module--demoWip--18449",F="styles-module--demoTitle--7c73a",I="styles-module--mainSource--f7ebb",T="styles-module--dataList--54f77",_="styles-module--sourcesList--27e91",D="styles-module--ghButtons--1d466"}}]);
//# sourceMappingURL=component---src-pages-d-3-js-vectors-tsx-e6d8f5b10825ae3a9d62.js.map