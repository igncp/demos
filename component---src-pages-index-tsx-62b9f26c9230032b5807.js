(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[691],{5329:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return w}});var r=n(7294),o=n(9734),a=n.n(o),i=n(5414),s=n(8210),c=function(e){var t=e.demos,n=e.indexOffset;return r.createElement("ul",{className:"list-group"},t.map((function(e,t){return r.createElement("a",{className:"list-group-item",href:e.route,key:e.name},r.createElement("span",{className:"home-demo-number"},t+1+n,".-")," ",r.createElement("span",{className:"home-demo-name-link"},e.name),r.createElement("div",{className:"bullet "+e.category},"•"))})))},u=n(1802),l=n.n(u),d=n(3390),f=n.n(d),p={d3js:[],raphael:[]};for(var h in l()){var m=l()[h];m.key=h,m.category="d3js",m.route="/demos/d3js/"+h,p.d3js.push(m)}for(var v in f()){var b=f()[v];b.key=v,b.category="raphael",b.route="/demos/raphael/"+v,p.raphael.push(b)}var y=p.d3js,g=p.raphael,x=y.concat(g);x=a()(x,"name");var w=function(){var e=Math.ceil(x.length/2),t=[];return t[0]=x.slice(0,e),t[1]=x.slice(e,x.length),r.createElement(s.Z,null,r.createElement(i.q,{meta:[{content:"HTML data visualization demos for the web, rewritten and extended. Using TypeScript with libraries like d3js, Raphael, jQuery UI or Stylus, rendering SVG or Canvas elements.",name:"description"}],title:"Demos - igncp"}),r.createElement("div",{className:"bs-callout bs-callout-info"},"Here are some ",r.createElement("i",null,"interactive data visualization demos")," that are built with examples found on the web, which I've rewritten with ideas from other examples. The sources are always available. The idea is to try things using libraries like D3.js or Raphaël, and extensions of those."),r.createElement("div",{id:"demos-legend"},r.createElement("ul",{className:"bs-callout bs-callout-warning"},r.createElement("li",null,r.createElement("span",{className:"bullet d3js"},"•")," D3js"),r.createElement("li",null,r.createElement("span",{className:"bullet raphael"},"•")," Raphaël"))),r.createElement("div",{className:"row",id:"demos-lists"},r.createElement("div",{className:"col-lg-offset-2 col-lg-3"},r.createElement(c,{demos:t[0],indexOffset:0})),r.createElement("div",{className:"col-lg-offset-2 col-lg-3"},r.createElement(c,{demos:t[1],indexOffset:e}))))}},1802:function(e){var t=[["d3-shape API reference","https://github.com/d3/d3-shape"],["d3-shape Types","https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/d3-shape/index.d.ts"]],n=[["d3-selection API reference","https://github.com/d3/d3-selection#selecting-elements"],["d3-selection Types","https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/d3-selection/index.d.ts"]],r=[["d3-axis API reference","https://github.com/d3/d3-axis#api-reference"],["d3-axis Types","https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/d3-axis/index.d.ts"]],o=[["d3-scale API reference","https://github.com/d3/d3-scale"],["d3-scale Types","https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/d3-scale/index.d.ts"]];e.exports={area:{data:["data.csv"],docs:[].concat(n,t,o,r,[["d3-delaunay API reference","https://github.com/d3/d3-delaunay#api-reference"],["d3-delaunay Types","https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/d3-delaunay/index.d.ts"],["Delaunay Triangulation Wikipedia Article","https://en.wikipedia.org/wiki/Delaunay_triangulation"]]),name:"Area",notes:["Changed style","Added point and voronoi functionality"],sources:["http://codepen.io/notno/pen/ilvsd"],summary:["This chart is a mix of a common area + line chart plus Voronoi to properly display the points on mouse move. For the x and y axis, it uses two linear scales. It uses a SVG 'path' for printing the area, and a different SVG 'path' to print the line.","It uses an SVG 'clipPath' element with a 'rect' to limit the area and line paths. This doesn't look necessary, because after removing it, the area has the same dimensions. However I kept it because it was in the original source and it showcases this approach.","The voronoi lines are applied to a SVG 'path' element using 'voronoi.renderCell'. Because no context is passed to this method, it returns the SVG path by default. Each fragment of the voronoi chart has a fill value with opacity 0 in order to detect the mouse events.","The only return value from the render function is a function to allow toggling the visibility of the voronoi lines. This is done by changing the CSS class without re-rendering."]},bars:{data:["data.json"],docs:[],name:"Bars",notes:["Added axis","Changed direction and added color transition for wave effect","Added transition in axis and the add item possibility","The interval stops when you place the mouse over a bar"],sources:["http://codepen.io/basemoz/pen/mBoiL"],summary:[]},bubbles:{data:["data.json"],docs:[],name:"Bubbles",notes:['Using the <a href="https://github.com/novus/nvd3" target="_blank">NV3D</a> extension for D3JS',"Data taken from the Nike API (via the Codepen)",'You can click the "Maginify" button and click a point to zoom the chart'],sources:["http://codepen.io/linghzang3/pen/GFdzh"],summary:[]},chord:{data:["data.csv"],docs:[],name:"Chord",notes:["Added filters with drop shadow and low opacity","Changed scheme and match each color with a country"],sources:["http://bl.ocks.org/mbostock/1308257"],summary:[]},"collapsible-tree":{data:["data.json"],docs:[],name:"Collapsible Tree",notes:[],sources:["http://bl.ocks.org/mbostock/4339083","https://observablehq.com/@d3/collapsible-tree"],summary:[]},"concentric-circles":{data:[],docs:[],name:"Concentric Circles",notes:["Data of baby names in New York 2012","Custom color scale","Added box shadow filter"],sources:["http://codepen.io/notno/pen/wgyAz","http://bl.ocks.org/cpbotha/5200394","http://stackoverflow.com/questions/17671252/d3-create-a-continous-color-scale-with-many-strings-inputs-for-the-range-and-dy"],summary:[]},"fish-eye":{data:["data.json"],docs:[],name:"Fish Eye",notes:["Uses the Fish Eye plugin","Changed style","Click to stop and show a pointer","Extended the title information"],sources:["http://bost.ocks.org/mike/fisheye/"],summary:[]},force:{data:["links.json","nodes.json"],docs:[],name:"Force",notes:[],sources:["http://codepen.io/MidnightLightning/pen/dclbA"],summary:[]},icosahedron:{data:[],docs:[],name:"Icosahedron",notes:["No data bound to it, it could be to the speed, size, colors","Added color scale and the sinusoidal x velocity","Added the stop and move when clicked"],sources:["https://gist.github.com/mbostock/7782500"],summary:[]},"map-distorsions":{data:["data.tsv"],docs:[].concat(t,r,n,o),name:"Map Distorsions",notes:["Dynamic (for performance) shadow","Custom color scale related to index","Tooltip and minor style changes"],sources:["http://bl.ocks.org/mbostock/3709000"],summary:["This chart has some special characteristics like multiple vertical axis, color scale with many values, and the interaction with the mouse.","When hovering a line, the rest are converted to gray, and this one gets appended to the parent element, so it renders on top.","There is a drop-shadow filter applied but only to the focused line, which improves a lot the performance."]},"mareys-schedule":{data:["data.tsv"],docs:[],name:"Marey's Schedule",notes:["Added titles with information in stops and trains","Add box shadow","Add range input"],sources:["http://bl.ocks.org/mbostock/5544008"],summary:[]},"multiline-voronoi":{data:["data.tsv"],docs:[],name:"Multi-Line Voronoi",notes:["Click one time to just show a line, click again to sho all","Added color and dropshadow for 3D effect","Added label data and clicked function"],sources:["http://bl.ocks.org/mbostock/8033015"],summary:[]},partition:{data:["flare.json"],docs:[],name:"Partition (needs fix)",notes:["Added title attributes, labels and change colors with events","Needs fix: Change between types like 2016 chart"],sources:["http://bl.ocks.org/mbostock/4063423"],summary:[]},pie:{data:["data.json"],docs:[],name:"Pie",notes:["Added the animation (transition) by changing a random slice data by a random integer between range"],sources:["http://codepen.io/nishidh41/pen/Frzhq"],summary:[]},"spain-map":{data:["data.json"],docs:[],name:"Spanish Map",notes:["For this chart I reused the code from the World Map chart and other demos","Added drop shadow for 3D effect"],sources:["http://www.diva-gis.org/datadown"],summary:[]},timeline:{data:["data.csv"],docs:[],name:"Timeline",notes:["Change to bootstrap tooltip","Add dynamic text lengths (adding two dots)","Improve performance (a lot) removing the drop-shadow while brushing"],sources:["http://bl.ocks.org/rengel-de/5603464"],summary:[]},"trend-line":{data:["data.tsv"],docs:[],name:"Trend line",notes:["Added both line animations","Changed y scale domain"],sources:["http://codepen.io/arundhaj/pen/ouyjd","http://big-elephants.com/2014-06/unrolling-line-charts-d3js/"],summary:[]},vectors:{data:[],docs:[["d3-force API reference","https://github.com/d3/d3-force#forceSimulation"]],name:"Vectors (needs fix)",notes:["Use the <strong>Ctrl</strong> key to move nodes instead of creating vectors","Needs fix: Some functionality from 2016 chart detailed in the comments"],sources:["http://codepen.io/zarazum/pen/fjoqF"],summary:[]},"weekly-heatmap":{data:["data.tsv"],docs:[].concat(n,o,[["d3-fetch API reference","https://github.com/d3/d3-fetch#api-reference"],["d3-fetch Types","https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/d3-fetch/index.d.ts"]]),name:"Weekly Heatmap",notes:[],sources:["http://bl.ocks.org/tjdecke/5558084"],summary:["This chart is a grid of days and hours using a quantile to group the data values by nine colors. The number of groups is directly tied to the colors array, so removing or adding colors to the array also affects the number of groups."]},"world-map":{data:["world.json"],docs:[],name:"World Map",notes:["Added the mouse over stroke and the zooming-unzooming when clicking in countries (from third source)","Click a country to zoom, click in the water to set zoom back to normal"],sources:["http://bost.ocks.org/mike/map/","http://bl.ocks.org/mbostock/raw/4090846/world-50m.json","http://bl.ocks.org/mbostock/2206590"],summary:[]}}},3390:function(e){e.exports={"bars-3dimensional":{data:["data.json"],docs:[],name:"Bars 3D",notes:["Added titles on hover","Dynamic dimensions"],sources:["http://codepen.io/djam/pen/edjCz"],summary:[]},"circular-arcs":{data:[],docs:[],name:"Circular Arcs",notes:["This demo doesn't have data, but it wouldn't be hard (e.g. bound to the radius if all are different)"],sources:["http://codepen.io/dshapira/pen/ltrqc"],summary:[]},"moving-line":{data:["data.json"],docs:[],name:"Moving Line",notes:["The axis is not included as it is part of the background image","Add titles"],sources:["http://codepen.io/johnegraham2/pen/ExfBI"],summary:[]}}},8552:function(e,t,n){var r=n(852)(n(5639),"DataView");e.exports=r},3818:function(e,t,n){var r=n(852)(n(5639),"Promise");e.exports=r},8525:function(e,t,n){var r=n(852)(n(5639),"Set");e.exports=r},8668:function(e,t,n){var r=n(3369),o=n(619),a=n(2385);function i(e){var t=-1,n=null==e?0:e.length;for(this.__data__=new r;++t<n;)this.add(e[t])}i.prototype.add=i.prototype.push=o,i.prototype.has=a,e.exports=i},577:function(e,t,n){var r=n(852)(n(5639),"WeakMap");e.exports=r},6874:function(e){e.exports=function(e,t,n){switch(n.length){case 0:return e.call(t);case 1:return e.call(t,n[0]);case 2:return e.call(t,n[0],n[1]);case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}},4963:function(e){e.exports=function(e,t){for(var n=-1,r=null==e?0:e.length,o=0,a=[];++n<r;){var i=e[n];t(i,n,e)&&(a[o++]=i)}return a}},9932:function(e){e.exports=function(e,t){for(var n=-1,r=null==e?0:e.length,o=Array(r);++n<r;)o[n]=t(e[n],n,e);return o}},2488:function(e){e.exports=function(e,t){for(var n=-1,r=t.length,o=e.length;++n<r;)e[o+n]=t[n];return e}},2908:function(e){e.exports=function(e,t){for(var n=-1,r=null==e?0:e.length;++n<r;)if(t(e[n],n,e))return!0;return!1}},4140:function(e,t,n){var r=n(7816),o=n(9291)(r);e.exports=o},1078:function(e,t,n){var r=n(2488),o=n(7285);e.exports=function e(t,n,a,i,s){var c=-1,u=t.length;for(a||(a=o),s||(s=[]);++c<u;){var l=t[c];n>0&&a(l)?n>1?e(l,n-1,a,i,s):r(s,l):i||(s[s.length]=l)}return s}},8483:function(e,t,n){var r=n(5063)();e.exports=r},7816:function(e,t,n){var r=n(8483),o=n(3674);e.exports=function(e,t){return e&&r(e,t,o)}},7786:function(e,t,n){var r=n(1811),o=n(327);e.exports=function(e,t){for(var n=0,a=(t=r(t,e)).length;null!=e&&n<a;)e=e[o(t[n++])];return n&&n==a?e:void 0}},8866:function(e,t,n){var r=n(2488),o=n(1469);e.exports=function(e,t,n){var a=t(e);return o(e)?a:r(a,n(e))}},13:function(e){e.exports=function(e,t){return null!=e&&t in Object(e)}},939:function(e,t,n){var r=n(1299),o=n(7005);e.exports=function e(t,n,a,i,s){return t===n||(null==t||null==n||!o(t)&&!o(n)?t!=t&&n!=n:r(t,n,a,i,e,s))}},1299:function(e,t,n){var r=n(6384),o=n(7114),a=n(8351),i=n(6096),s=n(4160),c=n(1469),u=n(4144),l=n(6719),d="[object Arguments]",f="[object Array]",p="[object Object]",h=Object.prototype.hasOwnProperty;e.exports=function(e,t,n,m,v,b){var y=c(e),g=c(t),x=y?f:s(e),w=g?f:s(t),k=(x=x==d?p:x)==p,j=(w=w==d?p:w)==p,A=x==w;if(A&&u(e)){if(!u(t))return!1;y=!0,k=!1}if(A&&!k)return b||(b=new r),y||l(e)?o(e,t,n,m,v,b):a(e,t,x,n,m,v,b);if(!(1&n)){var T=k&&h.call(e,"__wrapped__"),D=j&&h.call(t,"__wrapped__");if(T||D){var E=T?e.value():e,C=D?t.value():t;return b||(b=new r),v(E,C,n,m,b)}}return!!A&&(b||(b=new r),i(e,t,n,m,v,b))}},2958:function(e,t,n){var r=n(6384),o=n(939);e.exports=function(e,t,n,a){var i=n.length,s=i,c=!a;if(null==e)return!s;for(e=Object(e);i--;){var u=n[i];if(c&&u[2]?u[1]!==e[u[0]]:!(u[0]in e))return!1}for(;++i<s;){var l=(u=n[i])[0],d=e[l],f=u[1];if(c&&u[2]){if(void 0===d&&!(l in e))return!1}else{var p=new r;if(a)var h=a(d,f,l,e,t,p);if(!(void 0===h?o(f,d,3,a,p):h))return!1}}return!0}},7206:function(e,t,n){var r=n(1573),o=n(6432),a=n(6557),i=n(1469),s=n(9601);e.exports=function(e){return"function"==typeof e?e:null==e?a:"object"==typeof e?i(e)?o(e[0],e[1]):r(e):s(e)}},280:function(e,t,n){var r=n(5726),o=n(6916),a=Object.prototype.hasOwnProperty;e.exports=function(e){if(!r(e))return o(e);var t=[];for(var n in Object(e))a.call(e,n)&&"constructor"!=n&&t.push(n);return t}},9199:function(e,t,n){var r=n(4140),o=n(8612);e.exports=function(e,t){var n=-1,a=o(e)?Array(e.length):[];return r(e,(function(e,r,o){a[++n]=t(e,r,o)})),a}},1573:function(e,t,n){var r=n(2958),o=n(1499),a=n(2634);e.exports=function(e){var t=o(e);return 1==t.length&&t[0][2]?a(t[0][0],t[0][1]):function(n){return n===e||r(n,e,t)}}},6432:function(e,t,n){var r=n(939),o=n(7361),a=n(9095),i=n(5403),s=n(9162),c=n(2634),u=n(327);e.exports=function(e,t){return i(e)&&s(t)?c(u(e),t):function(n){var i=o(n,e);return void 0===i&&i===t?a(n,e):r(t,i,3)}}},2689:function(e,t,n){var r=n(9932),o=n(7786),a=n(7206),i=n(9199),s=n(1131),c=n(1717),u=n(5022),l=n(6557),d=n(1469);e.exports=function(e,t,n){t=t.length?r(t,(function(e){return d(e)?function(t){return o(t,1===e.length?e[0]:e)}:e})):[l];var f=-1;t=r(t,c(a));var p=i(e,(function(e,n,o){return{criteria:r(t,(function(t){return t(e)})),index:++f,value:e}}));return s(p,(function(e,t){return u(e,t,n)}))}},371:function(e){e.exports=function(e){return function(t){return null==t?void 0:t[e]}}},9152:function(e,t,n){var r=n(7786);e.exports=function(e){return function(t){return r(t,e)}}},5976:function(e,t,n){var r=n(6557),o=n(5357),a=n(61);e.exports=function(e,t){return a(o(e,t,r),e+"")}},6560:function(e,t,n){var r=n(5703),o=n(8777),a=n(6557),i=o?function(e,t){return o(e,"toString",{configurable:!0,enumerable:!1,value:r(t),writable:!0})}:a;e.exports=i},1131:function(e){e.exports=function(e,t){var n=e.length;for(e.sort(t);n--;)e[n]=e[n].value;return e}},531:function(e,t,n){var r=n(2705),o=n(9932),a=n(1469),i=n(3448),s=r?r.prototype:void 0,c=s?s.toString:void 0;e.exports=function e(t){if("string"==typeof t)return t;if(a(t))return o(t,e)+"";if(i(t))return c?c.call(t):"";var n=t+"";return"0"==n&&1/t==-Infinity?"-0":n}},4757:function(e){e.exports=function(e,t){return e.has(t)}},1811:function(e,t,n){var r=n(1469),o=n(5403),a=n(5514),i=n(9833);e.exports=function(e,t){return r(e)?e:o(e,t)?[e]:a(i(e))}},6393:function(e,t,n){var r=n(3448);e.exports=function(e,t){if(e!==t){var n=void 0!==e,o=null===e,a=e==e,i=r(e),s=void 0!==t,c=null===t,u=t==t,l=r(t);if(!c&&!l&&!i&&e>t||i&&s&&u&&!c&&!l||o&&s&&u||!n&&u||!a)return 1;if(!o&&!i&&!l&&e<t||l&&n&&a&&!o&&!i||c&&n&&a||!s&&a||!u)return-1}return 0}},5022:function(e,t,n){var r=n(6393);e.exports=function(e,t,n){for(var o=-1,a=e.criteria,i=t.criteria,s=a.length,c=n.length;++o<s;){var u=r(a[o],i[o]);if(u)return o>=c?u:u*("desc"==n[o]?-1:1)}return e.index-t.index}},9291:function(e,t,n){var r=n(8612);e.exports=function(e,t){return function(n,o){if(null==n)return n;if(!r(n))return e(n,o);for(var a=n.length,i=t?a:-1,s=Object(n);(t?i--:++i<a)&&!1!==o(s[i],i,s););return n}}},5063:function(e){e.exports=function(e){return function(t,n,r){for(var o=-1,a=Object(t),i=r(t),s=i.length;s--;){var c=i[e?s:++o];if(!1===n(a[c],c,a))break}return t}}},7114:function(e,t,n){var r=n(8668),o=n(2908),a=n(4757);e.exports=function(e,t,n,i,s,c){var u=1&n,l=e.length,d=t.length;if(l!=d&&!(u&&d>l))return!1;var f=c.get(e),p=c.get(t);if(f&&p)return f==t&&p==e;var h=-1,m=!0,v=2&n?new r:void 0;for(c.set(e,t),c.set(t,e);++h<l;){var b=e[h],y=t[h];if(i)var g=u?i(y,b,h,t,e,c):i(b,y,h,e,t,c);if(void 0!==g){if(g)continue;m=!1;break}if(v){if(!o(t,(function(e,t){if(!a(v,t)&&(b===e||s(b,e,n,i,c)))return v.push(t)}))){m=!1;break}}else if(b!==y&&!s(b,y,n,i,c)){m=!1;break}}return c.delete(e),c.delete(t),m}},8351:function(e,t,n){var r=n(2705),o=n(1149),a=n(7813),i=n(7114),s=n(8776),c=n(1814),u=r?r.prototype:void 0,l=u?u.valueOf:void 0;e.exports=function(e,t,n,r,u,d,f){switch(n){case"[object DataView]":if(e.byteLength!=t.byteLength||e.byteOffset!=t.byteOffset)return!1;e=e.buffer,t=t.buffer;case"[object ArrayBuffer]":return!(e.byteLength!=t.byteLength||!d(new o(e),new o(t)));case"[object Boolean]":case"[object Date]":case"[object Number]":return a(+e,+t);case"[object Error]":return e.name==t.name&&e.message==t.message;case"[object RegExp]":case"[object String]":return e==t+"";case"[object Map]":var p=s;case"[object Set]":var h=1&r;if(p||(p=c),e.size!=t.size&&!h)return!1;var m=f.get(e);if(m)return m==t;r|=2,f.set(e,t);var v=i(p(e),p(t),r,u,d,f);return f.delete(e),v;case"[object Symbol]":if(l)return l.call(e)==l.call(t)}return!1}},6096:function(e,t,n){var r=n(8234),o=Object.prototype.hasOwnProperty;e.exports=function(e,t,n,a,i,s){var c=1&n,u=r(e),l=u.length;if(l!=r(t).length&&!c)return!1;for(var d=l;d--;){var f=u[d];if(!(c?f in t:o.call(t,f)))return!1}var p=s.get(e),h=s.get(t);if(p&&h)return p==t&&h==e;var m=!0;s.set(e,t),s.set(t,e);for(var v=c;++d<l;){var b=e[f=u[d]],y=t[f];if(a)var g=c?a(y,b,f,t,e,s):a(b,y,f,e,t,s);if(!(void 0===g?b===y||i(b,y,n,a,s):g)){m=!1;break}v||(v="constructor"==f)}if(m&&!v){var x=e.constructor,w=t.constructor;x==w||!("constructor"in e)||!("constructor"in t)||"function"==typeof x&&x instanceof x&&"function"==typeof w&&w instanceof w||(m=!1)}return s.delete(e),s.delete(t),m}},8234:function(e,t,n){var r=n(8866),o=n(9551),a=n(3674);e.exports=function(e){return r(e,a,o)}},1499:function(e,t,n){var r=n(9162),o=n(3674);e.exports=function(e){for(var t=o(e),n=t.length;n--;){var a=t[n],i=e[a];t[n]=[a,i,r(i)]}return t}},9551:function(e,t,n){var r=n(4963),o=n(479),a=Object.prototype.propertyIsEnumerable,i=Object.getOwnPropertySymbols,s=i?function(e){return null==e?[]:(e=Object(e),r(i(e),(function(t){return a.call(e,t)})))}:o;e.exports=s},4160:function(e,t,n){var r=n(8552),o=n(7071),a=n(3818),i=n(8525),s=n(577),c=n(4239),u=n(346),l="[object Map]",d="[object Promise]",f="[object Set]",p="[object WeakMap]",h="[object DataView]",m=u(r),v=u(o),b=u(a),y=u(i),g=u(s),x=c;(r&&x(new r(new ArrayBuffer(1)))!=h||o&&x(new o)!=l||a&&x(a.resolve())!=d||i&&x(new i)!=f||s&&x(new s)!=p)&&(x=function(e){var t=c(e),n="[object Object]"==t?e.constructor:void 0,r=n?u(n):"";if(r)switch(r){case m:return h;case v:return l;case b:return d;case y:return f;case g:return p}return t}),e.exports=x},222:function(e,t,n){var r=n(1811),o=n(5694),a=n(1469),i=n(5776),s=n(1780),c=n(327);e.exports=function(e,t,n){for(var u=-1,l=(t=r(t,e)).length,d=!1;++u<l;){var f=c(t[u]);if(!(d=null!=e&&n(e,f)))break;e=e[f]}return d||++u!=l?d:!!(l=null==e?0:e.length)&&s(l)&&i(f,l)&&(a(e)||o(e))}},7285:function(e,t,n){var r=n(2705),o=n(5694),a=n(1469),i=r?r.isConcatSpreadable:void 0;e.exports=function(e){return a(e)||o(e)||!!(i&&e&&e[i])}},6612:function(e,t,n){var r=n(7813),o=n(8612),a=n(5776),i=n(3218);e.exports=function(e,t,n){if(!i(n))return!1;var s=typeof t;return!!("number"==s?o(n)&&a(t,n.length):"string"==s&&t in n)&&r(n[t],e)}},5403:function(e,t,n){var r=n(1469),o=n(3448),a=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,i=/^\w*$/;e.exports=function(e,t){if(r(e))return!1;var n=typeof e;return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=e&&!o(e))||(i.test(e)||!a.test(e)||null!=t&&e in Object(t))}},9162:function(e,t,n){var r=n(3218);e.exports=function(e){return e==e&&!r(e)}},8776:function(e){e.exports=function(e){var t=-1,n=Array(e.size);return e.forEach((function(e,r){n[++t]=[r,e]})),n}},2634:function(e){e.exports=function(e,t){return function(n){return null!=n&&(n[e]===t&&(void 0!==t||e in Object(n)))}}},4523:function(e,t,n){var r=n(8306);e.exports=function(e){var t=r(e,(function(e){return 500===n.size&&n.clear(),e})),n=t.cache;return t}},6916:function(e,t,n){var r=n(5569)(Object.keys,Object);e.exports=r},5357:function(e,t,n){var r=n(6874),o=Math.max;e.exports=function(e,t,n){return t=o(void 0===t?e.length-1:t,0),function(){for(var a=arguments,i=-1,s=o(a.length-t,0),c=Array(s);++i<s;)c[i]=a[t+i];i=-1;for(var u=Array(t+1);++i<t;)u[i]=a[i];return u[t]=n(c),r(e,this,u)}}},619:function(e){e.exports=function(e){return this.__data__.set(e,"__lodash_hash_undefined__"),this}},2385:function(e){e.exports=function(e){return this.__data__.has(e)}},1814:function(e){e.exports=function(e){var t=-1,n=Array(e.size);return e.forEach((function(e){n[++t]=e})),n}},61:function(e,t,n){var r=n(6560),o=n(1275)(r);e.exports=o},1275:function(e){var t=Date.now;e.exports=function(e){var n=0,r=0;return function(){var o=t(),a=16-(o-r);if(r=o,a>0){if(++n>=800)return arguments[0]}else n=0;return e.apply(void 0,arguments)}}},5514:function(e,t,n){var r=n(4523),o=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,a=/\\(\\)?/g,i=r((function(e){var t=[];return 46===e.charCodeAt(0)&&t.push(""),e.replace(o,(function(e,n,r,o){t.push(r?o.replace(a,"$1"):n||e)})),t}));e.exports=i},327:function(e,t,n){var r=n(3448);e.exports=function(e){if("string"==typeof e||r(e))return e;var t=e+"";return"0"==t&&1/e==-Infinity?"-0":t}},5703:function(e){e.exports=function(e){return function(){return e}}},7361:function(e,t,n){var r=n(7786);e.exports=function(e,t,n){var o=null==e?void 0:r(e,t);return void 0===o?n:o}},9095:function(e,t,n){var r=n(13),o=n(222);e.exports=function(e,t){return null!=e&&o(e,t,r)}},6557:function(e){e.exports=function(e){return e}},3448:function(e,t,n){var r=n(4239),o=n(7005);e.exports=function(e){return"symbol"==typeof e||o(e)&&"[object Symbol]"==r(e)}},3674:function(e,t,n){var r=n(4636),o=n(280),a=n(8612);e.exports=function(e){return a(e)?r(e):o(e)}},8306:function(e,t,n){var r=n(3369);function o(e,t){if("function"!=typeof e||null!=t&&"function"!=typeof t)throw new TypeError("Expected a function");var n=function(){var r=arguments,o=t?t.apply(this,r):r[0],a=n.cache;if(a.has(o))return a.get(o);var i=e.apply(this,r);return n.cache=a.set(o,i)||a,i};return n.cache=new(o.Cache||r),n}o.Cache=r,e.exports=o},9601:function(e,t,n){var r=n(371),o=n(9152),a=n(5403),i=n(327);e.exports=function(e){return a(e)?r(i(e)):o(e)}},9734:function(e,t,n){var r=n(1078),o=n(2689),a=n(5976),i=n(6612),s=a((function(e,t){if(null==e)return[];var n=t.length;return n>1&&i(e,t[0],t[1])?t=[]:n>2&&i(t[0],t[1],t[2])&&(t=[t[0]]),o(e,r(t,1),[])}));e.exports=s},479:function(e){e.exports=function(){return[]}},9833:function(e,t,n){var r=n(531);e.exports=function(e){return null==e?"":r(e)}}}]);
//# sourceMappingURL=component---src-pages-index-tsx-62b9f26c9230032b5807.js.map