/*! For license information please see library-search.js.LICENSE.txt */
(()=>{var e={946(e){"use strict";var t=Object.prototype.hasOwnProperty,r="~";function n(){}function a(e,t,r){this.fn=e,this.context=t,this.once=r||!1}function o(e,t,n,o,s){if("function"!=typeof n)throw new TypeError("The listener must be a function");var i=new a(n,o||e,s),c=r?r+t:t;return e._events[c]?e._events[c].fn?e._events[c]=[e._events[c],i]:e._events[c].push(i):(e._events[c]=i,e._eventsCount++),e}function s(e,t){0===--e._eventsCount?e._events=new n:delete e._events[t]}function i(){this._events=new n,this._eventsCount=0}Object.create&&(n.prototype=Object.create(null),(new n).__proto__||(r=!1)),i.prototype.eventNames=function(){var e,n,a=[];if(0===this._eventsCount)return a;for(n in e=this._events)t.call(e,n)&&a.push(r?n.slice(1):n);return Object.getOwnPropertySymbols?a.concat(Object.getOwnPropertySymbols(e)):a},i.prototype.listeners=function(e){var t=r?r+e:e,n=this._events[t];if(!n)return[];if(n.fn)return[n.fn];for(var a=0,o=n.length,s=new Array(o);a<o;a++)s[a]=n[a].fn;return s},i.prototype.listenerCount=function(e){var t=r?r+e:e,n=this._events[t];return n?n.fn?1:n.length:0},i.prototype.emit=function(e,t,n,a,o,s){var i=r?r+e:e;if(!this._events[i])return!1;var c,l,h=this._events[i],d=arguments.length;if(h.fn){switch(h.once&&this.removeListener(e,h.fn,void 0,!0),d){case 1:return h.fn.call(h.context),!0;case 2:return h.fn.call(h.context,t),!0;case 3:return h.fn.call(h.context,t,n),!0;case 4:return h.fn.call(h.context,t,n,a),!0;case 5:return h.fn.call(h.context,t,n,a,o),!0;case 6:return h.fn.call(h.context,t,n,a,o,s),!0}for(l=1,c=new Array(d-1);l<d;l++)c[l-1]=arguments[l];h.fn.apply(h.context,c)}else{var p,u=h.length;for(l=0;l<u;l++)switch(h[l].once&&this.removeListener(e,h[l].fn,void 0,!0),d){case 1:h[l].fn.call(h[l].context);break;case 2:h[l].fn.call(h[l].context,t);break;case 3:h[l].fn.call(h[l].context,t,n);break;case 4:h[l].fn.call(h[l].context,t,n,a);break;default:if(!c)for(p=1,c=new Array(d-1);p<d;p++)c[p-1]=arguments[p];h[l].fn.apply(h[l].context,c)}}return!0},i.prototype.on=function(e,t,r){return o(this,e,t,r,!1)},i.prototype.once=function(e,t,r){return o(this,e,t,r,!0)},i.prototype.removeListener=function(e,t,n,a){var o=r?r+e:e;if(!this._events[o])return this;if(!t)return s(this,o),this;var i=this._events[o];if(i.fn)i.fn!==t||a&&!i.once||n&&i.context!==n||s(this,o);else{for(var c=0,l=[],h=i.length;c<h;c++)(i[c].fn!==t||a&&!i[c].once||n&&i[c].context!==n)&&l.push(i[c]);l.length?this._events[o]=1===l.length?l[0]:l:s(this,o)}return this},i.prototype.removeAllListeners=function(e){var t;return e?(t=r?r+e:e,this._events[t]&&s(this,t)):(this._events=new n,this._eventsCount=0),this},i.prototype.off=i.prototype.removeListener,i.prototype.addListener=i.prototype.on,i.prefixed=r,i.EventEmitter=i,e.exports=i},314(e){"use strict";e.exports=(e,t)=>(t=t||(()=>{}),e.then(e=>new Promise(e=>{e(t())}).then(()=>e),e=>new Promise(e=>{e(t())}).then(()=>{throw e})))},442(e,t,r){"use strict";r(946);const n=r(218);r(574),new n.TimeoutError},478(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,r){let n=0,a=e.length;for(;a>0;){const o=a/2|0;let s=n+o;r(e[s],t)<=0?(n=++s,a-=o+1):a=o}return n}},574(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=r(478);t.default=class{constructor(){this._queue=[]}enqueue(e,t){const r={priority:(t=Object.assign({priority:0},t)).priority,run:e};if(this.size&&this._queue[this.size-1].priority>=t.priority)return void this._queue.push(r);const a=n.default(this._queue,r,(e,t)=>t.priority-e.priority);this._queue.splice(a,0,r)}dequeue(){const e=this._queue.shift();return null==e?void 0:e.run}filter(e){return this._queue.filter(t=>t.priority===e.priority).map(e=>e.run)}get size(){return this._queue.length}}},218(e,t,r){"use strict";const n=r(314);class a extends Error{constructor(e){super(e),this.name="TimeoutError"}}const o=(e,t,r)=>new Promise((o,s)=>{if("number"!=typeof t||t<0)throw new TypeError("Expected `milliseconds` to be a positive number");if(t===1/0)return void o(e);const i=setTimeout(()=>{if("function"==typeof r){try{o(r())}catch(e){s(e)}return}const n=r instanceof Error?r:new a("string"==typeof r?r:`Promise timed out after ${t} milliseconds`);"function"==typeof e.cancel&&e.cancel(),s(n)},t);n(e.then(o,s),()=>{clearTimeout(i)})});e.exports=o,e.exports.default=o,e.exports.TimeoutError=a},816(e,t,r){"use strict";var n=r(567);function a(){}function o(){}o.resetWarningCache=a,e.exports=function(){function e(e,t,r,a,o,s){if(s!==n){var i=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw i.name="Invariant Violation",i}}function t(){return e}e.isRequired=e;var r={array:e,bigint:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:o,resetWarningCache:a};return r.PropTypes=r,r}},390(e,t,r){e.exports=r(816)()},567(e){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"}},t={};function r(n){var a=t[n];if(void 0!==a)return a.exports;var o=t[n]={exports:{}};return e[n](o,o.exports,r),o.exports}r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.nc=void 0,(()=>{"use strict";const e=React;var t=r.n(e),n=r(390),a=r.n(n),o="-ms-",s="-moz-",i="-webkit-",c="comm",l="rule",h="decl",d="@keyframes",p=Math.abs,u=String.fromCharCode,f=Object.assign;function g(e){return e.trim()}function m(e,t){return(e=t.exec(e))?e[0]:e}function y(e,t,r){return e.replace(t,r)}function b(e,t,r){return e.indexOf(t,r)}function k(e,t){return 0|e.charCodeAt(t)}function v(e,t,r){return e.slice(t,r)}function x(e){return e.length}function w(e){return e.length}function M(e,t){return t.push(e),e}function E(e,t){return e.filter(function(e){return!m(e,t)})}var z,C,S=1,R=1,$=0,j=0,A=0,N="";function O(e,t,r,n,a,o,s,i){return{value:e,root:t,parent:r,type:n,props:a,children:o,line:S,column:R,length:s,return:"",siblings:i}}function _(e,t){return f(O("",null,null,"",null,null,0,e.siblings),e,{length:-e.length},t)}function q(e){for(;e.root;)e=_(e.root,{children:[e]});M(e,e.siblings)}function I(){return A=j>0?k(N,--j):0,R--,10===A&&(R=1,S--),A}function P(){return A=j<$?k(N,j++):0,R++,10===A&&(R=1,S++),A}function T(){return k(N,j)}function L(){return j}function H(e,t){return v(N,e,t)}function B(e){switch(e){case 0:case 9:case 10:case 13:case 32:return 5;case 33:case 43:case 44:case 47:case 62:case 64:case 126:case 59:case 123:case 125:return 4;case 58:return 3;case 34:case 39:case 40:case 91:return 2;case 41:case 93:return 1}return 0}function V(e){return g(H(j-1,D(91===e?e+2:40===e?e+1:e)))}function W(e){for(;(A=T())&&A<33;)P();return B(e)>2||B(A)>3?"":" "}function F(e,t){for(;--t&&P()&&!(A<48||A>102||A>57&&A<65||A>70&&A<97););return H(e,L()+(t<6&&32==T()&&32==P()))}function D(e){for(;P();)switch(A){case e:return j;case 34:case 39:34!==e&&39!==e&&D(A);break;case 40:41===e&&D(e);break;case 92:P()}return j}function Y(e,t){for(;P()&&e+A!==57&&(e+A!==84||47!==T()););return"/*"+H(t,j-1)+"*"+u(47===e?e:P())}function G(e){for(;!B(T());)P();return H(e,j)}function X(e,t){for(var r="",n=0;n<e.length;n++)r+=t(e[n],n,e,t)||"";return r}function U(e,t,r,n){switch(e.type){case"@layer":if(e.children.length)break;case"@import":case"@namespace":case h:return e.return=e.return||e.value;case c:return"";case d:return e.return=e.value+"{"+X(e.children,n)+"}";case l:if(!x(e.value=e.props.join(",")))return""}return x(r=X(e.children,n))?e.return=e.value+"{"+r+"}":""}function Z(e,t,r){switch(function(e,t){return 45^k(e,0)?(((t<<2^k(e,0))<<2^k(e,1))<<2^k(e,2))<<2^k(e,3):0}(e,t)){case 5103:return i+"print-"+e+e;case 5737:case 4201:case 3177:case 3433:case 1641:case 4457:case 2921:case 5572:case 6356:case 5844:case 3191:case 6645:case 3005:case 4215:case 6389:case 5109:case 5365:case 5621:case 3829:case 6391:case 5879:case 5623:case 6135:case 4599:return i+e+e;case 4855:return i+e.replace("add","source-over").replace("substract","source-out").replace("intersect","source-in").replace("exclude","xor")+e;case 4789:return s+e+e;case 5349:case 4246:case 4810:case 6968:case 2756:return i+e+s+e+o+e+e;case 5936:switch(k(e,t+11)){case 114:return i+e+o+y(e,/[svh]\w+-[tblr]{2}/,"tb")+e;case 108:return i+e+o+y(e,/[svh]\w+-[tblr]{2}/,"tb-rl")+e;case 45:return i+e+o+y(e,/[svh]\w+-[tblr]{2}/,"lr")+e}case 6828:case 4268:case 2903:return i+e+o+e+e;case 6165:return i+e+o+"flex-"+e+e;case 5187:return i+e+y(e,/(\w+).+(:[^]+)/,i+"box-$1$2"+o+"flex-$1$2")+e;case 5443:return i+e+o+"flex-item-"+y(e,/flex-|-self/g,"")+(m(e,/flex-|baseline/)?"":o+"grid-row-"+y(e,/flex-|-self/g,""))+e;case 4675:return i+e+o+"flex-line-pack"+y(e,/align-content|flex-|-self/g,"")+e;case 5548:return i+e+o+y(e,"shrink","negative")+e;case 5292:return i+e+o+y(e,"basis","preferred-size")+e;case 6060:return i+"box-"+y(e,"-grow","")+i+e+o+y(e,"grow","positive")+e;case 4554:return i+y(e,/([^-])(transform)/g,"$1"+i+"$2")+e;case 6187:return y(y(y(e,/(zoom-|grab)/,i+"$1"),/(image-set)/,i+"$1"),e,"")+e;case 5495:case 3959:return y(e,/(image-set\([^]*)/,i+"$1$`$1");case 4968:return y(y(e,/(.+:)(flex-)?(.*)/,i+"box-pack:$3"+o+"flex-pack:$3"),/space-between/,"justify")+i+e+e;case 4200:if(!m(e,/flex-|baseline/))return o+"grid-column-align"+v(e,t)+e;break;case 2592:case 3360:return o+y(e,"template-","")+e;case 4384:case 3616:return r&&r.some(function(e,r){return t=r,m(e.props,/grid-\w+-end/)})?~b(e+(r=r[t].value),"span",0)?e:o+y(e,"-start","")+e+o+"grid-row-span:"+(~b(r,"span",0)?m(r,/\d+/):+m(r,/\d+/)-+m(e,/\d+/))+";":o+y(e,"-start","")+e;case 4896:case 4128:return r&&r.some(function(e){return m(e.props,/grid-\w+-start/)})?e:o+y(y(e,"-end","-span"),"span ","")+e;case 4095:case 3583:case 4068:case 2532:return y(e,/(.+)-inline(.+)/,i+"$1$2")+e;case 8116:case 7059:case 5753:case 5535:case 5445:case 5701:case 4933:case 4677:case 5533:case 5789:case 5021:case 4765:if(x(e)-1-t>6)switch(k(e,t+1)){case 109:if(45!==k(e,t+4))break;case 102:return y(e,/(.+:)(.+)-([^]+)/,"$1"+i+"$2-$3$1"+s+(108==k(e,t+3)?"$3":"$2-$3"))+e;case 115:return~b(e,"stretch",0)?Z(y(e,"stretch","fill-available"),t,r)+e:e}break;case 5152:case 5920:return y(e,/(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/,function(t,r,n,a,s,i,c){return o+r+":"+n+c+(a?o+r+"-span:"+(s?i:+i-+n)+c:"")+e});case 4949:if(121===k(e,t+6))return y(e,":",":"+i)+e;break;case 6444:switch(k(e,45===k(e,14)?18:11)){case 120:return y(e,/(.+:)([^;\s!]+)(;|(\s+)?!.+)?/,"$1"+i+(45===k(e,14)?"inline-":"")+"box$3$1"+i+"$2$3$1"+o+"$2box$3")+e;case 100:return y(e,":",":"+o)+e}break;case 5719:case 2647:case 2135:case 3927:case 2391:return y(e,"scroll-","scroll-snap-")+e}return e}function K(e,t,r,n){if(e.length>-1&&!e.return)switch(e.type){case h:return void(e.return=Z(e.value,e.length,r));case d:return X([_(e,{value:y(e.value,"@","@"+i)})],n);case l:if(e.length)return function(e,t){return e.map(t).join("")}(r=e.props,function(t){switch(m(t,n=/(::plac\w+|:read-\w+)/)){case":read-only":case":read-write":q(_(e,{props:[y(t,/:(read-\w+)/,":-moz-$1")]})),q(_(e,{props:[t]})),f(e,{props:E(r,n)});break;case"::placeholder":q(_(e,{props:[y(t,/:(plac\w+)/,":"+i+"input-$1")]})),q(_(e,{props:[y(t,/:(plac\w+)/,":-moz-$1")]})),q(_(e,{props:[y(t,/:(plac\w+)/,o+"input-$1")]})),q(_(e,{props:[t]})),f(e,{props:E(r,n)})}return""})}}function Q(e){return function(e){return N="",e}(J("",null,null,null,[""],e=function(e){return S=R=1,$=x(N=e),j=0,[]}(e),0,[0],e))}function J(e,t,r,n,a,o,s,i,c){for(var l=0,h=0,d=s,f=0,g=0,m=0,w=1,E=1,z=1,C=0,S="",R=a,$=o,j=n,A=S;E;)switch(m=C,C=P()){case 40:if(108!=m&&58==k(A,d-1)){-1!=b(A+=y(V(C),"&","&\f"),"&\f",p(l?i[l-1]:0))&&(z=-1);break}case 34:case 39:case 91:A+=V(C);break;case 9:case 10:case 13:case 32:A+=W(m);break;case 92:A+=F(L()-1,7);continue;case 47:switch(T()){case 42:case 47:M(te(Y(P(),L()),t,r,c),c),5!=B(m||1)&&5!=B(T()||1)||!x(A)||" "===v(A,-1,void 0)||(A+=" ");break;default:A+="/"}break;case 123*w:i[l++]=x(A)*z;case 125*w:case 59:case 0:switch(C){case 0:case 125:E=0;case 59+h:-1==z&&(A=y(A,/\f/g,"")),g>0&&(x(A)-d||0===w&&47===m)&&M(g>32?re(A+";",n,r,d-1,c):re(y(A," ","")+";",n,r,d-2,c),c);break;case 59:A+=";";default:if(M(j=ee(A,t,r,l,h,a,i,S,R=[],$=[],d,o),o),123===C)if(0===h)J(A,t,j,j,R,o,d,i,$);else{switch(f){case 99:if(110===k(A,3))break;case 108:if(97===k(A,2))break;default:h=0;case 100:case 109:case 115:}h?J(e,j,j,n&&M(ee(e,j,j,0,0,a,i,S,a,R=[],d,$),$),a,$,d,i,n?R:$):J(A,j,j,j,[""],$,0,i,$)}}l=h=g=0,w=z=1,S=A="",d=s;break;case 58:d=1+x(A),g=m;default:if(w<1)if(123==C)--w;else if(125==C&&0==w++&&125==I())continue;switch(A+=u(C),C*w){case 38:z=h>0?1:(A+="\f",-1);break;case 44:i[l++]=(x(A)-1)*z,z=1;break;case 64:45===T()&&(A+=V(P())),f=T(),h=d=x(S=A+=G(L())),C++;break;case 45:45===m&&2==x(A)&&(w=0)}}return o}function ee(e,t,r,n,a,o,s,i,c,h,d,u){for(var f=a-1,m=0===a?o:[""],b=w(m),k=0,x=0,M=0;k<n;++k)for(var E=0,z=v(e,f+1,f=p(x=s[k])),C=e;E<b;++E)(C=g(x>0?m[E]+" "+z:y(z,/&\f/g,m[E])))&&(c[M++]=C);return O(e,t,r,0===a?l:i,c,h,d,u)}function te(e,t,r,n){return O(e,t,r,c,u(A),v(e,2,-2),0,n)}function re(e,t,r,n,a){return O(e,t,r,h,v(e,0,n),v(e,n+1,-1),n,a)}const ne="undefined"!=typeof process&&void 0!==process.env&&(process.env.REACT_APP_SC_ATTR||process.env.SC_ATTR)||"data-styled",ae="active",oe="data-styled-version",se="6.4.0",ie="/*!sc*/\n",ce="undefined"!=typeof window&&"undefined"!=typeof document;function le(e){if("undefined"!=typeof process&&void 0!==process.env){const t=process.env[e];if(void 0!==t&&""!==t)return"false"!==t}}const he=Boolean("boolean"==typeof SC_DISABLE_SPEEDY?SC_DISABLE_SPEEDY:null!==(C=null!==(z=le("REACT_APP_SC_DISABLE_SPEEDY"))&&void 0!==z?z:le("SC_DISABLE_SPEEDY"))&&void 0!==C?C:"undefined"==typeof process||void 0===process.env||!1);function de(e,...t){return new Error(`An error occurred. See https://github.com/styled-components/styled-components/blob/main/packages/styled-components/src/utils/errors.md#${e} for more information.${t.length>0?` Args: ${t.join(", ")}`:""}`)}let pe=new Map,ue=new Map,fe=1;const ge=e=>{if(pe.has(e))return pe.get(e);for(;ue.has(fe);)fe++;const t=fe++;return pe.set(e,t),ue.set(t,e),t},me=e=>ue.get(e),ye=(e,t)=>{fe=t+1,pe.set(e,t),ue.set(t,e)},be=(new Set,Object.freeze([])),ke=Object.freeze({});const ve=/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g,xe=/(^-|-$)/g;function we(e){return e.replace(ve,"-").replace(xe,"")}const Me=/(a)(d)/gi,Ee=e=>String.fromCharCode(e+(e>25?39:97));function ze(e){let t,r="";for(t=Math.abs(e);t>52;t=t/52|0)r=Ee(t%52)+r;return(Ee(t%52)+r).replace(Me,"$1-$2")}const Ce=5381,Se=(e,t)=>{let r=t.length;for(;r;)e=33*e^t.charCodeAt(--r);return e},Re=e=>Se(Ce,e);function $e(e){return"string"==typeof e&&!0}function je(e){return $e(e)?`styled.${e}`:`Styled(${function(e){return e.displayName||e.name||"Component"}(e)})`}const Ae=Symbol.for("react.memo"),Ne=Symbol.for("react.forward_ref"),Oe={contextType:!0,defaultProps:!0,displayName:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,propTypes:!0,type:!0},_e={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},qe={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},Ie={[Ne]:{$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},[Ae]:qe};function Pe(e){return("type"in(t=e)&&t.type.$$typeof)===Ae?qe:"$$typeof"in e?Ie[e.$$typeof]:Oe;var t}const Te=Object.defineProperty,Le=Object.getOwnPropertyNames,He=Object.getOwnPropertySymbols,Be=Object.getOwnPropertyDescriptor,Ve=Object.getPrototypeOf,We=Object.prototype;function Fe(e,t,r){if("string"!=typeof t){const n=Ve(t);n&&n!==We&&Fe(e,n,r);const a=Le(t).concat(He(t)),o=Pe(e),s=Pe(t);for(let n=0;n<a.length;++n){const i=a[n];if(!(i in _e||r&&r[i]||s&&i in s||o&&i in o)){const r=Be(t,i);try{Te(e,i,r)}catch(e){}}}}return e}function De(e){return"function"==typeof e}function Ye(e){return"object"==typeof e&&"styledComponentId"in e}function Ge(e,t){return e&&t?e+" "+t:e||t||""}function Xe(e,t){return e.join(t||"")}function Ue(e){return null!==e&&"object"==typeof e&&e.constructor.name===Object.name&&!("props"in e&&e.$$typeof)}function Ze(e,t,r=!1){if(!r&&!Ue(e)&&!Array.isArray(e))return t;if(Array.isArray(t))for(let r=0;r<t.length;r++)e[r]=Ze(e[r],t[r]);else if(Ue(t))for(const r in t)e[r]=Ze(e[r],t[r]);return e}function Ke(e,t){Object.defineProperty(e,"toString",{value:t})}const Qe=class{constructor(e){this.groupSizes=new Uint32Array(512),this.length=512,this.tag=e,this._cGroup=0,this._cIndex=0}indexOfGroup(e){if(e===this._cGroup)return this._cIndex;let t=this._cIndex;if(e>this._cGroup)for(let r=this._cGroup;r<e;r++)t+=this.groupSizes[r];else for(let r=this._cGroup-1;r>=e;r--)t-=this.groupSizes[r];return this._cGroup=e,this._cIndex=t,t}insertRules(e,t){if(e>=this.groupSizes.length){const t=this.groupSizes,r=t.length;let n=r;for(;e>=n;)if(n<<=1,n<0)throw de(16,`${e}`);this.groupSizes=new Uint32Array(n),this.groupSizes.set(t),this.length=n;for(let e=r;e<n;e++)this.groupSizes[e]=0}let r=this.indexOfGroup(e+1),n=0;for(let a=0,o=t.length;a<o;a++)this.tag.insertRule(r,t[a])&&(this.groupSizes[e]++,r++,n++);n>0&&this._cGroup>e&&(this._cIndex+=n)}clearGroup(e){if(e<this.length){const t=this.groupSizes[e],r=this.indexOfGroup(e),n=r+t;this.groupSizes[e]=0;for(let e=r;e<n;e++)this.tag.deleteRule(r);t>0&&this._cGroup>e&&(this._cIndex-=t)}}getGroup(e){let t="";if(e>=this.length||0===this.groupSizes[e])return t;const r=this.groupSizes[e],n=this.indexOfGroup(e),a=n+r;for(let e=n;e<a;e++)t+=this.tag.getRule(e)+ie;return t}},Je=`style[${ne}][${oe}="${se}"]`,et=new RegExp(`^${ne}\\.g(\\d+)\\[id="([\\w\\d-]+)"\\].*?"([^"]*)`),tt=e=>"undefined"!=typeof ShadowRoot&&e instanceof ShadowRoot||"host"in e&&11===e.nodeType,rt=e=>{if(!e)return document;if(tt(e))return e;if("getRootNode"in e){const t=e.getRootNode();if(tt(t))return t}return document},nt=(e,t,r)=>{const n=r.split(",");let a;for(let r=0,o=n.length;r<o;r++)(a=n[r])&&e.registerName(t,a)},at=(e,t)=>{var r;const n=(null!==(r=t.textContent)&&void 0!==r?r:"").split(ie),a=[];for(let t=0,r=n.length;t<r;t++){const r=n[t].trim();if(!r)continue;const o=r.match(et);if(o){const t=0|parseInt(o[1],10),r=o[2];0!==t&&(ye(r,t),nt(e,r,o[3]),e.getTag().insertRules(t,a)),a.length=0}else a.push(r)}},ot=e=>{const t=rt(e.options.target).querySelectorAll(Je);for(let r=0,n=t.length;r<n;r++){const n=t[r];n&&n.getAttribute(ne)!==ae&&(at(e,n),n.parentNode&&n.parentNode.removeChild(n))}};let st=!1;const it=(e,t)=>{const n=document.head,a=e||n,o=document.createElement("style"),s=(e=>{const t=Array.from(e.querySelectorAll(`style[${ne}]`));return t[t.length-1]})(a),i=void 0!==s?s.nextSibling:null;o.setAttribute(ne,ae),o.setAttribute(oe,se);const c=t||function(){if(!1!==st)return st;if("undefined"!=typeof document){const e=document.head.querySelector('meta[property="csp-nonce"]');if(e)return st=e.nonce||e.getAttribute("content")||void 0;const t=document.head.querySelector('meta[name="sc-nonce"]');if(t)return st=t.getAttribute("content")||void 0}return st=r.nc}();return c&&o.setAttribute("nonce",c),a.insertBefore(o,i),o},ct=class{constructor(e,t){this.element=it(e,t),this.element.appendChild(document.createTextNode("")),this.sheet=(e=>{var t;if(e.sheet)return e.sheet;const r=null!==(t=e.getRootNode().styleSheets)&&void 0!==t?t:document.styleSheets;for(let t=0,n=r.length;t<n;t++){const n=r[t];if(n.ownerNode===e)return n}throw de(17)})(this.element),this.length=0}insertRule(e,t){try{return this.sheet.insertRule(t,e),this.length++,!0}catch(e){return!1}}deleteRule(e){this.sheet.deleteRule(e),this.length--}getRule(e){const t=this.sheet.cssRules[e];return t&&t.cssText?t.cssText:""}},lt=class{constructor(e,t){this.element=it(e,t),this.nodes=this.element.childNodes,this.length=0}insertRule(e,t){if(e<=this.length&&e>=0){const r=document.createTextNode(t);return this.element.insertBefore(r,this.nodes[e]||null),this.length++,!0}return!1}deleteRule(e){this.element.removeChild(this.nodes[e]),this.length--}getRule(e){return e<this.length?this.nodes[e].textContent:""}};let ht=ce;const dt={isServer:!ce,useCSSOMInjection:!he};class pt{static registerId(e){return ge(e)}constructor(e=ke,t={},r){this.options=Object.assign(Object.assign({},dt),e),this.gs=t,this.keyframeIds=new Set,this.names=new Map(r),this.server=!!e.isServer,!this.server&&ce&&ht&&(ht=!1,ot(this)),Ke(this,()=>(e=>{const t=e.getTag(),{length:r}=t;let n="";for(let a=0;a<r;a++){const r=me(a);if(void 0===r)continue;const o=e.names.get(r);if(void 0===o||!o.size)continue;const s=t.getGroup(a);if(0===s.length)continue;const i=ne+".g"+a+'[id="'+r+'"]';let c="";for(const e of o)e.length>0&&(c+=e+",");n+=s+i+'{content:"'+c+'"}'+ie}return n})(this))}rehydrate(){!this.server&&ce&&ot(this)}reconstructWithOptions(e,t=!0){const r=new pt(Object.assign(Object.assign({},this.options),e),this.gs,t&&this.names||void 0);return r.keyframeIds=new Set(this.keyframeIds),!this.server&&ce&&e.target!==this.options.target&&rt(this.options.target)!==rt(e.target)&&ot(r),r}allocateGSInstance(e){return this.gs[e]=(this.gs[e]||0)+1}getTag(){return this.tag||(this.tag=(e=(({useCSSOMInjection:e,target:t,nonce:r})=>e?new ct(t,r):new lt(t,r))(this.options),new Qe(e)));var e}hasNameForId(e,t){var r,n;return null!==(n=null===(r=this.names.get(e))||void 0===r?void 0:r.has(t))&&void 0!==n&&n}registerName(e,t){ge(e),e.startsWith("sc-keyframes-")&&this.keyframeIds.add(e);const r=this.names.get(e);r?r.add(t):this.names.set(e,new Set([t]))}insertRules(e,t,r){this.registerName(e,t),this.getTag().insertRules(ge(e),r)}clearNames(e){this.names.has(e)&&this.names.get(e).clear()}clearRules(e){this.getTag().clearGroup(ge(e)),this.clearNames(e)}clearTag(){this.tag=void 0}}const ut=new WeakSet,ft={animationIterationCount:1,aspectRatio:1,borderImageOutset:1,borderImageSlice:1,borderImageWidth:1,columnCount:1,columns:1,flex:1,flexGrow:1,flexShrink:1,gridRow:1,gridRowEnd:1,gridRowSpan:1,gridRowStart:1,gridColumn:1,gridColumnEnd:1,gridColumnSpan:1,gridColumnStart:1,fontWeight:1,lineHeight:1,opacity:1,order:1,orphans:1,scale:1,tabSize:1,widows:1,zIndex:1,zoom:1,WebkitLineClamp:1,fillOpacity:1,floodOpacity:1,stopOpacity:1,strokeDasharray:1,strokeDashoffset:1,strokeMiterlimit:1,strokeOpacity:1,strokeWidth:1};function gt(e,t){return null==t||"boolean"==typeof t||""===t?"":"number"!=typeof t||0===t||e in ft||e.startsWith("--")?String(t).trim():t+"px"}const mt=e=>e>="A"&&e<="Z";function yt(e){let t="";for(let r=0;r<e.length;r++){const n=e[r];if(1===r&&"-"===n&&"-"===e[0])return e;mt(n)?t+="-"+n.toLowerCase():t+=n}return t.startsWith("ms-")?"-"+t:t}const bt=Symbol.for("sc-keyframes");function kt(e){return De(e)&&!(e.prototype&&e.prototype.isReactComponent)}const vt=e=>null==e||!1===e||""===e,xt=Symbol.for("react.client.reference");function wt(e){return e.$$typeof===xt}const Mt=e=>{const t=[];for(const r in e){const n=e[r];e.hasOwnProperty(r)&&!vt(n)&&(Array.isArray(n)&&ut.has(n)||De(n)?t.push(yt(r)+":",n,";"):Ue(n)?t.push(r+" {",...Mt(n),"}"):t.push(yt(r)+": "+gt(r,n)+";"))}return t};function Et(e,t,r,n,a=[]){if(vt(e))return a;const o=typeof e;if("string"===o)return a.push(e),a;if("function"===o)return wt(e)?a:kt(e)&&t?Et(e(t),t,r,n,a):(a.push(e),a);if(Array.isArray(e)){for(let o=0;o<e.length;o++)Et(e[o],t,r,n,a);return a}if(Ye(e))return a.push(`.${e.styledComponentId}`),a;if(function(e){return"object"==typeof e&&null!==e&&bt in e}(e))return r?(e.inject(r,n),a.push(e.getName(n))):a.push(e),a;if(wt(e))return a;if(Ue(e)){const t=Mt(e);for(let e=0;e<t.length;e++)a.push(t[e]);return a}return a.push(e.toString()),a}const zt=Re(se);class Ct{constructor(e,t,r){this.rules=e,this.componentId=t,this.baseHash=Se(zt,t),this.baseStyle=r,pt.registerId(t)}generateAndInjectStyles(e,t,r){let n=this.baseStyle?this.baseStyle.generateAndInjectStyles(e,t,r):"";{let a="";for(let n=0;n<this.rules.length;n++){const o=this.rules[n];if("string"==typeof o)a+=o;else if(o)if(kt(o)){const n=o(e);"string"==typeof n?a+=n:null!=n&&!1!==n&&(a+=Xe(Et(n,e,t,r)))}else a+=Xe(Et(o,e,t,r))}if(a){this.dynamicNameCache||(this.dynamicNameCache=new Map);const e=r.hash?r.hash+a:a;let o=this.dynamicNameCache.get(e);if(!o){if(o=ze(Se(Se(this.baseHash,r.hash),a)>>>0),this.dynamicNameCache.size>=200){const e=this.dynamicNameCache.keys().next().value;void 0!==e&&this.dynamicNameCache.delete(e)}this.dynamicNameCache.set(e,o)}if(!t.hasNameForId(this.componentId,o)){const e=r(a,"."+o,void 0,this.componentId);t.insertRules(this.componentId,o,e)}n=Ge(n,o)}}return n}}const St=/&/g,Rt=47;function $t(e,t){let r=0;for(;--t>=0&&92===e.charCodeAt(t);)r++;return!(1&~r)}function jt(e){const t=e.length;let r="",n=0,a=0,o=0,s=!1,i=!1;for(let c=0;c<t;c++){const l=e.charCodeAt(c);if(0!==o||s||l!==Rt||42!==e.charCodeAt(c+1))if(s)42===l&&e.charCodeAt(c+1)===Rt&&(s=!1,c++);else if(34!==l&&39!==l||$t(e,c)){if(0===o)if(123===l)a++;else if(125===l){if(a--,a<0){i=!0;let r=c+1;for(;r<t;){const t=e.charCodeAt(r);if(59===t||10===t)break;r++}r<t&&59===e.charCodeAt(r)&&r++,a=0,c=r-1,n=r;continue}0===a&&(r+=e.substring(n,c+1),n=c+1)}else 59===l&&0===a&&(r+=e.substring(n,c+1),n=c+1)}else 0===o?o=l:o===l&&(o=0);else s=!0,c++}return i||0!==a||0!==o?(n<t&&0===a&&0===o&&(r+=e.substring(n)),r):e}function At(e,t){for(let r=0;r<e.length;r++){const n=e[r];if("rule"===n.type){n.value=t+" "+n.value,n.value=n.value.replaceAll(",",","+t+" ");const e=n.props,r=[];for(let n=0;n<e.length;n++)r[n]=t+" "+e[n];n.props=r}Array.isArray(n.children)&&"@keyframes"!==n.type&&(n.children=At(n.children,t))}return e}const Nt=new pt,Ot=function({options:e=ke,plugins:t=be}=ke){let r,n,a;const o=(e,t,a)=>a.startsWith(n)&&a.endsWith(n)&&a.replaceAll(n,"").length>0?`.${r}`:e,s=t.slice();s.push(e=>{e.type===l&&e.value.includes("&")&&(a||(a=new RegExp(`\\${n}\\b`,"g")),e.props[0]=e.props[0].replace(St,n).replace(a,o))}),e.prefix&&s.push(K),s.push(U);let i=[];const c=(p=s.concat((f=e=>i.push(e),function(e){e.root||(e=e.return)&&f(e)})),u=w(p),function(e,t,r,n){for(var a="",o=0;o<u;o++)a+=p[o](e,t,r,n)||"";return a}),h=(t,o="",s="",l="&")=>{r=l,n=o,a=void 0;const h=function(e){const t=-1!==e.indexOf("//"),r=-1!==e.indexOf("}");if(!t&&!r)return e;if(!t)return jt(e);const n=e.length;let a="",o=0,s=0,i=0,c=0,l=0,h=!1;for(;s<n;){const t=e.charCodeAt(s);if(34!==t&&39!==t||$t(e,s))if(0===i)if(t===Rt&&s+1<n&&42===e.charCodeAt(s+1)){for(s+=2;s+1<n&&(42!==e.charCodeAt(s)||e.charCodeAt(s+1)!==Rt);)s++;s+=2}else if(40!==t)if(41!==t)if(c>0)s++;else if(42===t&&s+1<n&&e.charCodeAt(s+1)===Rt)a+=e.substring(o,s),s+=2,o=s,h=!0;else if(t===Rt&&s+1<n&&e.charCodeAt(s+1)===Rt){for(a+=e.substring(o,s);s<n&&10!==e.charCodeAt(s);)s++;o=s,h=!0}else 123===t?l++:125===t&&l--,s++;else c>0&&c--,s++;else c++,s++;else s++;else 0===i?i=t:i===t&&(i=0),s++}return h?(o<n&&(a+=e.substring(o)),0===l?a:jt(a)):0===l?e:jt(e)}(t);let d=Q(s||o?s+" "+o+" { "+h+" }":h);return e.namespace&&(d=At(d,e.namespace)),i=[],X(d,c),i},d=e;var p,u,f;let g=Ce;for(let e=0;e<t.length;e++)t[e].name||de(15),g=Se(g,t[e].name);return(null==d?void 0:d.namespace)&&(g=Se(g,d.namespace)),(null==d?void 0:d.prefix)&&(g=Se(g,"p")),h.hash=g!==Ce?g.toString():"",h}(),_t=t().createContext({shouldForwardProp:void 0,styleSheet:Nt,stylis:Ot,stylisPlugins:void 0});_t.Consumer;const qt=t().createContext(void 0);qt.Consumer;const It=Object.prototype.hasOwnProperty,Pt={};function Tt(e,t){const r="string"!=typeof e?"sc":we(e);Pt[r]=(Pt[r]||0)+1;const n=r+"-"+function(e){return ze(Re(e)>>>0)}(se+r+Pt[r]);return t?t+"-"+n:n}function Lt(r,n,a){const o=Ye(r),s=r,i=!$e(r),{attrs:c=be,componentId:l=Tt(n.displayName,n.parentComponentId),displayName:h=je(r)}=n,d=n.displayName&&n.componentId?we(n.displayName)+"-"+n.componentId:n.componentId||l,p=o&&s.attrs?s.attrs.concat(c).filter(Boolean):c;let{shouldForwardProp:u}=n;if(o&&s.shouldForwardProp){const e=s.shouldForwardProp;if(n.shouldForwardProp){const t=n.shouldForwardProp;u=(r,n)=>e(r,n)&&t(r,n)}else u=e}const f=new Ct(a,d,o?s.componentStyle:void 0);function g(r,n){return function(r,n,a){const{attrs:o,componentStyle:s,defaultProps:i,foldedComponentIds:c,styledComponentId:l,target:h}=r,d=t().useContext(qt),p=t().useContext(_t),u=r.shouldForwardProp||p.shouldForwardProp,f=function(e,t,r=ke){return e.theme!==r.theme&&e.theme||t||r.theme}(n,d,i)||ke;let g,m;{const e=t().useRef(null),r=e.current;if(null!==r&&r[1]===f&&r[2]===p.styleSheet&&r[3]===p.stylis&&r[7]===s&&function(e,t,r){const n=e,a=t;let o=0;for(const e in a)if(It.call(a,e)&&(o++,n[e]!==a[e]))return!1;return o===r}(r[0],n,r[4]))g=r[5],m=r[6];else{g=function(e,t,r){const n=Object.assign(Object.assign({},t),{className:void 0,theme:r}),a=e.length>1;for(let r=0;r<e.length;r++){const o=e[r],s=De(o)?o(a?Object.assign({},n):n):o;for(const e in s)"className"===e?n.className=Ge(n.className,s[e]):"style"===e?n.style=Object.assign(Object.assign({},n.style),s[e]):e in t&&void 0===t[e]||(n[e]=s[e])}return"className"in t&&"string"==typeof t.className&&(n.className=Ge(n.className,t.className)),n}(o,n,f),m=function(e,t,r,n){return e.generateAndInjectStyles(t,r,n)}(s,g,p.styleSheet,p.stylis);let t=0;for(const e in n)It.call(n,e)&&t++;e.current=[n,f,p.styleSheet,p.stylis,t,g,m,s]}}const y=g.as||h,b=function(e,t,r,n){const a={};for(const o in e)void 0===e[o]||"$"===o[0]||"as"===o||"theme"===o&&e.theme===r||("forwardedAs"===o?a.as=e.forwardedAs:n&&!n(o,t)||(a[o]=e[o]));return a}(g,y,f,u);let k=Ge(c,l);return m&&(k+=" "+m),g.className&&(k+=" "+g.className),b[$e(y)&&y.includes("-")?"class":"className"]=k,a&&(b.ref=a),(0,e.createElement)(y,b)}(m,r,n)}g.displayName=h;let m=t().forwardRef(g);return m.attrs=p,m.componentStyle=f,m.displayName=h,m.shouldForwardProp=u,m.foldedComponentIds=o?Ge(s.foldedComponentIds,s.styledComponentId):"",m.styledComponentId=d,m.target=o?s.target:r,Object.defineProperty(m,"defaultProps",{get(){return this._foldedDefaultProps},set(e){this._foldedDefaultProps=o?function(e,...t){for(const r of t)Ze(e,r,!0);return e}({},s.defaultProps,e):e}}),Ke(m,()=>`.${m.styledComponentId}`),i&&Fe(m,r,{attrs:!0,componentStyle:!0,displayName:!0,foldedComponentIds:!0,shouldForwardProp:!0,styledComponentId:!0,target:!0}),m}var Ht=new Set(["a","abbr","address","area","article","aside","audio","b","bdi","bdo","blockquote","body","button","br","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","label","legend","li","main","map","mark","menu","meter","nav","object","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","slot","small","span","strong","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","u","ul","var","video","wbr","circle","clipPath","defs","ellipse","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence","filter","foreignObject","g","image","line","linearGradient","marker","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","svg","switch","symbol","text","textPath","tspan","use"]);function Bt(e,t){const r=[e[0]];for(let n=0,a=t.length;n<a;n+=1)r.push(t[n],e[n+1]);return r}const Vt=e=>(ut.add(e),e);function Wt(e,t,r=ke){if(!t)throw de(1,t);const n=(n,...a)=>e(t,r,function(e,...t){if(De(e)||Ue(e))return Vt(Et(Bt(be,[e,...t])));const r=e;return 0===t.length&&1===r.length&&"string"==typeof r[0]?Et(r):Vt(Et(Bt(r,t)))}(n,...a));return n.attrs=n=>Wt(e,t,Object.assign(Object.assign({},r),{attrs:Array.prototype.concat(r.attrs,n).filter(Boolean)})),n.withConfig=n=>Wt(e,t,Object.assign(Object.assign({},r),n)),n}const Ft=e=>Wt(Lt,e),Dt=Ft;Ht.forEach(e=>{Dt[e]=Ft(e)});const Yt=e=>{const t=(e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,r)=>r?r.toUpperCase():t.toLowerCase()))(e);return t.charAt(0).toUpperCase()+t.slice(1)},Gt=(...e)=>e.filter((e,t,r)=>Boolean(e)&&""!==e.trim()&&r.indexOf(e)===t).join(" ").trim(),Xt=e=>{for(const t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0};var Ut={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};const Zt=(0,e.forwardRef)(({color:t="currentColor",size:r=24,strokeWidth:n=2,absoluteStrokeWidth:a,className:o="",children:s,iconNode:i,...c},l)=>(0,e.createElement)("svg",{ref:l,...Ut,width:r,height:r,stroke:t,strokeWidth:a?24*Number(n)/Number(r):n,className:Gt("lucide",o),...!s&&!Xt(c)&&{"aria-hidden":"true"},...c},[...i.map(([t,r])=>(0,e.createElement)(t,r)),...Array.isArray(s)?s:[s]])),Kt=(t,r)=>{const n=(0,e.forwardRef)(({className:n,...a},o)=>{return(0,e.createElement)(Zt,{ref:o,iconNode:r,className:Gt(`lucide-${s=Yt(t),s.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${t}`,n),...a});var s});return n.displayName=Yt(t),n},Qt=Kt("timer-reset",[["path",{d:"M10 2h4",key:"n1abiw"}],["path",{d:"M12 14v-4",key:"1evpnu"}],["path",{d:"M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6",key:"1ts96g"}],["path",{d:"M9 17H4v5",key:"8t5av"}]]),Jt=Kt("tag",[["path",{d:"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",key:"vktsd0"}],["circle",{cx:"7.5",cy:"7.5",r:".5",fill:"currentColor",key:"kqv944"}]]),er=Kt("list",[["path",{d:"M3 12h.01",key:"nlz23k"}],["path",{d:"M3 18h.01",key:"1tta3j"}],["path",{d:"M3 6h.01",key:"1rqtza"}],["path",{d:"M8 12h13",key:"1za7za"}],["path",{d:"M8 18h13",key:"1lx6n3"}],["path",{d:"M8 6h13",key:"ik3vkj"}]]),tr=Kt("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]),rr=Kt("lock-keyhole",[["circle",{cx:"12",cy:"16",r:"1",key:"1au0dj"}],["rect",{x:"3",y:"10",width:"18",height:"12",rx:"2",key:"6s8ecr"}],["path",{d:"M7 10V7a5 5 0 0 1 10 0v3",key:"1pqi11"}]]),nr=Kt("lock-open",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 9.9-1",key:"1mm8w8"}]]),ar=Kt("file-x",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"m14.5 12.5-5 5",key:"b62r18"}],["path",{d:"m9.5 12.5 5 5",key:"1rk7el"}]]),or=Kt("file-symlink",[["path",{d:"m10 18 3-3-3-3",key:"18f6ys"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M4 11V4a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h7",key:"50q2rw"}]]),sr=Kt("chevrons-left",[["path",{d:"m11 17-5-5 5-5",key:"13zhaf"}],["path",{d:"m18 17-5-5 5-5",key:"h8a8et"}]]),ir=Kt("chevrons-right",[["path",{d:"m6 17 5-5-5-5",key:"xnjwq"}],["path",{d:"m13 17 5-5-5-5",key:"17xmmf"}]]),cr=Kt("chevron-left",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]),lr=Kt("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]),hr=Kt("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]),dr=Kt("chevron-up",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]),pr=Kt("pause",[["rect",{x:"14",y:"3",width:"5",height:"18",rx:"1",key:"kaeet6"}],["rect",{x:"5",y:"3",width:"5",height:"18",rx:"1",key:"1wsw3u"}]]),ur=Kt("play",[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",key:"10ikf1"}]]),fr=Kt("rotate-ccw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]),gr=Kt("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]),mr=Kt("circle-check-big",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]),yr=Kt("circle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]),br=Kt("square",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]]),kr=Kt("square-check-big",[["path",{d:"M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344",key:"2acyp4"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]),vr=Kt("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]),xr=Kt("undo",[["path",{d:"M3 7v6h6",key:"1v2h90"}],["path",{d:"M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13",key:"1r6uu6"}]]),wr=Kt("circle-alert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]),Mr=Kt("triangle-alert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]),Er=Kt("database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]),zr=Kt("wrench",[["path",{d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z",key:"1ngwbx"}]]),Cr=Kt("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]),Sr=Kt("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),Rr=Kt("cat",[["path",{d:"M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z",key:"x6xyqk"}],["path",{d:"M8 14v.5",key:"1nzgdb"}],["path",{d:"M16 14v.5",key:"1lajdz"}],["path",{d:"M11.25 16.25h1.5L12 17l-.75-.75Z",key:"12kq1m"}]]),$r=Kt("circle-arrow-up",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m16 12-4-4-4 4",key:"177agl"}],["path",{d:"M12 16V8",key:"1sbj14"}]]),jr=Kt("pencil",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]]),Ar=Kt("layout-dashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]]),Nr=Kt("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]),Or=Kt("folder",[["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}]]),_r=Kt("folder-open",[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]]),qr=Kt("image",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]),Ir=Kt("images",[["path",{d:"m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16",key:"9kzy35"}],["path",{d:"M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2",key:"1t0f0t"}],["circle",{cx:"13",cy:"7",r:"1",fill:"currentColor",key:"1obus6"}],["rect",{x:"8",y:"2",width:"14",height:"14",rx:"2",key:"1gvhby"}]]),Pr=Kt("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]),Tr=Kt("folder-plus",[["path",{d:"M12 10v6",key:"1bos4e"}],["path",{d:"M9 13h6",key:"1uhe8q"}],["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}]]),Lr=Kt("image-plus",[["path",{d:"M16 5h6",key:"1vod17"}],["path",{d:"M19 2v6",key:"4bpg5p"}],["path",{d:"M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5",key:"1ue2ih"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}]]),Hr=Kt("grid-3x3",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"M3 15h18",key:"5xshup"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"M15 3v18",key:"14nvp0"}]]),Br=Kt("twitter",[["path",{d:"M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",key:"pff0z6"}]]),Vr=Kt("instagram",[["rect",{width:"20",height:"20",x:"2",y:"2",rx:"5",ry:"5",key:"2e1cvw"}],["path",{d:"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z",key:"9exkf1"}],["line",{x1:"17.5",x2:"17.51",y1:"6.5",y2:"6.5",key:"r4j83e"}]]),Wr=Kt("facebook",[["path",{d:"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",key:"1jg4f8"}]]),Fr=Kt("star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]),Dr=Kt("timer",[["line",{x1:"10",x2:"14",y1:"2",y2:"2",key:"14vaq8"}],["line",{x1:"12",x2:"15",y1:"14",y2:"11",key:"17fdiu"}],["circle",{cx:"12",cy:"14",r:"8",key:"1e1u0o"}]]),Yr=Kt("link",[["path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",key:"1cjeqo"}],["path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",key:"19qd67"}]]),Gr=Kt("linkedin",[["path",{d:"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",key:"c2jq9f"}],["rect",{width:"4",height:"12",x:"2",y:"9",key:"mk3on5"}],["circle",{cx:"4",cy:"4",r:"2",key:"bt5ra8"}]]),Xr=Kt("pin",[["path",{d:"M12 17v5",key:"bb1du9"}],["path",{d:"M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z",key:"1nkz8b"}]]),Ur=Kt("zoom-in",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65",key:"13gj7c"}],["line",{x1:"11",x2:"11",y1:"8",y2:"14",key:"1vmskp"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11",key:"durymu"}]]),Zr=Kt("info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]),Kr=Kt("image-off",[["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}],["path",{d:"M10.41 10.41a2 2 0 1 1-2.83-2.83",key:"1bzlo9"}],["line",{x1:"13.5",x2:"6",y1:"13.5",y2:"21",key:"1q0aeu"}],["line",{x1:"18",x2:"21",y1:"12",y2:"15",key:"5mozeu"}],["path",{d:"M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59",key:"mmje98"}],["path",{d:"M21 15V5a2 2 0 0 0-2-2H9",key:"43el77"}]]),Qr=Kt("arrow-up",[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]]),Jr=Kt("arrow-down",[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]]),en=Kt("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]),tn=Kt("arrow-right",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]),rn=Kt("arrow-up-down",[["path",{d:"m21 16-4 4-4-4",key:"f6ql7i"}],["path",{d:"M17 20V4",key:"1ejh1v"}],["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}]]),nn=Kt("circle-pause",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"10",x2:"10",y1:"15",y2:"9",key:"c1nkhi"}],["line",{x1:"14",x2:"14",y1:"15",y2:"9",key:"h65svq"}]]),an=Kt("brain",[["path",{d:"M12 18V5",key:"adv99a"}],["path",{d:"M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4",key:"1e3is1"}],["path",{d:"M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5",key:"1gqd8o"}],["path",{d:"M17.997 5.125a4 4 0 0 1 2.526 5.77",key:"iwvgf7"}],["path",{d:"M18 18a4 4 0 0 0 2-7.464",key:"efp6ie"}],["path",{d:"M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517",key:"1gq6am"}],["path",{d:"M6 18a4 4 0 0 1-2-7.464",key:"k1g0md"}],["path",{d:"M6.003 5.125a4 4 0 0 0-2.526 5.77",key:"q97ue3"}]]),on=Kt("terminal",[["path",{d:"M12 19h8",key:"baeox8"}],["path",{d:"m4 17 6-6-6-6",key:"1yngyt"}]]),sn=Kt("clipboard",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}]]),cn=Kt("list-checks",[["path",{d:"m3 17 2 2 4-4",key:"1jhpwq"}],["path",{d:"m3 7 2 2 4-4",key:"1obspn"}],["path",{d:"M13 6h8",key:"15sg57"}],["path",{d:"M13 12h8",key:"h98zly"}],["path",{d:"M13 18h8",key:"oe0vm4"}]]),ln=Kt("server",[["rect",{width:"20",height:"8",x:"2",y:"2",rx:"2",ry:"2",key:"ngkwjq"}],["rect",{width:"20",height:"8",x:"2",y:"14",rx:"2",ry:"2",key:"iecqi9"}],["line",{x1:"6",x2:"6.01",y1:"6",y2:"6",key:"16zg32"}],["line",{x1:"6",x2:"6.01",y1:"18",y2:"18",key:"nzw8ys"}]]),hn=Kt("key",[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",key:"g0fldk"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}]]),dn=Kt("user",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]),pn=Kt("plug",[["path",{d:"M12 22v-5",key:"1ega77"}],["path",{d:"M9 8V2",key:"14iosj"}],["path",{d:"M15 8V2",key:"18g5xt"}],["path",{d:"M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z",key:"osxo6l"}]]),un=Kt("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]),fn=Kt("eye-off",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]),gn=Kt("rocket",[["path",{d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",key:"m3kijz"}],["path",{d:"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",key:"1fmvmk"}],["path",{d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0",key:"1f8sc4"}],["path",{d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",key:"qeys4"}]]),mn=Kt("calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]),yn=Kt("wand-sparkles",[["path",{d:"m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",key:"ul74o6"}],["path",{d:"m14 7 3 3",key:"1r5n42"}],["path",{d:"M5 6v4",key:"ilb8ba"}],["path",{d:"M19 14v4",key:"blhpug"}],["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M7 8H3",key:"zfb6yr"}],["path",{d:"M21 16h-4",key:"1cnmox"}],["path",{d:"M11 3H9",key:"1obp7u"}]]),bn=Kt("at-sign",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8",key:"7n84p3"}]]),kn=Kt("funnel",[["path",{d:"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",key:"sc7q7i"}]]),vn=Kt("circle-question-mark",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]),xn=Kt("loader-circle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]),wn=Kt("file-plus",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M9 15h6",key:"cctwl0"}],["path",{d:"M12 18v-6",key:"17g6i2"}]]),Mn=Kt("save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]),En=Kt("rotate-cw",[["path",{d:"M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8",key:"1p45f6"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}]]),zn=Kt("square-pen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]),Cn=Kt("refresh-ccw",[["path",{d:"M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"14sxne"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16",key:"1hlbsb"}],["path",{d:"M16 16h5v5",key:"ccwih5"}]]),Sn=Kt("zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]),Rn=Kt("file-up",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M12 12v6",key:"3ahymv"}],["path",{d:"m15 15-3-3-3 3",key:"15xj92"}]]),$n=Kt("sparkles",[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]]),jn=Kt("bug",[["path",{d:"m8 2 1.88 1.88",key:"fmnt4t"}],["path",{d:"M14.12 3.88 16 2",key:"qol33r"}],["path",{d:"M9 7.13v-1a3.003 3.003 0 1 1 6 0v1",key:"d7y7pr"}],["path",{d:"M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6",key:"xs1cw7"}],["path",{d:"M12 20v-9",key:"1qisl0"}],["path",{d:"M6.53 9C4.6 8.8 3 7.1 3 5",key:"32zzws"}],["path",{d:"M6 13H2",key:"82j7cp"}],["path",{d:"M3 21c0-2.1 1.7-3.9 3.8-4",key:"4p0ekp"}],["path",{d:"M20.97 5c0 2.1-1.6 3.8-3.5 4",key:"18gb23"}],["path",{d:"M22 13h-4",key:"1jl80f"}],["path",{d:"M17.2 17c2.1.1 3.8 1.9 3.8 4",key:"k3fwyw"}]]),An=Kt("scan-eye",[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}],["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["path",{d:"M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0",key:"11ak4c"}]]),Nn=Kt("feather",[["path",{d:"M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z",key:"18jl4k"}],["path",{d:"M16 8 2 22",key:"vp34q"}],["path",{d:"M17.5 15H9",key:"1oz8nu"}]]),On=Kt("external-link",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]),_n=Kt("download",[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]]),qn=Kt("share-2",[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]]),In=Kt("mail",[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]]),Pn=Kt("phone",[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]]),Tn=Kt("message-circle",[["path",{d:"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",key:"1sd12s"}]]),Ln=Kt("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]),Hn=Kt("house",[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]]),Bn=Kt("brush-cleaning",[["path",{d:"m16 22-1-4",key:"1ow2iv"}],["path",{d:"M19 13.99a1 1 0 0 0 1-1V12a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v.99a1 1 0 0 0 1 1",key:"iw8jdu"}],["path",{d:"M5 14h14l1.973 6.767A1 1 0 0 1 20 22H4a1 1 0 0 1-.973-1.233z",key:"1soew8"}],["path",{d:"m8 22 1-4",key:"s3unb"}]]),Vn=Kt("book",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",key:"k3hazp"}]]),Wn={trash:"rgb(255 255 255 / 25%)",delete:"rgb(255 255 255 / 25%)",pencil:"rgb(255 255 255 / 25%)",filter:"rgb(255 255 255 / 25%)",lightning:"rgb(255 255 255 / 25%)",zap:"rgb(255 255 255 / 25%)",stop:"rgb(255 255 255 / 25%)","checkbox-blank":"rgb(255 255 255 / 25%)","checkbox-marked":"rgb(255 255 255 / 25%)",star:"rgb(255 255 255 / 25%)","file-upload":"rgb(255 255 255 / 25%)",cat:"rgb(255 255 255 / 25%)",pinterest:"rgb(255 255 255 / 25%)",instagram:"rgb(255 255 255 / 25%)",facebook:"rgb(255 255 255 / 25%)","rocket-launch":"rgb(255 255 255 / 25%)",upload:"rgb(255 255 255 / 25%)","zoom-in":"rgb(255 255 255 / 25%)",dashboard:"rgb(255 255 255 / 25%)",tools:"rgb(255 255 255 / 25%)",cog:"rgb(255 255 255 / 25%)",database:"rgb(255 255 255 / 25%)",folder:"rgb(255 255 255 / 25%)","lock-open":"rgb(255 255 255 / 25%)",lock:"rgb(255 255 255 / 25%)",question:"rgb(255 255 255 / 25%)","info-outline":"rgb(255 255 255 / 25%)",alert:"rgb(255 255 255 / 25%)",play:"rgb(255 255 255 / 25%)",sparkles:"rgb(255 255 255 / 25%)",bell:"rgb(255 255 255 / 25%)",home:"rgb(255 255 255 / 25%)",phone:"rgb(255 255 255 / 25%)",message:"rgb(255 255 255 / 25%)"},Fn={"timer-reset":Qt,tag:Jt,"format-list-bulleted":er,duplicate:tr,lock:rr,"lock-open":nr,"file-undo":ar,"file-move":or,"chevron-double-left":sr,"chevron-double-right":ir,"chevron-left":cr,"chevron-right":lr,"chevron-down":hr,"chevron-up":dr,pause:pr,play:ur,replay:fr,check:gr,"check-circle":mr,circle:yr,stop:br,"checkbox-blank":br,"checkbox-marked":kr,delete:vr,undo:xr,alert:wr,warning:Mr,database:Er,tools:zr,cog:Cr,close:Sr,cat:Rr,upload:$r,trash:vr,pencil:jr,dashboard:Ar,search:Nr,folder:Or,"folder-open":_r,image:qr,"image-multiple-outline":Ir,plus:Pr,"folder-plus":Tr,"image-plus":Lr,"view-grid":Hr,list:er,twitter:Br,instagram:Vr,facebook:Wr,star:Fr,"timer-outline":Dr,link:Yr,linkedin:Gr,pinterest:Xr,"zoom-in":Ur,"info-outline":Zr,"image-off-outline":Kr,"arrow-up":Qr,"arrow-down":Jr,"arrow-left":en,"arrow-right":tn,sort:rn,"alert-triangle":Mr,"alert-circle":wr,"pause-circle":nn,brain:an,console:on,terminal:on,clipboard:sn,copy:tr,"list-checks":cn,server:ln,key:hn,user:dn,plug:pn,eye:un,"eye-off":fn,"rocket-launch":gn,"calendar-month":mn,wand:yn,mastodon:bn,filter:kn,question:vn,loading:xn,new:wn,save:Mn,reset:En,rename:zn,edit:zn,sync:Cn,lightning:Sn,zap:Sn,refresh:Cn,"file-upload":Rn,sparkles:$n,debug:jn,retina:An,feather:Nn,"external-link":On,download:_n,share:qn,mail:In,phone:Pn,message:Tn,bell:Ln,home:Hn,clean:Bn,book:Vn},Dn=ReactDOM;var Yn=r.n(Dn);r(442);const Gn=(...t)=>(0,e.useMemo)(()=>{const e=[];return t.forEach(t=>{if("string"==typeof t){const r=t.trim().split(" ").filter(e=>e.length>0);r.forEach(t=>e.push(t))}else"object"==typeof t&&Object.keys(t).forEach(r=>{t[r]&&e.push(r)})}),e.join(" ")},[t]),Xn=Dt.div`
  display: inline-block;
`,Un=Dt.div`
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  color: var(--neko-white);
  font-family: var(--neko-font-family);
  font-weight: normal;
  font-size: var(--neko-font-size);
  padding: 8px 12px;
  max-width: ${e=>e.$maxWidth}px;
  width: max-content;
  word-break: break-word;
  white-space: normal;
  pointer-events: ${e=>e.visible?"auto":"none"};
  opacity: ${e=>e.visible?1:0};
  transition: opacity 0.15s ease-in-out, transform 0.25s ease-in-out;
  position: absolute;
  z-index: 100;
  transform: ${e=>{const t="5px",r="15px";if(e.visible)switch(e.position){case"top":return`translateX(-50%) translateY(calc(-100% - ${t}))`;case"bottom":return`translateX(-50%) translateY(${t})`;case"left":return`translateX(calc(-100% - ${t})) translateY(-50%)`;case"right":return`translateX(${t}) translateY(-50%)`;default:return""}else switch(e.position){case"top":return`translateX(-50%) translateY(calc(-100% - ${r}))`;case"bottom":return`translateX(-50%) translateY(${r})`;case"left":return`translateX(calc(-100% - ${r})) translateY(-50%)`;case"right":return`translateX(${r}) translateY(-50%)`;default:return""}}};
  &:before {
    content: '';
    position: absolute;
    border: 4px solid transparent;
    ${e=>{switch(e.position){case"top":return"\n            bottom: -8px;\n            left: 50%;\n            margin-left: -4px;\n            border-top: 4px solid rgba(0, 0, 0, 0.8);\n          ";case"bottom":return"\n            top: -8px;\n            left: 50%;\n            margin-left: -4px;\n            border-bottom: 4px solid rgba(0, 0, 0, 0.8);\n          ";case"left":return"\n            top: 50%;\n            right: -8px;\n            margin-top: -4px;\n            border-left: 4px solid rgba(0, 0, 0, 0.8);\n          ";case"right":return"\n            top: 50%;\n            left: -8px;\n            margin-top: -4px;\n            border-right: 4px solid rgba(0, 0, 0, 0.8);\n          ";default:return""}}}
  }
`,Zn=r=>{const{text:n="Hello world!",position:a="top",maxWidth:o=160}=r,[s,i]=(0,e.useState)(!1),c=(t=>{const r=(0,e.useRef)(null);return(0,e.useEffect)(()=>()=>{r.current&&clearTimeout(r.current)},[]),(0,e.useCallback)((...e)=>{r.current&&clearTimeout(r.current),r.current=setTimeout(()=>{t(...e)},100)},[t,100])})(e=>i(e)),[l,h]=(0,e.useState)({top:0,left:0}),d=(0,e.useRef)(null);return(0,e.useEffect)(()=>{if(s&&d.current){const e=d.current.getBoundingClientRect();let t=0,r=0;const n=window.scrollY||window.pageYOffset,o=window.scrollX||window.pageXOffset;switch(a){case"top":t=e.top+n,r=e.left+e.width/2+o;break;case"bottom":t=e.bottom+n,r=e.left+e.width/2+o;break;case"left":t=e.top+e.height/2+n,r=e.left+o;break;case"right":t=e.top+e.height/2+n,r=e.right+o}h({top:t,left:r})}},[s,a]),t().createElement(Xn,{className:"neko-tooltip",ref:d,style:r.style,onMouseEnter:()=>n&&c(!0),onMouseLeave:()=>c(!1)},r.children,Yn().createPortal(t().createElement(Un,{visible:s,position:a,$maxWidth:o,style:{top:l.top,left:l.left}},"string"==typeof n?n.split("\n").map((e,r)=>t().createElement(t().Fragment,{key:r},e,t().createElement("br",null))):n),document.body))},Kn=e=>e.text?t().createElement(Zn,e):e.children||null;Kn.propTypes={style:a().object,text:a().string,position:a().oneOf(["top","right","bottom","left"]),maxWidth:a().number};const Qn=Dt.div`
  display: flex;
  align-items: center;

  &.neko-clickable {
    cursor: pointer;
  }

  &.spin svg {
    animation-name: spin;
    animation-duration: 700ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }

  &.disabled {
    pointer-events: none;
    opacity: 0.35;
    cursor: default;
  }

  svg {
    color: ${e=>e.$color};
    transition: color 0.2s ease;
  }

  &:hover svg {
    color: ${e=>e.$hoverColor||e.$color};
    filter: ${e=>!e.$hoverColor&&e.$color?"brightness(1.1)":"none"};
  }
`,Jn=Dt.div`
  width: 25px;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: auto !important;
    height: 25px !important;
  }
`,ea={primary:{color:"var(--neko-blue)"},success:{color:"var(--neko-green)"},warning:{color:"var(--neko-yellow)"},danger:{color:"var(--neko-red)"}},ta=r=>{let{icon:n,color:a,spinning:o=!1,className:s="",tooltip:i,raw:c,isBusy:l=!1,busy:h=!1,variant:d,title:p,containerStyle:u,hoverColor:f,disabled:g=!1,width:m,height:y,strokeWidth:b,...k}=r;const v=h||l;t().useEffect(()=>{l&&console.log('NekoIcon: The "isBusy" prop is deprecated. Please use "busy" instead.')},[l]);const x=d&&ea[d]?ea[d].color:a,w=d&&ea[d]?ea[d].hoverColor:f,M="string"==typeof n&&Wn[n]?Wn[n]:void 0,E=m||y||30,z=(0,e.useMemo)(()=>"string"==typeof n?Fn[n]?Fn[n]:(console.warn(`NekoIcon: Icon "${n}" does not exist. Falling back to placeholder.`),vn):n,[n]),C=(0,e.useMemo)(()=>"string"==typeof n||"function"==typeof z||"object"==typeof z,[n,z]),S=Gn("neko-icon",s,{"neko-clickable":!!k.onClick},{spin:o||v},{disabled:g}),R=()=>{if(v&&!g)return t().createElement(xn,{size:E,className:"spin",strokeWidth:b});if(C){const e=z,{width:r,height:n,fill:a,...o}=k;return t().createElement(e,{size:E,fill:a||M||"none",strokeWidth:b,...o})}return t().createElement(Jn,null,z)};if(i)return"string"==typeof i&&(i={text:i}),t().createElement(Kn,{text:i.text,position:i.position||"top"},t().createElement(Qn,{style:u,className:S,$color:x,$hoverColor:w,title:p},R()));if(c){if(C){const e=z,{width:r,height:n,fill:a,...o}=k;return t().createElement(e,{size:E,color:x,fill:a||M||"none",className:S,strokeWidth:b,...o})}return t().createElement(Jn,null,z)}return t().createElement(Qn,{style:u,title:p,className:S,$color:x,$hoverColor:w},R())};function ra(){return ra=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)({}).hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},ra.apply(null,arguments)}ta.propTypes={icon:a().oneOfType([a().elementType,a().oneOf(["duplicate","lock","lock-open","file-undo","chevron-double-left","chevron-double-right","chevron-left","chevron-right","chevron-down","chevron-up","pause","play","replay","check","check-circle","stop","checkbox-blank","checkbox-marked","delete","undo","alert","database","tools","cog","close","cat","upload","trash","pencil","dashboard","search","folder","folder-open","image-multiple-outline","plus","folder-plus","image-plus","view-grid","list","twitter","instagram","facebook","star","timer-outline","link","linkedin","pinterest","zoom-in","info-outline","image-off-outline","arrow-up","arrow-down","sort","eye","rocket-launch","calendar-month","wand","mastodon","filter","question","loading","new","save","reset","rename","edit","debug","external-link","download","share","mail","phone","message","bell","home"])]),color:a().string,spinning:a().bool,className:a().string,tooltip:a().string,raw:a().bool,busy:a().bool,isBusy:a().bool,variant:a().string};const na=e=>e.split(",").map(e=>e.trim()).filter(e=>e.length>0),aa=(r,n)=>{const{type:a="text",name:o,value:s="",description:i,placeholder:c="",onChange:l,onEnter:h,onBlur:d,onFinalChange:p,readOnly:u=!1,step:f=1,min:g=0,max:m=null,maxLength:y,natural:b=!1,onReset:k,isCommaSeparatedArray:v=!1,iconEmpty:x="",iconFilled:w="",onEmptyIconClick:M,onFilledIconClick:E,action:z,className:C,style:S,inputStyle:R,...$}=r,[j,A]=(0,e.useState)(s||0===s?s:""),[N,O]=(0,e.useState)(!1),_=!!l,q=(0,e.useRef)(null),[I,P]=(0,e.useState)(0);(0,e.useLayoutEffect)(()=>{if(!z||!q.current)return void P(0);const e=q.current,t=()=>P(e.offsetWidth);t();const r=new ResizeObserver(t);return r.observe(e),()=>r.disconnect()},[z]);const T="password"===a,L=T&&!x&&!w,H=T&&N?"text":a,B=y||("number"===a?3:void 0);(0,e.useEffect)(()=>{p&&(h||d)&&console.warn("NekoInput: Since onFinalChange is used, onEnter and onBlur are redundant.")},[p,h,d]),(0,e.useEffect)(()=>{var e;_||A(v?(e=s,Array.isArray(e)||(console.warn("The provided value is not an array. Falling back to an empty array."),e=[]),e.join(", ")):s)},[s]);const V=e=>{const t=e.target.value,r=v?na(t):t;e.stopPropagation(),e.preventDefault(),_?l(r,o):A(t)},W=e=>{if("Enter"===e.key){e.preventDefault();const t=e.target.value,r=v?na(t):t;p?p(r,o):h&&h(r,o)}},F=e=>{const t=e.target.value,r=v?na(t):t,n=v?((e,t)=>{if(!Array.isArray(e)||!Array.isArray(t)||e.length!==t.length)return!1;for(let r=0;r<e.length;r++)if(e[r]!==t[r])return!1;return!0})(s,r):s===r;n||(p?p(r,o):d&&d(r,o))},D=Gn("neko-input",{natural:b}),Y=()=>{const e=_?s:j;return v?!!Array.isArray(e)&&e.length>0:e&&""!==e&&0!==e},G=x||w||L,X=Boolean(Y()&&w),U=Boolean(!Y()&&x);return t().createElement("div",{className:C,style:S},t().createElement("div",{style:{position:"relative"}},"number"===a?t().createElement("input",ra({ref:n,className:D,name:o,value:_?s:j,type:a,disabled:u,step:f,min:g,max:m,maxLength:B,autoComplete:"off","data-form-type":"other",placeholder:c,style:{...R,paddingRight:z?`${I+10}px`:G?"30px":void 0},onChange:V,onKeyPress:W,onBlur:e=>{(e=>{const t=Number(e.target.value);g&&t<Number(g)?e.target.value=g:m&&t>Number(m)&&(e.target.value=m)})(e),F(e)},readOnly:u},$)):t().createElement("input",ra({ref:n,className:D},$,{name:o,value:_?s:j,type:H,disabled:u,spellCheck:"false",autoComplete:"off","data-form-type":"other",placeholder:c,style:{...R,paddingRight:z?`${I+10}px`:G?"30px":void 0},maxLength:B,onChange:V,onKeyPress:W,onBlur:F,readOnly:u},$)),z&&t().createElement("div",{className:"neko-input-action",ref:q},z),!!s&&!!k&&t().createElement(ta,{icon:"close",width:24,style:{position:"absolute",top:"3px",right:"3px"},variant:"blue",onClick:()=>k()}),U&&t().createElement(ta,{icon:x,width:15,style:{position:"absolute",top:"50%",right:"8px",transform:"translateY(-50%)",pointerEvents:M?"auto":"none",cursor:M?"pointer":"default"},color:"#5a5a5a82",onClick:M}),X&&t().createElement(ta,{icon:w,width:15,style:{position:"absolute",top:"50%",right:"8px",transform:"translateY(-50%)",pointerEvents:E?"auto":"none",cursor:E?"pointer":"default"},color:"var(--neko-blue)",onClick:E}),L&&t().createElement(ta,{icon:N?"eye-off":"eye",width:15,style:{position:"absolute",top:"50%",right:"8px",transform:"translateY(-50%)",cursor:"pointer"},color:"#5a5a5a82",onClick:()=>O(e=>!e)})),i&&("string"==typeof i?t().createElement("p",{className:"neko-input-description",dangerouslySetInnerHTML:{__html:i}}):t().createElement("p",{className:"neko-input-description"},i)))},oa=Dt((0,e.forwardRef)(aa))`
  .neko-input {
    font-family: var(--neko-font-family);
    font-size: var(--neko-font-size);
    border: 1.5px solid var(--neko-input-border);
    box-sizing: border-box;
    height: var(--neko-control-height);
    /* WP 7 admin CSS sets min-height: 40px on bare input[type="text"] etc.,
       which overrides our height. Explicitly reset it so Neko's height wins. */
    min-height: 0;
    background: var(--neko-input-background);
    color: black;
    padding: 0 10px;
    width: 100%;
    border-radius: var(--neko-radius-md);
    transition: background 0.3s ease, box-shadow 0.2s ease, opacity 0.3s ease, border-color 0.3s ease;

    &.natural {
      border-color: gray;
      border-width: 1px;
    }

    &::placeholder {
      color: rgba(0, 0, 0, 0.25);
    }

    &:focus {
      background-color: white;
      outline: none;
    }

    /* Keyboard-only focus ring — the global --neko-focus-ring shadow + a
       brand-tinted border so tabbing through a form is always visible.
       Mouse clicks won't trigger this (browser distinguishes :focus from
       :focus-visible). */
    &:focus-visible {
      outline: none;
      border-color: color-mix(in oklab, var(--neko-main-color) 60%, transparent);
      box-shadow: var(--neko-focus-ring);
    }

    &:read-only {
      color: var(--neko-gray-60);
    }

    &:disabled {
      color: var(--neko-gray-60);
      background: var(--neko-gray-98);
      border-color: var(--neko-disabled-color);
      box-shadow: none;
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  /* Embedded action — sits flush inside the field on the right. Any NekoButton
     dropped in here auto-shrinks to fit the control height (label or icon-only),
     so callers just pass a normal <NekoButton>. See PATTERNS.md "Embedded field
     action". */
  .neko-input-action {
    position: absolute;
    top: 50%;
    right: 4px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;

    .neko-button {
      height: calc(var(--neko-control-height) - 8px);
      min-height: calc(var(--neko-control-height) - 8px);
      min-width: 0;
      padding: 0 10px;
      border-radius: 6px;
      /* Compact "micro-action" label — uppercase + tiny + bold reads as an
         affordance inside the field rather than a full button. */
      text-transform: uppercase;
      font-size: 10px;
      font-weight: bold;
    }

    /* Icon-only embedded button → square, no side padding. */
    .neko-button.has-icon:not(:has(.button-text)) {
      width: calc(var(--neko-control-height) - 8px);
      padding: 0;
    }
  }

  .neko-input-description {
    font-size: var(--neko-small-font-size);
    color: var(--neko-gray-60);
    line-height: 14px;
    margin-top: 5px;
    margin-bottom: 0;

    code {
      font-size: 9px;
      background: #016fba14;
      border-radius: 5px;
      padding: 2px 4px;
    }
  }
`,sa=t().forwardRef((e,r)=>t().createElement(oa,ra({ref:r},e)));function ia(){return ia=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)({}).hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},ia.apply(null,arguments)}sa.propTypes={type:a().oneOf(["number","text","password"]),name:a().string,value:a().oneOfType([a().string,a().array]),description:a().string,placeholder:a().string,onChange:a().func,onEnter:a().func,onBlur:a().func,onFinalChange:a().func,readOnly:a().bool,step:a().number,min:a().number,max:a().number,maxLength:a().number,natural:a().bool,onReset:a().func,isCommaSeparatedArray:a().bool,iconEmpty:a().string,iconFilled:a().string,onEmptyIconClick:a().func,onFilledIconClick:a().func,action:a().node};const ca=Dt.a`
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg,
    var(--neko-orange, #f97316),
    color-mix(in oklab, var(--neko-orange, #f97316) 75%, var(--neko-red, #dc2626))
  );
  position: relative;
  border-radius: 4px;
  color: white !important;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.4px;
  line-height: 1;
  padding: 3px 5px;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
  transition: filter 0.2s var(--neko-ease-out), transform 0.2s var(--neko-ease-spring);

  &:hover {
    filter: brightness(1.06);
    transform: translateY(-0.5px);
  }

  &.inline {
    display: inline-flex;
    margin-left: 6px;
    vertical-align: middle;
  }
`,la=e=>{const{show:r=!0,className:n,...a}=e,o=Gn("neko-pro-only",n);return r?t().createElement(ca,ia({href:"https://meowapps.com",target:"_blank",className:o},a),"Pro"):null},ha=e=>t().createElement(la,e);function da(){return da=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)({}).hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},da.apply(null,arguments)}ha.propTypes={show:a().bool,className:a().string};const pa=Dt(r=>{let{className:n="primary",variant:a,disabled:o=!1,icon:s=null,color:i=null,onClick:c=()=>{},onStopClick:l=null,rounded:h,isBusy:d=!1,busy:p=!1,spinning:u=!1,disabledColor:f=null,busyText:g,hideBusyIcon:m=!1,busyIconSize:y,requirePro:b=!1,isPro:k=!1,small:v,large:x,width:w,height:M,fullWidth:E,startTime:z=null,progress:C=null,ai:S=!1,children:R,...$}=r;const j=p||d;t().useEffect(()=>{d&&console.log('NekoButton: The "isBusy" prop is deprecated. Please use "busy" instead.')},[d]);const A=t().useRef(null),N=t().useRef(null),[O,_]=t().useState(null);t().useLayoutEffect(()=>{A.current&&!N.current&&(N.current=A.current.offsetWidth)}),t().useEffect(()=>{if(!j&&!l){const e=setTimeout(()=>{_(null)},300);return()=>clearTimeout(e)}},[j,l]),t().useEffect(()=>{n&&["primary","primary-block","secondary","danger","success","warning","header"].includes(n)&&!a&&console.warn(`NekoButton: Using 'className' prop for button variants is deprecated. Please use 'variant' prop instead. Found className="${n}"`)},[n,a]);const q=a||(["primary","primary-block","secondary","danger","success","warning","header"].includes(n)?n:"primary"),I=n&&!["primary","primary-block","secondary","danger","success","warning","header"].includes(n)?n:"";t().useEffect(()=>{S&&(a||["secondary","danger","success","warning","header"].includes(q))&&console.warn('NekoButton: The "ai" property doesn\'t need a variant. The ai styling will override the variant styling.')},[S,a,q]);const P=o||b&&!k,T=!!s,L=b&&!k,H=!!l&&j,B=(0,e.useMemo)(()=>{let e="number"==typeof w?w:30;return v&&(e*=.8),x&&(e*=1.3),"header"===q||n&&n.includes("header")?20:h?e-12:e-14},[w,h,v,x,q,n]),[V,W]=(0,e.useState)(null);((t,r)=>{const n=(0,e.useRef)();(0,e.useEffect)(()=>{n.current=t},[t]),(0,e.useEffect)(()=>{if(null!==r){let e=setInterval(()=>{n.current()},r);return()=>clearInterval(e)}},[r])})(()=>W(new Date),z?1e3:null),(0,e.useEffect)(()=>{z||W(null)},[z]);const F=(0,e.useMemo)(()=>{if(!z||!V)return null;const e=Math.floor((V-z)/1e3),t=e%60;return`${Math.floor(e/60).toString().padStart(2,"0")}:${t.toString().padStart(2,"0")}`},[V,z]),D=Gn("neko-button",q,I,{"has-icon":T},{"custom-color":i},{small:v},{large:x},{rounded:h},{busy:j},{"is-pro":L},{full:E},{"has-stop":H},{ai:S});return t().createElement("button",da({ref:A,type:"button",className:D,onClick:e=>{if(!j&&A.current){const e=l&&N.current?N.current:A.current.offsetWidth;_(e)}P||H||c(),e.stopPropagation(),e.preventDefault()},disabled:P&&!(j&&H),style:j&&O?{minWidth:`${O}px`,width:`${O}px`}:void 0},$),j&&null!==C&&C>0&&t().createElement("div",{className:"progress-bar",style:{width:`${C}%`}}),j&&!H&&!m&&t().createElement("div",{className:"busy-wrapper"},t().createElement("div",{className:"busy-icon"},t().createElement(ta,{raw:!0,icon:"sync",width:16,height:16})),null!==C&&C>=0&&t().createElement("span",{className:"progress-percentage"},Math.round(C),"%"),F&&t().createElement("span",{className:"chrono-time"},F)),!j&&!H&&t().createElement("div",{className:"normal-content"},T&&!h&&!!R&&t().createElement("div",{className:"icon-section"},t().createElement(ta,{raw:!0,icon:s,width:B,height:B,spinning:u,strokeWidth:h&&v?3:void 0})),T&&!h&&!R&&t().createElement(ta,{raw:!0,icon:s,width:B,height:B,spinning:u,style:{margin:"0 auto"},strokeWidth:h&&v?3:void 0}),T&&h&&t().createElement(ta,{raw:!0,icon:s,width:B,height:B,spinning:u,style:{margin:"0 auto"},strokeWidth:h&&v?3:void 0}),!!R&&t().createElement("span",{className:T&&!h?"button-text":""},R)),H&&t().createElement(t().Fragment,null,t().createElement("div",{className:"busy-icon"},t().createElement(ta,{raw:!0,icon:"sync",width:16,height:16})),t().createElement("div",{className:"stop-section",onClick:e=>{e.stopPropagation(),l()}},t().createElement(ta,{raw:!0,icon:"stop",width:"14",height:"14"}))),L&&t().createElement(ha,{style:{marginLeft:"8px"}}))})`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: var(--neko-control-height);
  min-height: var(--neko-control-height);
  min-width: 36px;
  border: none;
  border-radius: 7px;
  text-align: center;
  padding: 0 14px;
  vertical-align: middle;
  font-family: inherit;
  font-size: var(--neko-font-size);
  font-weight: 500;
  letter-spacing: 0;
  /* A subtle vertical gradient + inner top highlight gives the primary fill
     a touch of dimensionality without being glossy. Feels considered, not stock. */
  background:
    linear-gradient(180deg,
      color-mix(in oklab, var(--neko-main-color) 94%, white) 0%,
      var(--neko-main-color) 55%,
      color-mix(in oklab, var(--neko-main-color) 94%, black) 100%);
  color: white;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 1px 2px rgba(15, 23, 42, 0.15);
  transition:
    background 0.2s var(--neko-ease-out),
    box-shadow 0.2s var(--neko-ease-out),
    transform 0.22s var(--neko-ease-spring),
    filter 0.2s var(--neko-ease-out),
    opacity 0.2s ease;
  will-change: transform, box-shadow, filter;
  overflow: hidden;
  
  /* Progress bar styling */
  .progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: var(--neko-green);
    transition: width 0.3s ease;
    z-index: 0;
    opacity: 0.5;
    mix-blend-mode: overlay;
  }
  
  /* Ensure content appears above progress bar */
  .busy-wrapper,
  .normal-content,
  .busy-icon,
  .stop-section,
  .chrono-time,
  .progress-percentage {
    position: relative;
    z-index: 1;
  }

  span {
    white-space: nowrap;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
  }

  .chrono-time {
    font-size: 11px;
  }

  .progress-percentage {
    font-size: 11px;
    font-weight: 600;
  }

  &:not([disabled]):hover {
    cursor: pointer;
    filter: brightness(1.04);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.22),
      0 4px 12px color-mix(in oklab, var(--neko-main-color) 28%, transparent),
      0 1px 2px rgba(15, 23, 42, 0.15);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    filter: saturate(0.7);
  }

  &:focus { outline: none; }
  &:focus-visible {
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.18),
      0 1px 2px rgba(15, 23, 42, 0.15),
      var(--neko-focus-ring);
  }

  &:active:not([disabled]) {
    transform: translateY(0) scale(0.985);
    box-shadow:
      inset 0 2px 3px rgba(0, 0, 0, 0.15),
      0 1px 1px rgba(15, 23, 42, 0.1);
    transition-duration: 80ms;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:not([disabled]):hover { transform: none; box-shadow: var(--neko-shadow-xs); }
  }


  &.is-pro {
    background-image: none;
    background-color: var(--neko-main-color-disabled);
    color: rgb(255 255 255 / 65%);
    align-items: center;
    opacity: 1;
  }

  &.has-icon {
    align-items: center;
    position: relative;

    svg {
      color: white;
    }
  }

  /* Secondary — quiet off-white chip that pairs with the bold primary.
     Flat fill (no gradient) keeps it calm; the border does the work. */
  &.secondary {
    background: color-mix(in oklab, var(--neko-main-color) 3%, white);
    color: var(--neko-main-color);
    border: 1px solid color-mix(in oklab, var(--neko-main-color) 18%, transparent);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.6),
      0 1px 1px rgba(15, 23, 42, 0.04);

    svg {
      color: var(--neko-main-color);
    }

    &:not([disabled]):hover {
      background: color-mix(in oklab, var(--neko-main-color) 7%, white);
      border-color: color-mix(in oklab, var(--neko-main-color) 32%, transparent);
      filter: none;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.7),
        0 2px 6px rgba(15, 23, 42, 0.06);
      transform: translateY(-1px);
    }

    &:focus-visible {
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.6),
        var(--neko-focus-ring);
    }

    .icon-section {
      border-right-color: color-mix(in oklab, var(--neko-main-color) 18%, transparent);
    }
  }

  /* Semantic variants — flat fill, tinted hover glow that matches each color. */
  &.danger {
    background:
      linear-gradient(180deg,
        color-mix(in oklab, var(--neko-danger) 94%, white) 0%,
        var(--neko-danger) 55%,
        color-mix(in oklab, var(--neko-danger) 94%, black) 100%);
    border-color: var(--neko-danger);

    &:not([disabled]):hover {
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.22),
        0 4px 12px color-mix(in oklab, var(--neko-danger) 30%, transparent),
        0 1px 2px rgba(15, 23, 42, 0.15);
    }
  }

  &.success {
    background:
      linear-gradient(180deg,
        color-mix(in oklab, var(--neko-accent-color) 94%, white) 0%,
        var(--neko-accent-color) 55%,
        color-mix(in oklab, var(--neko-accent-color) 94%, black) 100%);
    border-color: var(--neko-accent-color);

    &:not([disabled]):hover {
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.22),
        0 4px 12px color-mix(in oklab, var(--neko-accent-color) 30%, transparent),
        0 1px 2px rgba(15, 23, 42, 0.15);
    }
  }

  &.warning {
    background:
      linear-gradient(180deg,
        color-mix(in oklab, var(--neko-warning) 94%, white) 0%,
        var(--neko-warning) 55%,
        color-mix(in oklab, var(--neko-warning) 94%, black) 100%);
    border-color: var(--neko-warning);

    &:not([disabled]):hover {
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.22),
        0 4px 12px color-mix(in oklab, var(--neko-warning) 30%, transparent),
        0 1px 2px rgba(15, 23, 42, 0.15);
    }
  }

  /* Safety-net spacing for sibling buttons — preferred practice is parent
     flex gap, but many existing plugin layouts render buttons as plain
     inline-block siblings. 5px keeps those from touching; with a gap-based
     parent, the effective spacing becomes parent-gap + 5px. */
  & + button.neko-button {
    margin-left: 5px;
  }

  &.small {
    font-size: var(--neko-small-font-size);
    height: var(--neko-control-height-small);
    min-height: var(--neko-control-height-small);
    border-radius: 6px;
    padding: 0 10px;
  }

  &.large {
    height: var(--neko-control-height-large);
    min-height: var(--neko-control-height-large);
    font-size: 15px;
    padding: 0 20px;
    border-radius: 9px;
  }

  /* Header variant — ghost glass button for use on the branded NekoHeader.
     Stays glassy throughout; hover just brightens the glass + lifts softly. */
  &.header {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.26);
    height: 38px;
    padding: 0 16px;
    font-weight: 500;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
    transition:
      background 0.3s var(--neko-ease-out),
      border-color 0.3s var(--neko-ease-out),
      box-shadow 0.3s var(--neko-ease-out),
      transform 0.3s var(--neko-ease-spring);

    svg { color: white; }

    &:hover {
      background: rgba(255, 255, 255, 0.22);
      border-color: rgba(255, 255, 255, 0.5);
      filter: none;
      box-shadow:
        0 6px 18px rgba(0, 0, 0, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.22);
      transform: translateY(-1px);
    }

    &:active:not([disabled]) {
      transform: translateY(0);
      background: rgba(255, 255, 255, 0.16);
    }

    /* Kill the shimmer sweep from the base primary — ghost doesn't need it */
    &::after { display: none; }

    .icon-section {
      border-right: none;
    }
  }

  /* Apply width/height if provided */
  ${e=>e.width&&"string"==typeof e.width?`width: ${e.width};`:""}
  ${e=>e.width&&"number"==typeof e.width?`width: ${e.width}px;`:""}
  ${e=>e.height&&"string"==typeof e.height?`height: ${e.height};`:""}
  ${e=>e.height&&"number"==typeof e.height?`height: ${e.height}px;`:""}

  &.rounded {
    border-radius: 50%;
    padding: 0;
    /* Explicit size with matching min-height overrides the base 30px min-height,
       otherwise rounded buttons end up 30×30 (oval). */
    --neko-rounded-size: ${e=>e.width??(e.large?50:30)}px;
    width: var(--neko-rounded-size);
    height: ${e=>e.height??"var(--neko-rounded-size)"};
    min-width: var(--neko-rounded-size);
    min-height: var(--neko-rounded-size);
    /* Rounded elevation — a real dark drop shadow (works on any background,
       including the brand-blue tab bar) stacked with a colored halo that
       blooms on light surfaces. The inset highlight sells the "lifted" feel. */
    box-shadow:
      0 6px 14px rgba(15, 23, 42, 0.22),
      0 2px 4px rgba(15, 23, 42, 0.12),
      0 0 0 1px rgba(15, 23, 42, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.28);

    &.small {
      --neko-rounded-size: 24px;
      box-shadow:
        0 3px 8px rgba(15, 23, 42, 0.2),
        0 1px 2px rgba(15, 23, 42, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.22);
    }

    &.success {
      box-shadow:
        0 6px 14px rgba(15, 23, 42, 0.22),
        0 2px 4px rgba(15, 23, 42, 0.12),
        0 0 0 1px color-mix(in oklab, var(--neko-accent-color) 40%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    &.danger {
      box-shadow:
        0 6px 14px rgba(15, 23, 42, 0.22),
        0 2px 4px rgba(15, 23, 42, 0.12),
        0 0 0 1px color-mix(in oklab, var(--neko-danger) 40%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    /* Hover lifts harder — shadow spreads further, inset highlights brighten.
       No translateY — rounded buttons stay put; the icon rotation + deeper
       shadow is the feedback. */
    &:not([disabled]):hover {
      transform: none;
      box-shadow:
        0 10px 22px rgba(15, 23, 42, 0.28),
        0 3px 6px rgba(15, 23, 42, 0.14),
        0 0 0 1px rgba(15, 23, 42, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.34);
    }
    &.success:not([disabled]):hover {
      box-shadow:
        0 10px 22px rgba(15, 23, 42, 0.28),
        0 3px 6px rgba(15, 23, 42, 0.14),
        0 0 0 1px color-mix(in oklab, var(--neko-accent-color) 50%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.36);
    }
    &.danger:not([disabled]):hover {
      box-shadow:
        0 10px 22px rgba(15, 23, 42, 0.28),
        0 3px 6px rgba(15, 23, 42, 0.14),
        0 0 0 1px color-mix(in oklab, var(--neko-danger) 50%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.36);
    }

    /* Icon micro-animations on hover — each variant gets its own character */
    svg {
      transition: transform 0.35s var(--neko-ease-spring);
    }
    /* Success + → rotates 90° (add intent) */
    &.success:not([disabled]):hover svg {
      transform: rotate(90deg);
    }
    /* Primary (edit, push, etc.) → gentle tilt + bump */
    &.primary:not([disabled]):hover svg {
      transform: rotate(-8deg) scale(1.08);
    }
    /* Danger (trash) → nervous shake-ish tilt */
    &.danger:not([disabled]):hover svg {
      transform: rotate(8deg) scale(1.08);
    }
  }

  /* Normal content animation */
  .normal-content {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
    transform: scale(1);
    transition: opacity 0.3s ease, transform 0.3s ease;
    width: 100%;
  }

  /* Icon section with separator */
  .icon-section {
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    padding: 0 7px;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
  }

  /* Button text styling when icon is present */
  .button-text {
    white-space: nowrap;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: center;
    padding-left: 40px; /* Space for icon section */
  }

  /* Adjust padding for buttons with icons and text */
  &.has-icon:not(.rounded):has(.button-text) {
    padding-left: 0;
    text-align: center;
  }

  /* Busy state animations */
  &.busy:not(.has-stop) {
    pointer-events: none;
    overflow: hidden;
    
    .normal-content {
      opacity: 0;
      transform: scale(0.8);
      position: absolute;
      visibility: hidden;
    }
    
    .busy-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      width: 100%;
      animation: fadeIn 0.3s ease forwards;

      .busy-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        animation: slideInRotate 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;

        svg {
          animation: rotate 1.5s linear infinite;
        }
      }
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideInRotate {
    from {
      transform: translateX(-20px) rotate(-180deg) scale(0);
      opacity: 0;
    }
    to {
      transform: translateX(0) rotate(0deg) scale(1);
      opacity: 1;
    }
  }
  
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  &.has-stop {
    position: relative;
    pointer-events: none;
    padding-right: 35px; /* Space for stop section */
    padding-left: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .busy-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      animation: fadeIn 0.3s ease forwards;
      
      svg {
        animation: rotate 1.5s linear infinite;
        color: white;
      }
    }
    
    .stop-section {
      position: absolute;
      right: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 10px;
      height: 100%;
      border-left: 1px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
      pointer-events: auto;
      transition: background-color 0.2s ease;
      
      svg {
        color: white;
        
        rect {
          transition: fill 0.2s ease;
        }
      }
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        
        svg {
          rect {
            fill: var(--neko-red);
          }
        }
      }
    }
  }

  &.full {
    width: 100%;
  }

  /* AI button — one gradient, one soft glow. No sparkles, no border halo.
     The slow hue drift already reads as "AI"; stacking more effects cheapens it. */
  &.ai {
    position: relative;
    background: linear-gradient(
      120deg,
      #6366f1 0%,
      #a855f7 50%,
      #ec4899 100%
    );
    background-size: 200% 100%;
    animation: aiFlow 10s ease-in-out infinite;
    color: white;
    border: none;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.22),
      0 1px 2px rgba(15, 23, 42, 0.15),
      0 4px 14px color-mix(in oklab, #a855f7 22%, transparent);

    @keyframes aiFlow {
      0%, 100% { background-position: 0% 50%; }
      50%      { background-position: 100% 50%; }
    }

    &:disabled {
      animation: none;
    }

    &:not([disabled]):hover {
      animation-duration: 6s;
      transform: translateY(-1px);
      filter: brightness(1.04);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.26),
        0 1px 2px rgba(15, 23, 42, 0.15),
        0 6px 18px color-mix(in oklab, #a855f7 30%, transparent);
    }

    &:focus-visible {
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.22),
        0 1px 2px rgba(15, 23, 42, 0.15),
        var(--neko-focus-ring);
    }
  }

  ${e=>ua(e.color)}
`,ua=e=>{if(e){const t=/^#|^rgb\(|^rgba\(|^hsl\(/.test(e),r=t?e:`var(--neko-${e})`;return`\n      &.custom-color {\n        background:\n          linear-gradient(180deg,\n            color-mix(in oklab, ${r} 94%, white) 0%,\n            ${r} 55%,\n            color-mix(in oklab, ${r} 94%, black) 100%);\n        border: 1px solid ${t?e:`var(--neko-${e})`};\n        color: white;\n\n        &:not([disabled]):hover {\n          filter: brightness(1.08);\n          box-shadow:\n            inset 0 1px 0 rgba(255, 255, 255, 0.22),\n            0 4px 12px color-mix(in oklab, ${r} 28%, transparent),\n            0 1px 2px rgba(15, 23, 42, 0.15);\n        }\n      }\n    `}},fa=e=>t().createElement(pa,e);fa.propTypes={className:a().string,variant:a().oneOf(["primary","primary-block","secondary","danger","success","warning","header"]),disabled:a().bool,icon:a().oneOfType([a().object,a().oneOf(["setting","edit","trash"])]),color:a().string,onClick:a().func.isRequired,onStopClick:a().func,rounded:a().bool,busy:a().bool,isBusy:a().bool,spinning:a().bool,busyText:a().string,hideBusyIcon:a().bool,busyIconSize:a().string,requirePro:a().bool,isPro:a().bool,disabledColor:a().string,small:a().bool,large:a().bool,progress:a().number,ai:a().bool};const{useState:ga,useEffect:ma,useMemo:ya}=wp.element,ba=React.createElement("g",null,React.createElement("g",null,React.createElement("path",{d:"m391 81h30v-66c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15z",fill:"#39326c"}),React.createElement("path",{d:"m331 81h30v-66c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15z",fill:"#39326c"}),React.createElement("path",{d:"m271 81h30v-66c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15z",fill:"#39326c"}),React.createElement("path",{d:"m211 81h30v-66c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15z",fill:"#5f55af"}),React.createElement("path",{d:"m151 81h30v-66c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15z",fill:"#5f55af"}),React.createElement("path",{d:"m91 81h30v-66c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15z",fill:"#5f55af"}),React.createElement("path",{d:"m406 512c8.284 0 15-6.716 15-15v-66h-30v66c0 8.284 6.716 15 15 15z",fill:"#39326c"}),React.createElement("path",{d:"m346 512c8.284 0 15-6.716 15-15v-66h-30v66c0 8.284 6.716 15 15 15z",fill:"#39326c"}),React.createElement("path",{d:"m286 512c8.284 0 15-6.716 15-15v-66h-30v66c0 8.284 6.716 15 15 15z",fill:"#39326c"}),React.createElement("g",{fill:"#5f55af"},React.createElement("path",{d:"m226 512c8.284 0 15-6.716 15-15v-66h-30v66c0 8.284 6.716 15 15 15z"}),React.createElement("path",{d:"m166 512c8.284 0 15-6.716 15-15v-66h-30v66c0 8.284 6.716 15 15 15z"}),React.createElement("path",{d:"m106 512c8.284 0 15-6.716 15-15v-66h-30v66c0 8.284 6.716 15 15 15z"}),React.createElement("path",{d:"m15 121h66v-30h-66c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15z"}),React.createElement("path",{d:"m15 181h66v-30h-66c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15z"}),React.createElement("path",{d:"m15 241h66v-30h-66c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15z"}),React.createElement("path",{d:"m15 301h66v-30h-66c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15z"}),React.createElement("path",{d:"m15 361h66v-30h-66c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15z"}),React.createElement("path",{d:"m15 421h66v-30h-66c-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15z"})),React.createElement("path",{d:"m431 91v30h66c8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15z",fill:"#39326c"}),React.createElement("path",{d:"m431 181h66c8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15h-66z",fill:"#39326c"}),React.createElement("path",{d:"m431 241h66c8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15h-66z",fill:"#39326c"}),React.createElement("path",{d:"m431 301h66c8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15h-66z",fill:"#39326c"}),React.createElement("path",{d:"m431 361h66c8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15h-66z",fill:"#39326c"}),React.createElement("path",{d:"m431 421h66c8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15h-66z",fill:"#39326c"})),React.createElement("g",null,React.createElement("path",{d:"m446 51h-380c-8.284 0-15 6.716-15 15v380c0 8.284 6.716 15 15 15h380c8.284 0 15-6.716 15-15v-380c0-8.284-6.716-15-15-15z",fill:"#aed0ff"}),React.createElement("g",null,React.createElement("path",{d:"m461 446v-380c0-8.284-6.716-15-15-15h-190v410h190c8.284 0 15-6.716 15-15z",fill:"#7c84e8"})),React.createElement("path",{d:"m386 111h-260c-8.284 0-15 6.716-15 15v260c0 8.284 6.716 15 15 15h260c8.284 0 15-6.716 15-15v-260c0-8.284-6.716-15-15-15z",fill:"#5f55af"}),React.createElement("g",null,React.createElement("path",{d:"m401 386v-260c0-8.284-6.716-15-15-15h-130v290h130c8.284 0 15-6.716 15-15z",fill:"#39326c"}))),React.createElement("g",null,React.createElement("path",{d:"m247.626 192.389c-.052-.138-.106-.274-.162-.411-2.744-6.671-9.175-10.978-16.387-10.978-.006 0-.012 0-.018 0-7.219.007-13.65 4.329-16.383 11.01-.046.113-.091.227-.134.341l-45.06 118.31c-2.949 7.742.937 16.408 8.679 19.356 7.742 2.95 16.408-.937 19.356-8.679l7.543-19.804h51.691l7.458 19.762c2.267 6.007 7.974 9.708 14.036 9.708 1.76 0 3.55-.312 5.294-.97 7.75-2.925 11.663-11.579 8.737-19.33zm-31.14 79.146 14.538-38.171 14.406 38.171z",fill:"#f9f9f9"}),React.createElement("g",{fill:"#e2dff4"},React.createElement("path",{d:"m264.209 321.296c2.267 6.007 7.974 9.708 14.036 9.708 1.76 0 3.55-.312 5.294-.97 7.75-2.925 11.663-11.579 8.737-19.33l-36.276-96.126v86.956h.751z"}),React.createElement("path",{d:"m328.5 181c-8.284 0-15 6.716-15 15v120c0 8.284 6.716 15 15 15s15-6.716 15-15v-120c0-8.284-6.716-15-15-15z"})))),ka=React.createElement("g",null,React.createElement("path",{d:"m213.46 341.461-139.26 156.08c-16.17 18.48-44.53 19.33-61.8 2.06-17.32-17.32-16.37-45.67 2.06-61.8l156.08-139.26s13.46-2.54 29.46 13.46 13.46 29.46 13.46 29.46z",fill:"#0052be"}),React.createElement("path",{d:"m213.46 341.461-139.26 156.08c-16.17 18.48-44.53 19.33-61.8 2.06l187.6-187.6c16 16 13.46 29.46 13.46 29.46z",fill:"#00429b"}),React.createElement("path",{d:"m304 240.001-90.54 101.46c-14.997-14.997-27.922-27.922-42.92-42.92l101.46-90.54z",fill:"#00429b"}),React.createElement("path",{d:"m304 240.001-90.54 101.46-21.46-21.46 96-96z",fill:"#00337a"}),React.createElement("path",{d:"m400 279.001h-64.4l-42.47 57.87c-7.88 10.735-24.824 6.606-26.91-6.52l-11.56-73.01-73.01-11.56c-13.139-2.087-17.244-19.042-6.52-26.91l57.87-42.47v-64.4c0-12.176 13.797-19.289 23.72-12.21l50.15 35.83 70.92-19.9c11.25-3.168 21.656 7.245 18.49 18.49l-19.9 70.92 35.83 50.15c7.071 9.913-.02 23.72-12.21 23.72z",fill:"#ffdd54"}),React.createElement("path",{d:"m412.21 255.281c7.071 9.913-.02 23.72-12.21 23.72h-64.4l-42.47 57.87c-7.875 10.728-24.823 6.616-26.91-6.52l-11.56-73.01 137.79-137.79c3.83 3.84 5.3 9.44 3.83 14.66l-19.9 70.92z",fill:"#ffb454"}),React.createElement("path",{d:"m512 39.001c0 8.28-6.72 15-15 15h-9v9c0 8.28-6.72 15-15 15s-15-6.72-15-15v-9h-9c-8.28 0-15-6.72-15-15s6.72-15 15-15h9v-9c0-8.28 6.72-15 15-15s15 6.72 15 15v9h9c8.28 0 15 6.719 15 15z",fill:"#bee75e"}),React.createElement("path",{d:"m512 39.001c0 8.28-6.72 15-15 15h-9v9c0 8.28-6.72 15-15 15s-15-6.72-15-15v-9l30-30h9c8.28 0 15 6.719 15 15z",fill:"#00cb75"}),React.createElement("path",{d:"m336 41.001h-9v-9c0-8.284-6.716-15-15-15s-15 6.716-15 15v9h-9c-8.284 0-15 6.716-15 15s6.716 15 15 15h9v9c0 8.284 6.716 15 15 15s15-6.716 15-15v-9h9c8.284 0 15-6.716 15-15s-6.716-15-15-15z",fill:"#f6f9f9"}),React.createElement("path",{d:"m441 224.001c0 8.284 6.716 15 15 15s15-6.716 15-15v-9h9c8.284 0 15-6.716 15-15s-6.716-15-15-15h-9v-9c0-8.284-6.716-15-15-15s-15 6.716-15 15v9h-9c-8.284 0-15 6.716-15 15s6.716 15 15 15h9z",fill:"#e2dff4"}),React.createElement("path",{d:"m497 329.001h-9v-9c0-8.284-6.716-15-15-15s-15 6.716-15 15v9h-9c-8.284 0-15 6.716-15 15s6.716 15 15 15h9v9c0 8.284 6.716 15 15 15s15-6.716 15-15v-9h9c8.284 0 15-6.716 15-15s-6.716-15-15-15z",fill:"#ff4a4a"}),React.createElement("path",{d:"m192 24.001h-9v-9c0-8.284-6.716-15-15-15s-15 6.716-15 15v9h-9c-8.284 0-15 6.716-15 15s6.716 15 15 15h9v9c0 8.284 6.716 15 15 15s15-6.716 15-15v-9h9c8.284 0 15-6.716 15-15s-6.716-15-15-15z",fill:"#ff8659"}),React.createElement("path",{d:"m159.442 122.977-56-32c-7.191-4.109-16.355-1.611-20.466 5.581-4.11 7.193-1.611 16.355 5.581 20.466l56 32c7.16 4.093 16.337 1.644 20.466-5.581 4.111-7.193 1.612-16.355-5.581-20.466z",fill:"#f6f9f9"}),React.createElement("path",{d:"m118.14 169.117-64 8c-8.221 1.027-14.052 8.524-13.023 16.744 1.027 8.218 8.523 14.054 16.744 13.023l64-8c8.221-1.027 14.052-8.524 13.023-16.744-1.028-8.22-8.527-14.062-16.744-13.023z",fill:"#acceff"}),React.createElement("path",{d:"m389.023 352.558c-4.111-7.193-13.274-9.693-20.466-5.581-7.192 4.11-9.691 13.272-5.581 20.466l32 56c2.769 4.845 7.83 7.561 13.037 7.561 11.319 0 18.784-12.341 13.01-22.445z",fill:"#e2dff4"}),React.createElement("path",{d:"m329.86 377.117c-8.222-1.031-15.717 4.804-16.744 13.023l-8 64c-1.117 8.925 5.834 16.862 14.902 16.862 7.455 0 13.917-5.553 14.865-13.142l8-64c1.029-8.219-4.802-15.716-13.023-16.743z",fill:"#6ba7ff"})),va=({icon:e="ai",size:t=20,style:r={}}={})=>{const n=ya(()=>{switch(e){case"ai":default:return ba;case"wand":return ka}},[e]);return React.createElement("svg",{style:{width:t,height:t,marginRight:5,...r},"enable-background":"new 0 0 512 512",height:"512",viewBox:"0 0 512 512",width:"512",xmlns:"http://www.w3.org/2000/svg"},n)},{render:xa,useState:wa,useCallback:Ma,useEffect:Ea}=wp.element,za=()=>{const e=new URLSearchParams(window.location.search).get("mwai_library_search")||"",[t,r]=wa(e),[n,a]=wa(!1);Ea(()=>{if(!document.getElementById("mwai-neko-vars")){const e=document.createElement("style");e.id="mwai-neko-vars",e.textContent=":root {\n  --neko-blue: hsl(204.25deg 100% 36.47%);\n  --neko-main-color: var(--neko-blue);\n  --neko-main-color-50: hsl(206deg 61.04% 54.71%);\n  --neko-main-color-disabled: var(--neko-main-color-50);\n  --neko-secondary: hsl(206 100% 96%);\n  --neko-gray-30: hsl(210 11% 26%);\n  --neko-gray-90: hsl(210 16% 92%);\n  --neko-gray-95: hsl(210 20% 96%);\n  --neko-gray-98: hsl(210 25% 98%);\n  --neko-font-size: 13px;\n  --neko-font-color: var(--neko-gray-30);\n  --neko-radius-sm: 6px;\n  --neko-radius-md: 8px;\n  --neko-shadow-xs: 0 1px 2px rgba(16, 24, 40, 0.06);\n  --neko-focus-ring: 0 0 0 3px color-mix(in oklab, var(--neko-main-color) 25%, transparent);\n  --neko-input-background: var(--neko-gray-98);\n  --neko-input-border: var(--neko-gray-90);\n}",document.head.appendChild(e)}},[]);const o=Ma(()=>{const e=t.trim();if(!e)return;a(!0);const r=new URL(window.location.href);r.searchParams.set("mwai_library_search",e),r.searchParams.delete("s"),r.searchParams.delete("paged"),window.location.href=r.toString()},[t]),s=Ma(()=>{const e=new URL(window.location.href);e.searchParams.delete("mwai_library_search"),window.location.href=e.toString()},[]);return React.createElement("div",{style:{display:"flex",alignItems:"center",gap:6,width:"100%"}},React.createElement(va,{icon:"wand",size:18,style:{margin:0,flexShrink:0,display:"block"}}),React.createElement(sa,{value:t,placeholder:"AI Search...",style:{flex:1,minWidth:100},onChange:r,onEnter:o}),React.createElement(fa,{className:"primary",busy:n,disabled:n,onClick:o,style:{flexShrink:0}},"Search"),e&&React.createElement(fa,{className:"secondary",onClick:s,style:{flexShrink:0}},"Clear"))};function Ca(e,t="replace"){const r=document.createElement("div");r.className="mwai-library-search","replace"===t?(e.parentNode.insertBefore(r,e),e.style.display="none"):e.appendChild(r),xa(wp.element.createElement(za),r)}document.addEventListener("DOMContentLoaded",()=>{var e;if(!window.mwaiLibrarySearch)return;const t=document.querySelector(".search-box");if(t){Ca(t,"replace");const e=document.querySelector(".mwai-library-search");e&&(e.style.marginTop="12px")}const r=()=>{const e=document.querySelector(".media-toolbar-primary");return!!e&&(e.innerHTML="",Ca(e,"append"),!0)};if(!r()){let e=0;const t=setInterval(()=>{(r()||++e>20)&&clearInterval(t)},200)}const n=new URLSearchParams(window.location.search).get("mwai_library_search");if(n&&null!==(e=wp.media)&&void 0!==e&&null!==(e=e.model)&&void 0!==e&&e.Query){const e=wp.media.model.Query.prototype.initialize;wp.media.model.Query.prototype.initialize=function(){e.apply(this,arguments),this.props.set("mwai_library_search",n)}}})})()})();