var t,r=require("react"),e=(t=r)&&t.__esModule?t.default:t,n=r.useEffect,o=r.useRef,i=r.useState;function u(t,r){return function(t){if(Array.isArray(t))return t}(t)||function(t,r){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(t)))return;var e=[],n=!0,o=!1,i=void 0;try{for(var u,a=t[Symbol.iterator]();!(n=(u=a.next()).done)&&(e.push(u.value),!r||e.length!==r);n=!0);}catch(t){o=!0,i=t}finally{try{n||null==a.return||a.return()}finally{if(o)throw i}}return e}(t,r)||function(t,r){if(!t)return;if("string"==typeof t)return a(t,r);var e=Object.prototype.toString.call(t).slice(8,-1);"Object"===e&&t.constructor&&(e=t.constructor.name);if("Map"===e||"Set"===e)return Array.from(t);if("Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return a(t,r)}(t,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,n=new Array(r);e<r;e++)n[e]=t[e];return n}var c=function(t){var r=t.width,a=void 0===r?160:r,c=t.height,l=void 0===c?160:c,f=t.value,d=void 0===f?80:f,h=t.max,v=void 0===h?127:h,s=t.backgroundColor,y=void 0===s?"#ccc":s,p=t.color,g=void 0===p?"#37332ee0":p,m=a/40,b=o(null),S=o(null),P=u(i(d),2),w=P[0],C=P[1],E=o(!1),I=o(0),A=o(0);return n((function(){var t=b.current;S.current=t.getContext("2d");var r=S.current,e=t.height/2;A.current=M(w),r.translate(e,e),function(t){t.beginPath();var r=t.createLinearGradient(0,0,0,170);r.addColorStop(0,y),r.addColorStop(1,g),t.fillStyle=r,t.fillRect(20,20,150,100),t.fill(),t.closePath()}(r),j(M(w))}),[]),e.createElement("div",null,e.createElement("canvas",{width:a,height:l,onPointerDown:function(t){b.current.setPointerCapture(t.pointerId),I.current=t.nativeEvent.offsetY,E.current=!0},onPointerMove:function(t){if(!0===E.current){j(-t.nativeEvent.offsetY+I.current+A.current)}},onPointerUp:function(t){b.current.releasePointerCapture(t.pointerId),A.current=M(w),E.current=!1},ref:b}),e.createElement("div",null,w.toString().slice(0,5)));function M(t){return b.current.height*t/v}function j(t){var r=S.current;if(r.canvas){var e=function(t){var r=t/b.current.height,e=r<0?0:r>1?1:r;return isNaN(e)?d:e}(t);C(e*v),function(t,r){t.clearRect(-b.current.width/2,-b.current.height/2,a,l),t.lineWidth=m,t.beginPath(),t.arc(0,0,b.current.width/2-2*m,0,2*Math.PI,!0),t.closePath(),t.fill(),t.lineWidth=m,t.lineCap="round",t.strokeStyle=g,t.moveTo(0,0),t.rotate(-r),t.lineTo(0,-b.current.width/2+2*m),t.stroke(),t.rotate(r)}(r,-e*Math.PI*2)}}};exports.default=c;
//# sourceMappingURL=RotaryKnob.js.map
