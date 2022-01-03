/*! For license information please see b112f1371de55d99df0dd8f7da4400695f01be49-8ff6b5a4b0ab113766d6.js.LICENSE.txt */
(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[962],{6198:function(e,t,n){var r,s,o;!function(i){"use strict";s=[n(8747),n(4350)],void 0===(o="function"==typeof(r=function(e){return e.ui.keyCode={BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}})?r.apply(t,s):r)||(e.exports=o)}()},4350:function(e,t,n){var r,s,o;!function(i){"use strict";s=[n(8747)],void 0===(o="function"==typeof(r=function(e){return e.ui=e.ui||{},e.ui.version="1.13.0"})?r.apply(t,s):r)||(e.exports=o)}()},9870:function(e,t,n){var r,s,o;!function(i){"use strict";s=[n(8747),n(4350)],r=function(e){var t=0,n=Array.prototype.hasOwnProperty,r=Array.prototype.slice;return e.cleanData=function(t){return function(n){var r,s,o;for(o=0;null!=(s=n[o]);o++)(r=e._data(s,"events"))&&r.remove&&e(s).triggerHandler("remove");t(n)}}(e.cleanData),e.widget=function(t,n,r){var s,o,i,a={},l=t.split(".")[0],c=l+"-"+(t=t.split(".")[1]);return r||(r=n,n=e.Widget),Array.isArray(r)&&(r=e.extend.apply(null,[{}].concat(r))),e.expr.pseudos[c.toLowerCase()]=function(t){return!!e.data(t,c)},e[l]=e[l]||{},s=e[l][t],o=e[l][t]=function(e,t){if(!this._createWidget)return new o(e,t);arguments.length&&this._createWidget(e,t)},e.extend(o,s,{version:r.version,_proto:e.extend({},r),_childConstructors:[]}),(i=new n).options=e.widget.extend({},i.options),e.each(r,(function(e,t){a[e]="function"==typeof t?function(){function r(){return n.prototype[e].apply(this,arguments)}function s(t){return n.prototype[e].apply(this,t)}return function(){var e,n=this._super,o=this._superApply;return this._super=r,this._superApply=s,e=t.apply(this,arguments),this._super=n,this._superApply=o,e}}():t})),o.prototype=e.widget.extend(i,{widgetEventPrefix:s&&i.widgetEventPrefix||t},a,{constructor:o,namespace:l,widgetName:t,widgetFullName:c}),s?(e.each(s._childConstructors,(function(t,n){var r=n.prototype;e.widget(r.namespace+"."+r.widgetName,o,n._proto)})),delete s._childConstructors):n._childConstructors.push(o),e.widget.bridge(t,o),o},e.widget.extend=function(t){for(var s,o,i=r.call(arguments,1),a=0,l=i.length;a<l;a++)for(s in i[a])o=i[a][s],n.call(i[a],s)&&void 0!==o&&(e.isPlainObject(o)?t[s]=e.isPlainObject(t[s])?e.widget.extend({},t[s],o):e.widget.extend({},o):t[s]=o);return t},e.widget.bridge=function(t,n){var s=n.prototype.widgetFullName||t;e.fn[t]=function(o){var i="string"==typeof o,a=r.call(arguments,1),l=this;return i?this.length||"instance"!==o?this.each((function(){var n,r=e.data(this,s);return"instance"===o?(l=r,!1):r?"function"!=typeof r[o]||"_"===o.charAt(0)?e.error("no such method '"+o+"' for "+t+" widget instance"):(n=r[o].apply(r,a))!==r&&void 0!==n?(l=n&&n.jquery?l.pushStack(n.get()):n,!1):void 0:e.error("cannot call methods on "+t+" prior to initialization; attempted to call method '"+o+"'")})):l=void 0:(a.length&&(o=e.widget.extend.apply(null,[o].concat(a))),this.each((function(){var t=e.data(this,s);t?(t.option(o||{}),t._init&&t._init()):e.data(this,s,new n(o,this))}))),l}},e.Widget=function(){},e.Widget._childConstructors=[],e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{classes:{},disabled:!1,create:null},_createWidget:function(n,r){r=e(r||this.defaultElement||this)[0],this.element=e(r),this.uuid=t++,this.eventNamespace="."+this.widgetName+this.uuid,this.bindings=e(),this.hoverable=e(),this.focusable=e(),this.classesElementLookup={},r!==this&&(e.data(r,this.widgetFullName,this),this._on(!0,this.element,{remove:function(e){e.target===r&&this.destroy()}}),this.document=e(r.style?r.ownerDocument:r.document||r),this.window=e(this.document[0].defaultView||this.document[0].parentWindow)),this.options=e.widget.extend({},this.options,this._getCreateOptions(),n),this._create(),this.options.disabled&&this._setOptionDisabled(this.options.disabled),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:function(){return{}},_getCreateEventData:e.noop,_create:e.noop,_init:e.noop,destroy:function(){var t=this;this._destroy(),e.each(this.classesElementLookup,(function(e,n){t._removeClass(n,e)})),this.element.off(this.eventNamespace).removeData(this.widgetFullName),this.widget().off(this.eventNamespace).removeAttr("aria-disabled"),this.bindings.off(this.eventNamespace)},_destroy:e.noop,widget:function(){return this.element},option:function(t,n){var r,s,o,i=t;if(0===arguments.length)return e.widget.extend({},this.options);if("string"==typeof t)if(i={},r=t.split("."),t=r.shift(),r.length){for(s=i[t]=e.widget.extend({},this.options[t]),o=0;o<r.length-1;o++)s[r[o]]=s[r[o]]||{},s=s[r[o]];if(t=r.pop(),1===arguments.length)return void 0===s[t]?null:s[t];s[t]=n}else{if(1===arguments.length)return void 0===this.options[t]?null:this.options[t];i[t]=n}return this._setOptions(i),this},_setOptions:function(e){var t;for(t in e)this._setOption(t,e[t]);return this},_setOption:function(e,t){return"classes"===e&&this._setOptionClasses(t),this.options[e]=t,"disabled"===e&&this._setOptionDisabled(t),this},_setOptionClasses:function(t){var n,r,s;for(n in t)s=this.classesElementLookup[n],t[n]!==this.options.classes[n]&&s&&s.length&&(r=e(s.get()),this._removeClass(s,n),r.addClass(this._classes({element:r,keys:n,classes:t,add:!0})))},_setOptionDisabled:function(e){this._toggleClass(this.widget(),this.widgetFullName+"-disabled",null,!!e),e&&(this._removeClass(this.hoverable,null,"ui-state-hover"),this._removeClass(this.focusable,null,"ui-state-focus"))},enable:function(){return this._setOptions({disabled:!1})},disable:function(){return this._setOptions({disabled:!0})},_classes:function(t){var n=[],r=this;function s(){t.element.each((function(t,n){e.map(r.classesElementLookup,(function(e){return e})).some((function(e){return e.is(n)}))||r._on(e(n),{remove:"_untrackClassesElement"})}))}function o(o,i){var a,l;for(l=0;l<o.length;l++)a=r.classesElementLookup[o[l]]||e(),t.add?(s(),a=e(e.uniqueSort(a.get().concat(t.element.get())))):a=e(a.not(t.element).get()),r.classesElementLookup[o[l]]=a,n.push(o[l]),i&&t.classes[o[l]]&&n.push(t.classes[o[l]])}return(t=e.extend({element:this.element,classes:this.options.classes||{}},t)).keys&&o(t.keys.match(/\S+/g)||[],!0),t.extra&&o(t.extra.match(/\S+/g)||[]),n.join(" ")},_untrackClassesElement:function(t){var n=this;e.each(n.classesElementLookup,(function(r,s){-1!==e.inArray(t.target,s)&&(n.classesElementLookup[r]=e(s.not(t.target).get()))})),this._off(e(t.target))},_removeClass:function(e,t,n){return this._toggleClass(e,t,n,!1)},_addClass:function(e,t,n){return this._toggleClass(e,t,n,!0)},_toggleClass:function(e,t,n,r){r="boolean"==typeof r?r:n;var s="string"==typeof e||null===e,o={extra:s?t:n,keys:s?e:t,element:s?this.element:e,add:r};return o.element.toggleClass(this._classes(o),r),this},_on:function(t,n,r){var s,o=this;"boolean"!=typeof t&&(r=n,n=t,t=!1),r?(n=s=e(n),this.bindings=this.bindings.add(n)):(r=n,n=this.element,s=this.widget()),e.each(r,(function(r,i){function a(){if(t||!0!==o.options.disabled&&!e(this).hasClass("ui-state-disabled"))return("string"==typeof i?o[i]:i).apply(o,arguments)}"string"!=typeof i&&(a.guid=i.guid=i.guid||a.guid||e.guid++);var l=r.match(/^([\w:-]*)\s*(.*)$/),c=l[1]+o.eventNamespace,u=l[2];u?s.on(c,u,a):n.on(c,a)}))},_off:function(t,n){n=(n||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,t.off(n),this.bindings=e(this.bindings.not(t).get()),this.focusable=e(this.focusable.not(t).get()),this.hoverable=e(this.hoverable.not(t).get())},_delay:function(e,t){function n(){return("string"==typeof e?r[e]:e).apply(r,arguments)}var r=this;return setTimeout(n,t||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){this._addClass(e(t.currentTarget),null,"ui-state-hover")},mouseleave:function(t){this._removeClass(e(t.currentTarget),null,"ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){this._addClass(e(t.currentTarget),null,"ui-state-focus")},focusout:function(t){this._removeClass(e(t.currentTarget),null,"ui-state-focus")}})},_trigger:function(t,n,r){var s,o,i=this.options[t];if(r=r||{},(n=e.Event(n)).type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),n.target=this.element[0],o=n.originalEvent)for(s in o)s in n||(n[s]=o[s]);return this.element.trigger(n,r),!("function"==typeof i&&!1===i.apply(this.element[0],[n].concat(r))||n.isDefaultPrevented())}},e.each({show:"fadeIn",hide:"fadeOut"},(function(t,n){e.Widget.prototype["_"+t]=function(r,s,o){var i;"string"==typeof s&&(s={effect:s});var a=s?!0===s||"number"==typeof s?n:s.effect||n:t;"number"==typeof(s=s||{})?s={duration:s}:!0===s&&(s={}),i=!e.isEmptyObject(s),s.complete=o,s.delay&&r.delay(s.delay),i&&e.effects&&e.effects.effect[a]?r[t](s):a!==t&&r[a]?r[a](s.duration,s.easing,o):r.queue((function(n){e(this)[t](),o&&o.call(r[0]),n()}))}})),e.widget},void 0===(o="function"==typeof r?r.apply(t,s):r)||(e.exports=o)}()},1223:function(e,t,n){var r=n(5112),s=n(30),o=n(3070),i=r("unscopables"),a=Array.prototype;null==a[i]&&o.f(a,i,{configurable:!0,value:s(null)}),e.exports=function(e){a[i][e]=!0}},7475:function(e,t,n){var r=n(7854),s=n(3157),o=n(4411),i=n(111),a=n(5112)("species"),l=r.Array;e.exports=function(e){var t;return s(e)&&(t=e.constructor,(o(t)&&(t===l||s(t.prototype))||i(t)&&null===(t=t[a]))&&(t=void 0)),void 0===t?l:t}},5417:function(e,t,n){var r=n(7475);e.exports=function(e,t){return new(r(e))(0===t?0:t)}},648:function(e,t,n){var r=n(7854),s=n(1694),o=n(614),i=n(4326),a=n(5112)("toStringTag"),l=r.Object,c="Arguments"==i(function(){return arguments}());e.exports=s?i:function(e){var t,n,r;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(n=function(e,t){try{return e[t]}catch(n){}}(t=l(e),a))?n:c?i(t):"Object"==(r=i(t))&&o(t.callee)?"Arguments":r}},6790:function(e,t,n){"use strict";var r=n(7854),s=n(3157),o=n(6244),i=n(9974),a=r.TypeError,l=function(e,t,n,r,c,u,m,f){for(var d,h,p=c,g=0,v=!!m&&i(m,f);g<r;){if(g in n){if(d=v?v(n[g],g,t):n[g],u>0&&s(d))h=o(d),p=l(e,t,d,h,p,u-1)-1;else{if(p>=9007199254740991)throw a("Exceed the acceptable array length");e[p]=d}p++}g++}return p};e.exports=l},9974:function(e,t,n){var r=n(1702),s=n(9662),o=r(r.bind);e.exports=function(e,t){return s(e),void 0===t?e:o?o(e,t):function(){return e.apply(t,arguments)}}},490:function(e,t,n){var r=n(5005);e.exports=r("document","documentElement")},3157:function(e,t,n){var r=n(4326);e.exports=Array.isArray||function(e){return"Array"==r(e)}},4411:function(e,t,n){var r=n(1702),s=n(7293),o=n(614),i=n(648),a=n(5005),l=n(2788),c=function(){},u=[],m=a("Reflect","construct"),f=/^\s*(?:class|function)\b/,d=r(f.exec),h=!f.exec(c),p=function(e){if(!o(e))return!1;try{return m(c,u,e),!0}catch(t){return!1}},g=function(e){if(!o(e))return!1;switch(i(e)){case"AsyncFunction":case"GeneratorFunction":case"AsyncGeneratorFunction":return!1}try{return h||!!d(f,l(e))}catch(t){return!0}};g.sham=!0,e.exports=!m||s((function(){var e;return p(p.call)||!p(Object)||!p((function(){e=!0}))||e}))?g:p},30:function(e,t,n){var r,s=n(9670),o=n(6048),i=n(748),a=n(3501),l=n(490),c=n(317),u=n(6200),m=u("IE_PROTO"),f=function(){},d=function(e){return"<script>"+e+"</"+"script>"},h=function(e){e.write(d("")),e.close();var t=e.parentWindow.Object;return e=null,t},p=function(){try{r=new ActiveXObject("htmlfile")}catch(s){}var e,t;p="undefined"!=typeof document?document.domain&&r?h(r):((t=c("iframe")).style.display="none",l.appendChild(t),t.src=String("javascript:"),(e=t.contentWindow.document).open(),e.write(d("document.F=Object")),e.close(),e.F):h(r);for(var n=i.length;n--;)delete p.prototype[i[n]];return p()};a[m]=!0,e.exports=Object.create||function(e,t){var n;return null!==e?(f.prototype=s(e),n=new f,f.prototype=null,n[m]=e):n=p(),void 0===t?n:o(n,t)}},6048:function(e,t,n){var r=n(9781),s=n(3070),o=n(9670),i=n(5656),a=n(1956);e.exports=r?Object.defineProperties:function(e,t){o(e);for(var n,r=i(t),l=a(t),c=l.length,u=0;c>u;)s.f(e,n=l[u++],r[n]);return e}},1956:function(e,t,n){var r=n(6324),s=n(748);e.exports=Object.keys||function(e){return r(e,s)}},1694:function(e,t,n){var r={};r[n(5112)("toStringTag")]="z",e.exports="[object z]"===String(r)},4944:function(e,t,n){"use strict";var r=n(2109),s=n(6790),o=n(7908),i=n(6244),a=n(9303),l=n(5417);r({target:"Array",proto:!0},{flat:function(){var e=arguments.length?arguments[0]:void 0,t=o(this),n=i(t),r=l(t,0);return r.length=s(r,t,t,n,0,void 0===e?1:a(e)),r}})},3792:function(e,t,n){n(1223)("flat")},1745:function(e,t,n){"use strict";n.d(t,{Z:function(){return p}});var r=n(7294),s=n(5414),o=n(2552),i=function(e){var t,n=e.isCompleted,s=e.mainSource,i=e.name;return r.createElement("h2",{className:"row",id:o.dc},r.createElement("span",{className:"col-xs-12 col-sm-10 p-0"},r.createElement("span",{className:o.jS},i," Chart "),r.createElement("small",{id:o.l4,title:"Main Source"},r.createElement("a",{href:s},"···")),!n&&r.createElement("small",{id:o.oT,title:"This demo is still work in progress"},"WIP")),r.createElement("span",Object.assign({className:"col-sm-2 p-0 d-xs-none "+o.eR},((t={})["data-back-home"]="",t)),r.createElement("a",{className:"btn btn-info",href:"/demos/",role:"button"},r.createElement("span",{className:"glyphicon glyphicon-home"})," Home")))},a=function(e){return"src/demos/"+e+"/tests/"+e+".e2e.ts"},l=function(){var e=(0,r.useState)(null),t=e[0],n=e[1];return(0,r.useEffect)((function(){var e="undefined"==typeof window?null:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth,document.body.offsetWidth,document.documentElement.offsetWidth,document.documentElement.clientWidth);null!==e&&n(e)}),[]),t},c=function(e){var t=e.content,n=(0,r.useState)(!1),s=n[0],i=n[1],a=l();return null===a?null:!a||a<1280&&!s?r.createElement("div",{className:o.wI},r.createElement("button",{className:o.W2+" btn btn-light",onClick:function(){return i(!0)},type:"button"},"Show Code")):r.createElement("pre",null,r.createElement("code",{dangerouslySetInnerHTML:{__html:t}}))},u=function(e){var t=e.filePath;return r.createElement(r.Fragment,null,r.createElement("span",null,"| "),r.createElement("a",{href:"https://github.com/igncp/demos/blob/main/"+t,rel:"noreferrer",target:"_blank"},"Code in Github"))},m=function(e){var t=e.filePath;return r.createElement(r.Fragment,null,r.createElement("span",null,"| "),r.createElement("a",{href:"https://igncp.github.io/demos/coverage-ts/files/"+t+".html",rel:"noreferrer",target:"_blank"},"TypeScript coverage report"))},f=function(e){var t=e.demoInfo;if("undefined"==typeof window)return null;var n="pages/"+t.category+"/"+t.key+"."+t.files.page.type;return r.createElement("div",null,!!t.notes.length&&r.createElement("div",{className:"bs-callout bs-callout-info"+o.$c},r.createElement("p",null,r.createElement("strong",null,"Notes:")),r.createElement("ul",null,t.notes.map((function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var s=t[0],o=t[1];return r.createElement("li",{dangerouslySetInnerHTML:{__html:s},key:o})})))),!!t.summary.length&&r.createElement("div",{className:"bs-callout bs-callout-summary "+o.$c},r.createElement("p",null,r.createElement("strong",null,"Implementation Summary:")),r.createElement("ul",null,t.summary.map((function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var s=t[0],o=t[1];return r.createElement("p",{dangerouslySetInnerHTML:{__html:s},key:o})})))),r.createElement("div",{className:"bs-callout bs-callout-primary",id:o.V2},r.createElement("p",null,r.createElement("strong",null,"Sources:")),r.createElement("ul",null,t.sources.map((function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var s=t[0],i=t[1];return r.createElement("li",{key:i},r.createElement("span",{className:o.hB},"[",i+1,"]"),":"," ",r.createElement("a",{href:s},s))})))),!!t.docs.length&&r.createElement("div",{className:"bs-callout bs-callout-secondary",id:"docs"},r.createElement("p",null,r.createElement("strong",null,"Docs:")),r.createElement("div",{className:o.Jw},t.docs.map((function(e){return r.createElement("span",{className:o._q,key:e[1]},r.createElement("a",{href:e[1],rel:"noreferrer",target:"_blank"},e[0]))})))),!!t.dataFiles.length&&r.createElement("div",{className:"bs-callout bs-callout-warning",id:o.sD},r.createElement("p",null,r.createElement("strong",null,"Data files: "),t.dataFiles.map((function(){for(var e=arguments.length,n=new Array(e),s=0;s<e;s++)n[s]=arguments[s];var o=n[0],i=n[1];return r.createElement("a",{href:"/demos/data/"+t.category+"/"+t.key+"/"+o,key:i},o)})))),r.createElement("div",{className:"bs-callout bs-callout-success",id:"code"},r.createElement("p",null,r.createElement("strong",null,"Code:")),r.createElement("ul",null,t.files.demoTS.map((function(){for(var e=arguments.length,n=new Array(e),s=0;s<e;s++)n[s]=arguments[s];var i=n[0],l=i.content,f=i.filePath,d=n[1];return r.createElement("li",{key:f},r.createElement("p",null,r.createElement("span",{className:o.s2},f)," ",r.createElement(u,{filePath:f})," ",r.createElement(m,{filePath:f}),0===d&&r.createElement(r.Fragment,null,r.createElement("span",null," | "),r.createElement("a",{href:"https://github.com/igncp/demos/blob/main/"+a(t.key),rel:"noreferrer",target:"_blank"},"E2E tests"))),r.createElement(c,{content:l}),r.createElement("div",{className:o.XP}))})),r.createElement("li",null,r.createElement("p",null,r.createElement("span",{className:o.s2},n)," ",r.createElement(u,{filePath:n})," ",r.createElement(m,{filePath:n})),r.createElement(c,{content:t.files.page.content}),!!t.files.demoCSS.length&&r.createElement("div",{className:o.XP})),t.files.demoCSS.map((function(){for(var e=arguments.length,n=new Array(e),s=0;s<e;s++)n[s]=arguments[s];var i=n[0],a=i.content,l=i.filePath,m=n[1];return r.createElement("li",{key:l},r.createElement("p",null,r.createElement("span",{className:o.s2},l)," ",r.createElement(u,{filePath:l})),r.createElement(c,{content:a}),m!==t.files.demoCSS.length-1&&r.createElement("div",{className:o.XP}))})))))},d=n(2504),h=function(e){return"/"===e[0]?"/demos/"+e.replace(/^\//,""):e},p=function(e){var t=e.main,n=e.children,o=e.scripts,a=void 0===o?[]:o,l=e.links,c=void 0===l?[]:l,u=e.pageContext,m=u.demoInfo,p=u.meta,g=m.isCompleted,v=m.name,y=m.sources;return(0,r.useEffect)((function(){"undefined"!=typeof window&&t().catch((function(e){console.error("error:",e)}))}),[]),r.createElement(d.Z,null,r.createElement(s.q,{link:c.map((function(e){return{href:h(e),rel:"stylesheet",type:"text/css"}})),meta:[{content:p.description,name:"description"}],script:a.map((function(e){return{src:h(e),type:"text/javascript"}})),title:m.name+" | Demos igncp"}),r.createElement(i,{isCompleted:g,mainSource:y[0],name:v}),n,r.createElement(f,{demoInfo:m}))}},2504:function(e,t,n){"use strict";n.d(t,{Z:function(){return a}});var r=n(7294),s=n(2552),o=function(){return r.createElement("footer",{className:s.Mv},r.createElement("p",null,(new Date).getFullYear()))},i=function(){return r.createElement("div",{className:s.H6},r.createElement("h1",{className:"row"},r.createElement("span",{className:"col-3 col-md-8 p-0"},r.createElement("a",{href:"/demos/"},"Demos")," ",r.createElement("small",{className:"hide-tablet"},"interactive data visualization examples")),r.createElement("span",{className:"col-9 col-md-4 p-0",id:s.ak},r.createElement("iframe",{className:"hide-mobile",frameBorder:"0",height:"20",scrolling:"0",src:"https://ghbtns.com/github-btn.html?user=igncp&repo=demos&type=follow",width:"119"}),r.createElement("iframe",{className:"hide-mobile",frameBorder:"0",height:"20",scrolling:"0",src:"https://ghbtns.com/github-btn.html?user=igncp&repo=demos&type=fork",width:"62"}),r.createElement("iframe",{frameBorder:"0",height:"20",scrolling:"0",src:"https://ghbtns.com/github-btn.html?user=igncp&repo=demos&type=watch",width:"52"}))))},a=function(e){var t=e.children;return r.createElement(r.Fragment,null,r.createElement("div",{className:s.Mg},r.createElement("div",{className:"px-3 px-sm-5"},r.createElement(i,null),t)),r.createElement(o,null))}},2656:function(e,t,n){e.exports=n(3076)},2552:function(e,t,n){"use strict";n.d(t,{eR:function(){return r},rT:function(){return s},UG:function(){return o},ZV:function(){return i},Bf:function(){return a},K7:function(){return l},wI:function(){return c},W2:function(){return u},jS:function(){return m},XP:function(){return f},s2:function(){return d},Mv:function(){return h},eQ:function(){return p},Be:function(){return g},$c:function(){return v},Mg:function(){return y},hB:function(){return E},H6:function(){return b},YX:function(){return w},Jw:function(){return _},_q:function(){return N},zG:function(){return C},Vj:function(){return x},pn:function(){return k},x:function(){return A},oT:function(){return O},dc:function(){return P},l4:function(){return S},sD:function(){return T},V2:function(){return D},ak:function(){return W}});var r="styles-module--backHome--b9e05",s="styles-module--bullet--337e0",o="styles-module--d3js--ff3aa",i="styles-module--raphael--40af0",a="styles-module--storybook--f1bcc",l="styles-module--testing--9f8b3",c="styles-module--codeFragment--8d705",u="styles-module--codeFragmentButton--98bc0",m="styles-module--demoName--4057d",f="styles-module--divisor--4c75d",d="styles-module--fileNameWrapper--e0bd4",h="styles-module--footer--a0f96",p="styles-module--homeDemoNumber--755fe",g="styles-module--homeDemoNameLink--4b57a",v="styles-module--notes--e1c07",y="styles-module--rootLayout--03362",E="styles-module--sourceNumber--335c1",b="styles-module--pageHeader--06484",w="styles-module--rowWrapper--9f3a4",_="styles-module--tagCollection--c96c8",N="styles-module--tag--8c674",C="styles-module--demosLegend--16d25",x="styles-module--demosLists--52492",k="styles-module--highlightStorybook--b465e",A="styles-module--highlightTesting--b7d3f",O="styles-module--demoWip--18449",P="styles-module--demoTitle--7c73a",S="styles-module--mainSource--f7ebb",T="styles-module--dataList--54f77",D="styles-module--sourcesList--27e91",W="styles-module--ghButtons--1d466"},8634:function(e,t,n){"use strict";function r(e,t,n,r,s,o,i){try{var a=e[o](i),l=a.value}catch(c){return void n(c)}a.done?t(l):Promise.resolve(l).then(r,s)}function s(e){return function(){var t=this,n=arguments;return new Promise((function(s,o){var i=e.apply(t,n);function a(e){r(i,s,o,a,l,"next",e)}function l(e){r(i,s,o,a,l,"throw",e)}a(void 0)}))}}n.d(t,{Z:function(){return s}})}}]);
//# sourceMappingURL=b112f1371de55d99df0dd8f7da4400695f01be49-8ff6b5a4b0ab113766d6.js.map