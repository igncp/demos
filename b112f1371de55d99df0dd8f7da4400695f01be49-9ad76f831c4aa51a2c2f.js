/*! For license information please see b112f1371de55d99df0dd8f7da4400695f01be49-9ad76f831c4aa51a2c2f.js.LICENSE.txt */
(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[962],{6198:function(e,t,n){var r,s,i;!function(o){"use strict";s=[n(8747),n(4350)],void 0===(i="function"==typeof(r=function(e){return e.ui.keyCode={BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}})?r.apply(t,s):r)||(e.exports=i)}()},4350:function(e,t,n){var r,s,i;!function(o){"use strict";s=[n(8747)],void 0===(i="function"==typeof(r=function(e){return e.ui=e.ui||{},e.ui.version="1.13.0"})?r.apply(t,s):r)||(e.exports=i)}()},9870:function(e,t,n){var r,s,i;!function(o){"use strict";s=[n(8747),n(4350)],r=function(e){var t=0,n=Array.prototype.hasOwnProperty,r=Array.prototype.slice;return e.cleanData=function(t){return function(n){var r,s,i;for(i=0;null!=(s=n[i]);i++)(r=e._data(s,"events"))&&r.remove&&e(s).triggerHandler("remove");t(n)}}(e.cleanData),e.widget=function(t,n,r){var s,i,o,a={},l=t.split(".")[0],c=l+"-"+(t=t.split(".")[1]);return r||(r=n,n=e.Widget),Array.isArray(r)&&(r=e.extend.apply(null,[{}].concat(r))),e.expr.pseudos[c.toLowerCase()]=function(t){return!!e.data(t,c)},e[l]=e[l]||{},s=e[l][t],i=e[l][t]=function(e,t){if(!this._createWidget)return new i(e,t);arguments.length&&this._createWidget(e,t)},e.extend(i,s,{version:r.version,_proto:e.extend({},r),_childConstructors:[]}),(o=new n).options=e.widget.extend({},o.options),e.each(r,(function(e,t){a[e]="function"==typeof t?function(){function r(){return n.prototype[e].apply(this,arguments)}function s(t){return n.prototype[e].apply(this,t)}return function(){var e,n=this._super,i=this._superApply;return this._super=r,this._superApply=s,e=t.apply(this,arguments),this._super=n,this._superApply=i,e}}():t})),i.prototype=e.widget.extend(o,{widgetEventPrefix:s&&o.widgetEventPrefix||t},a,{constructor:i,namespace:l,widgetName:t,widgetFullName:c}),s?(e.each(s._childConstructors,(function(t,n){var r=n.prototype;e.widget(r.namespace+"."+r.widgetName,i,n._proto)})),delete s._childConstructors):n._childConstructors.push(i),e.widget.bridge(t,i),i},e.widget.extend=function(t){for(var s,i,o=r.call(arguments,1),a=0,l=o.length;a<l;a++)for(s in o[a])i=o[a][s],n.call(o[a],s)&&void 0!==i&&(e.isPlainObject(i)?t[s]=e.isPlainObject(t[s])?e.widget.extend({},t[s],i):e.widget.extend({},i):t[s]=i);return t},e.widget.bridge=function(t,n){var s=n.prototype.widgetFullName||t;e.fn[t]=function(i){var o="string"==typeof i,a=r.call(arguments,1),l=this;return o?this.length||"instance"!==i?this.each((function(){var n,r=e.data(this,s);return"instance"===i?(l=r,!1):r?"function"!=typeof r[i]||"_"===i.charAt(0)?e.error("no such method '"+i+"' for "+t+" widget instance"):(n=r[i].apply(r,a))!==r&&void 0!==n?(l=n&&n.jquery?l.pushStack(n.get()):n,!1):void 0:e.error("cannot call methods on "+t+" prior to initialization; attempted to call method '"+i+"'")})):l=void 0:(a.length&&(i=e.widget.extend.apply(null,[i].concat(a))),this.each((function(){var t=e.data(this,s);t?(t.option(i||{}),t._init&&t._init()):e.data(this,s,new n(i,this))}))),l}},e.Widget=function(){},e.Widget._childConstructors=[],e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{classes:{},disabled:!1,create:null},_createWidget:function(n,r){r=e(r||this.defaultElement||this)[0],this.element=e(r),this.uuid=t++,this.eventNamespace="."+this.widgetName+this.uuid,this.bindings=e(),this.hoverable=e(),this.focusable=e(),this.classesElementLookup={},r!==this&&(e.data(r,this.widgetFullName,this),this._on(!0,this.element,{remove:function(e){e.target===r&&this.destroy()}}),this.document=e(r.style?r.ownerDocument:r.document||r),this.window=e(this.document[0].defaultView||this.document[0].parentWindow)),this.options=e.widget.extend({},this.options,this._getCreateOptions(),n),this._create(),this.options.disabled&&this._setOptionDisabled(this.options.disabled),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:function(){return{}},_getCreateEventData:e.noop,_create:e.noop,_init:e.noop,destroy:function(){var t=this;this._destroy(),e.each(this.classesElementLookup,(function(e,n){t._removeClass(n,e)})),this.element.off(this.eventNamespace).removeData(this.widgetFullName),this.widget().off(this.eventNamespace).removeAttr("aria-disabled"),this.bindings.off(this.eventNamespace)},_destroy:e.noop,widget:function(){return this.element},option:function(t,n){var r,s,i,o=t;if(0===arguments.length)return e.widget.extend({},this.options);if("string"==typeof t)if(o={},r=t.split("."),t=r.shift(),r.length){for(s=o[t]=e.widget.extend({},this.options[t]),i=0;i<r.length-1;i++)s[r[i]]=s[r[i]]||{},s=s[r[i]];if(t=r.pop(),1===arguments.length)return void 0===s[t]?null:s[t];s[t]=n}else{if(1===arguments.length)return void 0===this.options[t]?null:this.options[t];o[t]=n}return this._setOptions(o),this},_setOptions:function(e){var t;for(t in e)this._setOption(t,e[t]);return this},_setOption:function(e,t){return"classes"===e&&this._setOptionClasses(t),this.options[e]=t,"disabled"===e&&this._setOptionDisabled(t),this},_setOptionClasses:function(t){var n,r,s;for(n in t)s=this.classesElementLookup[n],t[n]!==this.options.classes[n]&&s&&s.length&&(r=e(s.get()),this._removeClass(s,n),r.addClass(this._classes({element:r,keys:n,classes:t,add:!0})))},_setOptionDisabled:function(e){this._toggleClass(this.widget(),this.widgetFullName+"-disabled",null,!!e),e&&(this._removeClass(this.hoverable,null,"ui-state-hover"),this._removeClass(this.focusable,null,"ui-state-focus"))},enable:function(){return this._setOptions({disabled:!1})},disable:function(){return this._setOptions({disabled:!0})},_classes:function(t){var n=[],r=this;function s(){t.element.each((function(t,n){e.map(r.classesElementLookup,(function(e){return e})).some((function(e){return e.is(n)}))||r._on(e(n),{remove:"_untrackClassesElement"})}))}function i(i,o){var a,l;for(l=0;l<i.length;l++)a=r.classesElementLookup[i[l]]||e(),t.add?(s(),a=e(e.uniqueSort(a.get().concat(t.element.get())))):a=e(a.not(t.element).get()),r.classesElementLookup[i[l]]=a,n.push(i[l]),o&&t.classes[i[l]]&&n.push(t.classes[i[l]])}return(t=e.extend({element:this.element,classes:this.options.classes||{}},t)).keys&&i(t.keys.match(/\S+/g)||[],!0),t.extra&&i(t.extra.match(/\S+/g)||[]),n.join(" ")},_untrackClassesElement:function(t){var n=this;e.each(n.classesElementLookup,(function(r,s){-1!==e.inArray(t.target,s)&&(n.classesElementLookup[r]=e(s.not(t.target).get()))})),this._off(e(t.target))},_removeClass:function(e,t,n){return this._toggleClass(e,t,n,!1)},_addClass:function(e,t,n){return this._toggleClass(e,t,n,!0)},_toggleClass:function(e,t,n,r){r="boolean"==typeof r?r:n;var s="string"==typeof e||null===e,i={extra:s?t:n,keys:s?e:t,element:s?this.element:e,add:r};return i.element.toggleClass(this._classes(i),r),this},_on:function(t,n,r){var s,i=this;"boolean"!=typeof t&&(r=n,n=t,t=!1),r?(n=s=e(n),this.bindings=this.bindings.add(n)):(r=n,n=this.element,s=this.widget()),e.each(r,(function(r,o){function a(){if(t||!0!==i.options.disabled&&!e(this).hasClass("ui-state-disabled"))return("string"==typeof o?i[o]:o).apply(i,arguments)}"string"!=typeof o&&(a.guid=o.guid=o.guid||a.guid||e.guid++);var l=r.match(/^([\w:-]*)\s*(.*)$/),c=l[1]+i.eventNamespace,u=l[2];u?s.on(c,u,a):n.on(c,a)}))},_off:function(t,n){n=(n||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,t.off(n),this.bindings=e(this.bindings.not(t).get()),this.focusable=e(this.focusable.not(t).get()),this.hoverable=e(this.hoverable.not(t).get())},_delay:function(e,t){function n(){return("string"==typeof e?r[e]:e).apply(r,arguments)}var r=this;return setTimeout(n,t||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){this._addClass(e(t.currentTarget),null,"ui-state-hover")},mouseleave:function(t){this._removeClass(e(t.currentTarget),null,"ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){this._addClass(e(t.currentTarget),null,"ui-state-focus")},focusout:function(t){this._removeClass(e(t.currentTarget),null,"ui-state-focus")}})},_trigger:function(t,n,r){var s,i,o=this.options[t];if(r=r||{},(n=e.Event(n)).type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),n.target=this.element[0],i=n.originalEvent)for(s in i)s in n||(n[s]=i[s]);return this.element.trigger(n,r),!("function"==typeof o&&!1===o.apply(this.element[0],[n].concat(r))||n.isDefaultPrevented())}},e.each({show:"fadeIn",hide:"fadeOut"},(function(t,n){e.Widget.prototype["_"+t]=function(r,s,i){var o;"string"==typeof s&&(s={effect:s});var a=s?!0===s||"number"==typeof s?n:s.effect||n:t;"number"==typeof(s=s||{})?s={duration:s}:!0===s&&(s={}),o=!e.isEmptyObject(s),s.complete=i,s.delay&&r.delay(s.delay),o&&e.effects&&e.effects.effect[a]?r[t](s):a!==t&&r[a]?r[a](s.duration,s.easing,i):r.queue((function(n){e(this)[t](),i&&i.call(r[0]),n()}))}})),e.widget},void 0===(i="function"==typeof r?r.apply(t,s):r)||(e.exports=i)}()},1223:function(e,t,n){var r=n(5112),s=n(30),i=n(3070),o=r("unscopables"),a=Array.prototype;null==a[o]&&i.f(a,o,{configurable:!0,value:s(null)}),e.exports=function(e){a[o][e]=!0}},7475:function(e,t,n){var r=n(7854),s=n(3157),i=n(4411),o=n(111),a=n(5112)("species"),l=r.Array;e.exports=function(e){var t;return s(e)&&(t=e.constructor,(i(t)&&(t===l||s(t.prototype))||o(t)&&null===(t=t[a]))&&(t=void 0)),void 0===t?l:t}},5417:function(e,t,n){var r=n(7475);e.exports=function(e,t){return new(r(e))(0===t?0:t)}},648:function(e,t,n){var r=n(7854),s=n(1694),i=n(614),o=n(4326),a=n(5112)("toStringTag"),l=r.Object,c="Arguments"==o(function(){return arguments}());e.exports=s?o:function(e){var t,n,r;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(n=function(e,t){try{return e[t]}catch(n){}}(t=l(e),a))?n:c?o(t):"Object"==(r=o(t))&&i(t.callee)?"Arguments":r}},6790:function(e,t,n){"use strict";var r=n(7854),s=n(3157),i=n(6244),o=n(9974),a=r.TypeError,l=function(e,t,n,r,c,u,m,f){for(var d,p,h=c,g=0,v=!!m&&o(m,f);g<r;){if(g in n){if(d=v?v(n[g],g,t):n[g],u>0&&s(d))p=i(d),h=l(e,t,d,p,h,u-1)-1;else{if(h>=9007199254740991)throw a("Exceed the acceptable array length");e[h]=d}h++}g++}return h};e.exports=l},9974:function(e,t,n){var r=n(1702),s=n(9662),i=r(r.bind);e.exports=function(e,t){return s(e),void 0===t?e:i?i(e,t):function(){return e.apply(t,arguments)}}},490:function(e,t,n){var r=n(5005);e.exports=r("document","documentElement")},3157:function(e,t,n){var r=n(4326);e.exports=Array.isArray||function(e){return"Array"==r(e)}},4411:function(e,t,n){var r=n(1702),s=n(7293),i=n(614),o=n(648),a=n(5005),l=n(2788),c=function(){},u=[],m=a("Reflect","construct"),f=/^\s*(?:class|function)\b/,d=r(f.exec),p=!f.exec(c),h=function(e){if(!i(e))return!1;try{return m(c,u,e),!0}catch(t){return!1}},g=function(e){if(!i(e))return!1;switch(o(e)){case"AsyncFunction":case"GeneratorFunction":case"AsyncGeneratorFunction":return!1}try{return p||!!d(f,l(e))}catch(t){return!0}};g.sham=!0,e.exports=!m||s((function(){var e;return h(h.call)||!h(Object)||!h((function(){e=!0}))||e}))?g:h},30:function(e,t,n){var r,s=n(9670),i=n(6048),o=n(748),a=n(3501),l=n(490),c=n(317),u=n(6200),m=u("IE_PROTO"),f=function(){},d=function(e){return"<script>"+e+"</"+"script>"},p=function(e){e.write(d("")),e.close();var t=e.parentWindow.Object;return e=null,t},h=function(){try{r=new ActiveXObject("htmlfile")}catch(s){}var e,t;h="undefined"!=typeof document?document.domain&&r?p(r):((t=c("iframe")).style.display="none",l.appendChild(t),t.src=String("javascript:"),(e=t.contentWindow.document).open(),e.write(d("document.F=Object")),e.close(),e.F):p(r);for(var n=o.length;n--;)delete h.prototype[o[n]];return h()};a[m]=!0,e.exports=Object.create||function(e,t){var n;return null!==e?(f.prototype=s(e),n=new f,f.prototype=null,n[m]=e):n=h(),void 0===t?n:i(n,t)}},6048:function(e,t,n){var r=n(9781),s=n(3070),i=n(9670),o=n(5656),a=n(1956);e.exports=r?Object.defineProperties:function(e,t){i(e);for(var n,r=o(t),l=a(t),c=l.length,u=0;c>u;)s.f(e,n=l[u++],r[n]);return e}},1956:function(e,t,n){var r=n(6324),s=n(748);e.exports=Object.keys||function(e){return r(e,s)}},1694:function(e,t,n){var r={};r[n(5112)("toStringTag")]="z",e.exports="[object z]"===String(r)},4944:function(e,t,n){"use strict";var r=n(2109),s=n(6790),i=n(7908),o=n(6244),a=n(9303),l=n(5417);r({target:"Array",proto:!0},{flat:function(){var e=arguments.length?arguments[0]:void 0,t=i(this),n=o(t),r=l(t,0);return r.length=s(r,t,t,n,0,void 0===e?1:a(e)),r}})},3792:function(e,t,n){n(1223)("flat")},4275:function(e,t,n){"use strict";n.d(t,{Z:function(){return f}});var r=n(7294),s=n(5414),i=n(2552),o=function(e){var t=e.isCompleted,n=e.mainSource,s=e.name;return r.createElement("h2",{className:"row",id:i.dc},r.createElement("span",{className:"col-xs-12 col-sm-10 p-0"},r.createElement("span",{className:i.jS},s," Chart "),r.createElement("small",{id:i.l4,title:"Main Source"},r.createElement("a",{href:n},"···")),!t&&r.createElement("small",{id:i.oT,title:"This demo is still work in progress"},"WIP")),r.createElement("span",{className:"col-sm-2 p-0 d-xs-none "+i.eR},r.createElement("a",{className:"btn btn-info",href:"/demos/",role:"button"},r.createElement("span",{className:"glyphicon glyphicon-home"})," Home")))},a=function(e){var t=e.filePath;return r.createElement(r.Fragment,null,r.createElement("span",null,"| "),r.createElement("a",{href:"https://github.com/igncp/demos/blob/main/"+t,rel:"noreferrer",target:"_blank"},"Code in Github"))},l=function(e){var t=e.filePath;return r.createElement(r.Fragment,null,r.createElement("span",null,"| "),r.createElement("a",{href:"https://igncp.github.io/demos/coverage-ts/files/"+t+".html",rel:"noreferrer",target:"_blank"},"TypeScript coverage report"))},c=function(e){var t=e.demoInfo;if("undefined"==typeof window)return null;var n="pages/"+t.category+"/"+t.key+"."+t.files.page.type;return r.createElement("div",null,!!t.notes.length&&r.createElement("div",{className:"bs-callout bs-callout-info"+i.$c},r.createElement("p",null,r.createElement("strong",null,"Notes:")),r.createElement("ul",null,t.notes.map((function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var s=t[0],i=t[1];return r.createElement("li",{dangerouslySetInnerHTML:{__html:s},key:i})})))),!!t.summary.length&&r.createElement("div",{className:"bs-callout bs-callout-summary "+i.$c},r.createElement("p",null,r.createElement("strong",null,"Implementation Summary:")),r.createElement("ul",null,t.summary.map((function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var s=t[0],i=t[1];return r.createElement("p",{dangerouslySetInnerHTML:{__html:s},key:i})})))),r.createElement("div",{className:"bs-callout bs-callout-primary",id:i.V2},r.createElement("p",null,r.createElement("strong",null,"Sources:")),r.createElement("ul",null,t.sources.map((function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var s=t[0],o=t[1];return r.createElement("li",{key:o},r.createElement("span",{className:i.hB},"[",o+1,"]"),":"," ",r.createElement("a",{href:s},s))})))),!!t.docs.length&&r.createElement("div",{className:"bs-callout bs-callout-secondary",id:"docs"},r.createElement("p",null,r.createElement("strong",null,"Docs:")),r.createElement("ul",null,t.docs.map((function(e){return r.createElement("li",{key:e[1],style:{border:"1px solid #157ad4",borderRadius:5,display:"inline-block",margin:5,padding:5}},r.createElement("a",{href:e[1],rel:"noreferrer",target:"_blank"},e[0]))})))),!!t.dataFiles.length&&r.createElement("div",{className:"bs-callout bs-callout-warning",id:i.sD},r.createElement("p",null,r.createElement("strong",null,"Data files: "),t.dataFiles.map((function(){for(var e=arguments.length,n=new Array(e),s=0;s<e;s++)n[s]=arguments[s];var i=n[0],o=n[1];return r.createElement("a",{href:"/demos/data/"+t.category+"/"+t.key+"/"+i,key:o},i)})))),r.createElement("div",{className:"bs-callout bs-callout-success",id:"code"},r.createElement("p",null,r.createElement("strong",null,"Code:")),r.createElement("ul",null,t.files.demoTS.map((function(e){var t=e.content,n=e.filePath;return r.createElement("li",{key:n},r.createElement("p",null,r.createElement("span",{className:i.s2},n)," ",r.createElement(r.Fragment,null,r.createElement(a,{filePath:n})," ",r.createElement(l,{filePath:n}))),r.createElement("pre",null,r.createElement("code",{dangerouslySetInnerHTML:{__html:t}})))})),r.createElement("li",null,r.createElement("p",null,r.createElement("span",{className:i.s2},n)," ",r.createElement(a,{filePath:n})," ",r.createElement(l,{filePath:n})),r.createElement("pre",null,r.createElement("code",{dangerouslySetInnerHTML:{__html:t.files.page.content}}))),t.files.demoCSS.map((function(e){var t=e.content,n=e.filePath;return r.createElement("li",{key:n},r.createElement("p",null,r.createElement("span",{className:i.s2},n)," ",r.createElement(a,{filePath:n})),r.createElement("pre",null,r.createElement("code",{dangerouslySetInnerHTML:{__html:t}})))})))))},u=n(2504),m=function(e){return"/"===e[0]?"/demos/"+e.replace(/^\//,""):e},f=function(e){var t=e.main,n=e.children,i=e.scripts,a=void 0===i?[]:i,l=e.links,f=void 0===l?[]:l,d=e.pageContext,p=d.demoInfo,h=d.meta,g=p.isCompleted,v=p.name,y=p.sources;return(0,r.useEffect)((function(){"undefined"!=typeof window&&t().catch((function(e){console.error("error:",e)}))}),[]),r.createElement(u.Z,null,r.createElement(s.q,{link:f.map((function(e){return{href:m(e),rel:"stylesheet",type:"text/css"}})),meta:[{content:h.description,name:"description"}],script:a.map((function(e){return{src:m(e),type:"text/javascript"}})),title:p.name+" | Demos igncp"}),r.createElement(o,{isCompleted:g,mainSource:y[0],name:v}),n,r.createElement(c,{demoInfo:p}))}},2504:function(e,t,n){"use strict";n.d(t,{Z:function(){return a}});var r=n(7294),s=n(2552),i=function(){return r.createElement("footer",{className:s.Mv},r.createElement("p",null,(new Date).getFullYear()))},o=function(){return r.createElement("div",{className:s.H6},r.createElement("h1",{className:"row"},r.createElement("span",{className:"col-3 col-md-8 p-0"},r.createElement("a",{href:"/demos/"},"Demos")," ",r.createElement("small",{className:"hide-tablet"},"interactive data visualization examples")),r.createElement("span",{className:"col-9 col-md-4 p-0",id:s.ak},r.createElement("iframe",{className:"hide-mobile",frameBorder:"0",height:"20",scrolling:"0",src:"https://ghbtns.com/github-btn.html?user=igncp&repo=demos&type=follow",width:"119"}),r.createElement("iframe",{className:"hide-mobile",frameBorder:"0",height:"20",scrolling:"0",src:"https://ghbtns.com/github-btn.html?user=igncp&repo=demos&type=fork",width:"62"}),r.createElement("iframe",{frameBorder:"0",height:"20",scrolling:"0",src:"https://ghbtns.com/github-btn.html?user=igncp&repo=demos&type=watch",width:"52"}))))},a=function(e){var t=e.children;return r.createElement(r.Fragment,null,r.createElement("div",{className:s.Mg},r.createElement("div",{className:"px-3 px-sm-5"},r.createElement(o,null),t)),r.createElement(i,null))}},2656:function(e,t,n){e.exports=n(3076)},2552:function(e,t,n){"use strict";n.d(t,{eR:function(){return r},rT:function(){return s},UG:function(){return i},ZV:function(){return o},Bf:function(){return a},K7:function(){return l},jS:function(){return c},s2:function(){return u},Mv:function(){return m},eQ:function(){return f},Be:function(){return d},$c:function(){return p},Mg:function(){return h},hB:function(){return g},H6:function(){return v},YX:function(){return y},zG:function(){return E},Vj:function(){return b},pn:function(){return _},x:function(){return w},oT:function(){return x},dc:function(){return N},l4:function(){return C},sD:function(){return k},V2:function(){return O},ak:function(){return A}});var r="styles-module--backHome--b9e05",s="styles-module--bullet--337e0",i="styles-module--d3js--ff3aa",o="styles-module--raphael--40af0",a="styles-module--storybook--f1bcc",l="styles-module--testing--9f8b3",c="styles-module--demoName--4057d",u="styles-module--fileNameWrapper--e0bd4",m="styles-module--footer--a0f96",f="styles-module--homeDemoNumber--755fe",d="styles-module--homeDemoNameLink--4b57a",p="styles-module--notes--e1c07",h="styles-module--rootLayout--03362",g="styles-module--sourceNumber--335c1",v="styles-module--pageHeader--06484",y="styles-module--rowWrapper--9f3a4",E="styles-module--demosLegend--16d25",b="styles-module--demosLists--52492",_="styles-module--highlightStorybook--b465e",w="styles-module--highlightTesting--b7d3f",x="styles-module--demoWip--18449",N="styles-module--demoTitle--7c73a",C="styles-module--mainSource--f7ebb",k="styles-module--dataList--54f77",O="styles-module--sourcesList--27e91",A="styles-module--ghButtons--1d466"},8634:function(e,t,n){"use strict";function r(e,t,n,r,s,i,o){try{var a=e[i](o),l=a.value}catch(c){return void n(c)}a.done?t(l):Promise.resolve(l).then(r,s)}function s(e){return function(){var t=this,n=arguments;return new Promise((function(s,i){var o=e.apply(t,n);function a(e){r(o,s,i,a,l,"next",e)}function l(e){r(o,s,i,a,l,"throw",e)}a(void 0)}))}}n.d(t,{Z:function(){return s}})}}]);
//# sourceMappingURL=b112f1371de55d99df0dd8f7da4400695f01be49-9ad76f831c4aa51a2c2f.js.map