(self.webpackChunkdemos=self.webpackChunkdemos||[]).push([[542],{2137:function(t,e,n){"use strict";function r(t,e,n,r,i,a,s){try{var o=t[a](s),l=o.value}catch(h){return void n(h)}o.done?e(l):Promise.resolve(l).then(r,i)}function i(t){return function(){var e=this,n=arguments;return new Promise((function(i,a){var s=t.apply(e,n);function o(t){r(s,i,a,o,l,"next",t)}function l(t){r(s,i,a,o,l,"throw",t)}o(void 0)}))}}n.d(e,{Z:function(){return i}})},1616:function(t,e,n){"use strict";var r=n(8236),i=n(2492),a=n.n(i),s={colorsScale:function(){},filterBlackOpacity:function(t,e,n,r){var i=e.append("defs").append("filter").attr("height","500%").attr("id","drop-shadow-"+t).attr("width","500%").attr("x","-200%").attr("y","-200%");i.append("feGaussianBlur").attr("in","SourceAlpha").attr("stdDeviation",n),i.append("feOffset").attr("dx",1).attr("dy",1),i.append("feComponentTransfer").append("feFuncA").attr("slope",r).attr("type","linear");var a=i.append("feMerge");return a.append("feMergeNode"),a.append("feMergeNode").attr("in","SourceGraphic")},filterColor:function(t,e,n,r,i){null==i&&(i=!1);var a=e.append("defs").append("filter").attr("id","drop-shadow-"+t);return i&&a.attr("height","500%").attr("width","500%").attr("x","-200%").attr("y","-200%"),a.append("feOffset").attr("dx",.5).attr("dy",.5).attr("in","SourceGraphic").attr("result","offOut"),a.append("feGaussianBlur").attr("in","offOut").attr("result","blurOut").attr("stdDeviation",n),a.append("feBlend").attr("in","SourceGraphic").attr("in2","blurOut").attr("mode","normal"),a.append("feComponentTransfer").append("feFuncA").attr("slope",r).attr("type","linear")},middleTitle:function(t,e,n,r){null==r&&(r=-15),t.append("text").attr("class","chart-title").attr("text-anchor","middle").attr("transform","translate("+String(e/2)+","+r+")").text(n).style("font-weight","bold")},svg:function(t,e,n,i){return r.Ys(t).text("").append("svg").attr("height",n+i.top+i.bottom).attr("width",e+i.left+i.right).append("g").attr("transform","translate("+i.left+","+i.top+")")},tooltip:function(t,e){null==e&&(e={});var n=a()({elementSelector:"",followElement:!1,followMouse:!1,leftOffst:60,tOpts:{container:"body",viewport:{selector:"#chart svg"}},topOffst:40},e);$(t).tooltip(n.tOpts),n.followMouse?$(t).hover((function(t){return $(".tooltip").css({left:String(t.pageX-n.leftOffst)+"px",top:String(t.pageY-n.topOffst)+"px"})})):n.followElement&&$(t).hover((function(){return $(".tooltip").css({left:String($(n.elementSelector).position().left-n.leftOffst)+"px",top:String($(n.elementSelector).position().top-n.topOffst)+"px"})}))}};e.Z=s},3435:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return X}});var r=n(7294),i=n(7538),a=n(2137),s=n(7757),o=n.n(s),l=n(8236),h=n(6610),u=n(5991),c=(n(5438),134217729);function f(t,e,n,r,i){var a,s,o,l,h=e[0],u=r[0],c=0,f=0;u>h==u>-h?(a=h,h=e[++c]):(a=u,u=r[++f]);var v=0;if(c<t&&f<n)for(u>h==u>-h?(o=a-((s=h+a)-h),h=e[++c]):(o=a-((s=u+a)-u),u=r[++f]),a=s,0!==o&&(i[v++]=o);c<t&&f<n;)u>h==u>-h?(o=a-((s=a+h)-(l=s-a))+(h-l),h=e[++c]):(o=a-((s=a+u)-(l=s-a))+(u-l),u=r[++f]),a=s,0!==o&&(i[v++]=o);for(;c<t;)o=a-((s=a+h)-(l=s-a))+(h-l),h=e[++c],a=s,0!==o&&(i[v++]=o);for(;f<n;)o=a-((s=a+u)-(l=s-a))+(u-l),u=r[++f],a=s,0!==o&&(i[v++]=o);return 0===a&&0!==v||(i[v++]=a),v}function v(t){return new Float64Array(t)}var d=v(4),p=v(8),y=v(12),g=v(16),m=v(4);function _(t,e,n,r,i,a){var s=(e-a)*(n-i),o=(t-i)*(r-a),l=s-o;if(0===s||0===o||s>0!=o>0)return l;var h=Math.abs(s+o);return Math.abs(l)>=33306690738754716e-32*h?l:-function(t,e,n,r,i,a,s){var o,l,h,u,v,_,x,k,b,w,S,A,T,M,I,Z,O,P,F=t-i,U=n-i,E=e-a,j=r-a;v=(I=(k=F-(x=(_=c*F)-(_-F)))*(w=j-(b=(_=c*j)-(_-j)))-((M=F*j)-x*b-k*b-x*w))-(S=I-(O=(k=E-(x=(_=c*E)-(_-E)))*(w=U-(b=(_=c*U)-(_-U)))-((Z=E*U)-x*b-k*b-x*w))),d[0]=I-(S+v)+(v-O),v=(T=M-((A=M+S)-(v=A-M))+(S-v))-(S=T-Z),d[1]=T-(S+v)+(v-Z),v=(P=A+S)-A,d[2]=A-(P-v)+(S-v),d[3]=P;var z=function(t,e){for(var n=e[0],r=1;r<t;r++)n+=e[r];return n}(4,d),C=22204460492503146e-32*s;if(z>=C||-z>=C)return z;if(o=t-(F+(v=t-F))+(v-i),h=n-(U+(v=n-U))+(v-i),l=e-(E+(v=e-E))+(v-a),u=r-(j+(v=r-j))+(v-a),0===o&&0===l&&0===h&&0===u)return z;if(C=11093356479670487e-47*s+33306690738754706e-32*Math.abs(z),(z+=F*u+j*o-(E*h+U*l))>=C||-z>=C)return z;v=(I=(k=o-(x=(_=c*o)-(_-o)))*(w=j-(b=(_=c*j)-(_-j)))-((M=o*j)-x*b-k*b-x*w))-(S=I-(O=(k=l-(x=(_=c*l)-(_-l)))*(w=U-(b=(_=c*U)-(_-U)))-((Z=l*U)-x*b-k*b-x*w))),m[0]=I-(S+v)+(v-O),v=(T=M-((A=M+S)-(v=A-M))+(S-v))-(S=T-Z),m[1]=T-(S+v)+(v-Z),v=(P=A+S)-A,m[2]=A-(P-v)+(S-v),m[3]=P;var B=f(4,d,4,m,p);v=(I=(k=F-(x=(_=c*F)-(_-F)))*(w=u-(b=(_=c*u)-(_-u)))-((M=F*u)-x*b-k*b-x*w))-(S=I-(O=(k=E-(x=(_=c*E)-(_-E)))*(w=h-(b=(_=c*h)-(_-h)))-((Z=E*h)-x*b-k*b-x*w))),m[0]=I-(S+v)+(v-O),v=(T=M-((A=M+S)-(v=A-M))+(S-v))-(S=T-Z),m[1]=T-(S+v)+(v-Z),v=(P=A+S)-A,m[2]=A-(P-v)+(S-v),m[3]=P;var $=f(B,p,4,m,y);v=(I=(k=o-(x=(_=c*o)-(_-o)))*(w=u-(b=(_=c*u)-(_-u)))-((M=o*u)-x*b-k*b-x*w))-(S=I-(O=(k=l-(x=(_=c*l)-(_-l)))*(w=h-(b=(_=c*h)-(_-h)))-((Z=l*h)-x*b-k*b-x*w))),m[0]=I-(S+v)+(v-O),v=(T=M-((A=M+S)-(v=A-M))+(S-v))-(S=T-Z),m[1]=T-(S+v)+(v-Z),v=(P=A+S)-A,m[2]=A-(P-v)+(S-v),m[3]=P;var L=f($,y,4,m,g);return g[L-1]}(t,e,n,r,i,a,h)}v(4),v(4),v(4),v(4),v(4),v(4),v(4),v(4),v(4),v(8),v(8),v(8),v(4),v(8),v(8),v(8),v(12),v(192),v(192);v(4),v(4),v(4),v(4),v(4),v(4),v(4),v(4),v(8),v(8),v(8),v(8),v(8),v(8),v(8),v(8),v(8),v(4),v(4),v(4),v(8),v(16),v(16),v(16),v(32),v(32),v(48),v(64),v(1152),v(1152);v(4),v(4),v(4),v(4),v(4),v(4),v(4),v(4),v(4),v(4),v(24),v(24),v(24),v(24),v(24),v(24),v(24),v(24),v(24),v(24),v(1152),v(1152),v(1152),v(1152),v(1152),v(2304),v(2304),v(3456),v(5760),v(8),v(8),v(8),v(16),v(24),v(48),v(48),v(96),v(192),v(384),v(384),v(384),v(768);v(96),v(96),v(96),v(1152);var x=Math.pow(2,-52),k=new Uint32Array(512),b=function(){function t(e){(0,h.Z)(this,t);var n=e.length>>1;if(n>0&&"number"!=typeof e[0])throw new Error("Expected coords to contain numbers.");this.coords=e;var r=Math.max(2*n-5,0);this._triangles=new Uint32Array(3*r),this._halfedges=new Int32Array(3*r),this._hashSize=Math.ceil(Math.sqrt(n)),this._hullPrev=new Uint32Array(n),this._hullNext=new Uint32Array(n),this._hullTri=new Uint32Array(n),this._hullHash=new Int32Array(this._hashSize).fill(-1),this._ids=new Uint32Array(n),this._dists=new Float64Array(n),this.update()}return(0,u.Z)(t,[{key:"update",value:function(){for(var t=this.coords,e=this._hullPrev,n=this._hullNext,r=this._hullTri,i=this._hullHash,a=t.length>>1,s=1/0,o=1/0,l=-1/0,h=-1/0,u=0;u<a;u++){var c=t[2*u],f=t[2*u+1];c<s&&(s=c),f<o&&(o=f),c>l&&(l=c),f>h&&(h=f),this._ids[u]=u}for(var v,d,p,y=(s+l)/2,g=(o+h)/2,m=1/0,k=0;k<a;k++){var b=w(y,g,t[2*k],t[2*k+1]);b<m&&(v=k,m=b)}var T=t[2*v],M=t[2*v+1];m=1/0;for(var I=0;I<a;I++)if(I!==v){var Z=w(T,M,t[2*I],t[2*I+1]);Z<m&&Z>0&&(d=I,m=Z)}for(var O=t[2*d],P=t[2*d+1],F=1/0,U=0;U<a;U++)if(U!==v&&U!==d){var E=S(T,M,O,P,t[2*U],t[2*U+1]);E<F&&(p=U,F=E)}var j=t[2*p],z=t[2*p+1];if(F===1/0){for(var C=0;C<a;C++)this._dists[C]=t[2*C]-t[0]||t[2*C+1]-t[1];A(this._ids,this._dists,0,a-1);for(var B=new Uint32Array(a),$=0,L=0,K=-1/0;L<a;L++){var Y=this._ids[L];this._dists[Y]>K&&(B[$++]=Y,K=this._dists[Y])}return this.hull=B.subarray(0,$),this.triangles=new Uint32Array(0),void(this.halfedges=new Uint32Array(0))}if(_(T,M,O,P,j,z)<0){var N=d,G=O,H=P;d=p,O=j,P=z,p=N,j=G,z=H}var V=function(t,e,n,r,i,a){var s=n-t,o=r-e,l=i-t,h=a-e,u=s*s+o*o,c=l*l+h*h,f=.5/(s*h-o*l);return{x:t+(h*u-o*c)*f,y:e+(s*c-l*u)*f}}(T,M,O,P,j,z);this._cx=V.x,this._cy=V.y;for(var D=0;D<a;D++)this._dists[D]=w(t[2*D],t[2*D+1],V.x,V.y);A(this._ids,this._dists,0,a-1),this._hullStart=v;var W=3;n[v]=e[p]=d,n[d]=e[v]=p,n[p]=e[d]=v,r[v]=0,r[d]=1,r[p]=2,i.fill(-1),i[this._hashKey(T,M)]=v,i[this._hashKey(O,P)]=d,i[this._hashKey(j,z)]=p,this.trianglesLen=0,this._addTriangle(v,d,p,-1,-1,-1);for(var q,R,X=0;X<this._ids.length;X++){var J=this._ids[X],Q=t[2*J],tt=t[2*J+1];if(!(X>0&&Math.abs(Q-q)<=x&&Math.abs(tt-R)<=x)&&(q=Q,R=tt,J!==v&&J!==d&&J!==p)){for(var et=0,nt=0,rt=this._hashKey(Q,tt);nt<this._hashSize&&(-1===(et=i[(rt+nt)%this._hashSize])||et===n[et]);nt++);for(var it=et=e[et],at=void 0;at=n[it],_(Q,tt,t[2*it],t[2*it+1],t[2*at],t[2*at+1])>=0;)if((it=at)===et){it=-1;break}if(-1!==it){var st=this._addTriangle(it,J,n[it],-1,-1,r[it]);r[J]=this._legalize(st+2),r[it]=st,W++;for(var ot=n[it];at=n[ot],_(Q,tt,t[2*ot],t[2*ot+1],t[2*at],t[2*at+1])<0;)st=this._addTriangle(ot,J,at,r[J],-1,r[ot]),r[J]=this._legalize(st+2),n[ot]=ot,W--,ot=at;if(it===et)for(;_(Q,tt,t[2*(at=e[it])],t[2*at+1],t[2*it],t[2*it+1])<0;)st=this._addTriangle(at,J,it,-1,r[it],r[at]),this._legalize(st+2),r[at]=st,n[it]=it,W--,it=at;this._hullStart=e[J]=it,n[it]=e[ot]=J,n[J]=ot,i[this._hashKey(Q,tt)]=J,i[this._hashKey(t[2*it],t[2*it+1])]=it}}}this.hull=new Uint32Array(W);for(var lt=0,ht=this._hullStart;lt<W;lt++)this.hull[lt]=ht,ht=n[ht];this.triangles=this._triangles.subarray(0,this.trianglesLen),this.halfedges=this._halfedges.subarray(0,this.trianglesLen)}},{key:"_hashKey",value:function(t,e){return Math.floor((n=t-this._cx,r=e-this._cy,i=n/(Math.abs(n)+Math.abs(r)),(r>0?3-i:1+i)/4*this._hashSize))%this._hashSize;var n,r,i}},{key:"_legalize",value:function(t){for(var e,n,r,i,a,s,o,l,h,u,c,f,v,d,p,y,g=this._triangles,m=this._halfedges,_=this.coords,x=0,b=0;;){var w=m[t],S=t-t%3;if(b=S+(t+2)%3,-1!==w){var A=w-w%3,T=S+(t+1)%3,M=A+(w+2)%3,I=g[b],Z=g[t],O=g[T],P=g[M];if(e=_[2*I],n=_[2*I+1],r=_[2*Z],i=_[2*Z+1],a=_[2*O],s=_[2*O+1],o=_[2*P],l=_[2*P+1],h=void 0,u=void 0,c=void 0,f=void 0,v=void 0,d=void 0,void 0,p=void 0,y=void 0,(h=e-o)*((f=i-l)*(y=(v=a-o)*v+(d=s-l)*d)-(p=(c=r-o)*c+f*f)*d)-(u=n-l)*(c*y-p*v)+(h*h+u*u)*(c*d-f*v)<0){g[t]=P,g[w]=I;var F=m[M];if(-1===F){var U=this._hullStart;do{if(this._hullTri[U]===M){this._hullTri[U]=t;break}U=this._hullPrev[U]}while(U!==this._hullStart)}this._link(t,F),this._link(w,m[b]),this._link(b,M);var E=A+(w+1)%3;x<k.length&&(k[x++]=E)}else{if(0===x)break;t=k[--x]}}else{if(0===x)break;t=k[--x]}}return b}},{key:"_link",value:function(t,e){this._halfedges[t]=e,-1!==e&&(this._halfedges[e]=t)}},{key:"_addTriangle",value:function(t,e,n,r,i,a){var s=this.trianglesLen;return this._triangles[s]=t,this._triangles[s+1]=e,this._triangles[s+2]=n,this._link(s,r),this._link(s+1,i),this._link(s+2,a),this.trianglesLen+=3,s}}],[{key:"from",value:function(e){for(var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:M,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:I,i=e.length,a=new Float64Array(2*i),s=0;s<i;s++){var o=e[s];a[2*s]=n(o),a[2*s+1]=r(o)}return new t(a)}}]),t}();function w(t,e,n,r){var i=t-n,a=e-r;return i*i+a*a}function S(t,e,n,r,i,a){var s=n-t,o=r-e,l=i-t,h=a-e,u=s*s+o*o,c=l*l+h*h,f=.5/(s*h-o*l),v=(h*u-o*c)*f,d=(s*c-l*u)*f;return v*v+d*d}function A(t,e,n,r){if(r-n<=20)for(var i=n+1;i<=r;i++){for(var a=t[i],s=e[a],o=i-1;o>=n&&e[t[o]]>s;)t[o+1]=t[o--];t[o+1]=a}else{var l=n+1,h=r;T(t,n+r>>1,l),e[t[n]]>e[t[r]]&&T(t,n,r),e[t[l]]>e[t[r]]&&T(t,l,r),e[t[n]]>e[t[l]]&&T(t,n,l);for(var u=t[l],c=e[u];;){do{l++}while(e[t[l]]<c);do{h--}while(e[t[h]]>c);if(h<l)break;T(t,l,h)}t[n+1]=t[h],t[h]=u,r-l+1>=h-n?(A(t,e,l,r),A(t,e,n,h-1)):(A(t,e,n,h-1),A(t,e,l,r))}}function T(t,e,n){var r=t[e];t[e]=t[n],t[n]=r}function M(t){return t[0]}function I(t){return t[1]}var Z=1e-6,O=function(){function t(){(0,h.Z)(this,t),this._x0=this._y0=this._x1=this._y1=null,this._=""}return(0,u.Z)(t,[{key:"moveTo",value:function(t,e){this._+="M".concat(this._x0=this._x1=+t,",").concat(this._y0=this._y1=+e)}},{key:"closePath",value:function(){null!==this._x1&&(this._x1=this._x0,this._y1=this._y0,this._+="Z")}},{key:"lineTo",value:function(t,e){this._+="L".concat(this._x1=+t,",").concat(this._y1=+e)}},{key:"arc",value:function(t,e,n){var r=(t=+t)+(n=+n),i=e=+e;if(n<0)throw new Error("negative radius");null===this._x1?this._+="M".concat(r,",").concat(i):(Math.abs(this._x1-r)>Z||Math.abs(this._y1-i)>Z)&&(this._+="L"+r+","+i),n&&(this._+="A".concat(n,",").concat(n,",0,1,1,").concat(t-n,",").concat(e,"A").concat(n,",").concat(n,",0,1,1,").concat(this._x1=r,",").concat(this._y1=i))}},{key:"rect",value:function(t,e,n,r){this._+="M".concat(this._x0=this._x1=+t,",").concat(this._y0=this._y1=+e,"h").concat(+n,"v").concat(+r,"h").concat(-n,"Z")}},{key:"value",value:function(){return this._||null}}]),t}(),P=function(){function t(){(0,h.Z)(this,t),this._=[]}return(0,u.Z)(t,[{key:"moveTo",value:function(t,e){this._.push([t,e])}},{key:"closePath",value:function(){this._.push(this._[0].slice())}},{key:"lineTo",value:function(t,e){this._.push([t,e])}},{key:"value",value:function(){return this._.length?this._:null}}]),t}(),F=n(4699);function U(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(!t)return;if("string"==typeof t)return E(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return E(t,e)}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,i=function(){};return{s:i,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,s=!0,o=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return s=t.done,t},e:function(t){o=!0,a=t},f:function(){try{s||null==n.return||n.return()}finally{if(o)throw a}}}}function E(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var j=function(){function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[0,0,960,500],r=(0,F.Z)(n,4),i=r[0],a=r[1],s=r[2],o=r[3];if((0,h.Z)(this,t),!((s=+s)>=(i=+i)&&(o=+o)>=(a=+a)))throw new Error("invalid bounds");this.delaunay=e,this._circumcenters=new Float64Array(2*e.points.length),this.vectors=new Float64Array(2*e.points.length),this.xmax=s,this.xmin=i,this.ymax=o,this.ymin=a,this._init()}return(0,u.Z)(t,[{key:"update",value:function(){return this.delaunay.update(),this._init(),this}},{key:"_init",value:function(){for(var t,e,n=this.delaunay,r=n.points,i=n.hull,a=n.triangles,s=this.vectors,o=this.circumcenters=this._circumcenters.subarray(0,a.length/3*2),l=0,h=0,u=a.length;l<u;l+=3,h+=2){var c=2*a[l],f=2*a[l+1],v=2*a[l+2],d=r[c],p=r[c+1],y=r[f],g=r[f+1],m=r[v],_=r[v+1],x=y-d,k=g-p,b=m-d,w=_-p,S=2*(x*w-k*b);if(Math.abs(S)<1e-9){var A=1e9,T=2*a[0];t=(d+m)/2-(A*=Math.sign((r[T]-d)*w-(r[T+1]-p)*b))*w,e=(p+_)/2+A*b}else{var M=1/S,I=x*x+k*k,Z=b*b+w*w;t=d+(w*I-k*Z)*M,e=p+(x*Z-b*I)*M}o[h]=t,o[h+1]=e}var O,P,F,U=i[i.length-1],E=4*U,j=r[2*U],z=r[2*U+1];s.fill(0);for(var C=0;C<i.length;++C)O=E,P=j,F=z,E=4*(U=i[C]),j=r[2*U],z=r[2*U+1],s[O+2]=s[E]=F-z,s[O+3]=s[E+1]=j-P}},{key:"render",value:function(t){var e=null==t?t=new O:void 0,n=this.delaunay,r=n.halfedges,i=n.inedges,a=n.hull,s=this.circumcenters,o=this.vectors;if(a.length<=1)return null;for(var l=0,h=r.length;l<h;++l){var u=r[l];if(!(u<l)){var c=2*Math.floor(l/3),f=2*Math.floor(u/3),v=s[c],d=s[c+1],p=s[f],y=s[f+1];this._renderSegment(v,d,p,y,t)}}for(var g,m=a[a.length-1],_=0;_<a.length;++_){g=m,m=a[_];var x=2*Math.floor(i[m]/3),k=s[x],b=s[x+1],w=4*g,S=this._project(k,b,o[w+2],o[w+3]);S&&this._renderSegment(k,b,S[0],S[1],t)}return e&&e.value()}},{key:"renderBounds",value:function(t){var e=null==t?t=new O:void 0;return t.rect(this.xmin,this.ymin,this.xmax-this.xmin,this.ymax-this.ymin),e&&e.value()}},{key:"renderCell",value:function(t,e){var n=null==e?e=new O:void 0,r=this._clip(t);if(null!==r&&r.length){e.moveTo(r[0],r[1]);for(var i=r.length;r[0]===r[i-2]&&r[1]===r[i-1]&&i>1;)i-=2;for(var a=2;a<i;a+=2)r[a]===r[a-2]&&r[a+1]===r[a-1]||e.lineTo(r[a],r[a+1]);return e.closePath(),n&&n.value()}}},{key:"cellPolygons",value:o().mark((function t(){var e,n,r,i;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e=this.delaunay.points,n=0,r=e.length/2;case 2:if(!(n<r)){t.next=11;break}if(!(i=this.cellPolygon(n))){t.next=8;break}return i.index=n,t.next=8,i;case 8:++n,t.next=2;break;case 11:case"end":return t.stop()}}),t,this)}))},{key:"cellPolygon",value:function(t){var e=new P;return this.renderCell(t,e),e.value()}},{key:"_renderSegment",value:function(t,e,n,r,i){var a,s=this._regioncode(t,e),o=this._regioncode(n,r);0===s&&0===o?(i.moveTo(t,e),i.lineTo(n,r)):(a=this._clipSegment(t,e,n,r,s,o))&&(i.moveTo(a[0],a[1]),i.lineTo(a[2],a[3]))}},{key:"contains",value:function(t,e,n){return(e=+e)==e&&(n=+n)==n&&this.delaunay._step(t,e,n)===t}},{key:"neighbors",value:o().mark((function t(e){var n,r,i,a,s,l,h,u,c;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!(n=this._clip(e))){t.next=33;break}r=U(this.delaunay.neighbors(e)),t.prev=3,r.s();case 5:if((i=r.n()).done){t.next=25;break}if(a=i.value,!(s=this._clip(a))){t.next=23;break}l=0,h=n.length;case 10:if(!(l<h)){t.next=23;break}u=0,c=s.length;case 12:if(!(u<c)){t.next=20;break}if(n[l]!=s[u]||n[l+1]!=s[u+1]||n[(l+2)%h]!=s[(u+c-2)%c]||n[(l+3)%h]!=s[(u+c-1)%c]){t.next=17;break}return t.next=16,a;case 16:return t.abrupt("break",23);case 17:u+=2,t.next=12;break;case 20:l+=2,t.next=10;break;case 23:t.next=5;break;case 25:t.next=30;break;case 27:t.prev=27,t.t0=t.catch(3),r.e(t.t0);case 30:return t.prev=30,r.f(),t.finish(30);case 33:case"end":return t.stop()}}),t,this,[[3,27,30,33]])}))},{key:"_cell",value:function(t){var e=this.circumcenters,n=this.delaunay,r=n.inedges,i=n.halfedges,a=n.triangles,s=r[t];if(-1===s)return null;var o=[],l=s;do{var h=Math.floor(l/3);if(o.push(e[2*h],e[2*h+1]),a[l=l%3==2?l-2:l+1]!==t)break;l=i[l]}while(l!==s&&-1!==l);return o}},{key:"_clip",value:function(t){if(0===t&&1===this.delaunay.hull.length)return[this.xmax,this.ymin,this.xmax,this.ymax,this.xmin,this.ymax,this.xmin,this.ymin];var e=this._cell(t);if(null===e)return null;var n=this.vectors,r=4*t;return n[r]||n[r+1]?this._clipInfinite(t,e,n[r],n[r+1],n[r+2],n[r+3]):this._clipFinite(t,e)}},{key:"_clipFinite",value:function(t,e){for(var n,r,i,a,s=e.length,o=null,l=e[s-2],h=e[s-1],u=this._regioncode(l,h),c=0,f=0;f<s;f+=2)if(n=l,r=h,l=e[f],h=e[f+1],i=u,u=this._regioncode(l,h),0===i&&0===u)a=c,c=0,o?o.push(l,h):o=[l,h];else{var v=void 0,d=void 0,p=void 0,y=void 0,g=void 0;if(0===i){if(null===(v=this._clipSegment(n,r,l,h,i,u)))continue;var m=v,_=(0,F.Z)(m,4);d=_[0],p=_[1],y=_[2],g=_[3]}else{if(null===(v=this._clipSegment(l,h,n,r,u,i)))continue;var x=v,k=(0,F.Z)(x,4);y=k[0],g=k[1],d=k[2],p=k[3],a=c,c=this._edgecode(d,p),a&&c&&this._edge(t,a,c,o,o.length),o?o.push(d,p):o=[d,p]}a=c,c=this._edgecode(y,g),a&&c&&this._edge(t,a,c,o,o.length),o?o.push(y,g):o=[y,g]}if(o)a=c,c=this._edgecode(o[0],o[1]),a&&c&&this._edge(t,a,c,o,o.length);else if(this.contains(t,(this.xmin+this.xmax)/2,(this.ymin+this.ymax)/2))return[this.xmax,this.ymin,this.xmax,this.ymax,this.xmin,this.ymax,this.xmin,this.ymin];return o}},{key:"_clipSegment",value:function(t,e,n,r,i,a){for(;;){if(0===i&&0===a)return[t,e,n,r];if(i&a)return null;var s=void 0,o=void 0,l=i||a;8&l?(s=t+(n-t)*(this.ymax-e)/(r-e),o=this.ymax):4&l?(s=t+(n-t)*(this.ymin-e)/(r-e),o=this.ymin):2&l?(o=e+(r-e)*(this.xmax-t)/(n-t),s=this.xmax):(o=e+(r-e)*(this.xmin-t)/(n-t),s=this.xmin),i?(t=s,e=o,i=this._regioncode(t,e)):(n=s,r=o,a=this._regioncode(n,r))}}},{key:"_clipInfinite",value:function(t,e,n,r,i,a){var s,o=Array.from(e);if((s=this._project(o[0],o[1],n,r))&&o.unshift(s[0],s[1]),(s=this._project(o[o.length-2],o[o.length-1],i,a))&&o.push(s[0],s[1]),o=this._clipFinite(t,o))for(var l,h=0,u=o.length,c=this._edgecode(o[u-2],o[u-1]);h<u;h+=2)l=c,c=this._edgecode(o[h],o[h+1]),l&&c&&(h=this._edge(t,l,c,o,h),u=o.length);else this.contains(t,(this.xmin+this.xmax)/2,(this.ymin+this.ymax)/2)&&(o=[this.xmin,this.ymin,this.xmax,this.ymin,this.xmax,this.ymax,this.xmin,this.ymax]);return o}},{key:"_edge",value:function(t,e,n,r,i){for(;e!==n;){var a=void 0,s=void 0;switch(e){case 5:e=4;continue;case 4:e=6,a=this.xmax,s=this.ymin;break;case 6:e=2;continue;case 2:e=10,a=this.xmax,s=this.ymax;break;case 10:e=8;continue;case 8:e=9,a=this.xmin,s=this.ymax;break;case 9:e=1;continue;case 1:e=5,a=this.xmin,s=this.ymin}r[i]===a&&r[i+1]===s||!this.contains(t,a,s)||(r.splice(i,0,a,s),i+=2)}if(r.length>4)for(var o=0;o<r.length;o+=2){var l=(o+2)%r.length,h=(o+4)%r.length;(r[o]===r[l]&&r[l]===r[h]||r[o+1]===r[l+1]&&r[l+1]===r[h+1])&&(r.splice(l,2),o-=2)}return i}},{key:"_project",value:function(t,e,n,r){var i,a,s,o=1/0;if(r<0){if(e<=this.ymin)return null;(i=(this.ymin-e)/r)<o&&(s=this.ymin,a=t+(o=i)*n)}else if(r>0){if(e>=this.ymax)return null;(i=(this.ymax-e)/r)<o&&(s=this.ymax,a=t+(o=i)*n)}if(n>0){if(t>=this.xmax)return null;(i=(this.xmax-t)/n)<o&&(a=this.xmax,s=e+(o=i)*r)}else if(n<0){if(t<=this.xmin)return null;(i=(this.xmin-t)/n)<o&&(a=this.xmin,s=e+(o=i)*r)}return[a,s]}},{key:"_edgecode",value:function(t,e){return(t===this.xmin?1:t===this.xmax?2:0)|(e===this.ymin?4:e===this.ymax?8:0)}},{key:"_regioncode",value:function(t,e){return(t<this.xmin?1:t>this.xmax?2:0)|(e<this.ymin?4:e>this.ymax?8:0)}}]),t}(),z=o().mark(V);function C(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(!t)return;if("string"==typeof t)return B(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return B(t,e)}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,i=function(){};return{s:i,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,s=!0,o=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return s=t.done,t},e:function(t){o=!0,a=t},f:function(){try{s||null==n.return||n.return()}finally{if(o)throw a}}}}function B(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var $=2*Math.PI,L=Math.pow;function K(t){return t[0]}function Y(t){return t[1]}function N(t,e,n){return[t+Math.sin(t+e)*n,e+Math.cos(t-e)*n]}var G=function(){function t(e){(0,h.Z)(this,t),this._delaunator=new b(e),this.inedges=new Int32Array(e.length/2),this._hullIndex=new Int32Array(e.length/2),this.points=this._delaunator.coords,this._init()}return(0,u.Z)(t,[{key:"update",value:function(){return this._delaunator.update(),this._init(),this}},{key:"_init",value:function(){var t=this._delaunator,e=this.points;if(t.hull&&t.hull.length>2&&function(t){for(var e=t.triangles,n=t.coords,r=0;r<e.length;r+=3){var i=2*e[r],a=2*e[r+1],s=2*e[r+2];if((n[s]-n[i])*(n[a+1]-n[i+1])-(n[a]-n[i])*(n[s+1]-n[i+1])>1e-10)return!1}return!0}(t)){this.collinear=Int32Array.from({length:e.length/2},(function(t,e){return e})).sort((function(t,n){return e[2*t]-e[2*n]||e[2*t+1]-e[2*n+1]}));for(var n=this.collinear[0],r=this.collinear[this.collinear.length-1],i=[e[2*n],e[2*n+1],e[2*r],e[2*r+1]],a=1e-8*Math.hypot(i[3]-i[1],i[2]-i[0]),s=0,o=e.length/2;s<o;++s){var l=N(e[2*s],e[2*s+1],a);e[2*s]=l[0],e[2*s+1]=l[1]}this._delaunator=new b(e)}else delete this.collinear;for(var h=this.halfedges=this._delaunator.halfedges,u=this.hull=this._delaunator.hull,c=this.triangles=this._delaunator.triangles,f=this.inedges.fill(-1),v=this._hullIndex.fill(-1),d=0,p=h.length;d<p;++d){var y=c[d%3==2?d-2:d+1];-1!==h[d]&&-1!==f[y]||(f[y]=d)}for(var g=0,m=u.length;g<m;++g)v[u[g]]=g;u.length<=2&&u.length>0&&(this.triangles=new Int32Array(3).fill(-1),this.halfedges=new Int32Array(3).fill(-1),this.triangles[0]=u[0],f[u[0]]=1,2===u.length&&(f[u[1]]=0,this.triangles[1]=u[1],this.triangles[2]=u[1]))}},{key:"voronoi",value:function(t){return new j(this,t)}},{key:"neighbors",value:o().mark((function t(e){var n,r,i,a,s,l,h,u,c,f,v;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=this.inedges,r=this.hull,i=this._hullIndex,a=this.halfedges,s=this.triangles,!(l=this.collinear)){t.next=10;break}if(!((h=l.indexOf(e))>0)){t.next=6;break}return t.next=6,l[h-1];case 6:if(!(h<l.length-1)){t.next=9;break}return t.next=9,l[h+1];case 9:return t.abrupt("return");case 10:if(-1!==(u=n[e])){t.next=13;break}return t.abrupt("return");case 13:c=u,f=-1;case 14:return t.next=16,f=s[c];case 16:if(s[c=c%3==2?c-2:c+1]===e){t.next=19;break}return t.abrupt("return");case 19:if(-1!==(c=a[c])){t.next=26;break}if((v=r[(i[e]+1)%r.length])===f){t.next=25;break}return t.next=25,v;case 25:return t.abrupt("return");case 26:if(c!==u){t.next=14;break}case 27:case"end":return t.stop()}}),t,this)}))},{key:"find",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;if((t=+t)!=t||(e=+e)!=e)return-1;for(var r,i=n;(r=this._step(n,t,e))>=0&&r!==n&&r!==i;)n=r;return r}},{key:"_step",value:function(t,e,n){var r=this.inedges,i=this.hull,a=this._hullIndex,s=this.halfedges,o=this.triangles,l=this.points;if(-1===r[t]||!l.length)return(t+1)%(l.length>>1);var h=t,u=L(e-l[2*t],2)+L(n-l[2*t+1],2),c=r[t],f=c;do{var v=o[f],d=L(e-l[2*v],2)+L(n-l[2*v+1],2);if(d<u&&(u=d,h=v),o[f=f%3==2?f-2:f+1]!==t)break;if(-1===(f=s[f])){if((f=i[(a[t]+1)%i.length])!==v&&L(e-l[2*f],2)+L(n-l[2*f+1],2)<u)return f;break}}while(f!==c);return h}},{key:"render",value:function(t){for(var e=null==t?t=new O:void 0,n=this.points,r=this.halfedges,i=this.triangles,a=0,s=r.length;a<s;++a){var o=r[a];if(!(o<a)){var l=2*i[a],h=2*i[o];t.moveTo(n[l],n[l+1]),t.lineTo(n[h],n[h+1])}}return this.renderHull(t),e&&e.value()}},{key:"renderPoints",value:function(t,e){void 0!==e||t&&"function"==typeof t.moveTo||(e=t,t=null),e=null==e?2:+e;for(var n=null==t?t=new O:void 0,r=this.points,i=0,a=r.length;i<a;i+=2){var s=r[i],o=r[i+1];t.moveTo(s+e,o),t.arc(s,o,e,0,$)}return n&&n.value()}},{key:"renderHull",value:function(t){var e=null==t?t=new O:void 0,n=this.hull,r=this.points,i=2*n[0],a=n.length;t.moveTo(r[i],r[i+1]);for(var s=1;s<a;++s){var o=2*n[s];t.lineTo(r[o],r[o+1])}return t.closePath(),e&&e.value()}},{key:"hullPolygon",value:function(){var t=new P;return this.renderHull(t),t.value()}},{key:"renderTriangle",value:function(t,e){var n=null==e?e=new O:void 0,r=this.points,i=this.triangles,a=2*i[t*=3],s=2*i[t+1],o=2*i[t+2];return e.moveTo(r[a],r[a+1]),e.lineTo(r[s],r[s+1]),e.lineTo(r[o],r[o+1]),e.closePath(),n&&n.value()}},{key:"trianglePolygons",value:o().mark((function t(){var e,n,r;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e=this.triangles,n=0,r=e.length/3;case 2:if(!(n<r)){t.next=8;break}return t.next=5,this.trianglePolygon(n);case 5:++n,t.next=2;break;case 8:case"end":return t.stop()}}),t,this)}))},{key:"trianglePolygon",value:function(t){var e=new P;return this.renderTriangle(t,e),e.value()}}],[{key:"from",value:function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:K,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Y,i=arguments.length>3?arguments[3]:void 0;return new t("length"in e?H(e,n,r,i):Float64Array.from(V(e,n,r,i)))}}]),t}();function H(t,e,n,r){for(var i=t.length,a=new Float64Array(2*i),s=0;s<i;++s){var o=t[s];a[2*s]=e.call(r,o,s,t),a[2*s+1]=n.call(r,o,s,t)}return a}function V(t,e,n,r){var i,a,s,l;return o().wrap((function(o){for(;;)switch(o.prev=o.next){case 0:i=0,a=C(t),o.prev=2,a.s();case 4:if((s=a.n()).done){o.next=13;break}return l=s.value,o.next=8,e.call(r,l,i,t);case 8:return o.next=10,n.call(r,l,i,t);case 10:++i;case 11:o.next=4;break;case 13:o.next=18;break;case 15:o.prev=15,o.t0=o.catch(2),a.e(o.t0);case 18:return o.prev=18,a.f(),o.finish(18);case 21:case"end":return o.stop()}}),z,null,[[2,15,18,21]])}var D=n(1616),W={bottom:50,left:70,right:50,top:50},q=400-W.top-W.bottom,R=function(){var t=(0,a.Z)(o().mark((function t(){var e,n,r,i,a,s,h,u,c,f,v,d,p,y,g,m,_,x;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,l.gyn("/demos/data/d3js/area/data.csv");case 2:e=t.sent,n="chart",r=document.getElementById(n).getBoundingClientRect().width-W.left-W.right,i=D.Z.svg("#chart",r,q,W),D.Z.middleTitle(i,r,"Share of top decile [aka top 10%] in national income",null),D.Z.filterBlackOpacity("points",i,2,.5),a=l.Fp7(e,(function(t){return t.year})),s=l.VV$(e,(function(t){return t.year})),h=l.Fp7(e,(function(t){return t.percent/100})),u=l.VV$(e,(function(t){return t.percent/100})),c=l.BYU().range([0,r]).domain([s,a]),f=l.BYU().range([0,q]).domain([h+.05,u-.05]),v=l.LLu(c).tickFormat(l.WUZ(".0f")).tickSize(-q),d=l.y4O(f).tickFormat(l.WUZ(".0%")).tickSize(-r),i.append("g").attr("class","x axis").attr("transform","translate(0,"+String(q)+")").call(v).selectAll("text").attr("dy","1.25em"),i.append("g").attr("class","y axis").call(d).selectAll("text").attr("dx","-.25em"),p=l.SOn().x((function(t){return c(t.year)})).y0(q).y1((function(t){return f(t.percent/100)})),y=l.jvg().x((function(t){return c(t.year)})).y((function(t){return f(t.percent/100)})),i.append("path").datum(e).attr("class","line").attr("clip-path","url(#clip)").attr("d",y),i.append("clipPath").attr("id","clip").append("rect").attr("height",q).attr("width",r),i.append("path").datum(e).attr("class","area").attr("clip-path","url(#clip)").attr("d",p),g=G.from(e,(function(t){return c(t.year)}),(function(t){return f(t.percent/100)})).voronoi([-W.left,-W.top,r+W.right,q+W.bottom]),m=function(t,e){l.Ys(".point-"+e.index).style("display","block")},_=function(t,e){l.Ys(".point-"+e.index).style("display","none")},i.selectAll("circle").data(e).enter().append("circle").attr("transform",(function(t){return"translate("+String(c(t.year))+","+f(t.percent/100)+")"})).attr("r","5px").attr("class",(function(t,e){return"point point-"+e})).style("filter","url(#drop-shadow-points)"),(x=i.append("g").attr("class","voronoi")).selectAll("path").data(e).enter().append("path").attr("d",(function(t,e){return t.index=e,g.renderCell(e)})).on("mouseover",m).on("mouseleave",_).attr("class","voronoi-area").append("title").text((function(t){return"Year: "+t.year+", Percent: "+t.percent+"%"})),document.getElementById("toggle-voronoi").addEventListener("click",(function(t){t.preventDefault();var e=x.attr("class"),n=e.includes("show-voronoi")?e.replace("show-voronoi","").trim():e+" show-voronoi";x.attr("class",n)}));case 30:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),X=function(t){var e=t.pageContext.demoInfo;return r.createElement(i.Z,{demoInfo:e,main:R},r.createElement("form",null,r.createElement("button",{className:"btn btn-info",id:"toggle-voronoi",type:"button"},"Toggle Voronoi")),r.createElement("div",{className:"area-chart",id:"chart"}))}}}]);
//# sourceMappingURL=component---src-pages-d-3-js-area-js-2cc6414a5f12fbbff592.js.map