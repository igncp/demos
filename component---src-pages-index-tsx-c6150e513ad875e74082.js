(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[691],{8210:function(e,t,a){"use strict";a.d(t,{Z:function(){return r}});var o=a(7294),n=function(){return o.createElement("div",{className:"page-header"},o.createElement("h1",{className:"row"},o.createElement("span",{className:"col-lg-8"},o.createElement("a",{href:"/demos/"},"Demos")," ",o.createElement("small",null,"interactive data visualization examples")),o.createElement("span",{className:"col-lg-4"},o.createElement("iframe",{frameBorder:"0",height:"20",scrolling:"0",src:"https://ghbtns.com/github-btn.html?user=igncp&repo=demos&type=watch",width:"62"}),o.createElement("iframe",{frameBorder:"0",height:"20",scrolling:"0",src:"https://ghbtns.com/github-btn.html?user=igncp&repo=demos&type=follow",width:"119"}),o.createElement("iframe",{frameBorder:"0",height:"20",scrolling:"0",src:"https://ghbtns.com/github-btn.html?user=igncp&repo=demos&type=fork",width:"62"}))))},s=function(){return o.createElement("footer",{className:"row"},o.createElement("p",null,(new Date).getFullYear()))},r=function(e){var t=e.children;return o.createElement(o.Fragment,null,o.createElement("div",{className:"row",id:"container"},o.createElement("div",{className:"col-lg-offset-1 col-lg-10"},o.createElement(n,null),t)),o.createElement(s,null))}},5329:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return w}});var o=a(7294),n=a(9734),s=a.n(n),r=a(8210),i=function(e){var t=e.demos,a=e.indexOffset;return o.createElement("ul",{className:"list-group"},t.map((function(e,t){return o.createElement("a",{className:"list-group-item",href:e.route,key:e.name},o.createElement("span",{className:"home-demo-number"},t+1+a,".-")," ",o.createElement("span",{className:"home-demo-name-link"},e.name),o.createElement("div",{className:"bullet "+e.category},"•"))})))},c=a(1802),l=a.n(c),d=a(3390),m=a.n(d),h={d3js:[],raphael:[]};for(var u in l()){var p=l()[u];p.key=u,p.category="d3js",p.route="/demos/d3js/"+u,h.d3js.push(p)}for(var f in m()){var g=m()[f];g.key=f,g.category="raphael",g.route="/demos/raphael/"+f,h.raphael.push(g)}var b=h.d3js,v=h.raphael,k=b.concat(v);k=s()(k,"name");var w=function(){var e=Math.ceil(k.length/2),t=[];return t[0]=k.slice(0,e),t[1]=k.slice(e,k.length),o.createElement(r.Z,null,o.createElement("div",{className:"bs-callout bs-callout-info"},"Here are some ",o.createElement("i",null,"interactive data visualization demos")," that are built with examples found on the web, which I've rewritten with ideas from other examples. The sources are always available. The idea is to try things using libraries like D3.js or Raphaël, and extensions of those."),o.createElement("div",{id:"demos-legend"},o.createElement("ul",{className:"bs-callout bs-callout-warning"},o.createElement("li",null,o.createElement("span",{className:"bullet d3js"},"•")," D3js"),o.createElement("li",null,o.createElement("span",{className:"bullet raphael"},"•")," Raphaël"))),o.createElement("div",{className:"row",id:"demos-lists"},o.createElement("div",{className:"col-lg-offset-2 col-lg-3"},o.createElement(i,{demos:t[0],indexOffset:0})),o.createElement("div",{className:"col-lg-offset-2 col-lg-3"},o.createElement(i,{demos:t[1],indexOffset:e}))))}},1802:function(e){e.exports={area:{data:["data.csv"],name:"Area",notes:["Changed style","Added point and voronoi functionality"],sources:["http://codepen.io/notno/pen/ilvsd"]},bars:{data:["data.json"],name:"Bars",notes:["Added axis","Changed direction and added color transition for wave effect","Added transition in axis and the add item possibility","The interval stops when you place the mouse over a bar"],sources:["http://codepen.io/basemoz/pen/mBoiL"]},bubbles:{data:["data.json"],name:"Bubbles",notes:['Using the <a href="https://github.com/novus/nvd3" target="_blank">NV3D</a> extension for D3JS',"Data taken from the Nike API (via the Codepen)",'You can click the "Maginify" button and click a point to zoom the chart'],sources:["http://codepen.io/linghzang3/pen/GFdzh"]},chord:{data:["data.csv"],name:"Chord",notes:["Added filters with drop shadow and low opacity","Changed scheme and match each color with a country"],sources:["http://bl.ocks.org/mbostock/1308257"]},"collapsible-tree":{data:["data.json"],name:"Collapsible Tree",notes:[],sources:["http://bl.ocks.org/mbostock/4339083","https://observablehq.com/@d3/collapsible-tree"]},"concentric-circles":{data:[],name:"Concentric Circles",notes:["Data of baby names in New York 2012","Custom color scale","Added box shadow filter"],sources:["http://codepen.io/notno/pen/wgyAz","http://bl.ocks.org/cpbotha/5200394","http://stackoverflow.com/questions/17671252/d3-create-a-continous-color-scale-with-many-strings-inputs-for-the-range-and-dy"]},"fish-eye":{data:["data.json"],name:"Fish Eye",notes:["Uses the Fish Eye plugin","Changed style","Click to stop and show a pointer","Extended the title information"],sources:["http://bost.ocks.org/mike/fisheye/"]},force:{data:["links.json","nodes.json"],name:"Force",notes:[],sources:["http://codepen.io/MidnightLightning/pen/dclbA"]},icosahedron:{data:[],name:"Icosahedron",notes:["No data bound to it, it could be to the speed, size, colors","Added color scale and the sinusoidal x velocity","Added the stop and move when clicked"],sources:["https://gist.github.com/mbostock/7782500"]},"map-distorsions":{data:["data.tsv"],name:"Map Distorsions",notes:["Dynamic (for performance) shadow","Custom color scale related to index","Tooltip and minor style changes"],sources:["http://bl.ocks.org/mbostock/3709000"]},"mareys-schedule":{data:["data.tsv"],name:"Marey's Schedule",notes:["Added titles with information in stops and trains","Add box shadow","Add range input"],sources:["http://bl.ocks.org/mbostock/5544008"]},"multiline-voronoi":{data:["data.tsv"],name:"Multi-Line Voronoi",notes:["Click one time to just show a line, click again to sho all","Added color and dropshadow for 3D effect","Added label data and clicked function"],sources:["http://bl.ocks.org/mbostock/8033015"]},partition:{data:["flare.json"],name:"Partition",notes:["Added title attributes, labels and change colors with events"],sources:["http://bl.ocks.org/mbostock/4063423"]},pie:{data:["data.json"],name:"Pie",notes:["Added the animation (transition) by changing a random slice data by a random integer between range"],sources:["http://codepen.io/nishidh41/pen/Frzhq"]},"spain-map":{data:["data.json"],name:"Spanish Map",notes:["For this chart I reused the code from the World Map chart and other demos","Added drop shadow for 3D effect"],sources:["http://www.diva-gis.org/datadown"]},timeline:{data:["data.csv"],name:"Timeline",notes:["Change to bootstrap tooltip","Add dynamic text lengths (adding two dots)","Improve performance (a lot) removing the drop-shadow while brushing"],sources:["http://bl.ocks.org/rengel-de/5603464"]},"trend-line":{data:["data.tsv"],name:"Trend line",notes:["Added both line animations","Changed y scale domain"],sources:["http://codepen.io/arundhaj/pen/ouyjd","http://big-elephants.com/2014-06/unrolling-line-charts-d3js/"]},vectors:{data:[],name:"Vectors",notes:["Use the <strong>Ctrl</strong> key to move nodes instead of creating vectors"],sources:["http://codepen.io/zarazum/pen/fjoqF"]},"weekly-heatmap":{data:["data.tsv"],name:"Weekly Heatmap",notes:[],sources:["http://bl.ocks.org/tjdecke/5558084"]},"world-map":{data:["world.json"],name:"World Map",notes:["Added the mouse over stroke and the zooming-unzooming when clicking in countries (from third source)","Click a country to zoom, click in the water to set zoom back to normal"],sources:["http://bost.ocks.org/mike/map/","http://bl.ocks.org/mbostock/raw/4090846/world-50m.json","http://bl.ocks.org/mbostock/2206590"]}}},3390:function(e){e.exports={"bars-3dimensional":{data:["data.json"],name:"Bars 3D",notes:["Added titles on hover","Dynamic dimensions"],sources:["http://codepen.io/djam/pen/edjCz"]},"circular-arcs":{data:[],name:"Circular Arcs",notes:["This demo doesn't have data, but it wouldn't be hard (e.g. bound to the radius if all are different)"],sources:["http://codepen.io/dshapira/pen/ltrqc"]},"moving-line":{data:["data.json"],name:"Moving Line",notes:["The axis is not included as it is part of the background image","Add titles"],sources:["http://codepen.io/johnegraham2/pen/ExfBI"]}}},6874:function(e){e.exports=function(e,t,a){switch(a.length){case 0:return e.call(t);case 1:return e.call(t,a[0]);case 2:return e.call(t,a[0],a[1]);case 3:return e.call(t,a[0],a[1],a[2])}return e.apply(t,a)}},8483:function(e,t,a){var o=a(5063)();e.exports=o},5976:function(e,t,a){var o=a(6557),n=a(5357),s=a(61);e.exports=function(e,t){return s(n(e,t,o),e+"")}},6560:function(e,t,a){var o=a(5703),n=a(8777),s=a(6557),r=n?function(e,t){return n(e,"toString",{configurable:!0,enumerable:!1,value:o(t),writable:!0})}:s;e.exports=r},5063:function(e){e.exports=function(e){return function(t,a,o){for(var n=-1,s=Object(t),r=o(t),i=r.length;i--;){var c=r[e?i:++n];if(!1===a(s[c],c,s))break}return t}}},6612:function(e,t,a){var o=a(7813),n=a(8612),s=a(5776),r=a(3218);e.exports=function(e,t,a){if(!r(a))return!1;var i=typeof t;return!!("number"==i?n(a)&&s(t,a.length):"string"==i&&t in a)&&o(a[t],e)}},5357:function(e,t,a){var o=a(6874),n=Math.max;e.exports=function(e,t,a){return t=n(void 0===t?e.length-1:t,0),function(){for(var s=arguments,r=-1,i=n(s.length-t,0),c=Array(i);++r<i;)c[r]=s[t+r];r=-1;for(var l=Array(t+1);++r<t;)l[r]=s[r];return l[t]=a(c),o(e,this,l)}}},61:function(e,t,a){var o=a(6560),n=a(1275)(o);e.exports=n},1275:function(e){var t=Date.now;e.exports=function(e){var a=0,o=0;return function(){var n=t(),s=16-(n-o);if(o=n,s>0){if(++a>=800)return arguments[0]}else a=0;return e.apply(void 0,arguments)}}},5703:function(e){e.exports=function(e){return function(){return e}}},6557:function(e){e.exports=function(e){return e}}}]);
//# sourceMappingURL=component---src-pages-index-tsx-c6150e513ad875e74082.js.map